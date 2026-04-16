import React, { useState, useMemo, useEffect } from 'react';
import {
  X, Save, GraduationCap, Bus, BookOpen, Trash2, Trophy,
  ShieldCheck, CreditCard, Calendar, CheckCircle2,
  Clock, ChevronDown, Plus, Banknote, History, Wallet, Receipt, Beaker, Loader2
} from 'lucide-react';

const StudentFeeDetails = ({ student, onClose, onUpdateProfile, onRecordPayment }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [bulkAmount, setBulkAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  const [filterMonth, setFilterMonth] = useState(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date()));

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const paymentHistory = useMemo(() => student?.finance?.paymentHistory || [], [student?.finance?.paymentHistory]);

  const availableYears = useMemo(() => {
    const yearsInData = paymentHistory.map(p => p.year?.toString()) || [];
    const currentYear = new Date().getFullYear().toString();
    const uniqueYears = [...new Set([currentYear, ...yearsInData])];
    return uniqueYears.sort((a, b) => b - a);
  }, [paymentHistory]);

  const activePaymentRecord = useMemo(() => {
    return paymentHistory.find(p => p.month === filterMonth && p.year?.toString() === filterYear);
  }, [paymentHistory, filterMonth, filterYear]);

  // Sync UI state when filters or student data changes
  useEffect(() => {
    if (activePaymentRecord) {
      setSelectedMonth({ ...activePaymentRecord });
    } else {
      setSelectedMonth(null);
    }
  }, [activePaymentRecord, filterMonth, filterYear]);

  const handleFeeChange = (field, value) => {
    const formattedValue = field === 'status' ? value : (value === "" ? 0 : parseFloat(value));
    setSelectedMonth(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleAddNewMonth = () => {
    setSelectedMonth({
      month: filterMonth,
      year: parseInt(filterYear),
      status: 'Pending',
      tuitionFee: 0,
      transportFee: 0,
      libraryFee: 0,
      examFee: 0,
      labFee: 0,
      others: 0,
      paidAmount: 0,
      totalBilled: 0,
      balance: 0
    });
  };

 const handleRecordPayment = async () => {
  let paymentInput = parseFloat(bulkAmount);

  if (isNaN(paymentInput) || paymentInput <= 0) return;

  setIsSubmitting(true);

  const success = await onRecordPayment(student._id, {
    month: filterMonth,
    year: parseInt(filterYear),
    paidAmount: paymentInput // ✅ FIXED (IMPORTANT)
  });

  setIsSubmitting(false);

  if (success?.success) {
    setBulkAmount("");
  }
};

  const feeCategories = ['tuitionFee', 'examFee', 'transportFee', 'libraryFee', 'labFee', 'others'];
  
  const monthlyTotal = useMemo(() => {
    if (!selectedMonth) return 0;
    return feeCategories.reduce((sum, field) => sum + (Number(selectedMonth[field]) || 0), 0);
  }, [selectedMonth]);

  const handleSaveInvoice = async () => {
    setIsSubmitting(true);
    const feeUpdate = {
      ...selectedMonth,
      totalBilled: monthlyTotal,
      balance: monthlyTotal - (selectedMonth.paidAmount || 0)
    };

    // CRITICAL: Send only the specific month update to the backend
    // Your controller should find the month in the array and update it
    const success = await onUpdateProfile(student._id, {
      financeUpdate: feeUpdate // Custom key for your backend to handle logic
    });

    setIsSubmitting(false);
    if (success) onClose();
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-slate-900 h-full overflow-hidden shadow-2xl border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300">

        {/* --- HEADER --- */}
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 font-black text-lg">
              {student.fullName?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{student.fullName}</h2>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Roll: {student.rollNo || 'N/A'}</p>
                {student.finance?.reservedBalance > 0 && (
                  <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/20 animate-pulse">
                    <Wallet size={10} /> VAULT: ৳{student.finance.reservedBalance}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-32">
          
          {/* --- QUICK PAYMENT --- */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Banknote size={80} className="text-indigo-500" />
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-2 tracking-widest">
                <CreditCard size={14} /> Quick Collection
              </label>
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Current Outstanding</p>
                <p className="text-sm font-black text-rose-500">৳{student.finance?.totalOutstandingDebt?.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                <input
                  type="number"
                  placeholder="Enter amount..."
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-white font-black outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <button
                onClick={handleRecordPayment}
                disabled={!bulkAmount || !activePaymentRecord || isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white px-6 rounded-2xl font-black text-xs transition-all uppercase flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Receive"}
              </button>
            </div>
            {!activePaymentRecord && (
              <div className="flex items-center gap-2 text-amber-500 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                <AlertCircle size={12} />
                <p className="text-[9px] font-bold uppercase">Initialize the {filterMonth} invoice below first</p>
              </div>
            )}
          </div>

          {/* --- FILTER & BILLING --- */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Invoice Management</h3>
               <div className="flex gap-2">
                 <div className="relative flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                    <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="bg-transparent text-[10px] font-black text-white outline-none appearance-none cursor-pointer uppercase">
                      {monthsList.map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}
                    </select>
                 </div>
                 <div className="relative flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                    <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="bg-transparent text-[10px] font-black text-white outline-none appearance-none cursor-pointer">
                      {availableYears.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}
                    </select>
                 </div>
               </div>
            </div>

            {selectedMonth ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <FeeInput label="Tuition" icon={<GraduationCap size={14} />} value={selectedMonth.tuitionFee} onChange={(v) => handleFeeChange('tuitionFee', v)} color="text-indigo-400" />
                  <FeeInput label="Exam" icon={<Receipt size={14} />} value={selectedMonth.examFee} onChange={(v) => handleFeeChange('examFee', v)} color="text-rose-400" />
                  <FeeInput label="Transport" icon={<Bus size={14} />} value={selectedMonth.transportFee} onChange={(v) => handleFeeChange('transportFee', v)} color="text-amber-400" />
                  <FeeInput label="Lab" icon={<Beaker size={14} />} value={selectedMonth.labFee} onChange={(v) => handleFeeChange('labFee', v)} color="text-emerald-400" />
                  <FeeInput label="Library" icon={<BookOpen size={14} />} value={selectedMonth.libraryFee} onChange={(v) => handleFeeChange('libraryFee', v)} color="text-blue-400" />
                  <FeeInput label="Others" icon={<Plus size={14} />} value={selectedMonth.others} onChange={(v) => handleFeeChange('others', v)} color="text-slate-400" />
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950 border border-slate-800 rounded-3xl">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Status</label>
                    <div className={`text-xs font-black uppercase flex items-center gap-2 ${
                        selectedMonth.status === 'Paid' ? 'text-emerald-500' : 
                        selectedMonth.status === 'Partial' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                        <CheckCircle2 size={14} /> {selectedMonth.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Received So Far</label>
                    <p className="text-sm font-black text-white">৳{selectedMonth.paidAmount || 0}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-950/30 rounded-3xl border-2 border-dashed border-slate-800">
                <History size={32} className="text-slate-700 mb-3" />
                <p className="text-slate-500 font-bold text-[10px] uppercase">No Record for {filterMonth}</p>
                <button onClick={handleAddNewMonth} className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all">
                  Initialize Invoice
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- STICKY FOOTER --- */}
        {selectedMonth && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-slate-800 flex justify-between items-center backdrop-blur-md">
            <div>
              <p className="text-[9px] text-slate-500 font-black uppercase">Month Total</p>
              <h3 className="text-2xl font-black text-white">৳{monthlyTotal.toLocaleString()}</h3>
            </div>
            <button
              onClick={handleSaveInvoice}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />}
              Update Bill
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// AlertCircle icon was missing in original imports
const AlertCircle = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

const FeeInput = ({ label, icon, value, onChange, color }) => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl focus-within:border-indigo-500/50 transition-all group">
    <label className={`text-[9px] font-black uppercase mb-1 flex items-center gap-1.5 ${color}`}>
      {icon} {label}
    </label>
    <div className="flex items-center gap-1">
      <span className="text-slate-700 font-bold text-xs">৳</span>
      <input
        type="number"
        value={value || 0}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-lg font-black text-white outline-none"
      />
    </div>
  </div>
);

export default StudentFeeDetails;