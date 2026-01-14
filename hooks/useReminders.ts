"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export interface Reminder {
    id: string;
    productName: string;
    productImage?: string; // Optional, can be generic if not selected from store
    frequency: string; // e.g., "Todos los días", "Cada 8 horas"
    dosage: string; // e.g., "1 tableta", "2 pufs"
    times: string[]; // ["08:00", "20:00"]
    startDate: string; // ISO Date "2024-01-01"
    duration?: string; // "Permanente" or number of days
    totalQuantity?: number; // For inventory tracking
    currentQuantity?: number;
    notify: boolean;
    notifyLowStock: boolean;
    lowStockThreshold?: number;
}

export interface LogEntry {
    reminderId: string;
    date: string; // "2024-01-01"
    time: string; // "08:00"
    taken: boolean;
    takenAt?: string; // ISO Timestamp
}

const STORAGE_KEY_REMINDERS = "pharma_pillbox_reminders";
const STORAGE_KEY_LOGS = "pharma_pillbox_logs";

export function useReminders() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Load from LocalStorage
    useEffect(() => {
        const storedReminders = localStorage.getItem(STORAGE_KEY_REMINDERS);
        const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);

        if (storedReminders) setReminders(JSON.parse(storedReminders));
        if (storedLogs) setLogs(JSON.parse(storedLogs));
        setLoading(false);
    }, []);

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(STORAGE_KEY_REMINDERS, JSON.stringify(reminders));
            localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
        }
    }, [reminders, logs, loading]);

    const addReminder = (reminder: Omit<Reminder, "id">) => {
        const newReminder = { ...reminder, id: uuidv4() };
        setReminders((prev) => [...prev, newReminder]);
    };

    const deleteReminder = (id: string) => {
        setReminders((prev) => prev.filter((r) => r.id !== id));
        // Also clean up logs? Maybe keep for history.
    };

    const updateReminder = (id: string, updates: Partial<Reminder>) => {
        setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    };

    const markAsTaken = (reminderId: string, date: string, time: string) => {
        const newLog: LogEntry = {
            reminderId,
            date,
            time,
            taken: true,
            takenAt: new Date().toISOString(),
        };

        // Remove existing log for this slot if any (toggle logic or overwrite?)
        // Let's assume overwrite/add
        setLogs((prev) => {
            const exists = prev.find(l => l.reminderId === reminderId && l.date === date && l.time === time);
            if (exists) return prev; // Already taken
            return [...prev, newLog];
        });

        // Deduct inventory if tracked
        const reminder = reminders.find(r => r.id === reminderId);
        if (reminder && reminder.currentQuantity !== undefined && reminder.currentQuantity > 0) {
            updateReminder(reminderId, { currentQuantity: reminder.currentQuantity - 1 });
        }
    };

    const unmarkTaken = (reminderId: string, date: string, time: string) => {
        setLogs((prev) => prev.filter(l => !(l.reminderId === reminderId && l.date === date && l.time === time)));
        // Restore inventory if tracked?
        const reminder = reminders.find(r => r.id === reminderId);
        if (reminder && reminder.currentQuantity !== undefined) {
            updateReminder(reminderId, { currentQuantity: reminder.currentQuantity + 1 });
        }
    };

    const getDailyReminders = (date: string) => {
        // Simple logic: returns all reminders active on this date
        // TODO: Filter by frequency/startDate/duration logic for more complex schedules
        return reminders.filter(r => new Date(r.startDate) <= new Date(date));
    };

    const getLogForSlot = (reminderId: string, date: string, time: string) => {
        return logs.find(l => l.reminderId === reminderId && l.date === date && l.time === time);
    };

    return {
        reminders,
        logs,
        loading,
        addReminder,
        deleteReminder,
        updateReminder,
        markAsTaken,
        unmarkTaken,
        getDailyReminders,
        getLogForSlot
    };
}
