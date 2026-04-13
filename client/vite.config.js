import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: [
      'recharts', 
      'recharts/lib/chart/AreaChart', 
      'recharts/lib/chart/RadialBarChart',
      'lucide-react',
      'axios',
      'react-hot-toast',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction'
    ],
  },
})