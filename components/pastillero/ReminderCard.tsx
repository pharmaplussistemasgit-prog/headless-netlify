"use client";

import { Check, Clock, Edit2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Reminder, LogEntry } from "@/hooks/useReminders";

interface ReminderCardProps {
    reminder: Reminder;
    time: string;
    log?: LogEntry;
    onTake: () => void;
    onUntake: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

export default function ReminderCard({ reminder, time, log, onTake, onUntake, onDelete, onEdit }: ReminderCardProps) {
    const isTaken = !!log?.taken;

    return (
        <div className={`
            relative bg-white border rounded-2xl p-4 transition-all duration-300
            ${isTaken ? 'border-green-200 shadow-sm opacity-80 bg-green-50/30' : 'border-gray-100 shadow-md hover:shadow-lg hover:-translate-y-1'}
        `}>
            {/* Time Badge */}
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-500">
                <Clock className="w-4 h-4" />
                <span className={isTaken ? 'line-through decoration-green-500' : ''}>
                    {time}
                </span>
                {isTaken && (
                    <span className="ml-auto text-xs bg-green-100 text-[var(--color-pharma-green)] px-2 py-0.5 rounded-full font-bold">
                        Completado
                    </span>
                )}
            </div>

            <div className="flex gap-4">
                {/* Image Placeholder */}
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-100">
                    {reminder.productImage ? (
                        <div className="relative w-12 h-12">
                            <Image src={reminder.productImage} alt={reminder.productName} fill className="object-contain" />
                        </div>
                    ) : (
                        <div className="text-2xl">💊</div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-gray-900 truncate ${isTaken ? 'line-through text-gray-400' : ''}`}>
                        {reminder.productName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                        Tomar {reminder.dosage}
                    </p>
                    <p className="text-xs text-blue-500 font-medium">
                        {reminder.times.length > 1 ? `Frecuencia: ${reminder.frequency}` : 'Una vez al día'}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
                <div className="mr-auto flex gap-1">
                    <button onClick={onEdit} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                {isTaken ? (
                    <button
                        onClick={onUntake}
                        className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Deshacer
                    </button>
                ) : (
                    <>
                        <button
                            className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-400 text-sm font-medium hover:bg-gray-50 transition-colors hover:text-gray-600"
                        >
                            Omitir
                        </button>
                        <button
                            onClick={onTake}
                            className="px-6 py-1.5 rounded-full bg-[var(--color-pharma-green)] text-white text-sm font-bold shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Tomar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
