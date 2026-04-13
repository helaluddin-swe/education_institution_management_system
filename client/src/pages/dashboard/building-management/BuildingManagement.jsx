import React from 'react';
import {
  Search, Plus, FileText, DollarSign, Zap,
  Download, Eye, Trash2, Mail
} from 'lucide-react';
import { documents_Pdf, dummyTennant, maintenencData, stats } from './data';
import Tennant from './tennant/Tennant';
import Maintenence from './components/Maintenence';
import Utilites from './components/Utilites';
import Marketing from './components/Marketing';
import Overview from './components/Overview';
import FinanceDashboard from './components/FinanceDashboard';
import UnitsInventory from './components/UnitsInventory';
import DocumentVault from './components/DocumentVault';

export const BuildingManagement = ({ subPage }) => {

  // --- SUB-COMPONENTS ---









  // --- MAIN RENDER LOGIC ---

  const renderContent = () => {
    switch (subPage) {
      case 'units': return <UnitsInventory />;

      case 'tenants': return (<Tennant />);

      case 'finance': return <FinanceDashboard />;

      case 'maintenance': return (
        <Maintenence />
      );

      case 'documents': return <DocumentVault />;

      case 'utilities': return (
        <Utilites />
      );

      case 'marketing': return (
        <Marketing />
      );

      default: return (
        <Overview />
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Action Bar */}
      {subPage !== 'overview' && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
            <input type="text" placeholder={`Search ${subPage}...`} className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-9 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-slate-200" />
          </div>
          <button className="w-full md:w-auto bg-indigo-600 px-6 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Plus size={14} /> Add New
          </button>
        </div>
      )}

      {renderContent()}
    </div>
  );
};