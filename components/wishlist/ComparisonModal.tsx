'use client';

import { X, Check, Activity, Shield, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { WishlistItem } from '@/context/WishlistContext';

interface ComparisonModalProps {
    products: WishlistItem[];
    isOpen: boolean;
    onClose: () => void;
    onRemove: (id: number) => void;
}

export default function ComparisonModal({ products, isOpen, onClose, onRemove }: ComparisonModalProps) {
    if (!isOpen) return null;

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Comparación de Productos</h2>
                        <p className="text-gray-500 text-sm">Comparando {products.length} artículos lado a lado</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-[150px_repeat(auto-fit,minmax(200px,1fr))] gap-0 border border-gray-200 rounded-2xl overflow-hidden divide-x divide-gray-200">
                        {/* Headers Column */}
                        <div className="bg-gray-50 flex flex-col divide-y divide-gray-200 font-semibold text-sm text-gray-600">
                            <div className="h-64 p-4 flex items-center">Producto</div>
                            <div className="h-16 p-4 flex items-center">Precio</div>
                            <div className="h-16 p-4 flex items-center">Marca</div>
                            <div className="h-16 p-4 flex items-center">Categoría</div>
                            <div className="h-16 p-4 flex items-center">Stock</div>
                            <div className="h-16 p-4 flex items-center">Despacho</div>
                            <div className="h-20 p-4 flex items-center">Acción</div>
                        </div>

                        {/* Product Columns */}
                        {products.map(product => (
                            <div key={product.id} className="flex flex-col divide-y divide-gray-200 text-sm relative group">
                                <button
                                    onClick={() => onRemove(product.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-100"
                                    title="Quitar de comparación"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                {/* Image & Name */}
                                <div className="h-64 p-4 flex flex-col items-center justify-center text-center gap-3">
                                    <div className="relative w-32 h-32 bg-white rounded-xl p-2">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900 leading-tight">{product.name}</h3>
                                </div>

                                {/* Price */}
                                <div className="h-16 p-4 flex items-center justify-center font-bold text-lg text-[var(--color-pharma-blue)]">
                                    {formatPrice(Number(product.price))}
                                </div>

                                {/* Brand */}
                                <div className="h-16 p-4 flex items-center justify-center text-gray-600 uppercase text-xs font-bold tracking-wider">
                                    {/* Mapped manually or fallback */}
                                    PharmaPlus
                                </div>

                                {/* Category */}
                                <div className="h-16 p-4 flex items-center justify-center text-gray-600 capitalize">
                                    {product.category || 'General'}
                                </div>

                                {/* Stock */}
                                <div className="h-16 p-4 flex items-center justify-center">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                        <Check className="w-3 h-3" />
                                        Disponible
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="h-16 p-4 flex items-center justify-center text-gray-500 text-xs text-center">
                                    Envío Nacional <br /> 24-48 horas
                                </div>

                                {/* Action */}
                                <div className="h-20 p-4 flex items-center justify-center">
                                    <a
                                        href={`/producto/${product.slug}`}
                                        className="w-full py-2 bg-[var(--color-pharma-blue)] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-3 h-3" />
                                        Ver Producto
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
