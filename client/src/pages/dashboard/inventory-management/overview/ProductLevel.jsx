



export const ProductAnalyticsCard = ({ pieData = [], totalStock = 0, viewMode = "All Stock" }) => {
  return (
    <div className="lg:col-span-2 bg-white text-gray-600 rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col md:flex-row items-center gap-10">
      
      {/* DONUT CHART SECTION */}
      <div className="relative w-60 h-60 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {/* Background Circle (Empty State) */}
          {pieData.length === 0 && (
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
          )}
          
          {/* Dynamic Segments */}
          {pieData.map((seg, i) => {
            const offset = pieData.slice(0, i).reduce((a, b) => a + b.percentage, 0);
            return (
              <circle 
                key={seg.label} 
                cx="18" cy="18" r="16" 
                fill="transparent" 
                stroke={seg.color} 
                strokeWidth="4"
                strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`} 
                strokeDashoffset={-offset} 
                className="transition-all duration-1000 ease-in-out"
              />
            );
          })}
        </svg>

        {/* CENTER TEXT OVERLAY */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {viewMode}
          </span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-800">
              {totalStock.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Total Units
            </span>
          </div>
        </div>
      </div>

      {/* LEGEND GRID SECTION */}
      <div className="flex-1 grid grid-cols-2 gap-4 w-full">
        {pieData.length > 0 ? (
          pieData.map((item) => (
            <div key={item.label} className="flex items-center gap-3 group">
              <div 
                className="w-3 h-3 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-125" 
                style={{ backgroundColor: item.color }} 
              />
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase truncate">
                  {item.label}
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {item.value.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">units</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic text-center">
              No inventory data<br/>for this segment
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

