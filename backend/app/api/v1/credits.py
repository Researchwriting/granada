from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ...core.database import get_db
from ...core.auth import get_current_user
from ...services.credit_service import CreditService
from ...schemas.credits import (
    CreditPackage, CreditBalance, CreditPurchaseCreate, CreditPurchaseResponse,
    CreditUsageCreate, CreditUsage, PaymentIntentCreate, PaymentIntentResponse,
    SubscriptionPlan, UserSubscriptionCreate, UserSubscription,
    PaymentMethodCreate, PaymentMethod, CreditStats,
    CreditPackageType, CreditUsageType
)
from ...schemas.dashboard import User

router = APIRouter()

# Credit Balance Endpoints
@router.get("/balance", response_model=CreditBalance)
async def get_credit_balance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's current credit balance"""
    service = CreditService(db)
    return service.get_user_credit_balance(current_user.id)

@router.get("/stats", response_model=CreditStats)
async def get_credit_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive credit statistics"""
    service = CreditService(db)
    return service.get_credit_stats(current_user.id)

# Credit Packages
@router.get("/packages", response_model=List[CreditPackage])
async def get_credit_packages(
    package_type: Optional[CreditPackageType] = Query(None),
    db: Session = Depends(get_db)
):
    """Get available credit packages"""
    service = CreditService(db)
    return service.get_credit_packages(package_type)

@router.get("/packages/{package_id}", response_model=CreditPackage)
async def get_credit_package(
    package_id: int,
    db: Session = Depends(get_db)
):
    """Get specific credit package details"""
    service = CreditService(db)
    package = service.get_credit_package(package_id)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package

# Payment Processing
@router.post("/payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    payment_data: PaymentIntentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create payment intent for credit purchase"""
    service = CreditService(db)
    try:
        return service.create_payment_intent(current_user.id, payment_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/purchase", response_model=CreditPurchaseResponse)
async def purchase_credits(
    purchase_data: CreditPurchaseCreate,
    transaction_id: str = Query(..., description="Stripe payment intent ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Complete credit purchase after successful payment"""
    service = CreditService(db)
    try:
        return service.process_credit_purchase(current_user.id, purchase_data, transaction_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/purchases", response_model=List[CreditPurchaseResponse])
async def get_purchase_history(
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's credit purchase history"""
    service = CreditService(db)
    return service.get_user_purchases(current_user.id, limit)

# Credit Usage
@router.post("/use", response_model=CreditUsage)
async def use_credits(
    usage_data: CreditUsageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Use credits for a specific action"""
    service = CreditService(db)
    try:
        return service.use_credits(current_user.id, usage_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/usage", response_model=List[CreditUsage])
async def get_usage_history(
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's credit usage history"""
    service = CreditService(db)
    return service.get_usage_history(current_user.id, limit)

@router.get("/costs")
async def get_credit_costs(
    db: Session = Depends(get_db)
):
    """Get credit costs for different actions"""
    service = CreditService(db)
    return service.get_credit_costs()

@router.post("/calculate-search-cost")
async def calculate_search_cost(
    search_type: str,
    filters_count: int = 0,
    db: Session = Depends(get_db)
):
    """Calculate credit cost for search operation"""
    service = CreditService(db)
    cost = service.calculate_search_cost(search_type, filters_count)
    return {"search_type": search_type, "filters_count": filters_count, "cost": cost}

# Subscription Management
@router.get("/subscription-plans", response_model=List[SubscriptionPlan])
async def get_subscription_plans(
    db: Session = Depends(get_db)
):
    """Get available subscription plans"""
    service = CreditService(db)
    return service.get_subscription_plans()

@router.post("/subscribe", response_model=UserSubscription)
async def create_subscription(
    subscription_data: UserSubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create user subscription"""
    service = CreditService(db)
    try:
        return service.create_subscription(current_user.id, subscription_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/subscription", response_model=Optional[UserSubscription])
async def get_user_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's current subscription"""
    service = CreditService(db)
    return service.get_user_subscription(current_user.id)

@router.delete("/subscription")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel user subscription"""
    service = CreditService(db)
    try:
        subscription = service.cancel_subscription(current_user.id)
        return {"message": "Subscription cancelled successfully", "subscription": subscription}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Payment Methods
@router.post("/payment-methods", response_model=PaymentMethod)
async def add_payment_method(
    payment_method_data: PaymentMethodCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add payment method for user"""
    service = CreditService(db)
    return service.add_payment_method(current_user.id, payment_method_data)

@router.get("/payment-methods", response_model=List[PaymentMethod])
async def get_payment_methods(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's payment methods"""
    service = CreditService(db)
    return service.get_user_payment_methods(current_user.id)

@router.delete("/payment-methods/{payment_method_id}")
async def remove_payment_method(
    payment_method_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove payment method"""
    service = CreditService(db)
    success = service.remove_payment_method(current_user.id, payment_method_id)
    if not success:
        raise HTTPException(status_code=404, detail="Payment method not found")
    return {"message": "Payment method removed successfully"}

# Credit Validation
@router.get("/check-availability")
async def check_credit_availability(
    required_credits: int = Query(..., ge=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Check if user has enough credits for an action"""
    service = CreditService(db)
    available = service.check_credit_availability(current_user.id, required_credits)
    balance = service.get_user_credit_balance(current_user.id)
    
    return {
        "has_sufficient_credits": available,
        "required_credits": required_credits,
        "current_balance": balance.remaining_credits,
        "shortfall": max(0, required_credits - balance.remaining_credits)
    }