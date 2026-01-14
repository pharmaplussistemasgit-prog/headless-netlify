"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, subDays } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarStripProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
}

export default function CalendarStrip({ selectedDate, onDateSelect }: CalendarStripProps) {
    const [currentStartDate, setCurrentStartDate] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));

    // Generate 7 days for current view
    const days = Array.from({ length: 7 }).map((_, i) => addDays(currentStartDate, i));

    const handlePrevWeek = () => {
        setCurrentStartDate(prev => subDays(prev, 7));
    };

    const handleNextWeek = () => {
        setCurrentStartDate(prev => addDays(prev, 7));
    };

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <div className="bg-[var(--color-pharma-green)] p-4 rounded-xl shadow-lg mb-8">
            <div className="flex items-center justify-between text-white mb-2">
                <button onClick={handlePrevWeek} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="font-bold text-lg">
                    {capitalize(format(currentStartDate, 'MMMM yyyy', { locale: es }))}
                </div>
                <button onClick={handleNextWeek} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDateSelect(day)}
                            className={`
                                flex flex-col items-center justify-center py-3 rounded-xl transition-all
                                ${isSelected
                                    ? 'bg-white/30 text-white font-bold shadow-sm scale-105 ring-2 ring-white/50'
                                    : 'hover:bg-white/10 text-white/90'
                                }
                            `}
                        >
                            <span className="text-xs uppercase opacity-80 mb-1">
                                {format(day, 'EEE', { locale: es }).replace('.', '')}
                            </span>
                            <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'}`}>
                                {format(day, 'd')}
                            </span>
                            {isToday && (
                                <span className="w-1 h-1 bg-white rounded-full mt-1"></span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
