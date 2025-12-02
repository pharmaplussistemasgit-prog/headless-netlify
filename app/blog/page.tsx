"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
                        <BookOpen size={40} className="text-saprix-electric-blue" />
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white mb-6 italic uppercase tracking-tighter">
                        Blog Saprix
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                        Estamos preparando contenido exclusivo sobre fútbol sala, guías de entrenamiento y las últimas novedades de nuestros productos.
                    </p>

                    <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800 mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Próximamente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            {[
                                "Guía definitiva para elegir tus zapatillas",
                                "Rutinas de entrenamiento para Futsal",
                                "Historia del Microfútbol en Colombia"
                            ].map((topic, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                    <span className="flex-shrink-0 w-8 h-8 bg-saprix-electric-blue/10 text-saprix-electric-blue rounded-full flex items-center justify-center font-bold text-sm">
                                        {idx + 1}
                                    </span>
                                    <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                                        {topic}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/tienda"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-saprix-electric-blue text-white font-bold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Ver Productos Mientras Esperas
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
