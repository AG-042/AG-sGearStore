'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { productsApi, Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isAuthenticated } from '@/lib/auth';
import { formatPriceInNaira } from '@/lib/currency';

/**
 * Product detail page with animations
 */
export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const productId = parseInt(params.id as string);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productsApi.getById(productId);
      setProduct(data);
      // Auto-select first variant if available
      if (data.variants && data.variants.length > 0) {
        setSelectedSize(data.variants[0].size);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedVariant = product.variants?.find(v => v.size === selectedSize);
    if (!selectedVariant) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }
    
    if (selectedVariant.stock < quantity) {
      toast({
        title: 'Insufficient stock',
        description: `Only ${selectedVariant.stock} items available`,
        variant: 'destructive',
      });
      return;
    }
    
    const price = selectedVariant.price_override 
      ? parseFloat(selectedVariant.price_override) 
      : parseFloat(product.base_price);
    
    addItem(product, selectedVariant.id, selectedSize, quantity, price);
    toast({
      title: 'Added to cart',
      description: `${product.name} (${selectedSize}) x${quantity}`,
    });
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm rounded-none overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="p-8 md:p-12 space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-2 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <div className="space-y-2 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-14 w-full rounded-none" />
                    <Skeleton className="h-14 w-full rounded-none" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm rounded-none">
            <CardContent className="p-12 text-center">
              <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-4">Product Not Found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {error || "The product you're looking for doesn't exist."}
              </p>
              <Button onClick={() => router.push('/shop')} className="bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none px-8">
                Back to Shop
              </Button>
            </CardContent>
          </Card>
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
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm rounded-none overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Product Image */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative aspect-square"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                  {product.team && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge className="absolute top-4 right-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-none text-sm px-3 py-2">
                        {product.team}
                      </Badge>
                    </motion.div>
                  )}
                  {authenticated && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Badge className="absolute top-4 left-4 bg-amber-600 text-white rounded-none text-xs px-2 py-1">
                        Earn Points
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>

                {/* Product Details */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="p-8 md:p-12 space-y-8"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      {product.category.name}
                    </p>
                    <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                      {product.name}
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-baseline gap-4 pb-6 border-b border-gray-200 dark:border-gray-800"
                  >
                    <span className="text-3xl font-light text-gray-900 dark:text-gray-100">
                      {formatPriceInNaira(parseFloat(product.base_price))}
                    </span>
                    <span className={`text-sm ${product.stock > 10 ? 'text-gray-500' : product.stock > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                      {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Sold Out'}
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pb-6 border-b border-gray-200 dark:border-gray-800"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                      Description
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {product.description}
                    </p>
                  </motion.div>

                  {/* Size Selection */}
                  {product.variants && product.variants.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="pb-6 border-b border-gray-200 dark:border-gray-800"
                    >
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                        Select Size
                      </h3>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger className="w-full rounded-none border-gray-300 dark:border-gray-700">
                          <SelectValue placeholder="Choose a size" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.variants.map((variant) => (
                            <SelectItem 
                              key={variant.id} 
                              value={variant.size}
                              disabled={variant.stock === 0}
                            >
                              {variant.size} {variant.stock === 0 ? '(Out of Stock)' : `(${variant.stock} available)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}

                  {/* Quantity Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="pb-6 border-b border-gray-200 dark:border-gray-800"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                      Quantity
                    </h3>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="rounded-none"
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="rounded-none"
                      >
                        +
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-3"
                  >
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none py-6 text-base"
                      disabled={!selectedSize || product.stock === 0}
                    >
                      Add to Cart
                    </Button>

                    <Button
                      onClick={handleBuyNow}
                      variant="outline"
                      className="w-full rounded-none border-gray-300 hover:bg-gray-50 py-6 text-base"
                      disabled={!selectedSize || product.stock === 0}
                    >
                      Buy Now
                    </Button>

                    {authenticated && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-none text-center"
                      >
                        <p className="text-amber-900 dark:text-amber-500 text-sm">
                          ★ You'll earn loyalty points on this purchase
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
