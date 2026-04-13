import React from 'react'
import { documents_Pdf } from '../data'
import { Eye, FileText, Trash2 } from 'lucide-react'

function DocumentVault() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
      {documents_Pdf.map((doc, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl group hover:bg-slate-800/50 transition-all">
          <FileText size={24} className="text-indigo-400 mb-3" />
          <p className="text-xs font-bold truncate">{doc}</p>
          <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 hover:text-white"><Eye size={14} /></button>
            <button className="p-1 hover:text-red-400"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DocumentVault
