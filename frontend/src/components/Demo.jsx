// ... (imports remain the same)
import axios from "axios";
import React, { useRef, useState } from "react";
import Ruler from "./Ruler.jsx";


export default function Demo() {
    // ... (states remain the same)

    const videoRef = useRef(null);
    const playheadRef = useRef(null);
    const timelineRef = useRef(null);
    const hoverLineRef = useRef(null);

    const handleScrub = (e) => {
        if (!videoRef.current || !timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        // Clamp the value between 0 and the width of the timeline
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = x / rect.width;

        // Sync Video
        videoRef.current.currentTime = percentage * videoRef.current.duration;
        
        // Sync Playhead immediately for smooth visual feedback
        if (playheadRef.current) {
            playheadRef.current.style.left = `${percentage * 100}%`;
        }
    };

    const handleMouseDown = (e) => {
        handleScrub(e); // Seek once on click

        // Handle dragging
        const onMouseMove = (moveEvent) => handleScrub(moveEvent);
        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    // --- HOVER LINE LOGIC ---
    const handleMouseMove = (e) => {
        if (!timelineRef.current || !hoverLineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        // Using transform is better for performance than 'left'
        hoverLineRef.current.style.transform = `translateX(${x}px)`;
        hoverLineRef.current.style.opacity = "1";
    };

    const handleMouseLeave = () => {
        if (hoverLineRef.current) hoverLineRef.current.style.opacity = "0";
    };

    // ... (File handlers and upload logic remain the same)

    return (
        <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden">
            {/* ... Side Panel and Preview Window remain the same ... */}

            {/* Timeline Section */}
            <section className="h-[30%] w-full bg-zinc-900 p-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-blue-400">Timeline Editor</span>
                </div>

                <div 
                    ref={timelineRef} 
                    onMouseDown={handleMouseDown} // ADD THIS
                    onMouseMove={handleMouseMove} 
                    onMouseLeave={handleMouseLeave}
                    className="w-full h-24 bg-zinc-800/30 rounded-lg border border-zinc-700 relative overflow-hidden cursor-crosshair select-none"
                >
                    {/* Background Ruler */}
                    <Ruler />

                    {/* Hover Dashed Line */}
                    <div
                        ref={hoverLineRef}
                        className="absolute top-0 left-0 w-[2px] h-full border-l border-dashed border-zinc-400 opacity-0 pointer-events-none z-20"
                    />

                    {/* Playhead - ADDED pointer-events-none and transition-none */}
                    <div 
                        ref={playheadRef} 
                        className="absolute left-0 top-0 w-[2px] h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] z-30 pointer-events-none" 
                        style={{ transition: 'none' }} 
                    />
                </div>
            </section>
        </div>
    );
};