import React, { useState } from 'react';
import { X, Package, Hash, DollarSign, Database, Truck } from 'lucide-react';

const AddNewProduct = ({ editingTask, closeModal, handleSaveTask, formData, setFormData }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'stock' || name === 'price' || name === 'reorderPoint' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 text-gray-600 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] text-gray-700 w-full max-w-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {editingTask ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Inventory Management System</p>
          </div>
          <button 
            type="button"
            onClick={closeModal} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSaveTask} className="space-y-6">
          
          {/* Row 1: Name & SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block">Product Name</label>
              <div className="relative">
                <input 
                  required name="title" autoFocus
                  className="w-full pl-11 pr-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="e.g. Wireless Mouse" 
                  value={formData.title} 
                  onChange={handleChange}
                />
                <Package className="absolute left-4 top-3.5 text-indigo-500" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block">SKU / Barcode</label>
              <div className="relative">
                <input 
                  required name="sku"
                  className="w-full pl-11 pr-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="ELEC-WLS-MOU" 
                  value={formData.sku} 
                  onChange={handleChange}
                />
                <Hash className="absolute left-4 top-3.5 text-indigo-500" size={18} />
              </div>
            </div>
          </div>

          {/* Row 2: Category & Supplier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block">Category</label>
              <select 
                name="category"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors" 
                value={formData.category} 
                onChange={handleChange}
              >
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Marketing Materials</option>
                <option>Office Supplies</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block">Supplier</label>
              <div className="relative">
                <input 
                  name="supplier"
                  className="w-full pl-11 pr-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  placeholder="Global Tech Ltd" 
                  value={formData.supplier} 
                  onChange={handleChange}
                />
                <Truck className="absolute left-4 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          {/* Row 3: Pricing & Stock Levels */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block">Unit Price</label>
              <div className="relative">
                <input 
                  type="number" name="price"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  value={formData.price} 
                  onChange={handleChange}
                />
                <DollarSign className="absolute left-4 top-3.5 text-emerald-500" size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block">Initial Stock</label>
              <div className="relative">
                <input 
                  type="number" name="stock"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  value={formData.stock} 
                  onChange={handleChange}
                />
                <Database className="absolute left-4 top-3.5 text-amber-500" size={16} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 block">Reorder Point</label>
              <input 
                type="number" name="reorderPoint"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                value={formData.reorderPoint} 
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-4"
          >
            {editingTask ? 'Save Product Changes' : 'Upload to Inventory'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNewProduct;