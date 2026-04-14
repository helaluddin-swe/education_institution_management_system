import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, CheckCircle2, AlertCircle, Save, MapPin, Loader2, Calendar, Briefcase, Mail } from 'lucide-react';
import { useStudent } from '../../../../context/StudentContext';

const AddNewStudents = ({ isOpen, onClose, lastRollNumber = 100, editData = null }) => {
  const firstInputRef = useRef(null);
  const [error, setError] = useState('');
  const { admitStudent, updateStudent, students, isLoading } = useStudent();

  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: lastRollNumber + 1,
    grade: '10',
    section: 'A',
    dob: '2010-01-01',
    gender: 'Male',
    bloodGroup: 'B+',
    email: '',
    studentPhone: '',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelation: 'Father',
    guardianOccupation: '',
    address: 'Chattogram, Bangladesh',
    status: 'Active'
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          fullName: editData.fullName || '',
          rollNumber: editData.rollNo || '',
          grade: editData.currentClass || '10',
          section: editData.section || 'A',
          dob: editData.personal?.dob ? new Date(editData.personal.dob).toISOString().split('T')[0] : '2010-01-01',
          gender: editData.personal?.gender || 'Male',
          bloodGroup: editData.personal?.bloodGroup || 'B+',
          email: editData.personal?.email || '',
          studentPhone: editData.personal?.phone || '',
          address: editData.personal?.address || '',
          guardianName: editData.guardian?.name || '',
          guardianPhone: editData.guardian?.phone || '',
          guardianEmail: editData.guardian?.email || '',
          guardianRelation: editData.guardian?.relation || 'Father',
          guardianOccupation: editData.guardian?.occupation || '',
          status: editData.status || 'Active'
        });
      } else {
        setFormData(prev => ({ ...prev, rollNumber: lastRollNumber + 1 }));
      }
      setError('');
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen, editData, lastRollNumber]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Roll Number Validation
    const isRollTaken = students.some(
      (s) =>
        String(s.currentClass) === String(formData.grade) &&
        Number(s.rollNo) === Number(formData.rollNumber) &&
        (s._id || s.id) !== editData?._id
    );

    if (isRollTaken) {
      setError(`Roll ${formData.rollNumber} is already taken in Class ${formData.grade}.`);
      return;
    }

    // Construct Payload matching the Mongoose Schema
    const studentEntry = {
      fullName: formData.fullName.trim(),
      currentClass: formData.grade,
      section: formData.section,
      rollNo: Number(formData.rollNumber),
      status: formData.status,
      personal: {
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        email: formData.email,
        phone: formData.studentPhone
      },
      guardian: {
        name: formData.guardianName,
        phone: formData.guardianPhone,
        email: formData.guardianEmail,
        relation: formData.guardianRelation,
        occupation: formData.guardianOccupation
      },
      // Initialize academics for new students to support charts
      ...( !editData && {
        academics: {
          attendance: "0%",
          lastGPA: "0.00",
          subjectGrades: [],
          progressHistory: []
        }
      })
    };

    let result = editData 
      ? await updateStudent(editData._id, studentEntry) 
      : await admitStudent(studentEntry);

    if (result?.success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-xl h-full bg-[#0f172a] border-l border-white/10 p-8 shadow-2xl overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tighter">
              {editData ? 'EDIT DOSSIER' : 'NEW ENROLLMENT'}
            </h2>
            <div className="h-1 w-12 bg-indigo-500 mt-1 rounded-full" />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-transform hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* SECTION 1: ACADEMIC PLACEMENT */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.3em] flex items-center gap-2">
              <GraduationCap size={14}/> Academic Placement
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Student Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input
                  ref={firstInputRef}
                  type="text" required disabled={isLoading}
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:border-indigo-500/50 outline-none transition-all"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Class</label>
                <select 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                >
                  {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Grade {i+1}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Section</label>
                <select 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                >
                  {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Roll No</label>
                <input
                  type="number"
                  className="w-full bg-indigo-500/5 border border-indigo-500/20 rounded-xl py-3 px-4 text-sm text-indigo-400 font-black outline-none"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PERSONAL DOSSIER */}
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.3em] flex items-center gap-2">
              <User size={14}/> Personal Dossier
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Birth Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="date" required
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 text-sm text-slate-200 outline-none"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Blood Group</label>
                <select 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Student Email</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  placeholder="student@school.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Student Phone</label>
                <input 
                  type="tel" 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.studentPhone}
                  onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Residential Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                <input 
                  type="text" 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 text-sm text-slate-200 outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: GUARDIANSHIP */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-[10px] uppercase font-black text-emerald-400 tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck size={14}/> Guardianship
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Guardian Name</label>
                <input 
                  type="text" required
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input 
                    type="tel" required
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 text-sm text-slate-200 outline-none"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Occupation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input 
                    type="text"
                    className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 text-sm text-slate-200 outline-none"
                    value={formData.guardianOccupation}
                    onChange={(e) => setFormData({ ...formData, guardianOccupation: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Relationship</label>
                <select 
                  className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-sm text-slate-200 outline-none"
                  value={formData.guardianRelation}
                  onChange={(e) => setFormData({ ...formData, guardianRelation: e.target.value })}
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-3 ${
              editData ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'
            } shadow-lg shadow-indigo-500/20`}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (editData ? <Save size={18} /> : <CheckCircle2 size={18} />)}
            {isLoading ? 'Processing...' : (editData ? 'Save Changes' : 'Admit Student')}
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple Icon fallback
const GraduationCap = ({size}) => <span style={{fontSize: size}}>🎓</span>;
const ShieldCheck = ({size}) => <span style={{fontSize: size}}>🛡️</span>;

export default AddNewStudents;