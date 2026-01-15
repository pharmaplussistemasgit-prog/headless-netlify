'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Minus, Plus, ShoppingBag, ArrowRight, Truck, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/product/ProductCard';

import { auth } from '@/lib/auth';

interface CheckoutFormProps {
    shippingRules: import('@/lib/shipping').ShippingRule[];
}



// Lista de departamentos para el selector (Misma lista que en ShippingCalculator o importada)
// Por simplicidad y consistencia, la defino aquí también o podría importarse si se centraliza.
const COLOMBIA_STATES = [
    { code: 'CO-AMA', name: 'Amazonas' },
    { code: 'CO-ANT', name: 'Antioquia' },
    { code: 'CO-ARA', name: 'Arauca' },
    { code: 'CO-ATL', name: 'Atlántico' },
    { code: 'CO-BOL', name: 'Bolívar' },
    { code: 'CO-BOY', name: 'Boyacá' },
    { code: 'CO-CAL', name: 'Caldas' },
    { code: 'CO-CAQ', name: 'Caquetá' },
    { code: 'CO-CAS', name: 'Casanare' },
    { code: 'CO-CAU', name: 'Cauca' },
    { code: 'CO-CES', name: 'Cesar' },
    { code: 'CO-CHO', name: 'Chocó' },
    { code: 'CO-COR', name: 'Córdoba' },
    { code: 'CO-CUN', name: 'Cundinamarca' },
    { code: 'CO-DC', name: 'Bogotá D.C.' },
    { code: 'CO-GUA', name: 'Guainía' },
    { code: 'CO-GUV', name: 'Guaviare' },
    { code: 'CO-HUI', name: 'Huila' },
    { code: 'CO-LAG', name: 'La Guajira' },
    { code: 'CO-MAG', name: 'Magdalena' },
    { code: 'CO-MET', name: 'Meta' },
    { code: 'CO-NAR', name: 'Nariño' },
    { code: 'CO-NSA', name: 'Norte de Santander' },
    { code: 'CO-PUT', name: 'Putumayo' },
    { code: 'CO-QUI', name: 'Quindío' },
    { code: 'CO-RIS', name: 'Risaralda' },
    { code: 'CO-SAP', name: 'San Andrés y Providencia' },
    { code: 'CO-SAN', name: 'Santander' },
    { code: 'CO-SUC', name: 'Sucre' },
    { code: 'CO-TOL', name: 'Tolima' },
    { code: 'CO-VAC', name: 'Valle del Cauca' },
    { code: 'CO-VAU', name: 'Vaupés' },
    { code: 'CO-VID', name: 'Vichada' }
];

export default function CheckoutForm({ shippingRules }: CheckoutFormProps) {
    const { items, cartTotal, removeItem, updateQuantity, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);

    // Shipping State
    const [selectedState, setSelectedState] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [shippingMethodName, setShippingMethodName] = useState('');

    const [customerData, setCustomerData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        documentId: '',
        address: '',
        city: '',
        state: '',
    });

    // Update shipping cost when state changes
    useEffect(() => {
        if (!selectedState) {
            setShippingCost(0);
            setShippingMethodName('');
            return;
        }

        // 1. Find matched zone
        let zone = shippingRules.find(r => r.locations.includes(selectedState));

        // 2. Default zone fallback
        if (!zone) {
            zone = shippingRules.find(r => r.zoneId === 0 || r.locations.length === 0);
            if (zone) console.log("Using Default Zone:", zone.zoneName);
        }

        if (zone && zone.methods.length > 0) {
            // Select first method by default (Logic can be improved to allow selection)
            const method = zone.methods[0];
            setShippingCost(method.cost);
            setShippingMethodName(method.title);
        } else {
            // No shipping available
            setShippingCost(0);
            setShippingMethodName('Sin cobertura');
            toast.error("No hay envíos disponibles para esta zona");
        }
    }, [selectedState, shippingRules]);

    // Pre-fill data if logged in
    useEffect(() => {
        if (auth.isAuthenticated()) {
            const user = auth.getUser();
            if (user) {
                setCustomerData(prev => ({
                    ...prev,
                    firstName: user.name?.split(' ')[0] || '',
                    lastName: user.name?.split(' ').slice(1).join(' ') || '',
                    email: user.email || '',
                }));
            }
        }
    }, []);

    const finalTotal = cartTotal + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCustomerData({ ...customerData, [e.target.name]: e.target.value });
    };

    const handleCheckout = () => {
        if (!selectedState) {
            toast.error("Selecciona un departamento de envío");
            return;
        }
        if (shippingMethodName === 'Sin cobertura') {
            toast.error("No tenemos cobertura en esta zona");
            return;
        }

        // ... validation continued
        if (!customerData.firstName || !customerData.email || !customerData.documentId) {
            toast.error("Completa tus datos personales");
            return;
        }

        setIsLoading(true);
        try {
            // Handover URL (Legacy/Backend)
            const baseUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://tienda.pharmaplus.com.co").replace(/\/$/, "") + "/finalizar-compra/";

            const itemsString = items.map(item => {
                const idToUse = item.variationId || item.id;
                return `${idToUse}:${item.quantity}`;
            }).join(',');

            const params = new URLSearchParams();
            params.append('saprix_handover', 'true');
            params.append('items', itemsString);

            // Send selected state as shipping zone context
            params.append('shipping_zone', selectedState); // We send the state code now
            params.append('shipping_method', shippingMethodName); // Optional: inform backend

            params.append('billing_first_name', customerData.firstName);
            params.append('billing_last_name', customerData.lastName);
            params.append('billing_email', customerData.email);
            params.append('billing_phone', customerData.phone);
            params.append('billing_address_1', customerData.address);
            params.append('billing_city', customerData.city);
            params.append('billing_state', selectedState); // Important for Woo
            params.append('documentId', customerData.documentId);

            const handoverUrl = `${baseUrl}?${params.toString()}`;
            toast.success("Redirigiendo a pasarela de pagos segura...");

            // Clear cart before handover
            clearCart();

            setTimeout(() => {
                window.location.href = handoverUrl;
            }, 1000);

        } catch (error) {
            setIsLoading(false);
            toast.error("Error al procesar la solicitud");
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-pharma-blue)] mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-500 mb-8 max-w-md">Explora nuestro catálogo y encuentra lo que necesitas.</p>
                <Link href="/tienda" className="bg-[var(--color-pharma-blue)] text-white px-8 py-3 rounded-full font-bold hover:bg-[var(--color-dark-blue)] transition-colors">
                    Ir a la Tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-6">
                {/* 1. Datos Personales */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-[var(--color-pharma-blue)] mb-4 flex items-center gap-2">
                        <span className="bg-[var(--color-pharma-blue)] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Datos Personales
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500">Nombre</label>
                            <input type="text" name="firstName" value={customerData.firstName} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg focus:border-[var(--color-pharma-blue)] outline-none" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500">Apellido</label>
                            <input type="text" name="lastName" value={customerData.lastName} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg focus:border-[var(--color-pharma-blue)] outline-none" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500">Cédula</label>
                            <input type="text" name="documentId" value={customerData.documentId} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg focus:border-[var(--color-pharma-blue)] outline-none" required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500">Celular</label>
                            <input type="tel" name="phone" value={customerData.phone} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg focus:border-[var(--color-pharma-blue)] outline-none" required />
                        </div>
                        <div className="col-span-1 sm:col-span-2 space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                            <input type="email" name="email" value={customerData.email} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg focus:border-[var(--color-pharma-blue)] outline-none" required />
                        </div>
                    </div>
                </div>

                {/* 2. Envío */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-[var(--color-pharma-blue)] mb-4 flex items-center gap-2">
                        <span className="bg-[var(--color-pharma-blue)] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Datos de Envío
                    </h2>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-gray-500">Ubicación (Departamento)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[var(--color-pharma-blue)] outline-none bg-white font-medium"
                                >
                                    <option value="">-- Seleccionar Departamento --</option>
                                    {COLOMBIA_STATES.map(st => (
                                        <option key={st.code} value={st.code}>{st.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedState && (
                            <>
                                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-[var(--color-pharma-blue)]" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{shippingMethodName || 'Calculando...'}</p>
                                            <p className="text-xs text-gray-500">Tarifa oficial</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-[var(--color-pharma-blue)]">
                                        {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString()}`}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500">Ciudad / Municipio</label>
                                    <input type="text" name="city" value={customerData.city} onChange={handleInputChange} className="w-full p-2 border border-gray-200 rounded-lg outline-none" placeholder="Ej: Medellín" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase text-gray-500">Dirección Exacta</label>
                                    <input type="text" name="address" value={customerData.address} onChange={handleInputChange} placeholder="Calle 123 # 45 - 67, Apto 101" className="w-full p-2 border border-gray-200 rounded-lg outline-none" required />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                    <h2 className="text-lg font-bold text-[var(--color-pharma-blue)] mb-6">Resumen del Pedido</h2>

                    {/* Items List (Brief) */}
                    <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
                        {items.map((item) => (
                            <div key={`${item.id}-${item.variationId || 'base'}`} className="flex gap-3">
                                <div className="relative w-12 h-12 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 text-sm">
                                    <p className="font-medium text-[var(--color-pharma-blue)] line-clamp-1">{item.name}</p>
                                    <p className="text-gray-500 text-xs">Cant: {item.quantity}</p>
                                </div>
                                <div className="text-right text-sm font-bold text-gray-900">
                                    ${(item.price * item.quantity).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-bold">${cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Envío</span>
                            {shippingCost === 0 ? (
                                <span className="text-green-600 font-bold">Gratis</span>
                            ) : (
                                <span className="font-bold">${shippingCost.toLocaleString()}</span>
                            )}
                        </div>
                        <div className="flex justify-between text-xl font-bold text-[var(--color-pharma-blue)] pt-2 border-t border-gray-100 mt-2">
                            <span>Total</span>
                            <span>${finalTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isLoading || !selectedState}
                        className="w-full py-4 bg-[var(--color-pharma-green)] text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Procesando...' : 'Pagar Ahora'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <ShieldCheck size={14} />
                        <span>Pagos procesados de forma segura</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
