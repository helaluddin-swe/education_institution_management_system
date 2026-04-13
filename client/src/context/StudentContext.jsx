import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { backendUrl } = useAuth();

    // Helper for Auth Headers
    const getHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // 1. ADMIT STUDENT (POST)
    const admitStudent = async (studentData) => {
        setIsLoading(true);
        try {
            // Flattening the data if your backend expects a flat structure, 
            // or sending as is if your controller handles nesting.
            const { data } = await axios.post(`${backendUrl}/api/students/admit`, studentData, getHeader());
            
            if (data.success) {
                toast.success("Student admitted and login created!");
                // Refresh list
                fetchStudents(); 
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
            setStudents(data);
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    // 3. DELETE/EXPEL (DELETE)
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
            expelStudent 
        }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => useContext(StudentContext);