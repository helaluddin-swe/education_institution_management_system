import React, { useEffect, useState } from 'react';
import { Plus, Loader2, GraduationCap } from 'lucide-react';
import { useStudent } from '../../../../context/StudentContext';
import StudentList from './FeeList';
import StudentFeeDetails from './StudentFeesDetails';
import AddNewFees from './AddNewFees'; // Combined Admission & Quick Fee Collection
import StudentFeeList from './FeeList';

const StudentFeesManagement = ({ students }) => {
  // 1. Using the Student Context
  const { isLoading, expelStudent, updateStudent, recordPayment } = useStudent();

  // 2. Local UI states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFees, setEditingFees] = useState(null);

  // --- DELETE/EXPEL HANDLER ---
  const handleExpel = async (e, id) => {
    e.stopPropagation();
    await expelStudent(id);
  };

  // --- EDIT/COLLECT HANDLER ---
  // Triggered when clicking 'Edit' or 'Collect' on a specific student in the list
  const handleEdit = (e, student) => {
    e.stopPropagation();
    setEditingFees(student);
    setIsAddModalOpen(true);
  };

  // --- QUICK FEE PAYMENT HANDLER ---
 const handleRecordPayment = async (studentId, paymentData) => {
  const response = await recordPayment(studentId, paymentData);

  if (response?.success) {
    // ✅ Always get latest from context (not old props)
    setSelectedStudent(prev => {
      const updatedStudent = students.find(s => s._id === studentId);
      return updatedStudent || prev;
    });
  }

  return response;
};
useEffect(() => {
  if (selectedStudent) {
    const updated = students.find(s => s._id === selectedStudent._id);
    if (updated) setSelectedStudent(updated);
  }
}, [students]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/50 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <GraduationCap className="text-indigo-500" />
            Fees & Admission
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
            Active Enrollments: {students.length}
          </p>
        </div>

        <button 
          onClick={() => {
            setEditingFees(null); // Ensure null so it acts as "New Admission"
            setIsAddModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
          Admission & Fee
        </button>
      </div>

      {/* Main List Logic */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="text-indigo-500 animate-spin" size={40} />
          <p className="text-slate-400 font-medium animate-pulse">Retrieving student records...</p>
        </div>
      ) : students.length > 0 ? (
        <StudentFeeList 
          students={students} 
          handleDelete={handleExpel} 
          handleEdit={handleEdit} 
          setSelectedStudent={setSelectedStudent}
        />
      ) : (
        <div className="text-center py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl">
           <p className="text-slate-500 font-bold uppercase tracking-widest">No student records found</p>
        </div>
      )}

      {/* Admission & Collection Modal */}
      <AddNewFees 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFees(null);
        }} 
        editStudent={editingFees} 
      />

      {/* Detailed History & Profile View Modal */}
      {selectedStudent && (
        <StudentFeeDetails
          student={selectedStudent}
          onUpdateProfile={updateStudent}
          onRecordPayment={handleRecordPayment} 
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentFeesManagement;