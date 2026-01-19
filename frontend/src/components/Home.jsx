import axios from "axios";
import React, { useState } from "react";

export const Home = () => {
    const [videoSource, setVideoSource] = useState(null); 
    const [selectedFile, setSelectedFile] = useState(null); // Added this to store the file
    const [backendPath, setBackendPath] = useState("");   
    const [isUploading, setIsUploading] = useState(false);

    // 1. Handle Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file); // Save file for upload later
        setVideoSource(URL.createObjectURL(file)); // Show preview instantly
    };

    // 2. Handle Upload
    const handleUpload = async () => {
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
                        onClick={handleUpload}
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
                            <video src={videoSource} controls className="w-full h-full object-contain" />
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
            <section className="h-[30%] w-full bg-zinc-900 p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-blue-400">00:00:00:00</span>
                    <button className="text-xs bg-zinc-800 border border-zinc-700 px-4 py-1 rounded hover:bg-zinc-700 transition">Play</button>
                </div>
                <div className="w-[200%] h-20 bg-zinc-800/50 rounded-lg border border-zinc-700 relative overflow-hidden">
                    <div className="absolute left-[15%] top-0 w-[30%] h-full bg-blue-500/20 border-x border-blue-500/50 flex items-center justify-center">
                        <span className="text-[10px] text-blue-300">Active Clip</span>
                    </div>
                    <div className="absolute left-1/4 top-0 w-[2px] h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10" /> 
                </div>
            </section>
        </div>
    );
};

export default Home;