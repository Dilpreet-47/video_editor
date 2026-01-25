const Timeline = ({ setIsTrimming, isTrimming, handleTrim, handleMouseMove, handleMouseLeave, handleTimelineClick, startTrimDragging, trimStartRef, trimEndRef, trimRangeRef, hoverLineRef, playheadRef, timelineRef }) => {
    return (
            <section className="flex flex-col h-[30%] w-full bg-zinc-900 p-4 overflow-x-auto gap-4 ">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsTrimming((prev) => !prev)} className="text-xs px-3 py-2 rounded font-bold transition bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">Trim</button>
                    {isTrimming && <button onClick={handleTrim} className="text-xs px-3 py-2 rounded font-bold transition bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">Trim Video</button>}
                </div>
                <div ref={timelineRef} className="w-full h-20 bg-zinc-800/50 rounded-lg border border-zinc-700 relative overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleTimelineClick}>
                    {isTrimming && (
                        <>
                            {/* Selection Overlay (The Highlight) */}
                            <div
                                ref={trimRangeRef}
                                className="absolute top-0 h-full bg-blue-500/20 border-x border-blue-500/50 pointer-events-none z-30"
                                style={{ left: '0px', width: '0px' }} // Start at 0 width
                            />
                            {/* Trim Start Handle */}
                            <div
                                ref={trimStartRef}
                                onMouseDown={startTrimDragging('start')}
                                className="absolute top-0 left-0 w-4 h-full bg-blue-600 cursor-ew-resize z-40 flex items-center justify-center border-r border-blue-400 select-none"
                                style={{ transform: 'translateX(0px)' }}
                                data-percent="0"
                            >
                                <div className="w-[1px] h-4 bg-white/50" />
                            </div>

                            {/* Trim End Handle - Anchored LEFT, not right */}
                            <div
                                ref={trimEndRef}
                                onMouseDown={startTrimDragging('end')}
                                className="absolute top-0 left-0 w-4 h-full bg-blue-600 cursor-ew-resize z-40 flex items-center justify-center border-l border-blue-400 select-none"
                                /* We calculate initial position based on timeline width */
                                style={{ transform: `translateX(${timelineRef.current?.clientWidth - 16 || 500}px)` }}
                                data-percent="100"
                            >
                                <div className="w-[1px] h-4 bg-white/50" />
                            </div>
                        </>
                    )}
                    <div
                        ref={hoverLineRef}
                        className="absolute top-0 left-0 w-[2px] h-full border-l border-dashed border-zinc-400 opacity-0 pointer-events-none z-20" // Changed z-0 to z-20
                        style={{ transition: 'opacity 0.2s' }}
                    />
                    <div ref={playheadRef} className="absolute left-0 top-0 w-[2px] h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10 cursor-pointer" />
                </div>
            </section>
        
    );
};

export default Timeline;
