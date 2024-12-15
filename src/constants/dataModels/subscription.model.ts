export interface Subscription {
    userId: string; // User associated with the subscription
    plan: 'Monthly' | 'Yearly' | 'Trial'; // Plan type
    details: string; // Additional details about the subscription
    startDate: string; // Subscription start date (ISO format)
    endDate: string; // Subscription end date (ISO format)
    status: 'active' | 'inactive' | 'canceled'; // Subscription status
    lastPaymentDate?: string; // Date of the last successful payment (ISO format)
    nextDueDate?: string; // Next payment due date (ISO format)
    amount?: number; // Amount
    payments: string[]; // Array of payment IDs for tracking
}
