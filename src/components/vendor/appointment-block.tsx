'use client';

import { CSSProperties, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Phone } from 'lucide-react';
import type { Appointment } from '@/types/vendor-calendar';
import { STATUS_CONFIG } from '@/types/vendor-calendar';
import { AppointmentPopover } from './appointment-popover';

interface AppointmentBlockProps {
    appointment: Appointment;
    style: CSSProperties;
}

export function AppointmentBlock({ appointment, style }: AppointmentBlockProps) {
    const [showPopover, setShowPopover] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: appointment.id,
    });
    
    const statusConfig = STATUS_CONFIG[appointment.status];
    
    // Calculate transform style
    const dragStyle = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              zIndex: 50,
          }
        : {};
    
    const handleClick = (e: React.MouseEvent) => {
        // Only open popover if not dragging
        if (!isDragging) {
            e.stopPropagation();
            setShowPopover(true);
        }
    };
    
    const handleDragStart = () => {
        setIsDragging(true);
        setShowPopover(false);
    };
    
    const handleDragEnd = () => {
        setTimeout(() => setIsDragging(false), 100);
    };
    
    return (
        <>
            <motion.div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onClick={handleClick}
                className={`absolute cursor-move group ${statusConfig.bg} ${statusConfig.border} border-r-2 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-${appointment.status === 'DEPOSIT' ? 'yellow' : appointment.status === 'COMPLETED' ? 'emerald' : 'slate'}-500/30`}
                style={{
                    ...style,
                    ...dragStyle,
                }}
                whileHover={{ scale: isDragging ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isDragging ? 0.7 : 1, scale: 1 }}
                transition={{ duration: 0.2 }}
            >
                {/* Break Pattern (for BREAK status) */}
                {appointment.status === 'BREAK' && (
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
                        }}
                    />
                )}
                
                <div className="relative z-10 p-3 h-full flex flex-col">
                    {/* Title */}
                    <h4
                        className={`font-bold text-sm ${statusConfig.text} mb-1 truncate`}
                    >
                        {appointment.title}
                    </h4>
                    
                    {/* Time */}
                    <div className="flex items-center gap-1.5 text-xs text-white/60 mb-2">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono">
                            {new Date(appointment.start).toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            {' - '}
                            {new Date(appointment.end).toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                    
                    {/* Client Info (if not a break) */}
                    {appointment.status !== 'BREAK' && (
                        <>
                            <div className="flex items-center gap-1.5 text-xs text-white/70 mb-1">
                                <User className="w-3 h-3" />
                                <span className="truncate">{appointment.clientName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-white/50">
                                <Phone className="w-3 h-3" />
                                <span className="font-mono" dir="ltr">
                                    {appointment.clientPhone}
                                </span>
                            </div>
                        </>
                    )}
                    
                    {/* Status Badge */}
                    <div className="mt-auto pt-2">
                        <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${statusConfig.text} ${statusConfig.bg} border ${statusConfig.border}`}
                        >
                            {statusConfig.label}
                        </span>
                    </div>
                </div>
                
                {/* Drag Ghost Effect */}
                <AnimatePresence>
                    {isDragging && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg border-2 border-dashed border-cyan-500/50"
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear' as const,
                                    }}
                                    className="w-8 h-8 border-2 border-t-cyan-500 border-r-purple-500 border-b-pink-500 border-l-transparent rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            
            {/* Popover */}
            <AppointmentPopover
                appointment={appointment}
                open={showPopover}
                onClose={() => setShowPopover(false)}
            />
        </>
    );
}
