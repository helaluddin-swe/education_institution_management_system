import React, { useState, useEffect, useMemo } from 'react';
import {
  X, Plus, Save, User, GraduationCap, Banknote,
  BookOpen, Loader2, Receipt, Beaker, Bus, Hash, Search, CheckCircle2, Wallet
} from 'lucide-react';
import { useStudent } from '../../../../context/StudentContext';

const AddNewFees = ({ isOpen, onClose, editStudent = null }) => {
  const { students, admitStudent, recordPayment } = useStudent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const initialState = {
    fullName: '',
    currentClass: '',
    section: 'A',
    rollNo: '',
    personal: { phone: '', email: '', address: '' },
    currentBill: {
      month: currentMonth,
      year: currentYear,
      tuitionFee: 0,
      examFee: 0,
      transportFee: 0,
      libraryFee: 0,
      labFee: 0,
      others: 0,
      paidAmount: 0
    }
  };

  const [formData, setFormData] = useState(initialState);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return [];
    return students.filter(s => 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      String(s.rollNo).includes(searchTerm)
    ).slice(0, 5);
  }, [searchTerm, students]);

  useEffect(() => {
    if (editStudent) {
      setSelectedProfile(editStudent);
      setFormData(prev => ({
        ...prev,
        fullName: editStudent.fullName,
        currentClass: editStudent.currentClass,
        section: editStudent.section || 'A',
        rollNo: editStudent.rollNo || '',
      }));
    } else if (isOpen) {
      setFormData(initialState);
      setSelectedProfile(null);
      setSearchTerm('');
    }
  }, [editStudent, isOpen]);

  const handleSelectStudent = (student) => {
    setSelectedProfile(student);
    setSearchTerm(student.fullName);
    setShowDropdown(false);
    setFormData(prev => ({
      ...prev,
      fullName: student.fullName,
      currentClass: student.currentClass,
      section: student.section || 'A',
      rollNo: student.rollNo || '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('currentBill.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        currentBill: { ...prev.currentBill, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const totalBilled = useMemo(() => {
    const b = formData.currentBill;
    return Number(b.tuitionFee) + Number(b.examFee) + Number(b.transportFee) + 
           Number(b.libraryFee) + Number(b.labFee) + Number(b.others);
  }, [formData.currentBill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bill = formData.currentBill;
    
    // VALIDATION: Ensure numbers are numbers, and required fields exist
    const paymentData = {
      month: bill.month, // Required by Schema
      year: Number(bill.year), // Required by Schema
      tuitionFee: Number(bill.tuitionFee),
      examFee: Number(bill.examFee),
      transportFee: Number(bill.transportFee),
      libraryFee: Number(bill.libraryFee),
      labFee: Number(bill.labFee),
      others: Number(bill.others),
      totalBilled: totalBilled,
      paidAmount: Number(bill.paidAmount),
      balance: totalBilled - Number(bill.paidAmount),
      status: Number(bill.paidAmount) >= totalBilled ? 'Paid' : (Number(bill.paidAmount) > 0 ? 'Partial' : 'Pending')
    };

    let result;
    if (selectedProfile) {
      // Payment for existing student
      result = await recordPayment(selectedProfile._id, paymentData);
    } else {
      // New admission logic
      const studentPayload = {
        fullName: formData.fullName,
        currentClass: formData.currentClass,
        section: formData.section,
        rollNo: Number(formData.rollNo),
        personal: formData.personal,
        finance: {
          paymentHistory: [paymentData],
          totalBilledToDate: totalBilled,
          totalOutstandingDebt: paymentData.balance,
          reservedBalance: 0 
        }
      };
      result = await admitStudent(studentPayload);
    }

    setIsSubmitting(false);
    if (result?.success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-slate-900 h-full sm:h-fit sm:max-h-[95vh] shadow-2xl sm:rounded-3xl border border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${selectedProfile ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                {selectedProfile ? <Banknote size={24}/> : <Plus size={24}/>}
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {selectedProfile ? "Collect Monthly Fees" : "Student Admission"}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                {selectedProfile ? `ID: ${selectedProfile.studentId}` : `Session ${currentYear}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400"><X size={20} /></button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Section 1: Reserved Balance Alert (ONLY if student has credit) */}
          {selectedProfile?.finance?.reservedBalance > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-3">
                <Wallet className="text-emerald-500" size={20} />
                <div>
                  <p className="text-xs font-black text-emerald-500 uppercase">Reserved Credit Available</p>
                  <p className="text-[10px] text-emerald-200/60 uppercase">This will be adjusted in backend</p>
                </div>
              </div>
              <span className="text-xl font-black text-emerald-500">৳{selectedProfile.finance.reservedBalance}</span>
            </div>
          )}

          {/* Section 2: Identity & Search */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
              <GraduationCap size={14} /> Academic Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editStudent && (
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1 block mb-2">Search Student</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="text"
                      placeholder="Name or Roll No..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setShowDropdown(true); }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  {showDropdown && filteredStudents.length > 0 && (
                    <div className="absolute w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl z-50 overflow-hidden shadow-2xl">
                      {filteredStudents.map(s => (
                        <div key={s._id} onClick={() => handleSelectStudent(s)} className="p-3 hover:bg-slate-700 cursor-pointer flex justify-between items-center border-b border-slate-700/50 last:border-0">
                          <span className="text-sm font-bold text-white">{s.fullName} (Roll: {s.rollNo})</span>
                          <CheckCircle2 size={14} className="text-indigo-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <InputGroup label="Full Name" icon={User} name="fullName" value={formData.fullName} onChange={handleChange} required disabled={!!selectedProfile} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputGroup label="Class" icon={BookOpen} name="currentClass" value={formData.currentClass} onChange={handleChange} required disabled={!!selectedProfile} />
              <InputGroup label="Section" icon={Hash} name="section" value={formData.section} onChange={handleChange} disabled={!!selectedProfile} />
              <InputGroup label="Roll No" icon={Hash} type="number" name="rollNo" value={formData.rollNo} onChange={handleChange} disabled={!!selectedProfile} />
            </div>
          </div>

          {/* Section 3: Fee Breakdown */}
          <div className="space-y-6 pt-6 border-t border-slate-800/50">
            <h3 className="text-[11px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <Receipt size={14} /> Fee Breakdown (৳)
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <FeeInput label="Tuition Fee" icon={Receipt} name="currentBill.tuitionFee" value={formData.currentBill.tuitionFee} onChange={handleChange} color="text-indigo-400" />
              <FeeInput label="Exam Fee" icon={Receipt} name="currentBill.examFee" value={formData.currentBill.examFee} onChange={handleChange} color="text-rose-400" />
              <FeeInput label="Transport" icon={Bus} name="currentBill.transportFee" value={formData.currentBill.transportFee} onChange={handleChange} color="text-amber-400" />
              <FeeInput label="Library" icon={BookOpen} name="currentBill.libraryFee" value={formData.currentBill.libraryFee} onChange={handleChange} color="text-blue-400" />
              <FeeInput label="Lab Fee" icon={Beaker} name="currentBill.labFee" value={formData.currentBill.labFee} onChange={handleChange} color="text-emerald-400" />
              <FeeInput label="Others" icon={Plus} name="currentBill.others" value={formData.currentBill.others} onChange={handleChange} color="text-slate-400" />
            </div>

            <div className="mt-8 bg-slate-950 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Invoice Total</span>
                <span className="text-4xl font-black text-white">৳{totalBilled.toLocaleString()}</span>
              </div>
              
              <div className="w-full md:w-72">
                <label className="text-[10px] font-black text-emerald-500 uppercase ml-1 block mb-2">Amount Paid Now</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">৳</span>
                  <input 
                    type="number" 
                    name="currentBill.paidAmount"
                    value={formData.currentBill.paidAmount}
                    onChange={handleChange}
                    className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl py-4 pl-10 pr-4 text-xl font-black text-white outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="p-6 bg-slate-900 border-t border-slate-800/50 flex gap-4">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 transition-all uppercase text-xs tracking-widest">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || (!selectedProfile && !formData.fullName)} 
            className={`flex-[2] py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${isSubmitting ? 'opacity-70' : ''} ${selectedProfile ? 'bg-emerald-600' : 'bg-indigo-600'} text-white shadow-lg`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {isSubmitting ? 'SAVING...' : selectedProfile ? 'CONFIRM PAYMENT' : 'ADMIT STUDENT'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal Helpers
const InputGroup = ({ label, icon: Icon, name, value, onChange, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400"><Icon size={16} /></div>
      <input {...props} name={name} value={value} onChange={onChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 text-sm text-slate-200 outline-none focus:border-indigo-500/50 transition-all disabled:opacity-50" />
    </div>
  </div>
);

const FeeInput = ({ label, icon: Icon, name, value, onChange, color }) => (
  <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
    <label className={`text-[9px] font-black uppercase flex items-center gap-2 mb-1 ${color}`}><Icon size={12} /> {label}</label>
    <div className="flex items-center gap-2">
      <span className="text-slate-700 font-bold text-xs">৳</span>
      <input type="number" name={name} value={value} onChange={onChange} className="w-full bg-transparent text-sm font-black text-white outline-none" />
    </div>
  </div>
);

export default AddNewFees;