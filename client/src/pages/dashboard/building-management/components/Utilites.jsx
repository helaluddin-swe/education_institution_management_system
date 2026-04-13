import React from 'react'

const Utilites = () => {
  return (
    <>
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-in fade-in">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-800/50 text-[10px] font-black uppercase tracking-widest border-b border-slate-800">
              <tr><th className="p-4">Unit</th><th className="p-4">Prev Reading</th><th className="p-4">Current Reading</th><th className="p-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {['A-101', 'B-202', 'Shop-01'].map((unit, i) => (
                <tr key={i} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 text-white font-bold">{unit}</td>
                  <td className="p-4 font-mono text-xs">10,245</td>
                  <td className="p-4">
                    <input type="number" placeholder="Enter..." className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500 w-24 text-slate-200" />
                  </td>
                  <td className="p-4"><span className="text-[10px] font-bold text-amber-500">Pending</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  )
}

export default Utilites
