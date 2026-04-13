import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx'
import { BrowserRouter } from 'react-router-dom'

import { HelmetProvider } from 'react-helmet-async'
import ThemeContextProvider from './context/ThemeContext.jsx'



const container = document.getElementById('root')

createRoot(container).render(
  <ThemeContextProvider>
    <HelmetProvider>
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </HelmetProvider>
  </ThemeContextProvider>

)
