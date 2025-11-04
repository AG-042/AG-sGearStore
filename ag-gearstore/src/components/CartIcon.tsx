'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

/**
 * Cart icon with item count badge
 */
export default function CartIcon() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300 hover:text-blue-950 dark:hover:text-amber-500 transition-colors" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
}
