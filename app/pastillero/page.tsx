"use client";

import { useState, useEffect } from "react";
import { Plus, Bell, Calendar as CalendarIcon, Info, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth"; // Import existing auth logic
import { useReminders } from "@/hooks/useReminders";
import CalendarStrip from "@/components/pastillero/CalendarStrip";
import ReminderCard from "@/components/pastillero/ReminderCard";
import AddMedicationModal from "@/components/pastillero/AddMedicationModal";

export default function PastilleroPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Auth Check
    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/login?redirect=/pastillero');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { reminders, logs, addReminder, deleteReminder, updateReminder, markAsTaken, unmarkTaken, getLogForSlot } = useReminders();

    // Prevent hydration mismatch or flash of content
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-pharma-blue)]" />
            </div>
        );
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    // Filter reminders that should appear on this day
    const todaysReminders = reminders.filter(r => new Date(r.startDate) <= selectedDate);

    // Group by time of day (Simple grouping for UI)
    const morningReminders: any[] = [];
    const afternoonReminders: any[] = [];
    const nightReminders: any[] = [];

    todaysReminders.forEach(reminder => {
        reminder.times.forEach(time => {
            const hour = parseInt(time.split(':')[0]);
            const entry = { reminder, time, log: getLogForSlot(reminder.id, formattedDate, time) };

            if (hour < 12) morningReminders.push(entry);
            else if (hour < 18) afternoonReminders.push(entry);
            else nightReminders.push(entry);
        });
    });

    // Handle Reminder Save
    const handleSaveReminder = (data: any) => {
        addReminder({
            productName: data.productName,
            productImage: data.productImage, // Pass image
            frequency: data.frequency,
            dosage: data.dosage,
            times: data.times,
            startDate: data.startDate,
            currentQuantity: data.quantity ? parseInt(data.quantity) : undefined,
            notify: data.notify,
            notifyLowStock: true
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Pastillero Virtual</h1>
                            <p className="text-gray-500 mt-1">Gestiona tus tomas y cuida tu salud</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[var(--color-pharma-green)] text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Crear recordatorio</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Calendar Strip */}
                <CalendarStrip selectedDate={selectedDate} onDateSelect={setSelectedDate} />

                {/* Dashboard */}
                <div className="space-y-8">
                    {/* Morning */}
                    {morningReminders.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
                                Mañana
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {morningReminders.map((item, idx) => (
                                    <ReminderCard
                                        key={idx}
                                        {...item}
                                        onTake={() => markAsTaken(item.reminder.id, formattedDate, item.time)}
                                        onUntake={() => unmarkTaken(item.reminder.id, formattedDate, item.time)}
                                        onDelete={() => deleteReminder(item.reminder.id)}
                                        onEdit={() => { }} // TODO: Implement edit
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Afternoon */}
                    {afternoonReminders.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-orange-400 rounded-full"></span>
                                Tarde
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {afternoonReminders.map((item, idx) => (
                                    <ReminderCard
                                        key={idx}
                                        {...item}
                                        onTake={() => markAsTaken(item.reminder.id, formattedDate, item.time)}
                                        onUntake={() => unmarkTaken(item.reminder.id, formattedDate, item.time)}
                                        onDelete={() => deleteReminder(item.reminder.id)}
                                        onEdit={() => { }}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Night */}
                    {nightReminders.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                                Noche
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {nightReminders.map((item, idx) => (
                                    <ReminderCard
                                        key={idx}
                                        {...item}
                                        onTake={() => markAsTaken(item.reminder.id, formattedDate, item.time)}
                                        onUntake={() => unmarkTaken(item.reminder.id, formattedDate, item.time)}
                                        onDelete={() => deleteReminder(item.reminder.id)}
                                        onEdit={() => { }}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty State */}
                    {morningReminders.length === 0 && afternoonReminders.length === 0 && nightReminders.length === 0 && (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CalendarIcon className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Tu día está libre</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                No tienes recordatorios programados para este día. ¡Aprovecha para crear uno nuevo y organizar tu salud!
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-2 text-[var(--color-pharma-green)] font-bold hover:underline"
                            >
                                <Plus className="w-5 h-5" />
                                Agregar primer recordatorio
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AddMedicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveReminder}
            />
        </div>
    );
}
