import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5174").replace(/\/$/, "");

    // Helper for Auth Headers
    const getHeader = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    // 1. HIRE STAFF (POST)
    const hireStaff = async (staffData) => {
        setIsLoading(true);
        try {
            // API matches the staffRoutes: /api/staff/appoint
            const { data } = await axios.post(`${backendUrl}/api/staff/appoint`, staffData, getHeader());

            if (data.success) {
                toast.success("Staff appointed successfully!");
                await fetchStaff(); // Refresh list to get new staff with DB ID
                return { success: true };
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Hiring failed";
            toast.error(msg);
            return { success: false, message: msg };
        } finally {
            setIsLoading(false);
        }
    };

    // 2. FETCH ALL STAFF (GET)
    const fetchStaff = useCallback(async () => {
        setIsLoading(true);
        try {
            // API matches the staffRoutes: /api/staff/all
            const { data } = await axios.get(`${backendUrl}/api/staff/all`, getHeader());
            
            // Safety check for different response formats
            const staffArray = Array.isArray(data) ? data : (data.staff || []);
            setStaffList(staffArray);
        } catch (err) {
            console.error("Error fetching staff:", err);
            setStaffList([]);
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchStaff();
        }
    }, [fetchStaff]);

    // 3. UPDATE STAFF (PUT)
    const updateStaff = async (id, updateData) => {
        setIsLoading(true);
        try {
            // API matches the staffRoutes: /api/staff/update/:id
            const { data } = await axios.put(`${backendUrl}/api/staff/update/${id}`, updateData, getHeader());

            if (data.success) {
                toast.success("Staff profile updated!");
                // Update local state immediately for better UX
                setStaffList(prev => prev.map(s => (s._id === id ? { ...s, ...updateData } : s)));
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

    // 4. TERMINATE STAFF (DELETE)
    const terminateStaff = async (id) => {
        try {
            // API matches the staffRoutes: /api/staff/terminate/:id
            await axios.delete(`${backendUrl}/api/staff/terminate/${id}`, getHeader());
            setStaffList(prev => prev.filter(s => s._id !== id));
            toast.success("Staff records removed");
        } catch (err) {
            toast.error("Action failed");
        }
    };

    return (
        <StaffContext.Provider value={{
            staffList, // renamed from students
            isLoading,
            hireStaff, // renamed from admitStudent
            fetchStaff, // renamed from fetchStudents
            updateStaff, // renamed from updateStudent
            terminateStaff // renamed from expelStudent
        }}>
            {children}
        </StaffContext.Provider>
    );
};

export const useStaff = () => useContext(StaffContext);