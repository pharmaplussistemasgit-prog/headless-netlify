import { getAllCategories } from '@/app/actions/products';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import { Metadata } from 'next';
import Link from 'next/link';
import { getColdChainProducts } from '@/lib/business-logic';
import { ThermometerSnowflake, Info } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Cadena de Frío | PharmaPlus',
    description: 'Medicamentos refrigerados y especiales con control de temperatura garantizado.',
};

export default async function ColdChainPage() {
    // Data Fetching
    const products = await getColdChainProducts(40); // Traer suficientes items
    const allCategories = await getAllCategories();

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            {/* Breadcrumbs */}
            <Breadcrumbs
                items={[
                    { label: 'Categorías', href: '#' },
                    { label: 'Cadena de Frío', href: `/categoria/cadena-de-frio` }
                ]}
            />

            <div className="flex flex-col md:flex-row gap-8 mt-6">
                {/* Sidebar (Reutilizado) */}
                <aside className="w-full md:w-64 flex-shrink-0 hidden md:block">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24 shadow-sm">
                        <h3 className="font-bold text-[var(--color-primary-blue)] mb-4 pb-2 border-b border-gray-100">Categorías</h3>
                        <ul className="space-y-2">
                            <li className="mb-4">
                                <Link
                                    href="/categoria/cadena-de-frio"
                                    className="block py-2 px-3 rounded-md text-sm font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-2"
                                >
                                    <ThermometerSnowflake className="w-4 h-4" />
                                    Cadena de Frío
                                </Link>
                            </li>
                            {allCategories.map(cat => (
                                <li key={cat.id}>
                                    <Link
                                        href={`/categoria/${cat.slug}`}
                                        className="block py-1.5 px-3 rounded-md text-sm font-medium text-gray-600 hover:text-[var(--color-action-blue)] hover:bg-gray-50 transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Custom Header */}
                    <div className="bg-white rounded-2xl p-8 mb-8 border border-blue-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                            <ThermometerSnowflake className="w-48 h-48 text-blue-900" />
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                                <ThermometerSnowflake className="w-3.5 h-3.5" />
                                Especialidad Farmacéutica
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Cadena de Frío
                            </h1>
                            <p className="text-gray-500 max-w-2xl text-lg mb-6">
                                Selección especializada de medicamentos que requieren estricto control de temperatura.
                                Garantizamos la integridad del producto desde nuestra farmacia hasta tu hogar.
                            </p>

                            <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 max-w-xl">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">
                                    <strong>Nota Importante:</strong> Estos productos se entregan en empaques térmicos especiales con geles refrigerantes para mantener la temperatura entre 2°C y 8°C.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-700">
                                    Resultados ({products.length})
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 border-dashed">
                            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
                                <ThermometerSnowflake className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">No encontramos productos refrigerados</h3>
                            <p className="text-gray-500 mb-6">Intenta verificar más tarde o contacta a soporte si buscas un medicamento específico.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
