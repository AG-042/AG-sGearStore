import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Guest checkout redirect - now uses unified checkout
 */
export default function GuestCheckoutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm rounded-none">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="text-3xl font-light text-gray-900 dark:text-gray-100 tracking-tight">
              Guest Checkout
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Complete your purchase without creating an account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-none mb-6">
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                Quick & Easy Shopping
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                No registration required. Just add items to cart and proceed to checkout.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button asChild className="flex-1 bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none py-6">
                <Link href="/shop">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 rounded-none border-gray-300 hover:bg-gray-50 py-6">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
