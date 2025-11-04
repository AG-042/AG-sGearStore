/**
 * Paystack payment integration utilities
 */

const API_URL = 'http://localhost:8000';

export interface PaymentInitializeData {
  email: string;
  cart_items: Array<{
    variant_id: number;
    quantity: number;
  }>;
}

export interface PaymentInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
    order_id: string;
    amount: number;
  };
}

export interface PaymentVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
    paid_at: string;
    customer: any;
    metadata: any;
  };
}

/**
 * Initialize payment with Paystack
 */
export async function initializePayment(
  data: PaymentInitializeData
): Promise<PaymentInitializeResponse> {
  try {
    const response = await fetch(`${API_URL}/api/store/payment/initialize/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment initialization failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment initialization error:', error);
    throw error;
  }
}

/**
 * Verify payment transaction
 */
export async function verifyPayment(
  reference: string
): Promise<PaymentVerifyResponse> {
  try {
    const response = await fetch(
      `${API_URL}/api/store/payment/verify/${reference}/`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
}

/**
 * Open Paystack payment popup
 */
export function openPaystackPopup(authorizationUrl: string) {
  window.location.href = authorizationUrl;
}
