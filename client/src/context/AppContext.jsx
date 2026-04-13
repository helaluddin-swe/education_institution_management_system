import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Recommended for cleaner API calls

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5174").replace(/\/$/, "");

    // --- State Management ---
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- Auth Logic ---
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/login');
    }, [navigate]);

    // Initial Load: Check for existing session
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                // Example: Fetch user profile using the token
                // const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
                //     headers: { Authorization: `Bearer ${token}` }
                // });
                // setUserData(data.user);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Auth initialization failed", error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [backendUrl, logout]);

    // --- Utils ---
    const slugify = useCallback((text) => {
        return text?.toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w-]+/g, '')  // Remove all non-word chars
            .replace(/--+/g, '-')     // Replace multiple - with single -
            .slice(0, 50);
    }, []);

    const contextValue = {
        backendUrl, 
        userData, setUserData, 
        isLoggedIn, setIsLoggedIn, 
        isLoading,
        logout,
        slugify, 
        navigate,
    };

    // --- Loading UI ---
    if (isLoading) {
        return (
            <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
                    Initializing System
                </p>
            </div>
        );
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};