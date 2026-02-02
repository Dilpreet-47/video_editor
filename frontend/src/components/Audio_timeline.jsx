import React, { useRef, useEffect } from "react";

const Audio_timeline = ({ audioFile, isTrimming, videoDuration }) => {
    // 1. Audio Specific Refs
    const audioTimelineRef = useRef(null);
    const audioTrimStartRef = useRef(null);
    const audioTrimEndRef = useRef(null);
    const audioTrimRangeRef = useRef(null);
    const isDragging = useRef(null);

    // 2. Logic: The Dragging Function (Internalized)
    const startAudioDragging = (type) => (e) => {
        e.preventDefault();
        isDragging.current = type;
        document.addEventListener("mousemove", handleAudioMouseMove);
        document.addEventListener("mouseup", stopAudioDragging);
    };

    const handleAudioMouseMove = (e) => {
        if (!isDragging.current || !audioTimelineRef.current) return;

        const rect = audioTimelineRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        
        // Constraints
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;

        if (isDragging.current === "start") {
            audioTrimStartRef.current.style.transform = `translateX(${x}px)`;
            audioTrimStartRef.current.dataset.percent = percent;
        } else {
            audioTrimEndRef.current.style.transform = `translateX(${x}px)`;
            audioTrimEndRef.current.dataset.percent = percent;
        }

        updateAudioRange();
    };

    const stopAudioDragging = () => {
        isDragging.current = null;
        document.removeEventListener("mousemove", handleAudioMouseMove);
        document.removeEventListener("mouseup", stopAudioDragging);
    };

    const updateAudioRange = () => {
        const startX = parseFloat(audioTrimStartRef.current.style.transform.replace("translateX(", "").replace("px)", ""));
        const endX = parseFloat(audioTrimEndRef.current.style.transform.replace("translateX(", "").replace("px)", ""));
        
        const left = Math.min(startX, endX);
        const width = Math.abs(endX - startX);

        audioTrimRangeRef.current.style.left = `${left}px`;
        audioTrimRangeRef.current.style.width = `${width}px`;
    };

    return (
        <div className="w-full bg-zinc-900/80 p-3 mt-4 rounded-xl border border-zinc-800">
            <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[10px] text-teal-500 uppercase font-black tracking-[0.2em]">Audio Layer</p>
                {audioFile && <span className="text-[9px] text-zinc-500 italic">{audioFile.name}</span>}
            </div>
            
            <div 
                ref={audioTimelineRef} 
                className="w-full h-14 bg-black/40 rounded-lg border border-zinc-700/50 relative overflow-hidden group"
            >
                {isTrimming && (
                    <>
                        {/* Audio Range Highlight */}
                        <div
                            ref={audioTrimRangeRef}
                            className="absolute top-0 h-full bg-teal-500/10 border-x border-teal-500/40 pointer-events-none z-30"
                        />

                        {/* Start Handle */}
                        <div
                            ref={audioTrimStartRef}
                            onMouseDown={startAudioDragging('start')}
                            className="absolute top-0 left-0 w-4 h-full bg-teal-600 hover:bg-teal-500 cursor-ew-resize z-40 flex items-center justify-center border-r border-teal-300 transition-colors"
                            style={{ transform: 'translateX(0px)' }}
                            data-percent="0"
                        >
                            <div className="w-[1px] h-4 bg-white/40" />
                        </div>

                        {/* End Handle */}
                        <div
                            ref={audioTrimEndRef}
                            onMouseDown={startAudioDragging('end')}
                            className="absolute top-0 left-0 w-4 h-full bg-teal-600 hover:bg-teal-500 cursor-ew-resize z-40 flex items-center justify-center border-l border-teal-300 transition-colors"
                            style={{ transform: `translateX(200px)` }} // Default fallback
                            data-percent="100"
                        >
                            <div className="w-[1px] h-4 bg-white/40" />
                        </div>
                    </>
                )}

                {/* Simple Decorative Waveform Background */}
                <div className="absolute inset-0 flex items-center justify-around opacity-5 pointer-events-none px-4">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="w-1 bg-teal-400 rounded-full" style={{ height: `${20 + Math.random() * 60}%` }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Audio_timeline;