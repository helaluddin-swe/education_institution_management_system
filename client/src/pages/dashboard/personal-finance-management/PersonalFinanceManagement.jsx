import React, { useState, useMemo } from 'react';
import { Plus, Layout, CheckCircle, Users } from 'lucide-react';

import { taskData } from './tasks/tasksUtils';
import FinanceOverview from './overview/FinanceOverview';
import TransactionsList from './transaction/TransactionsList';
import ExpenseTracker from './expense/ExpenseTracker';
import SavingsGoals from './goal/SavingsGoals';
import AccountBalances from './balance/AccountBalances';
import FinanceSettings from './settings/FinanceSettings';
import { GOALS_DATABASE } from './goal/data';

const PersonalFinanceManagement = ({ subPage }) => {
  const[goals,setGoals]=useState(GOALS_DATABASE)
  // --- GLOBAL STATES ---
  const [tasks, setTasks] = useState(taskData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- DERIVED ANALYTICS (Global) ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const efficiency = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, efficiency };
  }, [tasks]);

  // --- CONTENT ROUTING ---
  const renderContent = () => {
    switch (subPage) {
      case 'overview':
        return <FinanceOverview />;

      case 'transactions':
        return <TransactionsList />;

      case 'expenses':
        return <ExpenseTracker />;

      case 'goals':
        return <SavingsGoals goals={goals} setGoals={setGoals} />;

      case 'accounts':
        return <AccountBalances />;

      case 'settings':
        return <FinanceSettings />;

      default:
        return <FinanceOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white capitalize tracking-tight">
            {subPage === 'dashboard' || !subPage ? 'Productivity Hub' : `${subPage} Center`}
          </h2>
          <p className="text-slate-400 text-[10px] tracking-widest font-black uppercase mt-1">
            System Status: <span className="text-emerald-400">Optimized</span> • March 2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* QUICK ACTION BUTTON */}
          {(subPage === 'tasks' || subPage === 'dashboard') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus size={16} strokeWidth={3} /> Create New Task
            </button>
          )}

          {/* GLOBAL STATS BADGES */}
          <div className="hidden lg:flex gap-2">
            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                <Layout size={14} className="text-indigo-400" />
              </div>
              <div className="leading-tight">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Workload</p>
                <p className="text-xs text-white font-bold">{stats.pending} Pending</p>
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <CheckCircle size={14} className="text-emerald-400" />
              </div>
              <div className="leading-tight">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Efficiency</p>
                <p className="text-xs text-white font-bold">{stats.efficiency}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="min-h-[70vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </div>



    </div>
  );
};

export default PersonalFinanceManagement