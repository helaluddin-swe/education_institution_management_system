import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Use the correct base URL from your env or fallback
  const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5174").replace(/\/$/, "");
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Axios Global Config & Interceptors ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Response interceptor to handle token expiration (401)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleForceLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const handleForceLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    // Only redirect if not already on login/register pages
    if (!window.location.pathname.includes('/login')) {
      navigate('/login');
    }
  };

  // 1. Initial Load: Re-verify session with the /me route
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Use the new /me route we added to the controller
          const res = await axios.get(`${backendUrl}/api/user/me`);
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error("Auth initialization failed");
          handleForceLogout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [backendUrl]);

  // 2. Register User
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/register`, formData);
      const { token, user: userData } = res.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      toast.success(`Welcome, ${userData.name}!`);
      navigate(`/dashboard/${userData.role}/overview`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. Login User
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate(`/dashboard/${userData.role}/overview`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 4. Update Profile
  const updateProfile = async (updatedData) => {
    try {
      const res = await axios.put(`${backendUrl}/api/user/profile`, updatedData);
      if (res.data.success) {
        // Sync the whole user object including populated profile
        setUser(res.data.user);
        toast.success("Profile updated!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
      throw err;
    }
  };

  // 5. Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success("Logged out");
    navigate('/login');
  };

  // 6. Delete Account (Admin or Self)
  const deleteAccount = async (targetUserId) => {
    const idToDelete = targetUserId || user._id;
    if (!window.confirm("Permanent action: Delete this account?")) return;
    
    try {
      const res = await axios.delete(`${backendUrl}/api/user/${idToDelete}`);
      if (res.data.success) {
        toast.success("Account deleted");
        if (idToDelete === user._id) logout();
      }
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    isAuthenticated: !!user,
    userRole: user?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="h-screen w-full flex items-center justify-center bg-slate-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};