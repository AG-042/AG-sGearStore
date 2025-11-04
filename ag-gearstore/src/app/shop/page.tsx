'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { productsApi, Product } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ProductCard';

/**
 * Modern minimalist shop page with animations
 */
export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  const searchParams = useSearchParams();

  // Get unique teams for filter dropdown
  const teams = Array.from(new Set(products.map(p => p.team).filter(Boolean)));

  useEffect(() => {
    loadProducts();
  }, [search, teamFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productsApi.getAll({
        team: teamFilter || undefined,
        search: search || undefined,
      });
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleTeamFilterChange = (value: string) => {
    setTeamFilter(value === 'all' ? '' : value);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
            Shop <span className="text-blue-950 dark:text-amber-500">Collection</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our curated selection of premium soccer gear
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="rounded-none border-gray-300 dark:border-gray-700 focus-visible:ring-0 focus-visible:border-blue-950 dark:focus-visible:border-amber-500"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={teamFilter || 'all'} onValueChange={handleTeamFilterChange}>
                <SelectTrigger className="rounded-none border-gray-300 dark:border-gray-700 focus:ring-0 focus:border-blue-950 dark:focus:border-amber-500">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-none mb-6 text-center border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-6 text-sm text-gray-600 dark:text-gray-400">
              <p>
                {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>

            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">No products found</p>
                <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
