from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class CreditPackageType(enum.Enum):
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"
    CUSTOM = "custom"

class TransactionStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class CreditUsageType(enum.Enum):
    SEARCH = "search"
    APPLICATION = "application"
    PREMIUM_FEATURE = "premium_feature"
    AI_ASSISTANCE = "ai_assistance"
    DOCUMENT_GENERATION = "document_generation"

class CreditPackage(Base):
    __tablename__ = "credit_packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    package_type = Column(Enum(CreditPackageType))
    credits = Column(Integer)  # Number of credits in package
    price = Column(Float)  # Price in USD
    description = Column(Text)
    features = Column(Text)  # JSON string of features
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    purchases = relationship("CreditPurchase", back_populates="package")

class CreditBalance(Base):
    __tablename__ = "credit_balances"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    total_credits = Column(Integer, default=0)
    used_credits = Column(Integer, default=0)
    remaining_credits = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
    purchases = relationship("CreditPurchase", back_populates="user_balance")
    usage_history = relationship("CreditUsage", back_populates="user_balance")

class CreditPurchase(Base):
    __tablename__ = "credit_purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    package_id = Column(Integer, ForeignKey("credit_packages.id"))
    credits_purchased = Column(Integer)
    amount_paid = Column(Float)
    payment_method = Column(String)  # stripe, paypal, etc.
    transaction_id = Column(String, unique=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    purchase_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
    package = relationship("CreditPackage", back_populates="purchases")
    user_balance = relationship("CreditBalance", back_populates="purchases")

class CreditUsage(Base):
    __tablename__ = "credit_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    usage_type = Column(Enum(CreditUsageType))
    credits_used = Column(Integer)
    description = Column(String)
    metadata = Column(Text)  # JSON string with usage details
    used_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")
    user_balance = relationship("CreditBalance", back_populates="usage_history")

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    monthly_price = Column(Float)
    yearly_price = Column(Float)
    monthly_credits = Column(Integer)
    features = Column(Text)  # JSON string of features
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    subscriptions = relationship("UserSubscription", back_populates="plan")

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"))
    is_active = Column(Boolean, default=True)
    billing_cycle = Column(String)  # monthly, yearly
    next_billing_date = Column(DateTime)
    subscription_start = Column(DateTime, default=datetime.utcnow)
    subscription_end = Column(DateTime)
    stripe_subscription_id = Column(String)
    
    # Relationships
    user = relationship("User")
    plan = relationship("SubscriptionPlan", back_populates="subscriptions")

class PaymentMethod(Base):
    __tablename__ = "payment_methods"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    stripe_payment_method_id = Column(String)
    card_last_four = Column(String)
    card_brand = Column(String)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User")