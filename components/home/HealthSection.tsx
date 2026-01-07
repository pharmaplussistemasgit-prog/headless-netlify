'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Product } from '@/types/woocommerce';
import { mapWooProduct } from '@/lib/mappers';
import { WooProduct } from '@/types/product';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

interface HealthSectionProps {
    products: Product[];
}

export default function HealthSection({ products }: HealthSectionProps) {
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    if (!products || products.length === 0) return null;

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <section className="w-full bg-[var(--color-bg-light)] py-8">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 relative">
                        <div className="relative">
                            <h2 className="text-2xl font-bold text-gray-800 pb-2">
                                Salud y medicamentos
                            </h2>
                            {/* Green underline accent */}
                            <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-green-600 rounded-full"></div>
                        </div>

                        <Link href="/categoria/salud" className="text-gray-400 text-sm font-medium hover:text-green-600 flex items-center gap-1 transition-colors">
                            Ver más <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Products Carousel */}
                    <div className="relative group">
                        {/* Navigation Buttons */}
                        <button
                            ref={prevRef}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors bg-white shadow-sm rounded-full disabled:opacity-30 border border-gray-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                            ref={nextRef}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors bg-white shadow-sm rounded-full disabled:opacity-30 border border-gray-100"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={16}
                            slidesPerView={2}
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            onBeforeInit={(swiper) => {
                                // @ts-expect-error swiper styling
                                swiper.params.navigation.prevEl = prevRef.current;
                                // @ts-expect-error swiper styling
                                swiper.params.navigation.nextEl = nextRef.current;
                            }}
                            autoplay={{
                                delay: 7000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                768: { slidesPerView: 3, spaceBetween: 24 },
                                1024: { slidesPerView: 5, spaceBetween: 24 },
                            }}
                            className="py-2"
                        >
                            {products.map((product) => {
                                const p = mapWooProduct(product as unknown as WooProduct);
                                // Simulate discount like in the image (15%)
                                const displayDiscount = p.discountPercentage || 15;

                                return (
                                    <SwiperSlide key={product.id} className="h-full">
                                        <div className="group/card relative flex flex-col bg-white h-full">

                                            {/* Top Icons Layer */}
                                            <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-2">
                                                {/* Discount Circle Yellow */}
                                                <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 shadow-sm">
                                                    {displayDiscount}%
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-600 transition-colors">
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Image */}
                                            <div className="relative w-full aspect-[4/5] mb-2 p-4">
                                                <Image
                                                    src={p.images[0]}
                                                    alt={p.name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 768px) 50vw, 20vw"
                                                />
                                            </div>

                                            {/* Promo Tag */}
                                            <div className="bg-yellow-100 text-[10px] text-yellow-800 px-2 py-1 rounded w-full mb-2 truncate">
                                                Primera compra App y Web - Sólo domicilios
                                            </div>

                                            {/* Title */}
                                            <Link href={`/producto/${p.slug}`} className="mb-2 block">
                                                <h4 className="text-sm font-medium text-gray-700 line-clamp-2 min-h-[40px] group-hover/card:text-green-600 transition-colors">
                                                    {p.name}
                                                </h4>
                                            </Link>

                                            {/* Prices */}
                                            <div className="mt-auto">
                                                <div className="text-xl font-bold text-blue-600">
                                                    {formatPrice(p.price)}
                                                </div>
                                                {p.regularPrice > p.price && (
                                                    <div className="text-xs text-gray-400 line-through">
                                                        {formatPrice(p.regularPrice)}
                                                    </div>
                                                )}

                                                {/* Delivery Info Mock */}
                                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                                    <span>🚚 35 mins</span>
                                                </div>
                                            </div>

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
