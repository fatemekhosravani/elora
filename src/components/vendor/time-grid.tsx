'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { AppointmentBlock } from './appointment-block';
import type { Appointment, Staff, ViewMode } from '@/types/vendor-calendar';
import { useDroppable } from '@dnd-kit/core';

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate pixel position for appointment block
 */
export function calculatePosition(startTime: string, duration: number) {
    const start = new Date(startTime);
    const hours = start.getHours();
    const minutes = start.getMinutes();
    
    // Start from 8:00 AM (480 minutes from midnight)
    const minutesFromStart = hours * 60 + minutes - 480;
    const pixelsPerMinute = 1.5; // Adjust for desired density
    
    const top = minutesFromStart * pixelsPerMinute;
    const height = duration * pixelsPerMinute;
    
    return { top, height };
}

/**
 * Get duration in minutes between two ISO strings
 */
export function getDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.round((endDate.getTime() - startDate.getTime()) / 60000);
}

/**
 * Check if two appointments overlap
 */
function doAppointmentsOverlap(apt1: Appointment, apt2: Appointment): boolean {
    const start1 = new Date(apt1.start).getTime();
    const end1 = new Date(apt1.end).getTime();
    const start2 = new Date(apt2.start).getTime();
    const end2 = new Date(apt2.end).getTime();
    
    return start1 < end2 && start2 < end1;
}

/**
 * Get overlapping appointments for a given appointment
 */
function getOverlappingAppointments(
    appointment: Appointment,
    allAppointments: Appointment[]
): Appointment[] {
    return allAppointments.filter(
        apt => apt.id !== appointment.id &&
               apt.staffId === appointment.staffId &&
               doAppointmentsOverlap(apt, appointment)
    );
}

// ==================== TIME LINES ====================

function TimeLines() {
    const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 to 22:00
    
    return (
        <div className="absolute inset-0 pointer-events-none">
            {hours.map((hour) => (
                <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-white/5"
                    style={{ top: `${(hour - 8) * 90}px` }}
                >
                    <span className="absolute -top-2.5 right-full mr-3 text-xs font-mono text-white/40">
                        {hour.toString().padStart(2, '0')}:00
                    </span>
                </div>
            ))}
        </div>
    );
}

// ==================== CURRENT TIME LINE ====================

function CurrentTimeLine() {
    const [currentTime, setCurrentTime] = useState(new Date());
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        
        return () => clearInterval(interval);
    }, []);
    
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    
    // Only show if within business hours (8:00 - 22:00)
    if (hours < 8 || hours >= 22) return null;
    
    const minutesFromStart = hours * 60 + minutes - 480;
    const top = minutesFromStart * 1.5;
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{ top: `${top}px` }}
        >
            <div className="relative">
                <div className="absolute -top-1.5 -right-2 w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
                <div className="h-0.5 bg-red-500 shadow-lg shadow-red-500/50" />
            </div>
        </motion.div>
    );
}

// ==================== COLUMN COMPONENT ====================

interface ColumnProps {
    id: string;
    label: string;
    avatar?: string;
    appointments: Appointment[];
}

function Column({ id, label, avatar, appointments }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id });
    
    return (
        <div
            ref={setNodeRef}
            className="relative flex-1 min-w-[200px] border-l border-white/10 first:border-l-0"
        >
            {/* Column Header */}
            <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center gap-3">
                {avatar && (
                    <img
                        src={avatar}
                        alt={label}
                        className="w-8 h-8 rounded-full border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/30"
                    />
                )}
                <span className="font-bold text-white">{label}</span>
            </div>
            
            {/* Appointments */}
            <div className="relative h-full">
                {appointments.map((appointment) => {
                    const { top, height } = calculatePosition(
                        appointment.start,
                        getDuration(appointment.start, appointment.end)
                    );
                    
                    const overlapping = getOverlappingAppointments(
                        appointment,
                        appointments
                    );
                    
                    const hasOverlap = overlapping.length > 0;
                    const overlapIndex = overlapping.findIndex(
                        apt => new Date(apt.start) < new Date(appointment.start)
                    );
                    
                    return (
                        <AppointmentBlock
                            key={appointment.id}
                            appointment={appointment}
                            style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                width: hasOverlap ? '48%' : '95%',
                                left: hasOverlap && overlapIndex >= 0 ? '50%' : '2.5%',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// ==================== MAIN TIME GRID COMPONENT ====================

interface TimeGridProps {
    viewMode: ViewMode;
    currentDate: Date;
    appointments: Appointment[];
    staff: Staff[];
}

export function TimeGrid({ viewMode, currentDate, appointments, staff }: TimeGridProps) {
    const gridRef = useRef<HTMLDivElement>(null);
    
    // Scroll to current time on mount
    useEffect(() => {
        if (gridRef.current) {
            const now = new Date();
            const hours = now.getHours();
            if (hours >= 8 && hours < 22) {
                const minutesFromStart = hours * 60 + now.getMinutes() - 480;
                const scrollTop = minutesFromStart * 1.5 - 200; // Offset for better view
                gridRef.current.scrollTop = Math.max(0, scrollTop);
            }
        }
    }, [currentDate]);
    
    // Filter appointments for current view
    const filteredAppointments = useMemo(() => {
        return appointments.filter(apt => {
            const aptDate = new Date(apt.start);
            return isSameDay(aptDate, currentDate);
        });
    }, [appointments, currentDate]);
    
    // Generate columns based on view mode
    const columns = useMemo(() => {
        if (viewMode === 'daily' || viewMode === 'staff') {
            return staff.map(member => ({
                id: member.id,
                label: member.name,
                avatar: member.avatar,
                appointments: filteredAppointments.filter(apt => apt.staffId === member.id),
            }));
        }
        
        // Weekly view - will be implemented later
        return [];
    }, [viewMode, staff, filteredAppointments]);
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl"
        >
            <div
                ref={gridRef}
                className="relative overflow-auto"
                style={{ height: 'calc(100vh - 400px)', maxHeight: '800px' }}
            >
                {/* Time Grid Container */}
                <div
                    className="relative"
                    style={{ height: `${14 * 90}px` }} // 14 hours * 90px per hour
                >
                    {/* Time Lines */}
                    <TimeLines />
                    
                    {/* Current Time Line */}
                    {isSameDay(currentDate, new Date()) && <CurrentTimeLine />}
                    
                    {/* Columns */}
                    <div className="flex h-full">
                        {/* Time Labels Column */}
                        <div className="w-16 flex-shrink-0 border-l border-white/10" />
                        
                        {/* Resource Columns */}
                        {columns.map((column, index) => (
                            <motion.div
                                key={column.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                className="flex-1"
                            >
                                <Column {...column} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
