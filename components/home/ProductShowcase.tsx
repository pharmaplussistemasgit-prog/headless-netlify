'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { Category } from '@/types/woocommerce';

interface Product {
    id: number;
    name: string;
    slug: string;
    images: Array<{ src: string; alt?: string }>;
    price_html?: string;
    price?: string;
    categories?: Category[];
}

interface ProductShowcaseProps {
    products: Product[];
    categories?: Category[];
    title?: string;
    subtitle?: string;
}

export default function ProductShowcase({
    products,
    categories = [],
    title = "Productos Destacados",
    subtitle = "Lo mejor de nuestra colección seleccionado para ti"
}: ProductShowcaseProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

    // Filter products based on selected category
    const filteredProducts = selectedCategory === 'Todos'
        ? products
        : products.filter(product =>
            product.categories?.some(cat => cat.slug === selectedCategory)
        );

    // Custom filter categories configuration
    const customFilters = [
        { key: 'accesorios', label: 'Accesorios Deportivos Futsal' },
        { key: 'ropa', label: 'Ropa Deportiva' },
        { key: 'world', label: 'Zapatillas World' }
    ];

    const filterCategories = [
        { id: 0, name: 'Todos', slug: 'Todos' },
    ];

    customFilters.forEach(filter => {
        const category = categories.find(c =>
            c.slug.toLowerCase().includes(filter.key) ||
            c.name.toLowerCase().includes(filter.key)
        );
        if (category) {
            // Check if already added to avoid duplicates
            if (!filterCategories.find(fc => fc.id === category.id)) {
                filterCategories.push({
                    ...category,
                    name: filter.label
                });
            }
        }
    });

    // Tomar los primeros 8 productos (para 2 filas de 4)
    const displayProducts = filteredProducts.slice(0, 8);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white font-inter italic"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        {subtitle}
                    </motion.p>
                </div>

                {/* Filter Bar */}
                <div className="flex justify-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
                    <div className="flex space-x-2 sm:space-x-4 px-4">
                        {filterCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.slug)}
                                className={`px-8 py-2 transform -skew-x-[3deg] italic font-bold tracking-wide transition-all duration-300 whitespace-nowrap ${selectedCategory === category.slug
                                        ? 'bg-saprix-electric-blue text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:border-saprix-electric-blue'
                                    }`}
                            >
                                <span className="block transform skew-x-[3deg]">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={selectedCategory} // Re-render grid on category change
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8"
                    >
                        {displayProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                            >
                                <ProductCard
                                    id={product.id}
                                    name={product.name}
                                    price={product.price || product.price_html?.replace(/[^0-9.]/g, '') || "0"}
                                    imageUrl={product.images[0]?.src || '/placeholder-image.png'}
                                    slug={product.slug}
                                    images={product.images.map(img => img.src)}
                                    category={product.categories?.[0]?.name || "Destacado"}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {displayProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No se encontraron productos en esta categoría.
                    </div>
                )}

                {/* View All Products Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Link
                        href="/tienda"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-saprix-electric-blue text-white font-semibold rounded-full hover:bg-saprix-electric-blue-dark transition-colors duration-300 shadow-lg hover:shadow-xl"
                    >
                        Ver Todos los Productos
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
