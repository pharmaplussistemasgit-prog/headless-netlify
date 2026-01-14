'use client';

import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-20">
      {/* Header */}
      <div className="bg-[var(--color-pharma-blue)] text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Si tienes alguna pregunta, duda o sugerencia, no dudes en escribirnos.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[var(--color-pharma-blue)]" />
                Información de Contacto
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--color-pharma-blue)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Dirección Principal</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Calle 86 # 27-54, Barrio Polo Club<br />
                      Bogotá D.C., Colombia
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[var(--color-pharma-blue)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Teléfonos</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      PBX: (601) 593 4005<br />
                      Móvil: (+57) 300 123 4567
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[var(--color-pharma-blue)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Correo Electrónico</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      servicioalcliente@pharmaplus.com.co<br />
                      ventas@pharmaplus.com.co
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[var(--color-pharma-blue)]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Horario de Atención</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Lunes a Viernes: 8:00 AM - 6:00 PM<br />
                      Sábados: 8:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                <Link
                  href="https://wa.me/573001234567"
                  target="_blank"
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chatea con nosotros
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Envíanos un mensaje</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[var(--color-pharma-blue)] outline-none transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[var(--color-pharma-blue)] outline-none transition-all"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[var(--color-pharma-blue)] outline-none transition-all"
                      placeholder="(+57) 300..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Asunto</label>
                    <select
                      id="subject"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[var(--color-pharma-blue)] outline-none transition-all text-gray-600"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="pedido">Consulta sobre pedido</option>
                      <option value="producto">Información de producto</option>
                      <option value="reclamo">Peticiones, Quejas y Reclamos (PQR)</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje</label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[var(--color-pharma-blue)] outline-none transition-all resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    className="px-8 py-4 bg-[var(--color-pharma-blue)] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-96 bg-gray-100 relative group">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.621287959082!2d-74.0620666241324!3d4.671501995304001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a5f7f3d8e2d%3A0x7e8f5c8b7a4d4e3f!2sCl.%2086%20%2327-54%2C%20Barrios%20Unidos%2C%20Bogot%C3%A1!5e0!3m2!1ses!2sco!4v1709664531234!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale hover:grayscale-0 transition-all duration-700"
          >
          </iframe>
          <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm font-bold text-gray-700">
            PharmaPlus Principal
          </div>
        </div>
      </div>
    </div>
  );
}