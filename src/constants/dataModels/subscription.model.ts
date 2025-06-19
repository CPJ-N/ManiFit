// ===== SUBSCRIPTION MODEL (Enhanced) =====
// Enhance your existing subscription model
export interface Subscription {
    id?: string; // Subscription ID
    trainerId: string;
    clientId: string;
    
    // ===== Subscription Details =====
    planType: 'basic' | 'premium' | 'custom';
    amount: number;
    currency: string;
    billingCycle: 'weekly' | 'monthly' | 'yearly';
    
    // ===== Dates =====
    startDate: string; // Subscription start date (ISO format)
    nextBillingDate: string;
    endDate?: string; // For fixed-term subscriptions
    
    // ===== Status =====
    status: 'active' | 'paused' | 'cancelled' | 'past_due' | 'trialing';
    trialEndDate?: string;
    
    // ===== Payment Integration =====
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    paymentMethodId?: string;
    
    // ===== Features =====
    features: SubscriptionFeatures;
    
    // ===== Legacy Fields (for compatibility) =====
    userId?: string; // Keep for backward compatibility
    plan?: 'Monthly' | 'Yearly' | 'Trial'; // Keep for backward compatibility
    details?: string; // Keep for backward compatibility
    lastPaymentDate?: string;
    nextDueDate?: string;
    payments?: string[];
    
    // ===== Timestamps =====
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string;
}

export interface SubscriptionFeatures {
    maxWorkoutsPerWeek?: number;
    hasNutritionPlans: boolean;
    hasProgressTracking: boolean;
    hasMessaging: boolean;
    hasVideoCall: boolean;
    hasCustomExercises: boolean;
    canShareWorkouts: boolean;
}
