import React, { useState } from "react";

const Tools = ({handleTrim, handleExport}) => {

    const [isTrimming, setIsTrimming] = useState(false);


    return (
        <div className="h-full w-[20%] min-w-[250px] bg-zinc-900 border-r border-gray-700 overflow-y-auto p-4 flex flex-col gap-4">
            <button onClick={() => setIsTrimming((prev) => !prev)} className="text-xs px-3 py-2 rounded font-bold transition bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">Trim</button>
            {isTrimming && <button onClick={handleTrim} className="text-xs px-3 py-2 rounded font-bold transition bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">Trim Video</button>}
            <button onClick={handleExport} className="text-xs px-3 py-2 rounded font-bold transition bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">Export Video</button>
        </div>
    );
};

export default Tools;