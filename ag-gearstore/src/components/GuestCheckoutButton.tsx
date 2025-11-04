'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Unified checkout button - navigates to smart checkout page
 */
export default function GuestCheckoutButton() {
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <Button
      onClick={handleCheckout}
      variant="secondary"
      className="bg-gray-700 hover:bg-gray-600"
    >
      Checkout
    </Button>
  );
}
