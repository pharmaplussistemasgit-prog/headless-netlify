'use client';
import { Snowflake, Info, ThermometerSnowflake } from 'lucide-react';
import { Product } from '@/types/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import { mapWooProduct } from '@/lib/mappers';
import { WooProduct } from '@/types/product';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ColdChainSectionProps {
    products: Product[];
}

export default function ColdChainSection({ products }: ColdChainSectionProps) {
    // Filter for products that have the cold chain meta flag OR matching keywords
    const coldProducts = products.filter(p => {
        // 1. Check explicit meta (if added later)
        const coldMeta = p.meta_data?.find(m => m.key === '_cadena_de_frio' || m.key === 'cadena_frio');
        if (coldMeta && (coldMeta.value === 'yes' || coldMeta.value === 'true' || coldMeta.value === 'on' || coldMeta.value === '1' || coldMeta.value === true)) return true;

        // 2. Keyword fallback (Name or Description)
        const searchStr = (p.name + ' ' + (p.short_description || '')).toLowerCase();
        const keywords = ['refriger', 'frio', 'frío', 'never', 'insulina', 'vacuna', 'pen', 'vial', 'ampolla'];
        return keywords.some(k => searchStr.includes(k));
    });

    if (coldProducts.length === 0) return null;

    return (
        <section className="relative w-full py-16 overflow-hidden">
            {/* Thematic Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-blue-50/50 to-white pointer-events-none" />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform rotate-12">
                <Snowflake className="w-64 h-64 text-blue-900" />
            </div>

            <div className="relative max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-2xl shadow-blue-100 shadow-lg border border-blue-100 flex items-center justify-center">
                            <ThermometerSnowflake className="w-8 h-8 text-blue-500 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    Cadena de Frío
                                </h2>
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider">
                                    Control de Temperatura
                                </span>
                            </div>
                            <p className="text-gray-500 max-w-lg text-sm leading-relaxed">
                                Medicamentos especiales que requieren refrigeración continua garantizada para mantener su efectividad y seguridad.
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 w-fit px-3 py-1.5 rounded-lg border border-blue-100">
                                <Info className="w-3.5 h-3.5" />
                                <span>Estos productos se envían en empaques térmicos especiales.</span>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="hidden md:flex border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800" asChild>
                        <Link href="/categoria/medicamentos?feature=cold-chain">
                            Ver todo el catálogo
                        </Link>
                    </Button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {coldProducts.slice(0, 4).map((product) => {
                        const mappedProduct = mapWooProduct(product as unknown as WooProduct);
                        // Force isRefrigerated to true for visual consistency in this section if logic missed it but filter caught it
                        mappedProduct.isRefrigerated = true;

                        return (
                            <div key={product.id} className="h-full transform hover:-translate-y-1 transition-transform duration-300">
                                <ProductCard product={mappedProduct} />
                            </div>
                        );
                    })}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-8 md:hidden text-center">
                    <Button variant="outline" className="w-full border-blue-200 text-blue-700" asChild>
                        <Link href="/categoria/medicamentos?feature=cold-chain">
                            Ver todo el catálogo
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
