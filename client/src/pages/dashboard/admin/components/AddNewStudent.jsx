import React, { useState, useEffect, useRef } from 'react';
import {
  X, Plus, Save, User, Phone, Mail, Calendar,
  GraduationCap, Edit3, BookOpen, Hash, Loader2, 
  Heart, MapPin, Users, Briefcase, AlertCircle
} from 'lucide-react';
import { useStudent } from '../../../../context/StudentContext';

const AddNewStudents = ({ isOpen, onClose, lastRollNumber = 100, editData = null }) => {
  const { admitStudent, updateStudent, students, isLoading } = useStudent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Matches the nested StudentProfileSchema exactly
  const initialState = {
    studentId: '',
    fullName: '',
    currentClass: '10',
    section: 'A',
    rollNo: lastRollNumber + 1,
    status: 'Active',
    personal: {
      dob: '2010-01-01',
      gender: 'Male',
      bloodGroup: 'B+',
      address: 'Chattogram, Bangladesh',
      email: '',
      phone: '',
    },
    guardian: {
      name: '',
      phone: '',
      relation: 'Father',
      occupation: '',
      email: '',
    }
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          ...editData,
          personal: {
            ...editData.personal,
            dob: editData.personal?.dob ? new Date(editData.personal.dob).toISOString().split('T')[0] : '2010-01-01'
          }
        });
      } else {
        setFormData({
          ...initialState,
          rollNo: lastRollNumber + 1
        });
      }
      setError('');
    }
  }, [editData, isOpen, lastRollNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested objects (personal.email, guardian.name, etc)
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Roll Number Validation logic
    const isRollTaken = students.some(
      (s) =>
        String(s.currentClass) === String(formData.currentClass) &&
        Number(s.rollNo) === Number(formData.rollNo) &&
        (s._id || s.id) !== editData?._id
    );

    if (isRollTaken) {
      setError(`Roll ${formData.rollNo} is already taken in Class ${formData.currentClass}.`);
      return;
    }

    setIsSubmitting(true);

    // Prepare payload
    const studentEntry = {
      ...formData,
      rollNo: Number(formData.rollNo),
      // Initialize academics for new enrollments
      ...(!editData && {
        academics: {
          attendance: "0%",
          lastGPA: "0.00",
          subjectGrades: [],
          progressHistory: []
        }
      })
    };

    let result;
    if (editData) {
      result = await updateStudent(editData._id || editData.id, studentEntry);
    } else {
      result = await admitStudent(studentEntry);
    }

    setIsSubmitting(false);
    if (result?.success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex justify-end bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4 transition-all">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-slate-900 h-full sm:h-fit sm:max-h-[95vh] shadow-2xl sm:rounded-3xl border border-slate-800 animate-in slide-in-from-right duration-300 flex flex-col overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              {editData ? (
                <><Edit3 className="text-amber-500" size={24} /> Edit Dossier</>
              ) : (
                <><Plus className="text-indigo-500" size={24} /> New Enrollment</>
              )}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">
              {editData ? `MODIFIED RECORD: ${editData.studentId || 'N/A'}` : 'Academic Session 2026-27'}
            </p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all active:scale-90">
            <X size={20} />
          </button>
        </div>

        {/* --- ERROR MESSAGE --- */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* --- FORM BODY --- */}
        <form onSubmit={handleSubmit} className="p-8 space-y-10 overflow-y-auto flex-1 custom-scrollbar bg-slate-900/50">
          
          {/* Section 1: Academic Placement */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
              <GraduationCap size={14} /> Academic Placement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Full Name" icon={User} name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" required />
              <InputGroup label="Student ID (Optional)" icon={Hash} name="studentId" value={formData.studentId} onChange={handleChange} placeholder="STU-2026-001" />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Class</label>
                <select name="currentClass" value={formData.currentClass} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-all">
                  {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Grade {i+1}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Section</label>
                <select name="section" value={formData.section} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-all">
                  {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <InputGroup label="Roll No" icon={Hash} type="number" name="rollNo" value={formData.rollNo} onChange={handleChange} required />
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div className="space-y-4 pt-6 border-t border-slate-800/50">
            <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Date of Birth" icon={Calendar} type="date" name="personal.dob" value={formData.personal.dob} onChange={handleChange} />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Gender</label>
                <select name="personal.gender" value={formData.personal.gender} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Blood Group</label>
                <select name="personal.bloodGroup" value={formData.personal.bloodGroup} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-emerald-500">
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <InputGroup label="Student Phone" icon={Phone} name="personal.phone" value={formData.personal.phone} onChange={handleChange} placeholder="017XXXXXXXX" />
              <div className="md:col-span-2">
                <InputGroup label="Residential Address" icon={MapPin} name="personal.address" value={formData.personal.address} onChange={handleChange} placeholder="House, Road, Area..." />
                <InputGroup label="Email Address" icon={MapPin} name="personal.email" value={formData.personal.email} onChange={handleChange} placeholder="developer@gmail.com" />
              </div>
            </div>
          </div>

          {/* Section 3: Guardian Information */}
          <div className="space-y-4 pt-6 border-t border-slate-800/50">
            <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
              <Users size={14} /> Guardianship
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup label="Guardian Name" icon={User} name="guardian.name" value={formData.guardian.name} onChange={handleChange} required />
              <InputGroup label="Guardian Phone" icon={Phone} name="guardian.phone" value={formData.guardian.phone} onChange={handleChange} required />
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Relation</label>
                <select name="guardian.relation" value={formData.guardian.relation} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none focus:border-rose-500">
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>
              <InputGroup label="Occupation" icon={Briefcase} name="guardian.occupation" value={formData.guardian.occupation} onChange={handleChange} placeholder="Service/Business" />
            </div>
          </div>
        </form>

        {/* --- FOOTER --- */}
        <div className="p-6 bg-slate-900 border-t border-slate-800/50 flex gap-4">
          <button onClick={onClose} type="button" className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 transition-all active:scale-95">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isLoading} 
            className={`flex-2 py-4 px-8 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98] ${isSubmitting || isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${editData ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {isSubmitting || isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSubmitting || isLoading ? 'Saving...' : editData ? 'Update Dossier' : 'Admit Student'}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

const InputGroup = ({ label, icon: Icon, name, value, onChange, ...props }) => {
  const inputRef = useRef(null);
  const handleContainerClick = () => {
    if (props.type === 'date' && inputRef.current) {
        inputRef.current.showPicker();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">{label}</label>
      <div className="relative group cursor-pointer" onClick={handleContainerClick}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
          <Icon size={16} />
        </div>
        <input
          {...props}
          ref={inputRef}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all"
        />
      </div>
    </div>
  );
};

export default AddNewStudents;