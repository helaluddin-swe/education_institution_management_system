import React, { useState } from 'react';
import { dummyTennant } from '../data';
import TennantDetails from '../components/TennantDetails';
import { AlertCircle, CheckCircle2, Plus, Edit2, Trash2 } from 'lucide-react';
import AddNewTennant from './AddNewTennant';

const Tennant = () => {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tenants, setTenants] = useState(dummyTennant);
  const [editingTenant, setEditingTenant] = useState(null); // এডিট করার জন্য আলাদা স্টেট

  // নতুন টেন্যান্ট যোগ করা
  const handleAddNewTenant = (newTenant) => {
    setTenants([newTenant, ...tenants]);
    setIsAddModalOpen(false);
  };

  // টেন্যান্ট ডিলিট করা
  const handleDelete = (e, id) => {
    e.stopPropagation(); // কার্ডের ক্লিক ইভেন্ট থামানোর জন্য
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই টেন্যান্টকে ডিলিট করতে চান?")) {
      setTenants(tenants.filter(t => t.id !== id));
    }
  };

  // এডিট মোড ওপেন করা
  const handleEdit = (e, tenant) => {
    e.stopPropagation(); 
    setEditingTenant(tenant);
    setIsAddModalOpen(true);
  };

  // টেন্যান্ট আপডেট করা
  const handleUpdateTenant = (updatedTenant) => {
    setTenants(tenants.map(t => t.id === updatedTenant.id ? updatedTenant : t));
    setEditingTenant(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-100">টেন্যান্ট ডিরেক্টরি</h2>
        <button 
          onClick={() => {
            setEditingTenant(null);
            setIsAddModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={16} /> Add New Tennant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant, i) => {
          const hasDue = tenant.payments?.some(p => p.status === 'Pending');
          const dueMonths = tenant.payments?.filter(p => p.status === 'Pending') || [];

          return (
            <div
              key={tenant.id || i}
              onClick={() => setSelectedTenant(tenant)}
              className="bg-slate-900 border border-slate-800 p-5 rounded-3xl group hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden active:scale-95"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-sm">
                  {tenant.name.substring(0, 2)}
                </div>
                
                {/* অ্যাকশন বাটনস */}
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleEdit(e, tenant)}
                    className="p-2 bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-500 rounded-xl transition-all"
                    title="এডিট করুন"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, tenant.id)}
                    className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                    title="ডিলিট করুন"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{tenant.name}</h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight mb-4">
                {tenant.unit} • {tenant.type}
              </p>

              {hasDue ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                  <AlertCircle size={12} />
                  <span className="text-[10px] font-black uppercase">{dueMonths.length} মাসের ভাড়া বাকি</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <CheckCircle2 size={12} />
                  <span className="text-[10px] font-black uppercase">সব ক্লিয়ার</span>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-between items-center">
                <div className="flex gap-1">
                  {tenant.payments?.map((p, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${p.status === 'Paid' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}
                    ></div>
                  ))}
                </div>
                <span className="text-[11px] text-indigo-400 font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  প্রোফাইল দেখুন →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* অ্যাড এবং এডিট মোডাল */}
      <AddNewTennant 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTenant(null);
        }}
        onAdd={handleAddNewTenant}
        onUpdate={handleUpdateTenant}
        editTenant={editingTenant} // যদি থাকে তবে এডিট হবে
      />

      {/* প্রোফাইল ডিটেইলস মোডাল */}
      {selectedTenant && (
        <TennantDetails
          tenant={selectedTenant}
          onClose={() => setSelectedTenant(null)}
          onUpdate={(updatedData) => {
            setTenants(tenants.map(t => t.id === updatedData.id ? updatedData : t));
            setSelectedTenant(null);
          }}
        />
      )}
    </div>
  );
};

export default Tennant;