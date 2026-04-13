import React from 'react'
import { maintenencData } from '../data';

function Maintenence() {
  return (
  <>
  <div className="space-y-3 animate-in fade-in">
          {maintenencData.map((item, i) => {
            const Icon = item.icon; // Standardized Icon handling
            return (
              <div key={i} className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl hover:bg-slate-800/50 transition-all">
                <div className="p-2 bg-slate-950 rounded-lg text-slate-400">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{item.unit} • {item.time}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${item.priority === 'High' ? 'text-red-500 border-red-500/20' : 'text-slate-500 border-slate-700'}`}>{item.priority}</span>
              </div>
            );
          })}
        </div>
  </>
  )
}

export default Maintenence
