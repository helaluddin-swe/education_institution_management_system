import React from 'react';
import { Package, AlertTriangle, TrendingUp, Edit3, Trash2, Eye, Plus, Minus, DollarSign } from 'lucide-react';

// --- STAT CARD: INVENTORY VALUE (Replaced Timer) ---
export const InventoryValueCard = ({ totalValue, activeSkus }) => (
  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-slate-200 min-h-[240px]">
    <div className="flex justify-between items-center opacity-60">
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Portfolio Value</span>
      <TrendingUp size={20} />
    </div>
    <div className="my-6">
      <h2 className="text-5xl font-black tabular-nums">
        ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </h2>
      <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">
        Across {activeSkus} Active SKUs
      </p>
    </div>
    <div className="flex gap-2">
      <div className="h-1 flex-1 bg-emerald-500 rounded-full" />
      <div className="h-1 flex-1 bg-slate-700 rounded-full" />
      <div className="h-1 flex-1 bg-slate-700 rounded-full" />
    </div>
  </div>
);

// --- STAT CARD: STOCK DISTRIBUTION (Updated for Inventory) ---
export const StockAnalyticsCard = ({ pieData, totalValue, viewMode }) => (
  <div className="lg:col-span-2 bg-white text-gray-600 rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col md:flex-row items-center gap-10">
    <div className="relative w-56 h-56 shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {pieData.length === 0 && <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />}
        {pieData.map((seg, i) => {
          const offset = pieData.slice(0, i).reduce((a, b) => a + b.percentage, 0);
          return (
            <circle key={seg.label} cx="18" cy="18" r="16" fill="transparent" stroke={seg.color} strokeWidth="4"
              strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`} strokeDashoffset={-offset} className="transition-all duration-1000"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{viewMode}</span>
        <div className="flex flex-col items-center">
          <span className="text-xl font-black text-slate-800">
            {pieData.length}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Categories</span>
        </div>
      </div>
    </div>
    <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-8 w-full">
      {pieData.map(item => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase truncate mb-0.5">{item.label}</p>
            <p className="text-sm font-black text-slate-700">${item.value.toLocaleString()}</p>
          </div>
        </div>
      ))}
      {pieData.length === 0 && <p className="col-span-2 text-xs text-slate-400 italic">No inventory data found</p>}
    </div>
  </div>
);

// --- LIST ITEM: INVENTORY ROW (Replaced Task Row) ---
export const InventoryRow = ({ product, onAdjust, onEdit, onDelete, onView }) => {
  const isLowStock = product.stock <= product.reorderPoint && product.stock > 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <tr className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-none">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isOutOfStock ? 'bg-red-50 text-red-400' : isLowStock ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'}`}>
            <Package size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-slate-800 truncate">{product.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{product.sku}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="text-[10px] font-bold text-indigo-500 uppercase">{product.category}</span>
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-4 py-5">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-black ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-slate-700'}`}>
              {product.stock}
            </span>
            <div className="flex gap-1">
              <button onClick={() => onAdjust(product.id, -1)} className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400"><Minus size={12} /></button>
              <button onClick={() => onAdjust(product.id, 1)} className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400"><Plus size={12} /></button>
            </div>
          </div>
          {isLowStock && <span className="text-[9px] font-black text-amber-500 uppercase mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Reorder Soon</span>}
          {isOutOfStock && <span className="text-[9px] font-black text-red-500 uppercase mt-1 flex items-center gap-1"><AlertTriangle size={10} /> Restock Now</span>}
        </div>
      </td>

      <td className="px-4 py-5">
        <p className="text-sm font-bold text-slate-700">${product.price.toLocaleString()}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">Per Unit</p>
      </td>

      <td className="px-4 py-5">
        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-bold">
          {product.warehouseLoc || 'Bin-A1'}
        </span>
      </td>

      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onView} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Eye size={18} /></button>
          <button onClick={() => onEdit(product)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 size={18} /></button>
          <button onClick={() => onDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
        </div>
      </td>
    </tr>
  );
};