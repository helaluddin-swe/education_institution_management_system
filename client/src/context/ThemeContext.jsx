import { useEffect, useState, createContext, useContext } from 'react';

const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  // 1. Initialize theme: Check localStorage, then system preference, default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    
    // Check if user's OS prefers dark mode
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      // Using CSS variables or direct styles as you requested
      document.body.style.backgroundColor = "#020617"; // Matches your Slate-950 color
      document.body.style.color = "#ffffff";
    } else {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#0f172a"; // Slate-900 for better readability
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 2. Optimized toggle function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const themeValue = {
    toggleTheme,
    isDarkMode: theme === 'dark',
    theme // Exporting the raw string in case you need it
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

// 3. Custom hook for easy consumption
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
};