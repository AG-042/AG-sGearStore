import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus } from 'lucide-react';
import { formatPriceInNaira } from '@/lib/currency';
import { Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/Toaster';

/**
 * Modern minimalist product card
 */
interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addItem } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);

  const availableVariants = product.variants?.filter(v => v.stock > 0) || [];
  const hasVariants = availableVariants.length > 0;

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowQuickAdd(false);
        setSelectedSize('');
      }
    };

    if (showQuickAdd) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showQuickAdd]);

  const handleQuickAdd = () => {
    if (!hasVariants) return;

    const variantToAdd = selectedSize
      ? availableVariants.find(v => v.size === selectedSize)
      : availableVariants[0]; // Default to first available variant

    if (!variantToAdd) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }

    const price = variantToAdd.price_override
      ? parseFloat(variantToAdd.price_override)
      : parseFloat(product.base_price);

    addItem(product, variantToAdd.id, variantToAdd.size, 1, price);
    toast({
      title: 'Added to cart',
      description: `${product.name} (${variantToAdd.size})`,
    });

    setShowQuickAdd(false);
    setSelectedSize('');
  };

  return (
    <div className="group relative">
      <Link href={`/shop/${product.id}`}>
        <Card className="hover:shadow-lg hover:border-amber-600 transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-none">
          <div className="relative overflow-hidden aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.team && (
              <Badge className="absolute top-3 right-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 group-hover:border-amber-600 group-hover:text-amber-700 dark:group-hover:text-amber-500 rounded-none font-normal text-xs transition-colors">
                {product.team}
              </Badge>
            )}
          </div>

          <CardContent className="p-4 space-y-4">
            <h3 className="font-normal text-base text-gray-900 dark:text-gray-100 group-hover:text-blue-950 dark:group-hover:text-amber-500 transition-colors line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-lg font-light text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                {formatPriceInNaira(parseFloat(product.base_price))}
              </span>
              <span className={`text-xs ${product.stock > 10 ? 'text-gray-500' : product.stock > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Sold Out'}
              </span>
            </div>

            {/* Add to Cart Button - Always Visible */}
            {hasVariants ? (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setShowQuickAdd(true);
                }}
                className="w-full bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none py-2 font-medium transition-colors"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            ) : (
              <Button
                disabled
                className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-none py-2 cursor-not-allowed"
              >
                Out of Stock
              </Button>
            )}
          </CardContent>
        </Card>
      </Link>

      {/* Size Selector Modal */}
      {showQuickAdd && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              setShowQuickAdd(false);
              setSelectedSize('');
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-none p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Select Size</h3>

            <div className="space-y-4">
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="rounded-none border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Choose size" />
                </SelectTrigger>
                <SelectContent>
                  {availableVariants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.size}>
                      {variant.size} ({variant.stock} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuickAdd(false);
                    setSelectedSize('');
                  }}
                  variant="outline"
                  className="flex-1 rounded-none border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickAdd();
                  }}
                  className="flex-1 bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none"
                  disabled={!selectedSize}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
