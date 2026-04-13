import { DollarSign, Download } from 'lucide-react'


const FinanceDashboard = () => {
  return (
    <>
     
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-400" /> Revenue Stream
          </h3>
          <div className="h-40 flex items-end gap-3 px-2">
            {[60, 80, 45, 90, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-lg hover:bg-indigo-500 transition-all relative group" style={{ height: `${h}%` }}>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">${h}k</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold mb-2">Auto-Invoicing</h3>
            <p className="text-xs text-slate-500">Generate digital receipts for all tenants in one click.</p>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
            <Download size={14} /> Download Ledger
          </button>
        </div>
      </div>
    </div>
  
    
    </>
  )
}

export default FinanceDashboard
