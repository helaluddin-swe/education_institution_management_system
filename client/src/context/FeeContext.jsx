import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import { useAuth } from './AuthContext';


const FeesContext = createContext();

export const FeesContextProvider = ({ children }) => {
  const { backendUrl, isLoggedIn } = useAuth();
  const [fees, setFees] = useState([]);
  const [isTenantsLoading, setIsTenantsLoading] = useState(false);

  // Helper to get auth headers from localStorage
  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }, []);

  // --- FETCH ALL TENANTS ---
  const fetchTenants = useCallback(async () => {
    if (!isLoggedIn || !backendUrl) return;

    setIsTenantsLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/tenant`, getAuthConfig());

      if (data.success) {
        setTenants(data.data);
      }
    } catch (error) {
      console.error("Fetch Tenants Error:", error);
      if (error.response?.status === 401) setTenants([]);
    } finally {
      setIsTenantsLoading(false);
    }
  }, [backendUrl, isLoggedIn, getAuthConfig]);

  // Initial Fetch & Auth Sync
  useEffect(() => {
    if (isLoggedIn) {
      fetchTenants();
    } else {
      setTenants([]);
    }
  }, [fetchTenants, isLoggedIn]);

  // --- ADD NEW TENANT ---
  const addTenant = async (tenantData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/tenant`, tenantData, getAuthConfig());

      if (data.success) {
        // Add to the top of the list for immediate UI feedback
        setTenants((prev) => [data.data, ...prev]);
        toast.success("নতুন টেন্যান্ট যুক্ত করা হয়েছে!");
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || "টেন্যান্ট যুক্ত করতে ব্যর্থ হয়েছে");
      return false;
    }
  };

  // --- UPDATE TENANT ---
const updateTenant = async (id, updatedData) => {
  try {
    const token = localStorage.getItem('token');
    
    // Ensure we are hitting the correct endpoint and passing the token
    const { data } = await axios.put(
      `${backendUrl}/api/tenant/${id}`, 
      updatedData, 
      { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }
    );

    if (data.success) {
      // Update the local state instantly with the fresh data from the DB
      setTenants((prevTenants) => 
        prevTenants.map((tenant) => 
          tenant._id === id ? data.data : tenant
        )
      );

      // If a tenant is currently selected in a modal, you might want to update that too
      // setSelectedTenant(data.data); 

      toast.success("Billing records updated successfully");
      return true;
    } else {
      toast.error(data.message || "Update failed");
      return false;
    }
  } catch (error) {
    console.error("Error updating tenant:", error);
    const errorMsg = error.response?.data?.message || "Failed to update records";
    toast.error(errorMsg);
    return false;
  }
};

  // --- DELETE TENANT ---
  const deleteTenant = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/tenant/${id}`, getAuthConfig());

      if (data.success) {
        // Filter out the deleted tenant using both ID types
        setTenants(prev => prev.filter(t => t._id !== id && t.id !== id));
        toast.success("টেন্যান্ট রিমুভ করা হয়েছে");
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "ডিলিট করা সম্ভব হয়নি");
      return false;
    }
  };

  // Memoize value to prevent unnecessary re-renders of consuming components
  const value = useMemo(() => ({
    tenants,
    isTenantsLoading,
    fetchTenants,
    addTenant,
    updateTenant,
    deleteTenant
  }), [tenants, isTenantsLoading, fetchTenants]);

  return <FeesContext.Provider value={value}>{children}</FeesContext.Provider>;
};

export const useFees = () => {
  const context = useContext(FeesContext);
  if (!context) throw new Error("useTenants must be used within TenantContextProvider");
  return context;
};