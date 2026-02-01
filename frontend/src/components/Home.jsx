import { useState } from "react";
import axios from "axios";
import { useRef } from "react";
import Timeline from "./Timeline.jsx";

const Home = () => {
    const [videoSource, setVideoSource] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [backendPath, setBackendPath] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // This state will store the data returned from the server
    const [projectAssets, setProjectAssets] = useState(null);

    const videoRef = useRef(null);

    // One function to handle both file selections
    // 1. Updated handler to accept a 'type' parameter
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === "video" && file.type.startsWith("video/")) {
            // Clean up memory from the previous preview URL
            if (videoSource) URL.revokeObjectURL(videoSource);

            setVideoFile(file);
            setVideoSource(URL.createObjectURL(file));
        } else if (type === "audio" && file.type.startsWith("audio/")) {
            setAudioFile(file);
        } else {
            alert(`Invalid file type for ${type} selection.`);
        }
    };

    // 2. Updated Upload Handler
    const handleProjectUpload = async () => {
        // Video is mandatory for your editor logic
        if (!videoFile) return alert("Please select a video first");

        const formData = new FormData();
        formData.append("video", videoFile);

        // Audio is optional - only append if it exists
        if (audioFile) {
            formData.append("audio", audioFile);
        }

        try {
            setIsUploading(true);
            const response = await axios.post("http://localhost:5000/api/v1/videdit/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const data = response.data.data;
            setProjectAssets(data);

            // Use optional chaining to prevent crashes if audioData is missing
            setBackendPath(data.videoData.path);

            console.log("Upload Success:", data);
            alert(audioFile ? "Video & Audio Initialized!" : "Video Initialized (No Audio)!");
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Make sure your backend handles optional audio fields.");
        } finally {
            setIsUploading(false);
        }
    };


    
    return (
        <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden">
            <div className="flex flex-row h-[70%] w-full border-b border-gray-700">
                <aside className="h-full w-[20%] min-w-[250px] bg-zinc-900 border-r border-gray-700 overflow-y-auto p-4 flex flex-col gap-4">
                    <h2 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Project Assets</h2>

                    {/* Video Selection Box */}
                    <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer bg-zinc-800/50 hover:bg-zinc-800 hover:border-blue-500 transition-all duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-2">
                            <svg className="w-8 h-8 mb-3 text-zinc-500 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-zinc-400 font-medium">
                                {videoFile ? videoFile.name : "Select Video"}
                            </p>
                        </div>
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileChange(e, "video")} />
                    </label>

                    {/* Audio Selection Box */}
                    <label className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-xl cursor-pointer bg-zinc-800/50 hover:bg-zinc-800 hover:border-purple-500 transition-all duration-300">
                        <div className="flex flex-col items-center justify-center pt-4 pb-5 text-center px-2">
                            <svg className="w-8 h-8 mb-3 text-zinc-500 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                            <p className="text-sm text-zinc-400 font-medium">
                                {audioFile ? audioFile.name : "Add Background Music"}
                            </p>
                        </div>
                        <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileChange(e, "audio")} />
                    </label>

                    {/* MERGED UPLOAD BUTTON */}
                    <button
                        disabled={isUploading || !videoFile}
                        className={`text-xs px-3 py-3 rounded font-bold uppercase tracking-widest transition ${isUploading || !videoFile
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-lg shadow-blue-900/20'
                            }`}
                        onClick={handleProjectUpload}
                    >
                        {isUploading ? "Uploading Project..." : "Initialize Project"}
                    </button>

                    <div className="flex-1 mt-4">
                        <p className="text-[10px] text-zinc-600 uppercase mb-2">Video Path</p>
                        {backendPath && (
                            <div className="p-2 bg-zinc-800 border border-zinc-700 rounded text-[10px] truncate text-blue-400">
                                {backendPath}
                            </div>
                        )}
                    </div>
                </aside>

                <main className="h-full flex-1 bg-zinc-800 flex items-center justify-center relative p-10">
                    <div className="aspect-video w-full max-w-4xl bg-black shadow-2xl flex items-center justify-center rounded-lg overflow-hidden border border-zinc-700">
                        {videoSource ? (
                            <video key={videoSource} ref={videoRef} controls className="w-full h-full">
                                <source src={videoSource} type="video/mp4" />
                            </video>
                        ) : (
                            <div className="text-gray-500 italic text-sm text-center">
                                <div className="mb-2 text-3xl">🎬</div>
                                Select media to begin
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Timeline
                videoRef={videoRef}
                backendPath={backendPath}
                setVideoSource={setVideoSource}
                videoSource={videoSource}
                // TIP: You might want to pass projectAssets to Timeline too
                audioPath={projectAssets?.audioData?.path}
            />
        </div>
    );
};

export default Home;