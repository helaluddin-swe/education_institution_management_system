import React from 'react';
import { 
  X, 
  Package, 
  Tag, 
  MapPin, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  Edit3, 
  History 
} from 'lucide-react';

const ProductDetailView = ({ product, onClose, onEdit }) => {
  if (!product) return null;

  // Logic for Stock Status Badge
  const getStatusInfo = () => {
    if (product.stock <= 0) return { label: 'Out of Stock', color: 'bg-red-500', text: 'text-red-500' };
    if (product.stock <= product.reorderPoint) return { label: 'Low Stock', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'In Stock', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const status = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-end p-0 sm:p-4">
      {/* Modal Container (Slide-in from right) */}
      <div className="bg-white w-full max-w-2xl h-full sm:h-auto sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* 1. Header Section */}
        <div className="relative h-48 bg-slate-900 p-8 flex flex-col justify-end">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4 mb-2">
            <span className={`${status.color} text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest`}>
              {status.label}
            </span>
            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">SKU: {product.sku}</span>
          </div>
          <h2 className="text-3xl font-black text-white">{product.title}</h2>
        </div>

        {/* 2. Content Body */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          
          {/* Inventory Grid Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Current Stock</p>
              <p className={`text-2xl font-black ${status.text}`}>{product.stock}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Unit Price</p>
              <p className="text-2xl font-black text-slate-900">${product.price}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Value</p>
              <p className="text-2xl font-black text-indigo-600">${(product.stock * product.price).toLocaleString()}</p>
            </div>
          </div>

          {/* Detailed Info List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Tag size={20} /></div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</h4>
                  <p className="font-bold text-slate-700">{product.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><MapPin size={20} /></div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warehouse Location</h4>
                  <p className="font-bold text-slate-700">{product.warehouseLoc || 'Not Assigned'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Truck size={20} /></div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Supplier</h4>
                  <p className="font-bold text-slate-700">{product.supplier || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><AlertTriangle size={20} /></div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reorder Threshold</h4>
                  <p className="font-bold text-slate-700">{product.reorderPoint} Units</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Placeholder */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <History size={16} /> Recent Activity
               </h3>
               <span className="text-[10px] font-bold text-indigo-600 cursor-pointer">View Full Logs</span>
            </div>
            <div className="text-xs text-slate-400 italic">No recent stock movements recorded.</div>
          </div>
        </div>

        {/* 3. Footer Actions */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={() => onEdit(product)}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
          >
            <Edit3 size={14} /> Edit Product
          </button>
          <button 
            className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            <TrendingUp size={14} /> Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;