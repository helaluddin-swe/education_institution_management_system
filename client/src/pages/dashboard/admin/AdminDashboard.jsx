import React, { useState, useEffect, useMemo } from 'react';
import { Plus, School, Users, Loader2 } from 'lucide-react';
import { useStudent } from '../../../context/StudentContext';

// Components
import AcademicOverview from '../school-management/components/Overview';
import FeeManagement from '../school-management/components/FeeManagement';
import TransportFleet from '../school-management/components/TransportFleet';
import ReportCardSystem from '../school-management/components/ReportCardSystem';
import EventsCalendar from '../school-management/components/EventsCalendar';
import AddFeeForm from '../school-management/Fee/AddFeeForm';
import FeeReceipt from '../school-management/Fee/FeeReceipt';
import AttendanceTracker from '../school-management/components/AttendanceTraker';
import StudentProfileList from './components/StudentProfileList';
import StaffProfileList from './components/StaffProfileList';
import AddNewStudents from './components/AddNewStudent';

const DUMMY_STAFF = [
  { _id: '1', employeeId: 'TCH-2024-01', name: 'Dr. Sarah Jenkins', designation: 'Senior Lecturer', primarySubject: 'Mathematics' },
  { _id: '2', employeeId: 'TCH-2024-02', name: 'James Wilson', designation: 'Head of Dept', primarySubject: 'Physics' },
];

export const AdminDashboard = ({ subPage }) => {
  // 1. Safe Context Destructuring
  const { students = [], fetchStudents, isLoading } = useStudent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [staffList] = useState(DUMMY_STAFF);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // 2. FIXED: Safe Derived Data logic using .map() and ensuring students is an array
  const lastRollNumber = useMemo(() => {
    if (!Array.isArray(students) || students.length === 0) return 100;
    
    // Extract roll numbers, filter out non-numbers, and find max
    const rolls = students
      .map(s => Number(s.rollNumber))
      .filter(n => !isNaN(n));
      
    return rolls.length > 0 ? Math.max(...rolls) : 100;
  }, [students]);

  // --- HANDLERS ---
  const handleAddFee = (studentId, paymentObject) => {
    if (!Array.isArray(students)) return;
    const student = students.find(s => (s._id || s.id) === studentId);
    if (student) {
      setLastTransaction({ student, payment: paymentObject });
    }
    setIsModalOpen(false);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    // Show loader if fetching and list is empty
    if (isLoading && (!students || students.length === 0)) {
      return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
          <p className="text-sm font-medium animate-pulse">Syncing school records...</p>
        </div>
      );
    }

    // Ensure we pass an array to components even if API fails
    const safeStudents = Array.isArray(students) ? students : [];

    switch (subPage) {
      case 'overview': return <AcademicOverview />;
      case 'students':
        return <StudentProfileList students={safeStudents} onEdit={openEditModal} />;
      case 'teachers': 
        return <StaffProfileList staff={staffList} />;
      case 'fees':
        return <FeeManagement students={safeStudents} />;
      case 'attendance': return <AttendanceTracker />;
      case 'transport': return <TransportFleet />;
      case 'documents': return <ReportCardSystem />;
      case 'events': return <EventsCalendar />;
      default: return <AcademicOverview />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-white capitalize tracking-tight">
            {subPage === 'overview' || !subPage ? 'Institutional Overview' : `${subPage} Control`}
          </h2>
          <p className="text-slate-500 text-[10px] tracking-[0.15em] font-bold uppercase mt-1">
            Session: 2026-27 • <span className="text-indigo-500">{isLoading ? 'Updating...' : 'System Live'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {(subPage === 'students' || subPage === 'fees') && (
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus size={16} strokeWidth={3} /> {subPage === 'students' ? 'New Admission' : 'Collect Fee'}
            </button>
          )}

          <div className="flex gap-2">
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <School size={14} className="text-indigo-400" />
              Students: <span className="text-white font-mono">{students?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[60vh]">
        {renderContent()}
      </div>

      {/* --- MODALS --- */}
      {subPage === 'fees' && isModalOpen && (
        <AddFeeForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          handleOnSubmit={handleAddFee}
          students={Array.isArray(students) ? students : []}
        />
      )}

      {subPage === 'students' && isModalOpen && (
        <AddNewStudents
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
          lastRollNumber={lastRollNumber}
          editData={editingStudent}
        />
      )}

      {lastTransaction && (
        <FeeReceipt
          student={lastTransaction.student}
          payment={lastTransaction.payment}
          onClose={() => setLastTransaction(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;