import axios from "axios";
import React, { useRef, useState } from "react";
import Timeline from "./Timeline.jsx";

export const Home = () => {
    const [videoSource, setVideoSource] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [backendPath, setBackendPath] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const videoRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        setVideoSource(URL.createObjectURL(file));
    };

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
                            <video
                                key={videoSource} // Adding a key forces a full re-mount when the URL changes
                                ref={videoRef}
                                controls
                                className="w-full h-full"
                            >
                                <source src={videoSource} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
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
            <Timeline
                videoRef={videoRef}
                backendPath={backendPath} // Pass the string, not a setter
                setVideoSource={setVideoSource} // Allow Timeline to update the player
                videoSource={videoSource}
            />
        </div>
    );
};

export default Home;