import React, { useRef } from 'react';
import { Printer, Download, CheckCircle2, School } from 'lucide-react';

const FeeReceipt = ({ student, payment, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  if (!student || !payment) return null;

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="flex flex-col gap-4 max-w-2xl w-full">
        
        {/* Action Bar (Hidden during print) */}
        <div className="flex justify-between items-center print:hidden">
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold flex items-center gap-2">
             Back to Dashboard
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Printer size={14} /> Print Receipt
            </button>
          </div>
        </div>

        {/* The Receipt Paper */}
        <div 
          ref={printRef}
          className="bg-white text-slate-900 p-10 rounded-sm shadow-2xl ring-1 ring-slate-200 aspect-[1/1.4] flex flex-col print:shadow-none print:ring-0 print:m-0"
        >
          {/* Receipt Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-100 pb-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <School size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">ACME ACADEMY</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Official Fee Receipt</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-indigo-600 uppercase">Invoice Number</p>
              <p className="text-lg font-mono font-bold">#{payment.invoiceId}</p>
            </div>
          </div>

          {/* Success Badge */}
          <div className="my-8 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full w-fit">
            <CheckCircle2 size={16} />
            <span className="text-xs font-black uppercase tracking-wider">Payment {payment.status}</span>
          </div>

          {/* Student & Payment Info */}
          <div className="grid grid-cols-2 gap-12 mb-10">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Bill To:</h4>
              <p className="font-bold text-lg">{student.fullName}</p>
              <p className="text-sm text-slate-600">Student ID: {student.id}</p>
              <p className="text-sm text-slate-600">Grade {student.grade} - Section {student.section}</p>
            </div>
            <div className="text-right">
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Payment Details:</h4>
              <p className="text-sm text-slate-600 italic">Date: {payment.date}</p>
              <p className="text-sm text-slate-600">Method: {payment.method}</p>
              <p className="text-sm text-slate-600">TXN: {payment.transactionId}</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-10">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 text-left text-[10px] font-black uppercase text-slate-400">Description</th>
                <th className="py-3 text-right text-[10px] font-black uppercase text-slate-400">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50">
                <td className="py-4 text-sm font-medium">Monthly Tuition Fee - {payment.month} {payment.year}</td>
                <td className="py-4 text-right font-mono text-sm">${payment.total.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="py-4 text-sm font-bold text-slate-900 text-right">Total Paid</td>
                <td className="py-4 text-right font-mono text-lg font-black text-indigo-600">${payment.paid.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div className="mt-auto pt-8 border-t border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-800">Thank you for your payment!</p>
            <p className="text-[10px] text-slate-400 mt-1 italic">This is a computer-generated receipt and does not require a physical signature.</p>
            
            <div className="mt-6 flex justify-center gap-8">
              <div className="text-[9px] text-slate-400">www.acmeacademy.edu</div>
              <div className="text-[9px] text-slate-400">finance@acmeacademy.edu</div>
              <div className="text-[9px] text-slate-400">+1 (555) 000-1234</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeeReceipt;