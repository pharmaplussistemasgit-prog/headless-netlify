'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Product } from '@/types/woocommerce';
import { mapWooProduct } from '@/lib/mappers';
import { WooProduct } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface RecommendedSectionProps {
    products: Product[];
    title?: React.ReactNode;
}

// RecommendedSection.tsx
export default function RecommendedSection({ products, title }: RecommendedSectionProps) {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    if (!products || products.length === 0) return null;

    return (
        // The White Box (Level 1: 90% of Page if placed in 90% container, or just w-full of its parent)
        // Since ProductDetails puts it in a 90% container, this should be w-full bg-white.
        <div className="w-full bg-white rounded-3xl shadow-sm p-6 lg:p-10 border border-gray-100/50">
            {/* Inner Content (Level 2: 90% of White Box) */}
            <div className="w-full lg:w-[90%] mx-auto relative group">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl md:text-3xl font-bold italic">
                            {title || (
                                <>
                                    <span className="text-[var(--color-pharma-blue)]">Nuestros</span>{' '}
                                    <span className="text-[var(--color-pharma-green)]">recomendados</span>
                                </>
                            )}
                        </h2>
                        <Link href="/tienda" className="text-xs font-medium text-gray-400 hover:text-[var(--color-pharma-blue)] flex items-center gap-1 transition-colors">
                            Ver más <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="w-full h-px bg-gray-300 mt-2"></div>
                </div>

                {/* Carousel */}
                <div className="relative">
                    {/* Navigation Buttons: Positioned in the 5% gutter on each side */}
                    {/* -left-12 / -right-12 roughly pushes them into the margin if width is 90% */}
                    <button
                        ref={prevRef}
                        className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-[var(--color-pharma-green)] bg-white shadow-md border border-gray-100 rounded-full hover:bg-slate-50 transition-colors disabled:opacity-30"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        ref={nextRef}
                        className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center text-[var(--color-pharma-green)] bg-white shadow-md border border-gray-100 rounded-full hover:bg-slate-50 transition-colors disabled:opacity-30"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={2}
                        loop={true}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            // @ts-expect-error Swiper navigation params
                            swiper.params.navigation.prevEl = prevRef.current;
                            // @ts-expect-error Swiper navigation params
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 3, spaceBetween: 20 },
                            768: { slidesPerView: 4, spaceBetween: 24 },
                            1024: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        className="py-4 px-1"
                    >
                        {products.map((product) => {
                            const p = mapWooProduct(product as unknown as WooProduct);
                            return (
                                <SwiperSlide key={product.id} className="h-full pt-2 pb-2">
                                    <div className="h-full transform hover:-translate-y-1 transition-transform duration-300">
                                        <ProductCard product={p} />
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
