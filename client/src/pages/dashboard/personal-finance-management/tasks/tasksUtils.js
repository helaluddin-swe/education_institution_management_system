export const formatTime = (totalSeconds) => {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
export const taskData = [
  // --- MARCH (Current View) ---
  { 
    id: 1, 
    title: 'Schedule post Dusk&Dawn', 
    category: 'Marketing', 
    priority: 'High', 
    completed: true, 
    date: 'Mar 28', 
    spentTime: 3600 
  },
  { 
    id: 2, 
    title: 'Design post for Holi', 
    category: 'Design', 
    priority: 'Medium', 
    completed: true, 
    date: 'Mar 29', 
    spentTime: 7200 
  },
  { 
    id: 3, 
    title: 'Client Review Meeting', 
    category: 'Planning', 
    priority: 'High', 
    completed: false, 
    date: 'Mar 30', 
    spentTime: 1800 
  },
  { 
    id: 4, 
    title: 'Database Schema Finalization', 
    category: 'Development', 
    priority: 'High', 
    completed: false, 
    date: 'Mar 31', 
    spentTime: 0 
  },

  // --- APRIL (Future/Monthly View) ---
  { 
    id: 5, 
    title: 'Brainstorming new project', 
    category: 'Development', 
    priority: 'High', 
    completed: false, 
    date: 'Apr 01', 
    spentTime: 1200 
  },
  { 
    id: 6, 
    title: 'Re-Branding Discussion', 
    category: 'Design', 
    priority: 'Low', 
    completed: false, 
    date: 'Apr 02', 
    spentTime: 0 
  },
  { 
    id: 7, 
    title: 'Monthly Newsletter Draft', 
    category: 'Marketing', 
    priority: 'Medium', 
    completed: false, 
    date: 'Apr 05', 
    spentTime: 0 
  },
  { 
    id: 8, 
    title: 'App Security Audit', 
    category: 'Development', 
    priority: 'High', 
    completed: false, 
    date: 'Apr 10', 
    spentTime: 0 
  }
];

