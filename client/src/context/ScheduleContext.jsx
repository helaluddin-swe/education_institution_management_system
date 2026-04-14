import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const token = localStorage.getItem("token");
  const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5174").replace(/\/$/, "");

  // --- API Configuration ---
  const api = axios.create({
    baseURL: `${backendUrl}/api/schedules`,
  });

  api.interceptors.request.use((config) => {
    const latestToken = localStorage.getItem("token");
    if (latestToken) {
      config.headers.Authorization = `Bearer ${latestToken}`;
    }
    return config;
  }, (error) => Promise.reject(error));

  /**
   * Fetch Schedules
   */
  const fetchSchedules = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await api.get('/');
      
      const formattedEvents = data.map(item => ({
        id: item._id,
        title: `${item.subject} - ${item.className}${item.section}`,
        start: item.start,
        end: item.end,
        backgroundColor: item.backgroundColor,
        borderColor: item.borderColor,
        extendedProps: {
          category: item.category,
          className: item.className,
          section: item.section,
          subject: item.subject,
          topics: item.topics,
          description: item.description,
          // UPDATED: Now using employeeId as per your new schema
          employeeId: item.employeeId?._id, 
          instructorName: item.employeeId?.fullName || item.employeeId?.name, 
          createdBy: item.createdBy?.name
        }
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching schedules:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  /**
   * Fetch Teachers
   */
  const fetchTeachers = useCallback(async () => {
    if (!token || user?.role !== 'admin') return;
    try {
      // Ensure this endpoint returns the TeacherProfile documents
      const { data } = await axios.get(`${backendUrl}/api/staff/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }, [token, user, backendUrl]);

  /**
   * Add Schedule
   */
  const addSchedule = async (scheduleData) => {
    try {
      // Ensure scheduleData contains 'employeeId'
      const { data } = await api.post('/', scheduleData);
      await fetchSchedules(); 
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to create schedule" 
      };
    }
  };

  /**
   * Update Schedule
   */
  const updateSchedule = async (id, updateData) => {
    try {
      const { data } = await api.put(`/${id}`, updateData);
      await fetchSchedules();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Update failed" 
      };
    }
  };

  /**
   * Delete Schedule
   */
  const deleteSchedule = async (id) => {
    try {
      await api.delete(`/${id}`);
      setEvents(prev => prev.filter(event => event.id !== id));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Delete failed" 
      };
    }
  };

  useEffect(() => {
    if (token) {
      fetchSchedules();
      fetchTeachers();
    }
  }, [token, fetchSchedules, fetchTeachers]);

  return (
    <ScheduleContext.Provider value={{
      events,
      teachers,
      loading,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      refreshSchedules: fetchSchedules
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);