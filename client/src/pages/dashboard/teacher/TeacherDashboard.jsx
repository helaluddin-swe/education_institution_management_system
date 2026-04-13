import React, { useState } from 'react';
import { Plus, School } from 'lucide-react';

import { studentProfiles } from '../school-management/data';
import AcademicOverview from '../school-management/components/Overview';
import StudentRoster from '../school-management/components/StudentRoster';
import FacultyDirectory from '../school-management/components/FacultyDirectory';
import FeeManagement from '../school-management/components/FeeManagement';

import TransportFleet from '../school-management/components/TransportFleet';
import ReportCardSystem from '../school-management/components/ReportCardSystem';
import EventsCalendar from '../school-management/components/EventsCalendar';
import AddFeeForm from '../school-management/Fee/AddFeeForm';
import AddNewStudents from '../school-management/students/AddNewStudents';
import FeeReceipt from '../school-management/Fee/FeeReceipt';
import AttendanceTracker from '../school-management/components/AttendanceTraker';

export const TeacherDashboard = ({ subPage }) => {
  // Global States
  const [students, setStudents] = useState(studentProfiles);

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);

  // --- DERIVED DATA ---
  const lastRollNumber = students.length > 0
    ? Math.max(...students.map(s => Number(s.rollNumber || 0)))
    : 100;

  // --- HANDLERS ---

  /**
   * Handles adding a fee and triggering the receipt preview
   */
  const handleAddFee = (studentId, paymentObject) => {
    setStudents(prevStudents => prevStudents.map(student => {
      if (student.id === studentId) {
        // Calculate updated financials
        const currentPaid = student.financials?.totalPaid || 0;
        const totalPayable = student.financials?.totalPayable || 1200;
        const newPaidTotal = currentPaid + paymentObject.paid;
        
        const updatedStudent = {
          ...student,
          paymentHistory: [paymentObject, ...(student.paymentHistory || [])],
          financials: {
            ...student.financials,
            totalPaid: newPaidTotal,
            dueBalance: Math.max(0, totalPayable - newPaidTotal)
          }
        };

        // Prepare receipt data
        setLastTransaction({ student: updatedStudent, payment: paymentObject });
        return updatedStudent;
      }
      return student;
    }));

    setIsModalOpen(false);
  };

  const handleStudentSubmit = (studentData) => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? studentData : s));
    } else {
      const newStudent = {
        ...studentData,
        paymentHistory: [],
        financials: { totalPayable: 1200, totalPaid: 0, dueBalance: 1200 }
      };
      setStudents(prev => [newStudent, ...prev]);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  // --- CONTENT ROUTING ---
  const renderContent = () => {
    switch (subPage) {
      case 'overview': return <AcademicOverview />;
      case 'students':
        return <StudentRoster
          students={students}
          setStudents={setStudents}
          onEdit={openEditModal}
        />;
      case 'teachers': return <FacultyDirectory />;
      case 'exams': return <ExamPortal />;
      case 'fees':
        return <FeeManagement students={students} />;
      case 'attendance': return <AttendanceTracker />;
      case 'transport': return <TransportFleet />;
      case 'documents': return <ReportCardSystem />;
      case 'events': return <EventsCalendar />;
      default: return <AcademicOverview />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white capitalize">
            {subPage === 'overview' || !subPage ? 'School Dashboard' : `${subPage} Management`}
          </h2>
          <p className="text-slate-400 text-[10px] tracking-tight font-medium uppercase mt-1">
            Academic Session: 2026-27
          </p>
        </div>

        <div className="flex gap-3">
          {(subPage === 'students' || subPage === 'fees') && (
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus size={14} /> {subPage === 'students' ? 'Add Student' : 'Collect Fee'}
            </button>
          )}

          <div className="hidden md:flex gap-3">
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-2">
              <School size={14} className="text-indigo-400" />
              Students: <span className="text-white font-bold">{students.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[60vh]">
        {renderContent()}
      </div>

      {/* --- DYNAMIC MODALS --- */}

      {/* Fee Collection Form */}
      {subPage === 'fees' && isModalOpen && (
        <AddFeeForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          handleOnSubmit={handleAddFee}
          students={students}
        />
      )}

      {/* Student Add/Edit Form */}
      {subPage === 'students' && isModalOpen && (
        <AddNewStudents
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
          handleOnSubmit={handleStudentSubmit}
          lastRollNumber={lastRollNumber}
          existingStudents={students}
          editData={editingStudent}
        />
      )}

      {/* Success Receipt - Triggers after handleAddFee */}
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

export default TeacherDashboard;