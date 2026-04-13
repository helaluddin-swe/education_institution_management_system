import { Mail } from 'lucide-react'


const Marketing = () => {
  return (
    <>
      <div className="space-y-4 animate-in fade-in">
        <div className="bg-indigo-600 p-6 rounded-2xl flex justify-between items-center text-white shadow-xl shadow-indigo-600/20">
          <div>
            <h3 className="font-bold text-lg">Vacancy Marketing</h3>
            <p className="text-indigo-100 text-xs">List your vacant shops on social platforms automatically.</p>
          </div>
          <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">Post New Ad</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-full text-indigo-400"><Mail size={20} /></div>
              <div className="flex-1"><h4 className="text-sm font-bold">Inquiry for Shop #02</h4><p className="text-[10px] text-slate-500 font-bold uppercase">2 Hours Ago</p></div>
              <button className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/20">Reply</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Marketing
