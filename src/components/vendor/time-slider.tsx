'use client';

import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface TimeSliderProps {
    start: number;
    end: number;
    onChange: (start: number, end: number) => void;
}

const MIN_DURATION = 60; // 60 minutes minimum

export function TimeSlider({ start, end, onChange }: TimeSliderProps) {
    const [localValues, setLocalValues] = useState([start, end]);

    const handleValueChange = (values: number[]) => {
        let [newStart, newEnd] = values;

        // Ensure minimum duration
        if (newEnd - newStart < MIN_DURATION) {
            if (newStart !== localValues[0]) {
                // Start handle moved, adjust it
                newStart = newEnd - MIN_DURATION;
            } else {
                // End handle moved, adjust it
                newEnd = newStart + MIN_DURATION;
            }
        }

        // Clamp values
        newStart = Math.max(0, newStart);
        newEnd = Math.min(1440, newEnd);

        setLocalValues([newStart, newEnd]);
    };

    const handleValueCommit = (values: number[]) => {
        const [newStart, newEnd] = values;
        onChange(newStart, newEnd);
    };

    return (
        <div className="relative" dir="ltr">
            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-8"
                value={localValues}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                min={0}
                max={1440}
                step={30}
                minStepsBetweenThumbs={2} // 60 minutes minimum
            >
                {/* Track */}
                <Slider.Track className="relative h-3 grow rounded-full bg-slate-800/50 border border-white/10 overflow-hidden">
                    {/* Range (filled portion) */}
                    <Slider.Range className="absolute h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
                </Slider.Track>

                {/* Start Thumb */}
                <Slider.Thumb
                    className="block w-6 h-6 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 cursor-grab active:cursor-grabbing transition-all hover:scale-110"
                    aria-label="Start time"
                >
                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                </Slider.Thumb>

                {/* End Thumb */}
                <Slider.Thumb
                    className="block w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 hover:shadow-pink-500/70 focus:outline-none focus:ring-4 focus:ring-pink-500/30 cursor-grab active:cursor-grabbing transition-all hover:scale-110"
                    aria-label="End time"
                >
                    <div className="absolute inset-0 rounded-full border-2 border-white/30" />
                </Slider.Thumb>
            </Slider.Root>

            {/* Tick Marks */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-between pointer-events-none">
                {[0, 360, 720, 1080, 1440].map((minute) => (
                    <div key={minute} className="flex flex-col items-center">
                        <div className="w-px h-1 bg-white/20" />
                    </div>
                ))}
            </div>
        </div>
    );
}
