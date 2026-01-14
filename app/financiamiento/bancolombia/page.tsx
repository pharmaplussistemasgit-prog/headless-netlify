'use client';

import { CreditCard, CheckCircle2, ArrowRight, Wallet, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BancolombiaPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-[#2C2A29] text-white relative overflow-hidden">
                {/* Bancolombia Brand Colors: Yellow #FDDA24, Black #2C2A29, White #FFFFFF */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FDDA24] opacity-10 skew-x-12 transform translate-x-20"></div>

                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-[#FDDA24]" />
                                Alianza Exclusiva
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            Financia tu salud con <br />
                            <span className="text-[#FDDA24]">Bancolombia</span>
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                            Accede a tratamientos y medicamentos con tasas preferenciales y aprobación inmediata directamente con tu banco de confianza.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/contacto?subject=financiamiento-bancolombia"
                                className="px-8 py-4 bg-[#FDDA24] hover:bg-[#E5C520] text-[#2C2A29] font-bold rounded-xl shadow-lg shadow-yellow-500/20 text-lg flex items-center justify-center gap-2 transition-all"
                            >
                                Solicitar Financiación
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#como-funciona"
                                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm flex items-center justify-center gap-2 transition-all"
                            >
                                Cómo funciona
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Beneficios Exclusivos</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Diseñados pensando en tu bienestar y tranquilidad financiera.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Benefit 1 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center mb-6">
                            <Wallet className="w-7 h-7 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Tasas Preferenciales</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Disfruta de tasas de interés especiales por ser cliente Bancolombia, más bajas que una tarjeta de crédito tradicional.
                        </p>
                    </motion.div>

                    {/* Benefit 2 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                            <Clock className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Aprobación Inmediata</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Sin papeleos físicos. El proceso es 100% digital y recibes respuesta en minutos directamente en tu App Bancolombia.
                        </p>
                    </motion.div>

                    {/* Benefit 3 */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                    >
                        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6">
                            <ShieldCheck className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Seguridad Total</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Todo el proceso se realiza bajo los estándares de seguridad bancaria de Bancolombia. Tus datos siempre protegidos.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* How it Works */}
            <div id="como-funciona" className="bg-white py-20 border-y border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">¿Cómo solicitar tu financiación?</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#2C2A29] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Selecciona tus productos</h4>
                                        <p className="text-gray-600">Agrega los medicamentos o productos de salud que necesitas a tu carrito de compras en PharmaPlus.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#2C2A29] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Elige Bancolombia en el pago</h4>
                                        <p className="text-gray-600">Al finalizar la compra, selecciona la opción de financiación Bancolombia o botón Wompi/Bancolombia.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#2C2A29] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Autoriza en la App</h4>
                                        <p className="text-gray-600">Recibirás una notificación en tu App Bancolombia para aprobar el crédito y el desembolso.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FDDA24] text-[#2C2A29] flex items-center justify-center font-bold flex-shrink-0">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">¡Listo! Pedido Confirmado</h4>
                                        <p className="text-gray-600">Nosotros recibimos la confirmación y preparamos tu envío de inmediato.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-3xl p-8 h-[500px] flex items-center justify-center relative overflow-hidden group">
                            {/* Placeholder for App Screenshot or Illustration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FDDA24] to-[#F5B700] opacity-10"></div>
                            <SmartphoneMockup />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Listo para cuidar tu salud sin preocupaciones?</h2>
                <Link
                    href="/contacto?subject=financiamiento-bancolombia"
                    className="inline-flex px-10 py-4 bg-[#2C2A29] hover:bg-gray-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl text-lg items-center gap-2 transition-all"
                >
                    Iniciar Solicitud Ahora
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="mt-4 text-sm text-gray-500">Sujeto a estudio de crédito y políticas de Bancolombia S.A.</p>
            </div>
        </div>
    );
}

function SmartphoneMockup() {
    return (
        <div className="w-64 h-[480px] bg-gray-900 rounded-[3rem] border-4 border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
            <div className="w-full h-full bg-white flex flex-col pt-12 px-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full mb-6 mx-auto"></div>
                <div className="w-3/4 h-3 bg-gray-100 rounded mb-3 mx-auto"></div>
                <div className="w-1/2 h-3 bg-gray-100 rounded mb-8 mx-auto"></div>
                <div className="flex-1 bg-gray-50 rounded-xl mb-4 p-4">
                    <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                    <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full h-10 bg-[#FDDA24] rounded-lg mb-8"></div>
            </div>
        </div>
    );
}
