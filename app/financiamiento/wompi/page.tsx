'use client';

import { ShieldCheck, Lock, Smartphone, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WompiPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-[#2C004F] text-white overflow-hidden relative">
                {/* Wompi Brand Purple #3B0065 or approximate */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4D1585] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>

                <div className="container mx-auto px-4 py-24 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold mb-6 text-purple-200">
                                <ShieldCheck className="w-4 h-4" />
                                Pasarela de Pagos Segura
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                Pagos rápidos y seguros con <span className="text-[#9F50FF]">Wompi</span>
                            </h1>
                            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                                En PharmaPlus integramos Wompi, la pasarela de pagos de Bancolombia, para garantizar que cada transacción esté 100% protegida.
                            </p>
                            <Link
                                href="/tienda"
                                className="inline-flex px-8 py-4 bg-[#9F50FF] hover:bg-[#8A3CE8] text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 text-lg items-center gap-2 transition-all"
                            >
                                Ir a la Tienda y Pagar con Wompi
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            {/* Placeholder for Graphic */}
                            <div className="relative w-80 h-80 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                <div className="text-white text-9xl font-black opacity-20 select-none">W</div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Lock className="w-32 h-32 text-[#9F50FF]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Methods Section */}
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Todos los medios de pago en un solo lugar</h2>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Logos should be Images ideally, using text/icons for now */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                                <span className="font-bold text-blue-800 text-xs">VISA</span>
                            </div>
                            <span className="text-sm font-bold text-gray-500">Visa</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                                <span className="font-bold text-red-600 text-xs">MC</span>
                            </div>
                            <span className="text-sm font-bold text-gray-500">MasterCard</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                                <span className="font-bold text-blue-500 text-xs">AMEX</span>
                            </div>
                            <span className="text-sm font-bold text-gray-500">Amex</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                                <span className="font-bold text-purple-600 text-xs">PSE</span>
                            </div>
                            <span className="text-sm font-bold text-gray-500">PSE</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                                <span className="font-bold text-yellow-500 text-xs">NEQUI</span>
                            </div>
                            <span className="text-sm font-bold text-gray-500">Nequi</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                                <span className="font-bold text-black text-xs">Bancolombia</span>
                            </div>
                            <span className="text-sm font-bold text-gray-500">Botón Bancolombia</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Features */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-all group">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#9F50FF] group-hover:text-white transition-colors">
                            <Lock className="w-6 h-6 text-[#9F50FF] group-hover:text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Encriptación Avanzada</h3>
                        <p className="text-gray-600">Tus datos viajan encriptados bajo protocolos de seguridad bancaria de última generación.</p>
                    </div>
                    <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-all group">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#9F50FF] group-hover:text-white transition-colors">
                            <Smartphone className="w-6 h-6 text-[#9F50FF] group-hover:text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Experiencia Móvil</h3>
                        <p className="text-gray-600">Paga desde tu celular de manera fluida, rápida y sin complicaciones.</p>
                    </div>
                    <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-all group">
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#9F50FF] group-hover:text-white transition-colors">
                            <ShieldCheck className="w-6 h-6 text-[#9F50FF] group-hover:text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Respaldo Bancolombia</h3>
                        <p className="text-gray-600">Wompi cuenta con todo el respaldo y la infraestructura del Grupo Bancolombia.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
