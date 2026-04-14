import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5174").replace(/\/$/, "");

    // Helper for Auth Headers
    const getHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

   
    // 1. ADMIT STUDENT (POST)
    const admitStudent = async (studentData) => {
        setIsLoading(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/students/admit`, studentData, getHeader());

            if (data.success) {
                toast.success("Student admitted successfully!");
                await fetchStudents(); // Refresh list to get new student with DB ID
                return { success: true };
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Admission failed";
            toast.error(msg);
            return { success: false, message: msg };
        } finally {
            setIsLoading(false);
        }
    };

    // 2. FETCH ALL STUDENTS (GET)
    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/students`, getHeader());
            // SAFETY: If backend sends { success: true, students: [] }, use data.students
            // If backend sends just [], use data directly.
            const studentArray = Array.isArray(data) ? data : (data.students || []);
            setStudents(studentArray);
        } catch (err) {
            console.error("Error fetching students:", err);
            setStudents([]); // Fallback to empty array on error
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);
     useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchStudents();
        }
    }, [fetchStudents]);

    // 3. UPDATE STUDENT (PUT)
    // 3. UPDATE STUDENT (PUT)
  // 3. UPDATE STUDENT (PUT)
const updateStudent = async (id, updateData) => {
    setIsLoading(true);
    try {
        // Ensure updateData here contains 'currentClass' and 'rollNo'
        const { data } = await axios.put(`${backendUrl}/api/students/${id}`, updateData, getHeader());

        if (data.success) {
            toast.success("Student profile updated!");
            // Refresh local state
            setStudents(prev => prev.map(s => (s._id === id ? { ...s, ...updateData } : s)));
            return { success: true };
        }
    } catch (err) {
        const msg = err.response?.data?.message || "Update failed";
        toast.error(msg);
        return { success: false, message: msg };
    } finally {
        setIsLoading(false);
    }
};

    // 4. DELETE/EXPEL (DELETE)
    const expelStudent = async (id) => {
        try {
            await axios.delete(`${backendUrl}/api/students/${id}`, getHeader());
            setStudents(prev => prev.filter(s => s._id !== id));
            toast.success("Student records removed");
        } catch (err) {
            toast.error("Action failed");
        }
    };

    return (
        <StudentContext.Provider value={{
            students,
            isLoading,
            admitStudent,
            fetchStudents,
            updateStudent, // Exporting update function
            expelStudent
        }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => useContext(StudentContext);