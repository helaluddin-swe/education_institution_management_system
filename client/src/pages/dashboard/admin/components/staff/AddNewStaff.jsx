import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, CheckCircle2, AlertCircle, Save, MapPin, Loader2, Calendar, Briefcase, Mail, GraduationCap, ShieldAlert, BookOpen, ScrollText } from 'lucide-react';
import { useStaff } from '../../../../../context/StaffContext';


const AddNewStaff = ({ isOpen, onClose, editData = null }) => {
  const firstInputRef = useRef(null);
  const [error, setError] = useState('');
  const { hireStaff, updateStaff, isLoading } = useStaff();

  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    email:'',
    designation: 'Lecturer',
    qualification: '',
    primarySubject: '',
    otherSubjects: '',
    isClassTeacher: false,
    assignedClassSection: '',
    joiningDate: new Date().toISOString().split('T')[0],
    bio: '',
    phoneNumber: '',
    emergencyContact: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          fullName: editData.fullName || '',
          employeeId: editData.employeeId || '',
          email:editData.email || '',
          designation: editData.designation || 'Lecturer',
          qualification: editData.qualification || '',
          primarySubject: editData.primarySubject || '',
          otherSubjects: editData.otherSubjects?.join(', ') || '',
          isClassTeacher: editData.isClassTeacher || false,
          assignedClassSection: editData.assignedClassSection || '',
          joiningDate: editData.joiningDate ? new Date(editData.joiningDate).toISOString().split('T')[0] : '',
          bio: editData.bio || '',
          phoneNumber: editData.phoneNumber || '',
          emergencyContact: editData.emergencyContact || '',
          status: editData.status || 'Active'
        });
      } else {
        setFormData({
          fullName: '',
          employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`, // Example auto-
          email:'',
          designation: 'Lecturer',
          qualification: '',
          primarySubject: '',
          otherSubjects: '',
          isClassTeacher: false,
          assignedClassSection: '',
          joiningDate: new Date().toISOString().split('T')[0],
          bio: '',
          phoneNumber: '',
          emergencyContact: '',
          status: 'Active'
        });
      }
      setError('');
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct Payload matching TeacherProfileSchema
    const staffEntry = {
      fullName: formData.fullName.trim(),
      employeeId: formData.employeeId,
      email:formData.email,
      designation: formData.designation,
      qualification: formData.qualification,
      primarySubject: formData.primarySubject,
      otherSubjects: formData.otherSubjects.split(',').map(s => s.trim()).filter(s => s !== ""),
      isClassTeacher: formData.isClassTeacher,
      assignedClassSection: formData.assignedClassSection,
      joiningDate: formData.joiningDate,
      bio: formData.bio,
      phoneNumber: formData.phoneNumber,
      emergencyContact: formData.emergencyContact,
      status: formData.status
    };

    let result = editData 
      ? await updateStaff(editData._id, staffEntry) 
      : await hireStaff(staffEntry);

    if (result?.success) onClose();
    else setError(result?.message || 'An error occurred');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl h-full bg-[#0f172a] border-l border-white/10 p-8 shadow-2xl overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tighter">
              {editData ? 'EDIT STAFF PROFILE' : 'NEW STAFF APPOINTMENT'}
            </h2>
            <div className="h-1 w-12 bg-emerald-500 mt-1 rounded-full" />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-transform hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold uppercase">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* SECTION 1: PROFESSIONAL IDENTITY */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-black text-emerald-400 tracking-[0.3em] flex items-center gap-2">
              <Briefcase size={14}/> Professional Identity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    ref={firstInputRef}
                    type="text" required
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-emerald-500/50"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Employee ID</label>
                <input
                  type="text" required
                  className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-sm text-emerald-400 font-black"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Designation</label>
                <select 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                >
                  <option value="Lecturer">Lecturer</option>
                  <option value="Senior Teacher">Senior Teacher</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Assistant Teacher">Assistant Teacher</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC & QUALIFICATIONS */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.3em] flex items-center gap-2">
              <GraduationCap size={14}/> Academic Authority
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Qualification (e.g. B.Ed, M.Sc)</label>
              <div className="relative">
                <ScrollText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 text-sm text-slate-200 outline-none"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Staff Email</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  placeholder="staff@school.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Primary Subject</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input 
                    type="text" required
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 text-sm text-slate-200 outline-none"
                    value={formData.primarySubject}
                    onChange={(e) => setFormData({ ...formData, primarySubject: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Other Subjects (Comma separated)</label>
                <input 
                  type="text"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.otherSubjects}
                  onChange={(e) => setFormData({ ...formData, otherSubjects: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: RESPONSIBILITIES & CONTACT */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] uppercase font-black text-amber-400 tracking-[0.3em]">Responsibilities</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={formData.isClassTeacher}
                        onChange={(e) => setFormData({...formData, isClassTeacher: e.target.checked})}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-500"
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Class Teacher?</span>
                </label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Assigned Class-Section</label>
                <input 
                  type="text" placeholder="e.g. 10-A"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.assignedClassSection}
                  onChange={(e) => setFormData({ ...formData, assignedClassSection: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Joining Date</label>
                <input 
                  type="date"
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input 
                    type="tel"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 text-sm text-slate-200 outline-none"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Emergency Contact</label>
                <div className="relative">
                  <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-600/50" size={14} />
                  <input 
                    type="tel"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 text-sm text-slate-200 outline-none"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Brief Bio (Max 300 chars)</label>
            <textarea 
              maxLength={300}
              className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none min-h-[80px]"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-3 ${
              editData ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'
            } shadow-lg shadow-indigo-500/20`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (editData ? <Save size={18} /> : <CheckCircle2 size={18} />)}
            {isLoading ? 'Processing...' : (editData ? 'Update Profile' : 'Confirm Appointment')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewStaff;