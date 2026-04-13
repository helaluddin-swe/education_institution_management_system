import React, { useState, useMemo } from 'react';
import { Package, Layout, AlertTriangle, Database, TrendingUp, ShieldCheck ,AlertCircle} from 'lucide-react';
import Overview from './components/Overview';
import Performace from './components/Performace';
import Teams from './components/Teams';
import Settings from './components/Settings';
import Products from './components/Products';
// Assuming your utility file is now named correctly for products
import { productsData } from './products/productUtils'; 

const InventoryManagement = ({ subPage }) => {
  // --- GLOBAL STATES ---
  const [products, setProducts] = useState(productsData);

  // --- DERIVED INVENTORY ANALYTICS (Global) ---
  const globalStats = useMemo(() => {
    const totalItems = products.length;
    const totalStockValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
    const lowStockCount = products.filter(p => p.stock <= p.reorderPoint && p.stock > 0).length;
    const outOfStockCount = products.filter(p => p.stock <= 0).length;
    
    // Health percentage (Items not low or out of stock)
    const healthyItems = totalItems - (lowStockCount + outOfStockCount);
    const stockHealth = totalItems > 0 ? Math.round((healthyItems / totalItems) * 100) : 0;

    return { totalItems, totalStockValue, lowStockCount, outOfStockCount, stockHealth };
  }, [products]);

  // --- CONTENT ROUTING ---
  const renderContent = () => {
    const commonProps = { products, setProducts };
    switch (subPage) {
      case 'dashboard':
        return <Overview products={products} setProducts={setProducts} />;
      case 'products':
        return <Products products={products} setProducts={setProducts} />;
      case 'performance':
        return <Performace {...commonProps} />;
      case 'teams':
        return <Teams {...commonProps} />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview {...commonProps} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-4xl font-black text-white capitalize tracking-tighter">
            {subPage === 'dashboard' || !subPage ? 'Inventory Overview' : `${subPage} Control`}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck size={14} className="text-emerald-400" />
            <p className="text-slate-400 text-[10px] tracking-[0.2em] font-black uppercase">
              Warehouse Node: <span className="text-white">Active</span> • 
              Data Sync: <span className="text-indigo-400">Real-Time</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* GLOBAL STATS BADGES */}
          <div className="hidden lg:flex gap-3">
            {/* Total Valuation Badge */}
            <div className="px-5 py-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-[1.5rem] flex items-center gap-4 hover:border-indigo-500/50 transition-colors">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <TrendingUp size={16} className="text-indigo-400" />
              </div>
              <div className="leading-tight">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Asset Value</p>
                <p className="text-sm text-white font-black">${globalStats.totalStockValue.toLocaleString()}</p>
              </div>
            </div>

            {/* Stock Health Badge */}
            <div className={`px-5 py-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-[1.5rem] flex items-center gap-4 transition-colors ${globalStats.stockHealth < 70 ? 'border-red-500/30' : 'border-emerald-500/30'}`}>
              <div className={`p-2 rounded-xl ${globalStats.stockHealth < 70 ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                {globalStats.stockHealth < 70 ? 
                  <AlertCircle size={16} className="text-red-400" /> : 
                  <Database size={16} className="text-emerald-400" />
                }
              </div>
              <div className="leading-tight">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Stock Health</p>
                <p className={`text-sm font-black ${globalStats.stockHealth < 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {globalStats.stockHealth}%
                </p>
              </div>
            </div>

            {/* Critical Alerts Counter */}
            {(globalStats.lowStockCount > 0 || globalStats.outOfStockCount > 0) && (
              <div className="px-5 py-3 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] flex items-center gap-4 animate-pulse">
                <AlertTriangle size={16} className="text-red-400" />
                <div className="leading-tight">
                  <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">Attention</p>
                  <p className="text-sm text-white font-black">{globalStats.lowStockCount + globalStats.outOfStockCount} Issues</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="min-h-[75vh] animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
        {renderContent()}
      </div>
    </div>
  );
};

export default InventoryManagement;