'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useState } from "react";
import { productsApi, Product } from "@/lib/api";

/**
 * Modern minimalist home page with animations
 */
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await productsApi.getAll();
        setFeaturedProducts(products.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center order-2 lg:order-1"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 dark:text-gray-100 mb-6 tracking-tight"
              >
                Premium Soccer
                <span className="block font-normal mt-2">Gear for Fans</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
              >
                Discover authentic jerseys, professional equipment, and exclusive merchandise from the world's top teams.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none px-8">
                  <Link href="/shop">
                    Explore Collection
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none px-8 border-gray-300 hover:bg-gray-50 hover:border-amber-600 hover:text-amber-700 transition-colors">
                  <Link href="/register">
                    Join Community
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Hero Carousel - Desktop and Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-1 lg:order-2"
            >
              <HeroCarousel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '✓', title: 'Authentic Quality', desc: 'Official merchandise from trusted brands', color: 'bg-blue-950 dark:bg-blue-900', delay: 0 },
              { icon: '⚡', title: 'Fast Checkout', desc: 'No account required to purchase', color: 'bg-amber-600 dark:bg-amber-500', delay: 0.2 },
              { icon: '★', title: 'Loyalty Rewards', desc: 'Earn points with every purchase', color: 'bg-blue-950 dark:bg-blue-900', delay: 0.4 }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: feature.delay }}
                className="text-center p-8"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-12 h-12 mx-auto mb-4 ${feature.color} rounded-full flex items-center justify-center`}
                >
                  <span className={`text-white ${index === 2 ? 'text-amber-500' : ''} text-xl`}>{feature.icon}</span>
                </motion.div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-3">
                Featured Collection
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Handpicked essentials for the modern fan
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <Button asChild size="lg" variant="outline" className="rounded-none px-8 border-gray-300 hover:bg-gray-50">
                <Link href="/shop">
                  View All Products
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
