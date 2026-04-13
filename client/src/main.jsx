import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'

import { HelmetProvider } from 'react-helmet-async'
import ThemeContextProvider from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { StudentProvider } from './context/StudentContext.jsx'



const container = document.getElementById('root')

createRoot(container).render(
  <ThemeContextProvider>
    <HelmetProvider>
      <BrowserRouter>
       <AuthProvider>  
        <StudentProvider> 
          <App />
          </StudentProvider>
       </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </ThemeContextProvider>

)
