import React from 'react';
import { TrendingUp, Boxes, AlertCircle } from 'lucide-react';

/**
 * 1. STOCK HEALTH CARD
 * Reusable card to show inventory status percentage.
 * Props:
 * - totalItems: Total unique products (Number)
 * - lowStockCount: Count of items that hit reorder point (Number)
 */
export const StockHealthCard = ({ 
  totalItems = 0, 
  lowStockCount = 0 
}) => {
  // Safety check to avoid NaN or Infinity
  const healthRate = totalItems > 0 
    ? Math.max(0, Math.min(100, Math.round(((totalItems - lowStockCount) / totalItems) * 100))) 
    : 0;
  
  const getStatusColor = () => {
    if (healthRate > 85) return 'bg-emerald-500';
    if (healthRate > 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200 min-h-[240px] w-full transition-all duration-300">
      <div className="flex justify-between items-center opacity-60">
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Warehouse Health</span>
        <Boxes size={20} />
      </div>

      <div className="my-6">
        <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black tabular-nums">{healthRate}%</h2>
            {healthRate < 100 && (
              <AlertCircle size={18} className="text-amber-400 animate-pulse" />
            )}
        </div>
        <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">
          {lowStockCount > 0 
            ? `${lowStockCount} Items require attention` 
            : "All systems optimized"}
        </p>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getStatusColor()}`}
          style={{ width: `${healthRate}%` }}
        />
      </div>
    </div>
  );
};

/**
 * 2. MOST DEMAND PRODUCT CARD (Inventory Mix)
 * Reusable Donut Chart + Legend.
 * Props:
 * - pieData: Array of { label: string, percentage: number, color: string }
 * - viewMode: String title for the center of the donut (e.g., "Active")
 */
export const MostDemandProductCard = ({ 
  pieData = [], 
  viewMode = "Total" 
}) => {
  // Check if data actually exists to show the segments
  const hasData = pieData && pieData.length > 0;

  return (
    <div className="lg:col-span-2 bg-white text-gray-600 rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col md:flex-row items-center gap-10 w-full transition-all duration-300">
      
      {/* Chart Section */}
      <div className="relative w-60 h-60 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90 drop-shadow-sm">
          {!hasData ? (
            <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
          ) : (
            pieData.map((seg, i) => {
              // Calculate segment offset
              const offset = pieData.slice(0, i).reduce((a, b) => a + (b.percentage || 0), 0);
              return (
                <circle 
                  key={`${seg.label}-${i}`} 
                  cx="18" cy="18" r="16" 
                  fill="transparent" 
                  stroke={seg.color || '#cbd5e1'} 
                  strokeWidth="4"
                  strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`} 
                  strokeDashoffset={-offset} 
                  className="transition-all duration-1000 ease-in-out"
                />
              );
            })
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {viewMode}
          </span>
          <TrendingUp size={20} className="text-indigo-500 mb-1" />
          <span className="text-xs font-bold text-slate-800 leading-tight uppercase tracking-tighter">
            Inventory<br/>Mix
          </span>
        </div>
      </div>
      
      {/* Legend Section */}
      <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4 w-full">
        {hasData ? (
          pieData.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="flex items-center gap-3 group cursor-default">
              <div 
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform group-hover:scale-125" 
                style={{ backgroundColor: item.color || '#cbd5e1' }} 
              />
              <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase truncate group-hover:text-indigo-600 transition-colors">
                  {item.label}
                </p>
                <p className="text-sm font-black text-slate-700">
                  {(item.percentage || 0).toFixed(1)}% 
                  <span className="text-[10px] text-slate-400 font-medium ml-1 tracking-normal lowercase">share</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No Data Available</p>
          </div>
        )}
      </div>
    </div>
  );
};