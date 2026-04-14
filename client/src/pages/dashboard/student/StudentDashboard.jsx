import React, { useState } from 'react';
import { Plus, School } from 'lucide-react';
import { studentProfiles } from '../school-management/data';

// Component Imports
import AcademicOverview from '../school-management/components/Overview';
import StudentRoster from '../school-management/components/StudentRoster';
import FacultyDirectory from '../school-management/components/FacultyDirectory';
import FeeManagement from '../school-management/components/FeeManagement';
import AttendanceTracker from '../school-management/components/AttendanceTraker';
import TransportFleet from '../school-management/components/TransportFleet';
import ReportCardSystem from '../school-management/components/ReportCardSystem';
import EventsCalendar from '../school-management/components/EventsCalendar';
// Note: Ensure ExamPortal is imported or created
// import ExamPortal from '../school-management/components/ExamPortal'; 

import AddFeeForm from '../school-management/Fee/AddFeeForm';
import AddNewStudents from '../school-management/students/AddNewStudents';
import FeeReceipt from '../school-management/Fee/FeeReceipt';
import MyClass from './class/MyClass';

export const StudentDashboard = ({ subPage }) => {
  // Global States
  const [students, setStudents] = useState(studentProfiles);

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [lastTransaction, setLastTransaction] = useState(null);

  // --- LOGIC: Handle Nested Slugs ---
  // If subPage is "school/students", we want just "students"
  const activeTab = subPage?.split('/').pop() || 'overview';

  const lastRollNumber = students.length > 0
    ? Math.max(...students.map(s => Number(s.rollNumber || 0)))
    : 100;

  // --- HANDLERS ---
  const handleAddFee = (studentId, paymentObject) => {
    setStudents(prevStudents => prevStudents.map(student => {
      if (student.id === studentId) {
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
        id: Date.now(), // Ensure unique ID
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
    switch (activeTab) {
      case 'overview': return <AcademicOverview />;
      case 'students':
        return <StudentRoster
          students={students}
          setStudents={setStudents}
          onEdit={openEditModal}
        />;
      case 'teachers': return <FacultyDirectory />;
      case 'class': return <MyClass />;
      case 'exams': return <div className="text-white p-10">Exam Portal Component Needed</div>; 
      case 'fees': return <FeeManagement students={students} />;
      case 'attendance': return <AttendanceTracker />;
      case 'transport': return <TransportFleet />;
      case 'documents': return <ReportCardSystem />;
      case 'events': return <EventsCalendar />;
      default: return <AcademicOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white capitalize">
            {activeTab === 'overview' ? 'School Dashboard' : `${activeTab.replace(/-/g, ' ')} Management`}
          </h2>
          <p className="text-slate-500 text-[10px] tracking-widest font-black uppercase mt-1">
            Academic Session: 2026-27
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(activeTab === 'students' || activeTab === 'fees') && (
            <button
              onClick={() => {
                setEditingStudent(null);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus size={14} /> {activeTab === 'students' ? 'Add Student' : 'Collect Fee'}
            </button>
          )}

          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-400 flex items-center gap-2">
            <School size={14} className="text-emerald-400" />
            Total Students: <span className="text-white font-bold">{students.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[60vh] animate-in fade-in duration-500">
        {renderContent()}
      </div>

      {/* --- DYNAMIC MODALS --- */}
      {activeTab === 'fees' && isModalOpen && (
        <AddFeeForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          handleOnSubmit={handleAddFee}
          students={students}
        />
      )}

      {activeTab === 'students' && isModalOpen && (
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

export default StudentDashboard;