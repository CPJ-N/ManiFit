import { getFunctions, httpsCallable } from "firebase/functions";

export interface CreateSubscriptionResult {
    subscriptionId: string;
    shortUrl?: string;
    amount?: number;
    currency?: string;
    description?: string;
}

export const createSubscriptionIntent = async (): Promise<CreateSubscriptionResult> => {
    const functions = getFunctions();
    const createSubscription = httpsCallable<void, CreateSubscriptionResult>(
        functions,
        "createSubscription"
    );

    const result = await createSubscription();
    return result.data;
};
