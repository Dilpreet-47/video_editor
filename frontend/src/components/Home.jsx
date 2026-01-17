const Home = () => {
    return (
        <div className="flex flex-col w-full h-screen bg-black text-white overflow-hidden">
            
            {/* TOP SECTION: Assets + Preview */}
            <div className="flex flex-row h-[70%] w-full border-b border-gray-700">
                
                {/* Side Panel: Media/Assets */}
                <aside className="h-full w-[20%] min-w-[250px] bg-zinc-900 border-r border-gray-700 overflow-y-auto p-4">
                    <h2 className="text-sm font-bold uppercase text-gray-400">Project Assets</h2>
                    {/* Asset items would go here */}
                </aside>

                {/* Main Preview Window */}
                <main className="h-full flex-1 bg-zinc-800 flex items-center justify-center relative">
                    <div className="aspect-video w-[90%] bg-black shadow-2xl flex items-center justify-center">
                         <span className="text-gray-500 italic">Video Preview</span>
                    </div>
                </main>
            </div>

            {/* BOTTOM SECTION: Timeline */}
            <section className="h-[30%] w-full bg-zinc-900 p-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono">00:00:00:00</span>
                    <div className="flex gap-4">
                        {/* Play/Pause Controls */}
                        <button className="text-xs bg-blue-600 px-3 py-1 rounded">Play</button>
                    </div>
                </div>
                {/* Timeline Tracks */}
                <div className="w-[200%] h-20 bg-zinc-800 rounded border border-zinc-700 relative">
                    <div className="absolute left-1/4 top-0 w-1 h-full bg-red-500 z-10" /> {/* Playhead */}
                </div>
            </section>
        </div>
    );
};

export default Home;