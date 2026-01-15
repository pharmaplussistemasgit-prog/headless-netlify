'use client';

import { useState } from 'react';
import { Truck, MapPin, Search, PackageCheck } from 'lucide-react';
import { ShippingRule } from '@/lib/shipping';

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

const CITIES: Record<string, string[]> = {
    'CO-AMA': ['Leticia'],
    'CO-ANT': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Apartadó', 'Sabaneta'],
    'CO-ARA': ['Arauca'],
    'CO-ATL': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'],
    'CO-BOL': ['Cartagena', 'Magangué', 'Turbaco'],
    'CO-BOY': ['Tunja', 'Duitama', 'Sogamoso'],
    'CO-CAL': ['Manizales', 'Villamaría', 'La Dorada'],
    'CO-CAQ': ['Florencia'],
    'CO-CAS': ['Yopal'],
    'CO-CAU': ['Popayán', 'Santander de Quilichao'],
    'CO-CES': ['Valledupar', 'Aguachica'],
    'CO-CHO': ['Quibdó'],
    'CO-COR': ['Montería', 'Lorica', 'Sahagún'],
    'CO-CUN': ['Soacha', 'Chía', 'Zipaquirá', 'Cajicá', 'Facatativá', 'Mosquera', 'Madrid', 'Funza'],
    'CO-DC': ['Bogotá D.C.'],
    'CO-GUA': ['Inírida'],
    'CO-GUV': ['San José del Guaviare'],
    'CO-HUI': ['Neiva', 'Pitalito'],
    'CO-LAG': ['Riohacha', 'Maicao'],
    'CO-MAG': ['Santa Marta', 'Ciénaga'],
    'CO-MET': ['Villavicencio', 'Acacías'],
    'CO-NAR': ['Pasto', 'Ipiales', 'Tumaco'],
    'CO-NSA': ['Cúcuta', 'Ocaña', 'Villa del Rosario', 'Patios'],
    'CO-PUT': ['Mocoa', 'Puerto Asís'],
    'CO-QUI': ['Armenia', 'Calarcá'],
    'CO-RIS': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'],
    'CO-SAP': ['San Andrés'],
    'CO-SAN': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
    'CO-SUC': ['Sincelejo', 'Corozal'],
    'CO-TOL': ['Ibagué', 'Espinal'],
    'CO-VAC': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Buga', 'Yumbo', 'Jamundí', 'Cartago'],
    'CO-VAU': ['Mitú'],
    'CO-VID': ['Puerto Carreño']
};

export default function ShippingCalculator({ rules }: { rules: ShippingRule[] }) {
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [rates, setRates] = useState<any[]>([]);

    const handleCalculate = (code: string) => {
        setSelectedState(code);
        setSelectedCity(''); // Reset ciudad al cambiar departamento

        if (!code) {
            setRates([]);
            return;
        }

        // 1. Match Exacto (Ej: CO-ANT)
        let zone = rules.find(r => r.locations.includes(code));

        // 2. Match Default (Resto del país)
        if (!zone) {
            zone = rules.find(r => r.zoneId === 0 || r.locations.length === 0);
        }

        if (zone) {
            setRates(zone.methods);
        } else {
            setRates([]);
        }
    };

    const fmt = new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 0
    });

    // Helper para limpiar HTML
    const stripHtml = (html: string) => {
        return html.replace(/<[^>]*>?/gm, '');
    };

    const availableCities = selectedState ? (CITIES[selectedState] || []) : [];

    return (
        <div className="w-full h-full bg-gradient-to-br from-[#F5F7FA] to-[#E4E9F2]">
            {/* Background Decorativo (Mesh Gradients simulados) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-purple-400/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="relative z-10 p-6 flex flex-col h-full">

                {/* Header Fintech Style */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Cotizador</p>
                        <h3 className="text-2xl font-bold text-gray-800">Envíos</h3>
                    </div>
                    <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-[#0033A0]">
                        <Truck size={20} />
                    </div>
                </div>

                {/* Card Principal Glassmorphism */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl rounded-[2rem] p-6 flex-1 flex flex-col">

                    {/* Inputs Group */}
                    <div className="space-y-4 mb-8">
                        {/* Selector Departamento */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">DEPARTAMENTO</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <MapPin className="text-gray-400 group-focus-within:text-[#0033A0] transition-colors" size={18} />
                                </div>
                                <select
                                    value={selectedState}
                                    onChange={(e) => handleCalculate(e.target.value)}
                                    className="block w-full pl-11 pr-10 py-4 text-sm font-semibold text-gray-700 bg-white border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0033A0] focus:bg-white/80 transition-all outline-none appearance-none cursor-pointer shadow-sm"
                                >
                                    <option value="">Seleccionar...</option>
                                    {COLOMBIA_STATES.map(st => (
                                        <option key={st.code} value={st.code}>{st.name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Selector Ciudad (Dinámico) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2 ml-1">CIUDAD</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="text-gray-400 group-focus-within:text-[#0033A0] transition-colors" size={18} />
                                </div>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    disabled={!selectedState}
                                    className="block w-full pl-11 pr-10 py-4 text-sm font-semibold text-gray-700 bg-white border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-[#0033A0] focus:bg-white/80 transition-all outline-none appearance-none cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {!selectedState ? 'Selecciona Dpto primero' : 'Seleccionar Ciudad...'}
                                    </option>
                                    {availableCities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                    {selectedState && availableCities.length === 0 && (
                                        <option value="other">Otro Municipio</option>
                                    )}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resultados Widget */}
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 mb-4 ml-1 uppercase tracking-wider">
                            Resultados Estimados
                        </label>

                        {!selectedState ? (
                            <div className="h-32 flex flex-col items-center justify-center text-center p-4 rounded-3xl border-2 border-dashed border-gray-200/60 bg-white/30">
                                <p className="text-sm text-gray-400 font-medium">Selecciona un destino para calcular</p>
                            </div>
                        ) : rates.length > 0 ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {rates.map((rate, i) => (
                                    <div key={i} className="relative bg-white rounded-3xl p-5 shadow-lg shadow-blue-900/5 hover:scale-[1.02] transition-transform duration-300 border border-gray-50">
                                        {/* Gradient Accent */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-[4rem] rounded-tr-3xl -z-0"></div>

                                        <div className="relative z-10 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="bg-blue-50 text-[#0033A0] p-1.5 rounded-lg">
                                                        <PackageCheck size={16} />
                                                    </div>
                                                    <p className="font-bold text-gray-800 text-sm">{rate.title}</p>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium ml-1">
                                                    {stripHtml(rate.description || 'Entrega Estándar')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {rate.cost === 0 ? (
                                                    <span className="inline-block px-3 py-1 bg-green-100/80 text-green-700 text-xs font-bold rounded-full backdrop-blur-sm">
                                                        Gratis
                                                    </span>
                                                ) : (
                                                    <span className="block text-xl font-black text-gray-900 tracking-tight">
                                                        {fmt.format(rate.cost)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 bg-red-50 text-red-500 rounded-3xl text-sm font-medium">
                                Sin cobertura disponible
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
