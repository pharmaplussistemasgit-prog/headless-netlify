"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-end pb-24 overflow-hidden bg-gray-900">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/error-404-saprix.webp"
                    alt="404 Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient only at the bottom to make text readable, keeping the rest clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="space-y-8">
                        <h2 className="text-5xl sm:text-7xl font-black text-white italic uppercase tracking-wide drop-shadow-2xl">
                            Fuera de Juego
                        </h2>

                        <p className="text-xl sm:text-2xl text-gray-100 font-medium drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
                            Parece que esta página no está en nuestra alineación.
                            Regresa al campo y encuentra lo que buscas.
                        </p>

                        <div className="pt-6">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-3 px-12 py-5 bg-saprix-electric-blue text-white font-bold text-xl rounded-full hover:bg-blue-700 transition-all duration-300 shadow-[0_0_20px_rgba(37,0,255,0.5)] hover:shadow-[0_0_30px_rgba(37,0,255,0.7)] transform hover:-translate-y-1"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
