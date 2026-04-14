import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allLogs, setAllLogs] = useState([]);

  // Setup base URL and ensure no trailing slash
  const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5174").replace(/\/$/, "");

  /**
   * Helper to clear errors from the UI
   */
  const clearError = () => setError(null);

  /**
   * CREATE / UPDATE: Mark attendance for a specific date
   * Handles the "upsert" logic on the backend
   */
  const markStudentAttendance = async (attendanceData) => {
    // attendanceData: { studentId, status, date, remarks }
    setLoading(true);
    clearError();
    try {
      const response = await axios.post(`${backendUrl}/api/attendance/mark`, attendanceData);
      
      // If we are currently looking at all logs, refresh them to keep UI in sync
      if (allLogs.length > 0) fetchAllLogs();
      
      return { success: true, data: response.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to mark attendance";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * READ: Fetch full attendance history for a single student
   */
  const fetchStudentReport = useCallback(async (studentId) => {
    setLoading(true);
    clearError();
    try {
      const response = await axios.get(`${backendUrl}/api/attendance/${studentId}`);
      return response.data.data; // Returns the full attendance document
    } catch (err) {
      console.error("Error fetching student report:", err);
      setError("Could not load student attendance history");
      return null;
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  /**
   * READ: Get all attendance logs (Admin Dashboard view)
   */
  const fetchAllLogs = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const res = await axios.get(`${backendUrl}/api/attendance`);
      setAllLogs(res.data.data);
    } catch (err) {
      setError("Failed to fetch all attendance logs");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  /**
   * DELETE: Remove a specific record entry
   */
  const deleteRecord = async (studentId, recordId) => {
    setLoading(true);
    clearError();
    try {
      await axios.delete(`${backendUrl}/api/attendance/${studentId}/${recordId}`);
      
      // Update local state if logs are loaded
      setAllLogs(prev => prev.filter(log => log._id !== recordId));
      
      return { success: true };
    } catch (err) {
      setError("Failed to delete record");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider 
      value={{ 
        markStudentAttendance, 
        fetchStudentReport, 
        deleteRecord,
        fetchAllLogs,
        allLogs,
        loading,
        error,
        clearError
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);