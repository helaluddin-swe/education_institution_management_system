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

import AddNewStudents from './components/AddNewStudent';

import StaffProfileList from './components/staff/StaffProfileList';
import { useStaff } from '../../../context/StaffContext';
import AddNewStaff from './components/staff/AddNewStaff';
import MyClass from './class/MyClass';
import StudentFeesManagement from './fees/FeesManagement';

const DUMMY_STAFF = [
  { _id: '1', employeeId: 'TCH-2024-01', name: 'Dr. Sarah Jenkins', designation: 'Senior Lecturer', primarySubject: 'Mathematics' },
  { _id: '2', employeeId: 'TCH-2024-02', name: 'James Wilson', designation: 'Head of Dept', primarySubject: 'Physics' },
];

export const AdminDashboard = ({ subPage }) => {
  const { students = [], fetchStudents, isLoading } = useStudent();
  const { staffList = [], fetchStaff } = useStaff();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  
  // Distinguish between editing types
  const [editData, setEditData] = useState(null);
 

  useEffect(() => {
    fetchStudents();
    fetchStaff()
  }, [fetchStudents,fetchStaff]);

  // Derived Roll Number Logic
  const lastRollNumber = useMemo(() => {
    if (!Array.isArray(students) || students.length === 0) return 100;
    const rolls = students.map(s => Number(s.rollNumber)).filter(n => !isNaN(n));
    return rolls.length > 0 ? Math.max(...rolls) : 100;
  }, [students]);

  // --- HANDLERS ---
  const handleAddFee = (studentId, paymentObject) => {
    const student = students.find(s => (s._id || s.id) === studentId);
    if (student) setLastTransaction({ student, payment: paymentObject });
    setIsModalOpen(false);
  };

  const openEditModal = (data) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const renderContent = () => {
    if (isLoading && (!students || students.length === 0)) {
      return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
          <p className="text-sm font-medium animate-pulse">Syncing school records...</p>
        </div>
      );
    }

    const safeStudents = Array.isArray(students) ? students : [];
    const safeStaff = Array.isArray(staffList) ? staffList : [];

    switch (subPage) {
      case 'overview': return <AcademicOverview />;
      case 'students': return <StudentProfileList students={safeStudents} onEdit={openEditModal} />;
      case 'staff': return <StaffProfileList staff={safeStaff} onEdit={openEditModal} />;
      case 'fees': return <StudentFeesManagement students={safeStudents} />;
      case 'attendance': return <AttendanceTracker />;
      case 'class': return <MyClass />;
      case 'transport': return <TransportFleet />;
      case 'documents': return <ReportCardSystem />;
      case 'events': return <EventsCalendar />;
      default: return <AcademicOverview />;
    }
  };

  // Helper to determine button text
  const getButtonConfig = () => {
    if (subPage === 'students') return { text: 'New Admission', show: true };
    if (subPage === 'fees') return { text: 'Collect Fee', show: true };
    if (subPage === 'staff') return { text: 'Add New Staff', show: true };
    return { text: '', show: false };
  };

  const btnConfig = getButtonConfig();

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
          {btnConfig.show && (
            <button
              onClick={() => { setEditData(null); setIsModalOpen(true); }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus size={16} strokeWidth={3} /> {btnConfig.text}
            </button>
          )}

          <div className="flex gap-2">
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <School size={14} className="text-indigo-400" />
              Students: <span className="text-white font-mono">{students?.length || 0}</span>
            </div>
            {subPage === 'staff' && (
              <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2 animate-in fade-in">
                <Users size={14} className="text-emerald-400" />
                Staff: <span className="text-white font-mono">{staffList.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-[60vh]">
        {renderContent()}
      </div>

      {/* --- MODALS --- */}
      {isModalOpen && (
        <>
          {subPage === 'fees' && (
            <AddFeeForm
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              handleOnSubmit={handleAddFee}
              students={Array.isArray(students) ? students : []}
            />
          )}

          {subPage === 'students' && (
            <AddNewStudents
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              lastRollNumber={lastRollNumber}
              editData={editData}
              
            
            />
          )}

          {subPage === 'staff' && (
            <AddNewStaff
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              editData={editData}
            />
          )}
        </>
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