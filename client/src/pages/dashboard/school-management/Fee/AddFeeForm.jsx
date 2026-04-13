import React, { useState, useEffect, useRef } from 'react';
import { X,Calendar, User, Hash, CheckCircle2, Loader2, AlertCircle, Search, CreditCard, Wallet, Landmark } from 'lucide-react';

const AddFeeForm = ({ isOpen, onClose, handleOnSubmit, students = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const firstInputRef = useRef(null);

  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    grade: '',
    section: '',
    paid: '',
    total: 1200,
    method: 'bKash',
    transactionId: '',
    month: new Date().toLocaleDateString('en-US', { month: 'long' }),
    year: '2026'
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setTimeout(() => firstInputRef.current?.focus(), 100);
      const handleEsc = (e) => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStudentSelect = (student) => {
    setFormData({
      ...formData,
      studentId: student.id,
      fullName: student.fullName,
      grade: student.grade,
      section: student.section,
      // Pull specific monthly fee from the new nested data structure
      total: student.financials?.monthlyFee || 1200 
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const selectedStudent = students.find(s => s.id === formData.studentId);
    if (!selectedStudent) {
      setError('Please select a valid student from the search list.');
      return;
    }
    if (!formData.paid || Number(formData.paid) <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPayment = {
      invoiceId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      month: formData.month,
      year: formData.year,
      total: Number(formData.total),
      paid: Number(formData.paid),
      status: Number(formData.paid) >= Number(formData.total) ? 'Paid' : 'Partial',
      date: new Date().toISOString().split('T')[0],
      method: formData.method,
      transactionId: formData.transactionId || 'CASH-REF'
    };

    // Pass data to parent (SchoolManagement)
    handleOnSubmit(formData.studentId, newPayment);
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-8 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Collect Fee</h2>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Finance Department</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-all hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs animate-in shake">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Student Search with Datalist */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Find Student</label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                ref={firstInputRef}
                type="text" 
                list="student-search-list"
                required
                value={formData.fullName}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({...formData, fullName: val});
                  const found = students.find(s => s.fullName === val);
                  if(found) handleStudentSelect(found);
                }}
                placeholder="Type student name..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 pl-10 pr-4 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
              <datalist id="student-search-list">
                {students.map(s => (
                  <option key={s.id} value={s.fullName}>
                    {`Grade ${s.grade}-${s.section} | ID: ${s.id}`}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Target Month (Read Only for this session) */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Billing Month</label>
              <div className="w-full bg-slate-800/20 border border-slate-800/50 rounded-xl py-3 px-4 text-xs text-slate-400 font-bold flex items-center gap-2">
                <Calendar size={14} className="text-slate-600" />
                {formData.month} {formData.year}
              </div>
            </div>

            {/* Amount to Pay */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Pay Amount ($)</label>
              <input 
                type="number" 
                required
                value={formData.paid}
                onChange={(e) => setFormData({...formData, paid: e.target.value})}
                placeholder="0.00" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'bKash', icon: Wallet },
                { id: 'Cash', icon: CreditCard },
                { id: 'Bank', icon: Landmark }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFormData({...formData, method: m.id})}
                  className={`flex flex-col items-center gap-2 py-3 rounded-xl text-[10px] font-bold border transition-all ${
                    formData.method === m.id 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  <m.icon size={16} />
                  {m.id}
                </button>
              ))}
            </div>
          </div>

          {/* Reference ID */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Transaction Ref / ID</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
              <input 
                type="text" 
                value={formData.transactionId}
                onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                placeholder="TXN-99201..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>
          </div>

          {/* Summary Card */}
          {formData.studentId && (
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Payment Summary</span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {formData.studentId}</span>
              </div>
              <div className="flex justify-between items-end">
                <p className="text-sm text-white font-medium">{formData.fullName}</p>
                <p className="text-xs text-slate-400">Monthly: <span className="text-white font-bold">${formData.total}</span></p>
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${
              isSubmitting ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
            }`}
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            {isSubmitting ? 'Verifying Transaction...' : 'Confirm & Recieve'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFeeForm;