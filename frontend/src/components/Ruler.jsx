import React from 'react';

const Ruler = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {/* The Ticks Layer */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-40"
        style={{
          backgroundImage: `
            /* Major ticks (every 100px) */
            linear-gradient(90deg, #94a3b8 2px, transparent 2px),
            /* Minor ticks (every 20px) */
            linear-gradient(90deg, #4b5563 1px, transparent 1px)
          `,
          backgroundSize: '100px 25px, 20px 10px',
          backgroundPosition: '0 top, 0 top',
          backgroundRepeat: 'repeat-x'
        }}
      />
      
      {/* Time Markers Layer (Visual only for now) */}
      <div className="relative w-full h-full flex justify-between text-[9px] text-zinc-500 font-mono p-1">
        {/* We create a simple loop to show numbers across the 200% width */}
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="flex-none" style={{ width: '100px' }}>
            {`00:00:${(i * 5).toString().padStart(2, '0')}:00`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ruler;