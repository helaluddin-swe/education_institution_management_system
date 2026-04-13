import React, { useState, useEffect, useRef } from 'react';
import { TimerCard, AnalyticsCard, TaskRow } from '../tasks/TaskComponent';

import AddNewTask from '../tasks/AddNewTask';
import TaskHeader from '../tasks/Taskheader';
import { toast } from "react-hot-toast"

const Tasks = ({tasks,setTasks}) => {
  // --- State Management ---
 
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [viewMode, setViewMode] = useState('Daily');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('Mar 28');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Design',
    priority: 'Medium',
    date: selectedDate
  });

  const timerRef = useRef(null);

  // --- Timer Logic ---
  useEffect(() => {
    if (activeTaskId) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [activeTaskId]);

  const startTask = (id) => {
    if (activeTaskId === id) return;
    if (activeTaskId) stopTask();
    setActiveTaskId(id);
    toast.success("Start Traking Timer Successfull")
    setTimerSeconds(0);
  };

  const stopTask = () => {
    if (activeTaskId) {
      setTasks(prev => prev.map(t =>
        t.id === activeTaskId ? { ...t, spentTime: (t.spentTime || 0) + timerSeconds } : t
      ));
    }
    setActiveTaskId(null);
    setTimerSeconds(0);
    toast.success("Stop Traking Timer Successfull")
  };

  // --- Filter Logic ---
  const getFilteredTasks = () => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Daily: Exact date match
      if (viewMode === 'Daily') {
        return t.date === selectedDate && matchesSearch;
      }

      // Monthly: Match the month prefix (e.g., "Mar")
      if (viewMode === 'Monthly') {
        const currentMonth = selectedDate.split(' ')[0];
        return t.date.startsWith(currentMonth) && matchesSearch;
      }

      // Weekly: For this mockup, we show tasks for the current 7-day range
      // (Assuming week of Mar 27 - Apr 02 based on previous context)
      const weeklyRange = ['Mar 27', 'Mar 28', 'Mar 29', 'Mar 30', 'Mar 31', 'Apr 01', 'Apr 02'];
      if (viewMode === 'Weekly') {
        return weeklyRange.includes(t.date) && matchesSearch;
      }

      return matchesSearch;
    });
  };

  const displayTasks = getFilteredTasks();

  // --- Analytics Logic (Calculated based on displayTasks) ---
  const categoryTotals = displayTasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + (task.spentTime || 0);
    return acc;
  }, {});

  const totalSpentTime = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const pieData = Object.entries(categoryTotals).map(([label, value], index) => ({
    label,
    value,
    color: ['#6366F1', '#F59E0B', '#10B981', '#EC4899'][index % 4],
    percentage: totalSpentTime > 0 ? (value / totalSpentTime) * 100 : 0
  }));

  // --- CRUD Handlers ---
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...formData } : t));
      toast.success("Updated Task Successfull")
    } else {
      const newTask = {
        id: Date.now(),
        ...formData, // This now includes formData.date from the React Calendar
        completed: false,
        spentTime: 0,
      };
      setTasks([newTask, ...tasks]);
      toast.success("New Task Added Successfull")
    }
    closeModal();
  };

  const deleteTask = (id) => {
    if (activeTaskId === id) stopTask();
    setTasks(tasks.filter(t => t.id !== id));
    toast.success("Delete Task Successfull")
  };

  const toggleComplete = (id) => {
    if (!id) {
      toast.error("Invalid Task ID");
      return;
    }

    setTasks(prevTasks =>
      prevTasks.map(t => {
        if (t.id === id) {
          const newStatus = !t.completed;

          // Dynamic Toast based on the NEW status
          if (newStatus) {
            toast.success("Task marked as completed! 🎉");
          } else {
            toast.remove("Task moved back to active");
          }

          return { ...t, completed: newStatus };
        }
        return t;
      })
    );
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, category: task.category, priority: task.priority });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setFormData({ title: '', category: 'Design', priority: 'Medium' });
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto bg-[#FDFDFF] min-h-screen">

      {/* 1. Header Section with View Toggles & Search */}
      <TaskHeader
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddNew={() => setIsModalOpen(true)}
        title="Tasks"
      />

      {/* 2. Task List Container */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-50 overflow-hidden divide-y divide-slate-50">
        {displayTasks.length > 0 ? (
          displayTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              isActive={activeTaskId === task.id}
              showDate={viewMode !== 'Daily'} // Shows date badge in Weekly/Monthly views
              onToggle={toggleComplete}
              onStart={startTask}
              onEdit={openEditModal}
              onDelete={deleteTask}
            />
          ))
        ) : (
          <div className="p-20 text-center text-slate-400 font-medium italic">
            No tasks found for this {viewMode.toLowerCase()} period.
          </div>
        )}
      </div>

      {/* 3. Analytics and Timer Section (Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
        <TimerCard
          activeTask={tasks.find(t => t.id === activeTaskId)}
          timerSeconds={timerSeconds}
          onStop={stopTask}
        />
        <AnalyticsCard
          pieData={pieData}
          totalSpentTime={totalSpentTime}
          viewMode={viewMode}
        />
      </div>

      {/* 4. Task Form Modal */}
      {isModalOpen && (
        <AddNewTask
          editingTask={editingTask}
          closeModal={closeModal}
          formData={formData}
          setFormData={setFormData}
          handleSaveTask={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Tasks;