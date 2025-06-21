from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import stripe
import os

from ..models.credits import (
    CreditPackage, CreditBalance, CreditPurchase, CreditUsage,
    SubscriptionPlan, UserSubscription, PaymentMethod,
    CreditPackageType, TransactionStatus, CreditUsageType
)
from ..schemas.credits import (
    CreditPurchaseCreate, CreditUsageCreate, PaymentIntentCreate,
    UserSubscriptionCreate, PaymentMethodCreate, CreditStats
)

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class CreditService:
    def __init__(self, db: Session):
        self.db = db

    # Credit Balance Management
    def get_user_credit_balance(self, user_id: int) -> CreditBalance:
        """Get user's credit balance"""
        balance = self.db.query(CreditBalance).filter(CreditBalance.user_id == user_id).first()
        if not balance:
            balance = CreditBalance(user_id=user_id)
            self.db.add(balance)
            self.db.commit()
            self.db.refresh(balance)
        return balance

    def update_credit_balance(self, user_id: int, credits_to_add: int = 0, credits_to_use: int = 0):
        """Update user's credit balance"""
        balance = self.get_user_credit_balance(user_id)
        
        if credits_to_add > 0:
            balance.total_credits += credits_to_add
            balance.remaining_credits += credits_to_add
        
        if credits_to_use > 0:
            if balance.remaining_credits < credits_to_use:
                raise ValueError("Insufficient credits")
            balance.used_credits += credits_to_use
            balance.remaining_credits -= credits_to_use
        
        balance.last_updated = datetime.utcnow()
        self.db.commit()
        self.db.refresh(balance)
        return balance

    def check_credit_availability(self, user_id: int, required_credits: int) -> bool:
        """Check if user has enough credits"""
        balance = self.get_user_credit_balance(user_id)
        return balance.remaining_credits >= required_credits

    # Credit Packages
    def get_credit_packages(self, package_type: Optional[CreditPackageType] = None) -> List[CreditPackage]:
        """Get available credit packages"""
        query = self.db.query(CreditPackage).filter(CreditPackage.is_active == True)
        
        if package_type:
            query = query.filter(CreditPackage.package_type == package_type)
        
        return query.order_by(CreditPackage.price).all()

    def get_credit_package(self, package_id: int) -> Optional[CreditPackage]:
        """Get specific credit package"""
        return self.db.query(CreditPackage).filter(
            CreditPackage.id == package_id,
            CreditPackage.is_active == True
        ).first()

    # Payment Processing
    def create_payment_intent(self, user_id: int, payment_data: PaymentIntentCreate):
        """Create Stripe payment intent for credit purchase"""
        package = self.get_credit_package(payment_data.package_id)
        if not package:
            raise ValueError("Invalid package")

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(package.price * 100),  # Convert to cents
                currency='usd',
                metadata={
                    'user_id': user_id,
                    'package_id': package.id,
                    'credits': package.credits
                }
            )
            
            return {
                'client_secret': intent.client_secret,
                'amount': package.price,
                'currency': 'usd'
            }
        except stripe.error.StripeError as e:
            raise ValueError(f"Payment processing error: {str(e)}")

    def process_credit_purchase(self, user_id: int, purchase_data: CreditPurchaseCreate, transaction_id: str):
        """Process credit purchase after successful payment"""
        package = self.get_credit_package(purchase_data.package_id)
        if not package:
            raise ValueError("Invalid package")

        # Create purchase record
        purchase = CreditPurchase(
            user_id=user_id,
            package_id=package.id,
            credits_purchased=package.credits,
            amount_paid=package.price,
            payment_method=purchase_data.payment_method,
            transaction_id=transaction_id,
            status=TransactionStatus.COMPLETED
        )
        
        self.db.add(purchase)
        
        # Update credit balance
        self.update_credit_balance(user_id, credits_to_add=package.credits)
        
        self.db.commit()
        self.db.refresh(purchase)
        return purchase

    def get_user_purchases(self, user_id: int, limit: int = 20) -> List[CreditPurchase]:
        """Get user's purchase history"""
        return self.db.query(CreditPurchase)\
                     .filter(CreditPurchase.user_id == user_id)\
                     .order_by(desc(CreditPurchase.purchase_date))\
                     .limit(limit)\
                     .all()

    # Credit Usage
    def use_credits(self, user_id: int, usage_data: CreditUsageCreate) -> CreditUsage:
        """Use credits for a specific action"""
        if not self.check_credit_availability(user_id, usage_data.credits_used):
            raise ValueError("Insufficient credits")

        # Create usage record
        usage = CreditUsage(
            user_id=user_id,
            usage_type=usage_data.usage_type,
            credits_used=usage_data.credits_used,
            description=usage_data.description,
            metadata=json.dumps(usage_data.metadata) if usage_data.metadata else None
        )
        
        self.db.add(usage)
        
        # Update balance
        self.update_credit_balance(user_id, credits_to_use=usage_data.credits_used)
        
        self.db.commit()
        self.db.refresh(usage)
        return usage

    def get_usage_history(self, user_id: int, limit: int = 50) -> List[CreditUsage]:
        """Get user's credit usage history"""
        usages = self.db.query(CreditUsage)\
                       .filter(CreditUsage.user_id == user_id)\
                       .order_by(desc(CreditUsage.used_at))\
                       .limit(limit)\
                       .all()
        
        # Parse metadata JSON
        for usage in usages:
            if usage.metadata:
                try:
                    usage.metadata = json.loads(usage.metadata)
                except:
                    usage.metadata = {}
        
        return usages

    # Subscription Management
    def get_subscription_plans(self) -> List[SubscriptionPlan]:
        """Get available subscription plans"""
        return self.db.query(SubscriptionPlan)\
                     .filter(SubscriptionPlan.is_active == True)\
                     .order_by(SubscriptionPlan.monthly_price)\
                     .all()

    def create_subscription(self, user_id: int, subscription_data: UserSubscriptionCreate):
        """Create user subscription"""
        plan = self.db.query(SubscriptionPlan).filter(SubscriptionPlan.id == subscription_data.plan_id).first()
        if not plan:
            raise ValueError("Invalid subscription plan")

        # Calculate billing dates
        start_date = datetime.utcnow()
        if subscription_data.billing_cycle == "monthly":
            next_billing = start_date + timedelta(days=30)
            price = plan.monthly_price
        else:  # yearly
            next_billing = start_date + timedelta(days=365)
            price = plan.yearly_price

        try:
            # Create Stripe subscription
            stripe_subscription = stripe.Subscription.create(
                customer=f"user_{user_id}",  # You'd need to create/get Stripe customer
                items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': plan.name,
                        },
                        'unit_amount': int(price * 100),
                        'recurring': {
                            'interval': 'month' if subscription_data.billing_cycle == "monthly" else 'year',
                        },
                    },
                }],
            )

            # Create subscription record
            subscription = UserSubscription(
                user_id=user_id,
                plan_id=plan.id,
                billing_cycle=subscription_data.billing_cycle,
                next_billing_date=next_billing,
                stripe_subscription_id=stripe_subscription.id
            )
            
            self.db.add(subscription)
            
            # Add initial credits
            self.update_credit_balance(user_id, credits_to_add=plan.monthly_credits)
            
            self.db.commit()
            self.db.refresh(subscription)
            return subscription

        except stripe.error.StripeError as e:
            raise ValueError(f"Subscription creation error: {str(e)}")

    def get_user_subscription(self, user_id: int) -> Optional[UserSubscription]:
        """Get user's active subscription"""
        return self.db.query(UserSubscription)\
                     .filter(UserSubscription.user_id == user_id)\
                     .filter(UserSubscription.is_active == True)\
                     .first()

    def cancel_subscription(self, user_id: int):
        """Cancel user subscription"""
        subscription = self.get_user_subscription(user_id)
        if not subscription:
            raise ValueError("No active subscription found")

        try:
            # Cancel Stripe subscription
            stripe.Subscription.delete(subscription.stripe_subscription_id)
            
            # Update local record
            subscription.is_active = False
            subscription.subscription_end = datetime.utcnow()
            
            self.db.commit()
            return subscription

        except stripe.error.StripeError as e:
            raise ValueError(f"Subscription cancellation error: {str(e)}")

    # Payment Methods
    def add_payment_method(self, user_id: int, payment_method_data: PaymentMethodCreate):
        """Add payment method for user"""
        # Set other payment methods as non-default if this is default
        if payment_method_data.is_default:
            self.db.query(PaymentMethod)\
                  .filter(PaymentMethod.user_id == user_id)\
                  .update({PaymentMethod.is_default: False})

        payment_method = PaymentMethod(
            user_id=user_id,
            stripe_payment_method_id=payment_method_data.stripe_payment_method_id,
            card_last_four=payment_method_data.card_last_four,
            card_brand=payment_method_data.card_brand,
            is_default=payment_method_data.is_default
        )
        
        self.db.add(payment_method)
        self.db.commit()
        self.db.refresh(payment_method)
        return payment_method

    def get_user_payment_methods(self, user_id: int) -> List[PaymentMethod]:
        """Get user's payment methods"""
        return self.db.query(PaymentMethod)\
                     .filter(PaymentMethod.user_id == user_id)\
                     .order_by(desc(PaymentMethod.is_default))\
                     .all()

    def remove_payment_method(self, user_id: int, payment_method_id: int):
        """Remove payment method"""
        payment_method = self.db.query(PaymentMethod)\
                               .filter(PaymentMethod.id == payment_method_id)\
                               .filter(PaymentMethod.user_id == user_id)\
                               .first()
        
        if payment_method:
            self.db.delete(payment_method)
            self.db.commit()
            return True
        return False

    # Credit Statistics
    def get_credit_stats(self, user_id: int) -> CreditStats:
        """Get comprehensive credit statistics for user"""
        balance = self.get_user_credit_balance(user_id)
        
        # Monthly usage
        month_ago = datetime.utcnow() - timedelta(days=30)
        monthly_usage = self.db.query(func.sum(CreditUsage.credits_used))\
                              .filter(CreditUsage.user_id == user_id)\
                              .filter(CreditUsage.used_at >= month_ago)\
                              .scalar() or 0

        # Top usage types
        usage_types = self.db.query(
            CreditUsage.usage_type,
            func.sum(CreditUsage.credits_used).label('total_used'),
            func.count(CreditUsage.id).label('usage_count')
        ).filter(CreditUsage.user_id == user_id)\
         .filter(CreditUsage.used_at >= month_ago)\
         .group_by(CreditUsage.usage_type)\
         .order_by(desc('total_used'))\
         .limit(5)\
         .all()

        top_usage_types = [
            {
                'type': usage.usage_type,
                'credits_used': usage.total_used,
                'usage_count': usage.usage_count
            }
            for usage in usage_types
        ]

        # Recent purchases
        recent_purchases = self.get_user_purchases(user_id, limit=5)

        return CreditStats(
            total_credits=balance.total_credits,
            used_credits=balance.used_credits,
            remaining_credits=balance.remaining_credits,
            monthly_usage=monthly_usage,
            top_usage_types=top_usage_types,
            recent_purchases=recent_purchases
        )

    # Credit Cost Configuration
    def get_credit_costs(self) -> Dict[str, int]:
        """Get credit costs for different actions"""
        return {
            "basic_search": 1,
            "advanced_search": 3,
            "ai_assistance": 5,
            "document_generation": 10,
            "premium_application": 15,
            "expert_review": 25
        }

    def calculate_search_cost(self, search_type: str, filters_count: int = 0) -> int:
        """Calculate credit cost for search operations"""
        costs = self.get_credit_costs()
        base_cost = costs.get(search_type, 1)
        
        # Add cost for complex filters
        filter_cost = min(filters_count, 5)  # Max 5 extra credits for filters
        
        return base_cost + filter_cost