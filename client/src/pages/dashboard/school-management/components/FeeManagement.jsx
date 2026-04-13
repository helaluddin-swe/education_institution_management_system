import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, ArrowUpRight, ReceiptText, X, Printer, School, CheckCircle2 } from 'lucide-react';
import StudentFilter from './Filter';

// --- SUB-COMPONENT: INTERNAL RECEIPT MODAL ---
const FeeReceiptModal = ({ data, onClose }) => {
  if (!data) return null;
  const { student, payment } = data;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Toolbar - Hidden during print */}
        <div className="bg-slate-100 p-4 flex justify-between items-center border-b print:hidden">
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center gap-1">
            <X size={14} /> Close Preview
          </button>
          <button 
            onClick={() => window.print()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
          >
            <Printer size={14} /> Print Receipt
          </button>
        </div>

        {/* Printable Area */}
        <div className="p-10 bg-white text-slate-900 aspect-[1/1.4] print:p-0">
          <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white"><School size={20} /></div>
              <div>
                <h1 className="text-lg font-black tracking-tight">ACME ACADEMY</h1>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Fee Collection Department</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-indigo-600 uppercase">Receipt No</p>
              <p className="text-md font-mono font-bold">#{payment.invoiceId}</p>
            </div>
          </div>

          <div className="my-6 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-fit">
            <CheckCircle2 size={14} />
            <span className="text-[10px] font-black uppercase tracking-wider">Payment {payment.status}</span>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-[9px] font-black text-slate-400 uppercase mb-2">Student Details</h4>
              <p className="font-bold text-sm">{student.fullName}</p>
              <p className="text-xs text-slate-600">ID: {student.studentId}</p>
              <p className="text-xs text-slate-600">Grade {student.grade}-{student.section}</p>
            </div>
            <div className="text-right">
              <h4 className="text-[9px] font-black text-slate-400 uppercase mb-2">Transaction Details</h4>
              <p className="text-xs text-slate-600 italic">{payment.date}</p>
              <p className="text-xs text-slate-600">{payment.method} / {payment.transactionId}</p>
            </div>
          </div>

          <table className="w-full mb-8 text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] text-slate-400">
                <th className="py-2 text-left uppercase">Description</th>
                <th className="py-2 text-right uppercase">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50">
                <td className="py-4">Monthly Tuition Fee ({payment.month})</td>
                <td className="py-4 text-right font-mono">${payment.total}</td>
              </tr>
              <tr className="font-bold">
                <td className="py-4 text-right">Total Paid</td>
                <td className="py-4 text-right text-indigo-600 text-lg">${payment.paid}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-auto border-t pt-6 text-center">
            <p className="text-[10px] text-slate-400 italic font-medium">Thank you for supporting quality education.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const FeeManagement = ({ students = [] }) => {
  const [filteredFees, setFilteredFees] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Flatten the nested payment history for the table
  useEffect(() => {
    const flattenedFees = students.flatMap(student => 
      (student.paymentHistory || []).map(payment => ({
        ...payment,
        studentId: student.id,
        fullName: student.fullName,
        grade: student.grade,
        section: student.section,
        rowId: `${student.id}-${payment.invoiceId}-${payment.date}`
      }))
    );
    // Sort by date (newest first)
    setFilteredFees(flattenedFees.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [students]);

  // Stats calculation
  const totalCollected = students.reduce((acc, curr) => acc + (curr.financials?.totalPaid || 0), 0);
  const totalArrears = students.reduce((acc, curr) => acc + (curr.financials?.dueBalance || 0), 0);
  const totalPayable = totalCollected + totalArrears;
  const collectionRate = totalPayable > 0 ? Math.round((totalCollected / totalPayable) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Receipt Modal */}
      {selectedReceipt && (
        <FeeReceiptModal 
          data={selectedReceipt} 
          onClose={() => setSelectedReceipt(null)} 
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Total Collected</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold text-white">${totalCollected.toLocaleString()}</h3>
            <span className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><ArrowUpRight size={18}/></span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Pending Arrears</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold text-white">${totalArrears.toLocaleString()}</h3>
            <span className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><AlertCircle size={18}/></span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Collection Rate</p>
          <div className="flex items-center justify-between mt-2">
            <h3 className="text-2xl font-bold text-white">{collectionRate}%</h3>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${collectionRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <StudentFilter students={students} onFilterChange={(filteredList) => {
        const flattened = filteredList.flatMap(s => (s.paymentHistory || []).map(p => ({ ...p, fullName: s.fullName, grade: s.grade, section: s.section, studentId: s.id })));
        setFilteredFees(flattened);
      }}/>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 tracking-tight">
                <ReceiptText size={16} className="text-indigo-400" />
                Ledger History
            </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Invoice</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Method</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredFees.map((payment) => (
                <tr key={payment.rowId} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                        {payment.fullName?.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">{payment.fullName}</p>
                        <p className="text-[10px] text-slate-500">ID: {payment.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[11px] text-slate-300 font-mono font-bold tracking-tighter">#{payment.invoiceId}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-medium">{payment.month} {payment.year}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-white">${payment.paid}</div>
                    <div className="text-[9px] text-slate-500">{payment.date}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tighter ${
                      payment.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-[10px] text-slate-400 font-bold uppercase">{payment.method}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedReceipt({ student: payment, payment: payment })}
                      className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all active:scale-90"
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFees.length === 0 && (
          <div className="p-20 text-center text-slate-600 text-sm">
            No transactions found in this period.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeManagement;