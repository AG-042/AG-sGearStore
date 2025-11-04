'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';

/**
 * Payment callback page - handles Paystack redirect
 */
export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying payment...');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      
      if (!reference) {
        setStatus('failed');
        setMessage('No payment reference found');
        return;
      }

      try {
        // Verify payment with backend
        const response = await fetch(
          `http://localhost:8000/api/store/payment/verify/${reference}/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await response.json();

        if (result.status && result.data) {
          setStatus('success');
          setMessage('Payment successful!');
          setOrderDetails(result.data);
          
          // Clear cart on successful payment
          clearCart();
          
          // Clear pending order from localStorage
          localStorage.removeItem('pending_order');
        } else {
          setStatus('failed');
          setMessage(result.message || 'Payment verification failed');
        }
      } catch (error) {
        setStatus('failed');
        setMessage('Failed to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [searchParams, clearCart]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border border-gray-200 dark:border-gray-800 rounded-none">
          <CardHeader className="text-center border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="text-2xl font-light text-gray-900 dark:text-gray-100">
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {status === 'loading' && (
              <div className="text-center space-y-4">
                <Loader2 className="h-16 w-16 mx-auto text-blue-950 dark:text-amber-500 animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                <div>
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {message}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your order has been confirmed
                  </p>
                </div>

                {orderDetails && (
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-none text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {orderDetails.reference}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ₦{orderDetails.amount?.toFixed(2)}
                      </span>
                    </div>
                    {orderDetails.metadata?.order_id && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {orderDetails.metadata.order_id}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none py-6"
                  >
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-none border-gray-300 hover:bg-gray-50 py-6"
                  >
                    <Link href="/">Go to Home</Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                <XCircle className="h-16 w-16 mx-auto text-red-600" />
                <div>
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Payment Failed
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{message}</p>
                </div>

                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none py-6"
                  >
                    <Link href="/cart">Return to Cart</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-none border-gray-300 hover:bg-gray-50 py-6"
                  >
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
