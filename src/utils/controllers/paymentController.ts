import { RAZORPAY_API_KEY_ID, RAZORPAY_API_KEY_SECRET, RAZORPAY_API_URL } from '@env';
import { encode } from 'base-64';

interface OrderResponse {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    notes: Record<string, string>;
    created_at: number;
}

export const generateOrderId = async (): Promise<string> => {
    try {
        const response = await fetch(`${RAZORPAY_API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${encode(`${RAZORPAY_API_KEY_ID}:${RAZORPAY_API_KEY_SECRET}`)}`,
            },
            body: JSON.stringify({
                amount: 100 * 100, // amount in smallest currency unit (e.g., paise)
                currency: 'INR',
                receipt: 'receipt#1',
                notes: {
                    key1: 'value3',
                    key2: 'value2',
                },
            }),
        });

        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
            console.error(`Server error ${response.status}: ${responseText}`);
            throw new Error(`Server error ${response.status}: ${responseText}`);
        }

        const order: OrderResponse = JSON.parse(responseText);
        console.log('Order response:', order);
        return order.id;
    } catch (error) {
        console.error('Error generating order:', error.message);
        throw error;
    }
};