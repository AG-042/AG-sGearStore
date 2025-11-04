'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatNaira, convertToNaira } from '@/lib/currency';

/**
 * Shopping cart page with item management
 */
export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Add some items to your cart to get started
            </p>
            <Button asChild className="bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none px-8">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-light text-gray-900 dark:text-gray-100">Shopping Cart</h1>
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
            >
              Clear Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.variantId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-none"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/shop/${item.product.id}`}>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-950 dark:hover:text-amber-500 transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Size: {item.size}
                          </p>
                          {item.product.team && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Team: {item.product.team}
                            </p>
                          )}
                          <p className="text-lg font-light text-gray-900 dark:text-gray-100 mt-2">
                            {formatNaira(convertToNaira(item.price))}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.variantId)}
                            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-none">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {formatNaira(convertToNaira(item.price * item.quantity))}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="border border-gray-200 dark:border-gray-800 rounded-none sticky top-4">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">Order Summary</h2>
                  
                  <div className="space-y-2 py-4 border-y border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatNaira(convertToNaira(getTotal()))}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-medium text-gray-900 dark:text-gray-100">
                    <span>Total</span>
                    <span>{formatNaira(convertToNaira(getTotal()))}</span>
                  </div>

                  <Button asChild className="w-full bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none py-6">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full rounded-none border-gray-300 hover:bg-gray-50">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
