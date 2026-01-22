import axios from "axios";
import React, { useRef, useState } from "react";
import Ruler from "./Ruler.jsx";
import { Link } from "react-router-dom";

export const Home = () => {
    const [videoSource, setVideoSource] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // Added this to store the file
    const [backendPath, setBackendPath] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isTrimming, setIsTrimming] = useState(false);

    const videoRef = useRef(null);
    const playheadRef = useRef(null);
    const timelineRef = useRef(null);
    const hoverLineRef = useRef(null);

    // 1. Handle Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setVideoSource(URL.createObjectURL(file));
    };

    // 2. Handle Upload
    const handleVideoUpload = async () => {
        if (!selectedFile) return alert("Please select a video first");

        const formData = new FormData();
        formData.append("video", selectedFile);

        try {
            setIsUploading(true);
            const response = await axios.post("http://localhost:5000/api/v1/videdit/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setBackendPath(response.data.data.path);
            console.log("Upload Success:", response.data.data.path);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Check backend server.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && playheadRef.current) {
            const video = videoRef.current;
            const progress = (video.currentTime / video.duration) * 100;
            playheadRef.current.style.left = `${progress}%`;
        }
    };

    const handleMouseMove = (e) => {
        if (!timelineRef.current || !hoverLineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        hoverLineRef.current.style.transform = `translateX(${x}px)`;
        hoverLineRef.current.style.opacity = "1";
    };

    const handleMouseLeave = () => {
        if (hoverLineRef.current) {
            hoverLineRef.current.style.opacity = "0";
        }
    };

    const handleTimelineClick = (e) => {
        if (!videoRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const timelineWidth = rect.width;
        const clickedPosition = (x / timelineWidth) * videoRef.current.duration;

        videoRef.current.currentTime = clickedPosition; // Set video time to clicked position

        // Update playhead position
        const progress = (clickedPosition / videoRef.current.duration) * 100;
        playheadRef.current.style.left = `${progress}%`;
    };

    const trimStartRef = useRef(null);
    const trimEndRef = useRef(null);
    const draggingHandle = useRef(null); // 'start' | 'end' | null

    const startTrimDragging = (type) => (e) => {
        e.stopPropagation();
        draggingHandle.current = type;

        const onMouseMove = (moveEvent) => {
            if (!draggingHandle.current || !timelineRef.current) return;

            const rect = timelineRef.current.getBoundingClientRect();
            // Clamp mouse position between 0 and timeline width
            const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;

            const startPercent = parseFloat(trimStartRef.current.dataset.percent || "0");
            const endPercent = parseFloat(trimEndRef.current.dataset.percent || "100");

            if (draggingHandle.current === 'start') {
                // Prevent start from crossing end (minus 5% gap)
                if (percentage < endPercent - 5) {
                    trimStartRef.current.style.transform = `translateX(${x}px)`;
                    trimStartRef.current.dataset.percent = percentage;
                }
            } else if (draggingHandle.current === 'end') {
                // Prevent end from crossing start (plus 5% gap)
                if (percentage > startPercent + 5) {
                    // IMPORTANT: Calculate X relative to the start of the timeline
                    trimEndRef.current.style.transform = `translateX(${x}px)`;
                    trimEndRef.current.dataset.percent = percentage;
                }
            }
        };

        const onMouseUp = () => {
            draggingHandle.current = null;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    return (
        <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden">
            <div className="flex flex-row h-[70%] w-full border-b border-gray-700">
                {/* Side Panel */}
                <aside className="h-full w-[20%] min-w-[250px] bg-zinc-900 border-r border-gray-700 overflow-y-auto p-4 flex flex-col gap-4">
                    <h2 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Project Assets</h2>

                    <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer bg-zinc-800/50 hover:bg-zinc-800 hover:border-blue-500 transition-all duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-zinc-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-zinc-400 font-medium text-center px-2">
                                {selectedFile ? selectedFile.name : "Click to Select Video"}
                            </p>
                        </div>
                        <input type="file" name="video" accept="video/*" className="hidden" onChange={handleFileChange} />
                    </label>

                    <button
                        disabled={isUploading || !selectedFile}
                        className={`text-xs px-3 py-2 rounded font-bold transition ${isUploading || !selectedFile ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'}`}
                        onClick={handleVideoUpload}
                    >
                        {isUploading ? "UPLOADING..." : "UPLOAD TO SERVER"}
                    </button>

                    <div className="flex-1 mt-4">
                        <p className="text-[10px] text-zinc-600 uppercase mb-2">Server Storage Path</p>
                        {backendPath && (
                            <div className="p-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] truncate text-blue-400">
                                {backendPath}
                            </div>
                        )}
                    </div>
                </aside>

                {/* Preview Window */}
                <main className="h-full flex-1 bg-zinc-800 flex items-center justify-center relative p-10">
                    <div className="aspect-video w-full max-w-4xl bg-black shadow-2xl flex items-center justify-center rounded-lg overflow-hidden border border-zinc-700">
                        {videoSource ? (
                            <video src={videoSource} ref={videoRef} onTimeUpdate={handleTimeUpdate} controls className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-gray-500 italic text-sm text-center">
                                <div className="mb-2 text-3xl">🎬</div>
                                No media selected
                            </div>
                        )}
                    </div>
                </main>

            </div>

            {/* Timeline Section */}
            <section className="flex flex-col h-[30%] w-full bg-zinc-900 p-4 overflow-x-auto gap-4 ">
                <div className="flex items-center gap-4">
                    <Link to="/demo">Demo</Link>
                    <button onClick={() => setIsTrimming((prev) => !prev)} className="text-xs px-3 py-2 rounded font-bold transition bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">Trim</button>
                    {/* <Ruler /> */}
                </div>
                {/* <div className="flex items-center justify-center bg-amber-100 h-10">
                </div> */}
                <div ref={timelineRef} className="w-full h-20 bg-zinc-800/50 rounded-lg border border-zinc-700 relative overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleTimelineClick}>
                    {isTrimming && (
                        <>
                            {/* Trim Start Handle */}
                            <div
                                ref={trimStartRef}
                                onMouseDown={startTrimDragging('start')}
                                className="absolute top-0 left-0 w-4 h-full bg-blue-600 cursor-ew-resize z-40 flex items-center justify-center border-r border-blue-400 shadow-lg"
                                style={{ transform: 'translateX(0px)' }}
                                data-percent="0"
                            >
                                {/* Visual "Grip" Icon */}
                                <div className="flex gap-1">
                                    <div className="w-1 h-3 bg-white/50" />
                                    <div className="w-1 h-3 bg-white/50" />
                                </div>
                            </div>

                            {/* Trim End Handle */}
                            <div
                                ref={trimEndRef}
                                onMouseDown={startTrimDragging('end')}
                                className="absolute top-0 right-0 w-4 h-full bg-blue-600 cursor-ew-resize z-40 flex items-center justify-center border-l border-blue-400 shadow-lg"
                                style={{ transform: 'translateX(0px)' }}
                                data-percent="100"
                            >
                                <div className="flex gap-1">
                                    <div className="w-1 h-3 bg-white/50" />
                                    <div className="w-1 h-3 bg-white/50" />
                                </div>
                            </div>
                        </>
                    )}
                    <div
                        ref={hoverLineRef}
                        className="absolute top-0 left-0 w-[2px] h-full border-l border-dashed border-zinc-400 opacity-0 pointer-events-none z-0"
                        style={{ transition: 'opacity 0.2s' }}
                    />
                    <div ref={playheadRef} className="absolute left-0 top-0 w-[2px] h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10 cursor-pointer" />
                </div>
            </section>
        </div>
    );
};



export default Home;