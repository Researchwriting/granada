from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class CreditPackageType(str, Enum):
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"
    CUSTOM = "custom"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class CreditUsageType(str, Enum):
    SEARCH = "search"
    APPLICATION = "application"
    PREMIUM_FEATURE = "premium_feature"
    AI_ASSISTANCE = "ai_assistance"
    DOCUMENT_GENERATION = "document_generation"

# Credit Package Schemas
class CreditPackageBase(BaseModel):
    name: str
    package_type: CreditPackageType
    credits: int
    price: float
    description: str
    features: Optional[str] = None

class CreditPackageCreate(CreditPackageBase):
    pass

class CreditPackage(CreditPackageBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Credit Balance Schemas
class CreditBalanceBase(BaseModel):
    total_credits: int = 0
    used_credits: int = 0
    remaining_credits: int = 0

class CreditBalance(CreditBalanceBase):
    id: int
    user_id: int
    last_updated: datetime

    class Config:
        from_attributes = True

# Credit Purchase Schemas
class CreditPurchaseCreate(BaseModel):
    package_id: int
    payment_method: str

class CreditPurchaseResponse(BaseModel):
    id: int
    credits_purchased: int
    amount_paid: float
    status: TransactionStatus
    purchase_date: datetime
    package: CreditPackage

    class Config:
        from_attributes = True

# Credit Usage Schemas
class CreditUsageCreate(BaseModel):
    usage_type: CreditUsageType
    credits_used: int
    description: str
    metadata: Optional[Dict[str, Any]] = None

class CreditUsage(BaseModel):
    id: int
    user_id: int
    usage_type: CreditUsageType
    credits_used: int
    description: str
    metadata: Optional[Dict[str, Any]] = None
    used_at: datetime

    class Config:
        from_attributes = True

# Subscription Plan Schemas
class SubscriptionPlanBase(BaseModel):
    name: str
    monthly_price: float
    yearly_price: float
    monthly_credits: int
    features: Optional[str] = None

class SubscriptionPlan(SubscriptionPlanBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# User Subscription Schemas
class UserSubscriptionCreate(BaseModel):
    plan_id: int
    billing_cycle: str  # monthly, yearly

class UserSubscription(BaseModel):
    id: int
    user_id: int
    plan_id: int
    is_active: bool
    billing_cycle: str
    next_billing_date: Optional[datetime]
    subscription_start: datetime
    subscription_end: Optional[datetime]
    plan: SubscriptionPlan

    class Config:
        from_attributes = True

# Payment Method Schemas
class PaymentMethodCreate(BaseModel):
    stripe_payment_method_id: str
    card_last_four: str
    card_brand: str
    is_default: bool = False

class PaymentMethod(BaseModel):
    id: int
    user_id: int
    card_last_four: str
    card_brand: str
    is_default: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Stripe Payment Intent Schema
class PaymentIntentCreate(BaseModel):
    package_id: int
    payment_method_id: Optional[str] = None

class PaymentIntentResponse(BaseModel):
    client_secret: str
    amount: float
    currency: str = "usd"

# Credit System Stats
class CreditStats(BaseModel):
    total_credits: int
    used_credits: int
    remaining_credits: int
    monthly_usage: int
    top_usage_types: List[Dict[str, Any]]
    recent_purchases: List[CreditPurchaseResponse]