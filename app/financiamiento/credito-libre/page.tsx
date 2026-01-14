'use client';

import { Calculator, ArrowRight, DollarSign, CalendarCheck, Percent, Banknote } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CreditoLibrePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-[var(--color-pharma-green)] text-white relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400 opacity-20 rounded-full blur-2xl"></div>

                <div className="container mx-auto px-4 py-20 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                        <Banknote className="w-4 h-4" />
                        Financiación Flexible
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        Crédito de Libre Inversión <br /> para tu Salud
                    </h1>
                    <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto leading-relaxed">
                        No dejes que el presupuesto detenga tu tratamiento. Ofrecemos opciones de financiación ágiles con múltiples aliados financieros.
                    </p>
                    <Link
                        href="#simulador"
                        className="inline-flex px-8 py-4 bg-white text-[var(--color-pharma-green)] font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 text-lg items-center gap-2 transition-all"
                    >
                        Simular mi Crédito
                        <Calculator className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Visual Simulator Section */}
            <div id="simulador" className="container mx-auto px-4 -mt-16 mb-20 relative z-20">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <CreditSimulator />
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Percent className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Tasas Competitivas</h3>
                        <p className="text-gray-600">Trabajamos con múltiples entidades para buscarte la mejor tasa posible según tu perfil.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CalendarCheck className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Plazos Flexibles</h3>
                        <p className="text-gray-600">Elige pagar desde 6 hasta 48 meses. Tú tienes el control de tus cuotas mensuales.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DollarSign className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Desembolso Rápido</h3>
                        <p className="text-gray-600">Una vez aprobado, el dinero se abona directamente o se utiliza para pagar tu pedido web.</p>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="bg-gray-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">¿Tienes dudas sobre el proceso?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Nuestro equipo de asesores está listo para guiarte y encontrar la mejor opción para ti.
                    </p>
                    <Link
                        href="/contacto?subject=asesoria-credito"
                        className="inline-flex px-8 py-3 border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold rounded-full transition-all"
                    >
                        Hablar con un Asesor
                    </Link>
                </div>
            </div>
        </div>
    );
}

function CreditSimulator() {
    const [amount, setAmount] = useState(1000000);
    const [months, setMonths] = useState(12);

    // Simplified calculation for demo purposes (approximate PMT)
    // Rate ~2.5% M.V.
    const rate = 0.025;
    const monthlyPayment = (amount * rate) / (1 - Math.pow(1 + rate, -months));

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calculator className="w-6 h-6 text-[var(--color-pharma-green)]" />
                    Simula tu Plan de Pagos
                </h3>

                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-bold text-gray-700">Monto a solicitar</label>
                            <span className="text-[var(--color-pharma-green)] font-bold">{formatCurrency(amount)}</span>
                        </div>
                        <input
                            type="range"
                            min="200000"
                            max="50000000"
                            step="100000"
                            value={amount}
                            onChange={(e) => setAmount(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-pharma-green)]"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>$200k</span>
                            <span>$50M</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="font-bold text-gray-700">Plazo en meses</label>
                            <span className="text-[var(--color-pharma-green)] font-bold">{months} meses</span>
                        </div>
                        <input
                            type="range"
                            min="6"
                            max="48"
                            step="6"
                            value={months}
                            onChange={(e) => setMonths(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-pharma-green)]"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>6 meses</span>
                            <span>48 meses</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 flex flex-col justify-center border border-gray-100">
                <p className="text-center text-gray-500 mb-2 font-medium">Cuota Mensual Aproximada *</p>
                <div className="text-center">
                    <span className="text-4xl md:text-5xl font-black text-[var(--color-pharma-green)] tracking-tight">
                        {formatCurrency(monthlyPayment)}
                    </span>
                    <span className="text-xl font-bold text-gray-400">/mes</span>
                </div>

                <div className="mt-8 space-y-3 pt-8 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Total del Crédito:</span>
                        <span className="font-bold">{formatCurrency(amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Intereses estimados:</span>
                        <span className="font-bold text-gray-900">{formatCurrency((monthlyPayment * months) - amount)}</span>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href="/login?redirect=/solicitud"
                        className="block w-full py-4 bg-[var(--color-pharma-green)] hover:bg-green-600 text-white font-bold rounded-xl text-center shadow-lg transition-all"
                    >
                        Solicitar Este Monto
                    </Link>
                    <p className="text-[10px] text-gray-400 text-center mt-3 leading-tight">
                        * Valores aproximados con fines informativos. La tasa final y cuota dependerán de tu estudio de crédito y perfil de riesgo. Tasa referencia 2.5% M.V.
                    </p>
                </div>
            </div>
        </div>
    );
}
