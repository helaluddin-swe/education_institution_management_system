import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";


const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5174";

export const socket = io(backendUrl, {
  transports: ["websocket"],
  withCredentials: true
});
const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    

    // Helper for Auth Headers
    const getHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // ✅ REAL-TIME LISTENER
    useEffect(() => {
        socket.on("connect", () => {
            console.log("⚡ Connected:", socket.id);
        });

        socket.on("paymentUpdated", (updatedStudent) => {
            setStudents(prev =>
                prev.map(s =>
                    s._id === updatedStudent._id ? updatedStudent : s
                )
            );
        });

        return () => {
            socket.off("paymentUpdated");
            socket.disconnect();
        };
    }, []);

    // 1. ADMIT STUDENT
    const admitStudent = async (studentData) => {
        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/students/admit`,
                studentData,
                getHeader()
            );

            if (data.success) {
                toast.success("Student admitted successfully!");
                await fetchStudents();
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

    // 2. FETCH STUDENTS
    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/students`,
                getHeader()
            );

            const studentArray = Array.isArray(data) ? data : (data.data || []);
            setStudents(studentArray);

        } catch (err) {
            console.error("Error fetching students:", err);
            setStudents([]);
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) fetchStudents();
    }, [fetchStudents]);

    // 3. UPDATE STUDENT
    const updateStudent = async (id, updateData) => {
        setIsLoading(true);
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/students/${id}`,
                updateData,
                getHeader()
            );

            if (data.success) {
                toast.success("Student profile updated!");

                setStudents(prev =>
                    prev.map(s =>
                        s._id === id ? data.data : s
                    )
                );

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

    // 4. RECORD PAYMENT (🔥 FULL FIX)
    const recordPayment = async (id, paymentData) => {
        setIsLoading(true);
        try {
            const { data } = await axios.patch(
                `${backendUrl}/api/students/${id}/payment`,
                paymentData,
                getHeader()
            );

            if (data.success) {
                toast.success("Payment recorded!");

                // ✅ Immediate UI update (no wait for socket)
                setStudents(prev =>
                    prev.map(s =>
                        s._id === id ? data.data : s
                    )
                );

                return { success: true };
            }

        } catch (err) {
            const msg = err.response?.data?.message || "Payment failed";
            toast.error(msg);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    // 5. EXPEL STUDENT
    const expelStudent = async (id) => {
        if (!window.confirm("Are you sure you want to expel this student?")) return;

        try {
            await axios.delete(
                `${backendUrl}/api/students/${id}`,
                getHeader()
            );

            setStudents(prev => prev.filter(s => s._id !== id));
            toast.success("Student removed");

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
            updateStudent,
            recordPayment,
            expelStudent
        }}>
            {children}
        </StudentContext.Provider>
    );
};

export const useStudent = () => useContext(StudentContext);