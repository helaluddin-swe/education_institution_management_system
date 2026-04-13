import React, { useState, useMemo } from 'react';
import {
  RotateCcw, Maximize2, Package, AlertCircle, 
  TrendingUp, Truck, Layers, ArrowUpRight, DollarSign
} from 'lucide-react';
import { InventoryRow } from '../products/ProductsComponents';
import {MostDemandProductCard} from "../overview/MostDemand"
import {ProductAnalyticsCard} from "../overview/ProductLevel"


const Overview = ({ products, setProducts }) => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('In Stock');
  const [analyticsFilter, setAnalyticsFilter] = useState('All Categories');
  const [isExpanded, setIsExpanded] = useState(false);

  // --- DYNAMIC INVENTORY LOGIC ---
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      if (activeTab === 'In Stock') return item.stock > item.reorderPoint;
      if (activeTab === 'Low Stock') return item.stock <= item.reorderPoint && item.stock > 0;
      if (activeTab === 'Out of Stock') return item.stock <= 0;
      return true;
    });
  }, [products, activeTab]);

  // --- WAREHOUSE FINANCIALS ---
  const totalWarehouseValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  }, [products]);

  const pieData = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category))];
    return categories.map((cat, i) => {
      const count = products.filter(p => p.category === cat).length;
      return {
        label: cat,
        value: count,
        color: ['#6366F1', '#F59E0B', '#10B981', '#EC4899'][i % 4],
        percentage: (count / products.length) * 100
      };
    });
  }, [products]);

  // --- REUSABLE INVENTORY CARD ---
  const ProductCard = ({ item }) => {
    const isCritical = item.stock <= item.reorderPoint;
    return (
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
            isCritical ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {isCritical ? <AlertCircle size={12} /> : <Package size={12} />}
            {isCritical ? 'Critical Stock' : 'Optimal'}
          </div>
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase">
            {item.category}
          </span>
        </div>
        
        <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
          {item.title}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 mb-4 tracking-widest uppercase">SKU: {item.sku}</p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Current Stock</span>
            <span className={`text-xl font-black ${isCritical ? 'text-red-600' : 'text-slate-900'}`}>{item.stock}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Unit Price</span>
            <span className="text-xl font-black text-indigo-600">${item.price}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] font-sans text-slate-800">
      <div className="flex flex-col lg:flex-row p-6 lg:p-10 gap-10">
        
        {/* LEFT COLUMN: Inventory Operations */}
        <div className="flex-1 space-y-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-8 border-b border-gray-100 w-full md:w-auto overflow-x-auto whitespace-nowrap scrollbar-hide">
              {['In Stock', 'Low Stock', 'Out of Stock'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <RotateCcw size={18} className="cursor-pointer hover:rotate-180 transition-all duration-500" />
              <div className="h-6 w-px bg-slate-100" />
              <Maximize2 size={18} className="cursor-pointer hover:scale-110 transition" />
            </div>
          </header>

          {/* Metrics Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-indigo-600 p-6 rounded-[2rem] text-white">
                <p className="text-[10px] font-black uppercase opacity-60 mb-1">Stock Value</p>
                <h4 className="text-2xl font-black">${totalWarehouseValue.toLocaleString()}</h4>
             </div>
             <div className="bg-white border border-slate-100 p-6 rounded-[2rem]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Inbound Orders</p>
                <div className="flex items-center gap-2">
                   <Truck size={18} className="text-amber-500" />
                   <h4 className="text-2xl font-black text-slate-800">14</h4>
                </div>
             </div>
             <div className="bg-white border border-slate-100 p-6 rounded-[2rem]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Unique SKUs</p>
                <div className="flex items-center gap-2">
                   <Layers size={18} className="text-indigo-500" />
                   <h4 className="text-2xl font-black text-slate-800">{products.length}</h4>
                </div>
             </div>
          </div>

          <section className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                {activeTab} <span className="text-xs bg-slate-100 text-slate-400 px-3 py-1 rounded-full">{filteredProducts.length}</span>
              </h2>
              <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest flex items-center gap-1">
                Full Report <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProducts.length > 0 ? (
                (isExpanded ? filteredProducts : filteredProducts.slice(0, 4)).map(item => (
                  <ProductCard key={item.id} item={item} />
                ))
              ) : (
                <div className="col-span-2 p-16 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                  <Package size={40} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-gray-400 font-bold">Warehouse is clear for this filter.</p>
                </div>
              )}
            </div>
            
            {filteredProducts.length > 4 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-4 rounded-2xl border-2 border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition-all"
              >
                {isExpanded ? 'Collapse List' : `See All ${filteredProducts.length} Products`}
              </button>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Supply Chain Analysis */}
        <div className="w-full lg:w-96 space-y-10">
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-900 tracking-tight">Category Health</h3>
              <TrendingUp size={18} className="text-indigo-500" />
            </div>
            <ProductAnalyticsCard pieData={pieData} viewMode={analyticsFilter} />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black px-2 flex items-center justify-between">
              Critical Alerts
              <span className="text-xs text-red-500 font-bold">Action Required</span>
            </h3>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden divide-y divide-slate-50">
              {products.filter(p => p.stock <= p.reorderPoint).slice(0, 4).map((product) => (
                <InventoryRow key={product.id} product={product} isCompact />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Market Insights */}
      <div className="mx-6 lg:mx-10 mb-10 p-10 bg-white rounded-[3.5rem] border border-gray-50 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900">Demand Analytics</h3>
            <p className="text-sm text-slate-400 font-medium">Predictive stock movement based on historical sales</p>
          </div>
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[1.5rem]">
            {['Most Selling', 'Slow Moving'].map((mode) => (
              <button
                key={mode}
                onClick={() => setAnalyticsFilter(mode)}
                className={`px-6 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${
                  analyticsFilter === mode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <MostDemandProductCard pieData={pieData} viewMode={analyticsFilter} />
      </div>
    </div>
  );
};

export default Overview;