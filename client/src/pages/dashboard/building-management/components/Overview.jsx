import React from 'react'
import { dummyTennant, stats } from '../data';

const Overview = () => {
  return (
    <>
    <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon; // Correctly rendering data icons
              return (
                <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-indigo-500/5 transition-all">
                  <div className={`p-3 rounded-xl bg-slate-800/50 border border-slate-800 ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white leading-tight">{stat.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="font-bold text-slate-200">Revenue Snapshot</h3>
              <button className="text-[10px] bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-bold transition-all">+ Add Transaction</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-800/30 text-slate-300 text-[10px] font-bold uppercase">
                  <tr><th className="p-4">Address</th><th className="p-4">Type</th><th className="p-4">Status</th><th className="p-4">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {dummyTennant.map((t, i) => (
                    <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 text-white font-medium">{t.name}'s Unit ({t.unit})</td>
                      <td className="p-4 text-xs">{t.type}</td>
                      <td className="p-4"><span className={`text-[10px] font-black uppercase ${t.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{t.status}</span></td>
                      <td className="p-4 font-mono">{t.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    
    </>
  )
}

export default Overview
