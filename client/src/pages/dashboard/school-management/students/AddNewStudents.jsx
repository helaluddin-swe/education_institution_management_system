import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, CheckCircle2, Hash, AlertCircle, Save, MapPin } from 'lucide-react';

const AddNewStudents = ({ isOpen, onClose, lastRollNumber = 100, existingStudents = [], handleOnSubmit, editData = null }) => {
  const firstInputRef = useRef(null);
  const [error, setError] = useState('');

  // Local state matches the UI inputs
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: lastRollNumber + 1,
    grade: '10',
    section: 'A',
    dob: '2010-01-01',
    gender: 'Male',
    bloodGroup: 'B+',
    email: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Father',
    guardianOccupation: '',
    address: 'Chattogram, Bangladesh',
    status: 'Active'
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        // Flatten nested data for form inputs
        setFormData({
          ...editData,
          dob: editData.personal?.dob || '',
          gender: editData.personal?.gender || 'Male',
          bloodGroup: editData.personal?.bloodGroup || 'B+',
          email: editData.personal?.email || '',
          address: editData.personal?.address || '',
          guardianName: editData.guardian?.name || '',
          guardianPhone: editData.guardian?.phone || '',
          guardianRelation: editData.guardian?.relation || 'Father',
          guardianOccupation: editData.guardian?.occupation || '',
        });
      } else {
        setFormData({
          fullName: '',
          rollNumber: lastRollNumber + 1,
          grade: '10',
          section: 'A',
          dob: '2010-01-01',
          gender: 'Male',
          bloodGroup: 'B+',
          email: '',
          guardianName: '',
          guardianPhone: '',
          guardianRelation: 'Father',
          guardianOccupation: '',
          address: 'Chattogram, Bangladesh',
          status: 'Active'
        });
      }
      setError('');
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, editData, lastRollNumber]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isDuplicate = existingStudents.some(
      (s) => s.id !== editData?.id && s.fullName.toLowerCase() === formData.fullName.toLowerCase().trim()
    );

    if (isDuplicate) {
      setError(`Warning: A student named "${formData.fullName}" is already in the system.`);
      return;
    }

    const currentYear = new Date().getFullYear();
    const generatedID = editData 
      ? formData.id 
      : `${currentYear}-${formData.grade}${formData.section}-${formData.rollNumber}`;

    // CONSTRUCT NESTED OBJECT
    const studentEntry = {
      id: generatedID,
      fullName: formData.fullName.trim(),
      grade: formData.grade,
      section: formData.section,
      rollNumber: formData.rollNumber,
      status: formData.status,
      admissionDate: editData ? formData.admissionDate : new Date().toISOString().split('T')[0],
      
      // Personal Section
      personal: {
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        email: formData.email,
        address: formData.address
      },
      
      // Guardian Section
      guardian: {
        name: formData.guardianName,
        phone: formData.guardianPhone,
        relation: formData.guardianRelation,
        occupation: formData.guardianOccupation
      },
      
      // Academics Section (Defaults for new students)
      academics: editData?.academics || {
        attendance: '100%',
        lastGPA: 'N/A',
        rank: 'N/A'
      },

      // Financials Section (Defaults for new students)
      financials: editData?.financials || {
        monthlyFee: 1200,
        totalPayable: 1200,
        totalPaid: 0,
        dueBalance: 1200
      },
      
      paymentHistory: editData?.paymentHistory || []
    };

    handleOnSubmit(studentEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div
        className="w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 p-8 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {editData ? 'Update Profile' : 'New Admission'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {editData ? `Editing ID: ${editData.id}` : `Class of ${new Date().getFullYear()}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-all hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in shake">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Identity Info */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em]">Identity & Class</h3>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input
                  ref={firstInputRef}
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Grade</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  disabled={!!editData}
                >
                  {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Class {i+1}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Section</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.section}
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                  disabled={!!editData}
                >
                  {['A', 'B', 'C'].map(s => <option key={s} value={s}>Sec {s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Roll</label>
                <input readOnly className="w-full bg-slate-800/30 border border-slate-800 rounded-xl py-3 px-4 text-sm text-indigo-400 font-mono font-bold" value={formData.rollNumber} />
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em]">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Birth Date</label>
                <input type="date" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Blood Group</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Address</label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                 <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 text-sm text-slate-200" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
               </div>
            </div>
          </div>

          {/* Guardian Section */}
          <div className="space-y-4 pt-4 border-t border-slate-800/50">
            <h3 className="text-[10px] uppercase font-bold text-indigo-400 tracking-[0.2em]">Guardian Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Guardian Name</label>
                <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200" value={formData.guardianName} onChange={(e) => setFormData({...formData, guardianName: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input type="tel" required className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 text-sm text-slate-200 font-mono" value={formData.guardianPhone} onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full ${editData ? 'bg-emerald-600' : 'bg-indigo-600'} text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] hover:brightness-110`}
          >
            {editData ? <Save size={18} /> : <CheckCircle2 size={18} />}
            {editData ? 'Update Profile' : 'Confirm Admission'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewStudents;