'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Product } from '@/types/woocommerce';
import { mapWooProduct } from '@/lib/mappers';
import { WooProduct } from '@/types/product';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface RecommendedSectionProps {
    products: Product[];
}

export default function RecommendedSection({ products }: RecommendedSectionProps) {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    if (!products || products.length === 0) return null;

    return (
        <section className="w-full bg-[var(--color-bg-light)] py-8">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-2 relative">
                        <div className="relative">
                            <h2 className="text-2xl font-bold text-gray-800 pb-2">
                                Nuestros recomendados
                            </h2>
                            {/* Blue underline accent */}
                            <div className="absolute bottom-[-9px] left-0 w-full h-[3px] bg-blue-600 rounded-full"></div>
                        </div>

                        <Link href="/tienda" className="text-gray-400 text-sm font-medium hover:text-blue-600 flex items-center gap-1 transition-colors">
                            Ver más <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative group">
                        {/* Navigation Buttons */}
                        <button
                            ref={prevRef}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-30"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <button
                            ref={nextRef}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-30"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>

                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={2}
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
                                1024: { slidesPerView: 5, spaceBetween: 30 },
                            }}
                            className="py-4"
                        >
                            {products.map((product) => {
                                const p = mapWooProduct(product as unknown as WooProduct);
                                return (
                                    <SwiperSlide key={product.id}>
                                        <div className="group/card relative flex flex-col items-center">

                                            {/* Floating Action Button */}
                                            <div className="absolute top-0 right-0 z-10">
                                                <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-600 transition-colors">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Image Container */}
                                            <div className="relative w-full aspect-square mb-3 p-4">
                                                <Image
                                                    src={p.images[0]}
                                                    alt={p.name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 768px) 50vw, 20vw"
                                                />
                                            </div>

                                            {/* Yellow Label - Product Name/Brand */}
                                            <div className="bg-[#FFD600] text-gray-900 text-[11px] font-bold px-3 py-1.5 rounded-sm line-clamp-1 w-auto max-w-full text-center shadow-sm">
                                                {p.brand || p.name.split(' ')[0]}
                                                {/* Fallback to first word of name if Brand not set, as typical in pharma */}
                                            </div>

                                            {/* Hit area link */}
                                            <Link href={`/producto/${p.slug}`} className="absolute inset-0 z-0" aria-label={`Ver ${p.name}`} />
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    );
}
