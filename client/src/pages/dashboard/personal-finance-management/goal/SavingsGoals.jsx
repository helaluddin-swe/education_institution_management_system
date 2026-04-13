import React, { useState, useEffect } from 'react';
import { 
  Target, TrendingUp, Edit3, Plus, Trash2, Home, Utensils, 
  Car, Film, ShoppingBag, Grid, Loader2, X, Check, ArrowUpRight, Save, Shield, Heart, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

// Helper moved inside or imported to handle string -> JSX conversion
export const getIcon = (iconName, size = 20) => {
  const icons = {
    home: <Home size={size} />,
    utensils: <Utensils size={size} />,
    car: <Car size={size} />,
    film: <Film size={size} />,
    shopping: <ShoppingBag size={size} />,
    grid: <Grid size={size} />,
    shield: <Shield size={size} />,
    heart: <Heart size={size} />,
    zap: <Zap size={size} />,
    target: <Target size={size} />
  };
  return icons[iconName] || <Grid size={size} />;
};

const SavingsGoals = ({ goals, setGoals }) => {
  const [loading, setLoading] = useState(true);
  const [activeGoalId, setActiveGoalId] = useState(goals[0]?.id);
  
  const currentGoal = goals.find(g => g.id === activeGoalId) || goals[0];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // --- GOAL CRUD ---
  const handleAddGoal = () => {
    const newGoal = {
      id: `G-${Math.random().toString(36).substr(2, 4)}`,
      title: "New Strategic Goal",
      target: 5000,
      achieved: 0,
      status: "Early Stage",
      categories: []
    };
    setGoals([...goals, newGoal]);
    setActiveGoalId(newGoal.id);
    toast.success("New Goal Created");
  };

  const handleDeleteGoal = (id) => {
    if (window.confirm("Delete this entire goal?")) {
      const updated = goals.filter(g => g.id !== id);
      setGoals(updated);
      if (activeGoalId === id) setActiveGoalId(updated[0]?.id);
      toast.error("Goal Removed");
    }
  };

  const updateCurrentGoal = (updates) => {
    setGoals(goals.map(g => g.id === activeGoalId ? { ...g, ...updates } : g));
  };

  // --- CATEGORY CRUD ---
  const handleAddCategory = () => {
    const newCat = {
      id: Date.now(),
      name: "New Category",
      amount: 0,
      iconName: 'grid',
      color: 'bg-slate-500',
      trend: 'Stable'
    };
    updateCurrentGoal({ categories: [...currentGoal.categories, newCat] });
    toast.success("Category Added");
  };

  const handleDeleteCategory = (catId) => {
    const filtered = currentGoal.categories.filter(c => c.id !== catId);
    updateCurrentGoal({ categories: filtered });
    toast.error("Category Removed");
  };

  // --- RECHARTS CONFIG ---
  const pieData = currentGoal?.categories?.length > 0 
    ? currentGoal.categories.map(cat => ({ name: cat.name, value: cat.amount }))
    : [{ name: 'Empty', value: 1 }];

  const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#10b981', '#64748b'];
  const progress = (currentGoal?.achieved / currentGoal?.target) * 100;

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={42} />
      <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Admin Panel</p>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#F4F7FE] min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* TOP NAVIGATION */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-wrap items-center gap-3">
        {goals.map((g) => (
          <div key={g.id} className="flex items-center group">
            <button 
              onClick={() => setActiveGoalId(g.id)}
              className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all border ${
                activeGoalId === g.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {g.title}
            </button>
            <button onClick={() => handleDeleteGoal(g.id)} className="ml-2 p-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button onClick={handleAddGoal} className="p-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all">
          <Plus size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: LIVE METRICS & EDITING */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Goal Settings</h3>
              <Edit3 size={16} className="text-slate-300" />
            </div>

            <input 
              className="text-2xl font-black text-slate-900 w-full bg-transparent outline-none mb-2 focus:border-b-2 border-indigo-500"
              value={currentGoal?.title}
              onChange={(e) => updateCurrentGoal({ title: e.target.value })}
            />

            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-3xl font-black text-slate-800">{Math.round(progress || 0)}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Reached</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
               <div className="p-4 bg-slate-50 rounded-2xl flex justify-between">
                 <span className="text-xs font-bold text-slate-400">TARGET</span>
                 <input 
                    type="number"
                    className="bg-transparent font-black text-right outline-none w-24"
                    value={currentGoal?.target}
                    onChange={(e) => updateCurrentGoal({ target: parseInt(e.target.value) || 0 })}
                 />
               </div>
               <div className="p-4 bg-indigo-50/50 rounded-2xl flex justify-between">
                 <span className="text-xs font-bold text-indigo-400">ACHIEVED</span>
                 <input 
                    type="number"
                    className="bg-transparent font-black text-right outline-none w-24 text-indigo-600"
                    value={currentGoal?.achieved}
                    onChange={(e) => updateCurrentGoal({ achieved: parseInt(e.target.value) || 0 })}
                 />
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CATEGORY CRUD GRID */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-white min-h-[400px]">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-800">Category Allocations</h2>
                <button onClick={handleAddCategory} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">
                  <Plus size={14}/> Add Category
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentGoal?.categories?.map((cat) => (
                  <div key={cat.id} className="p-5 border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl ${cat.color} text-white flex items-center justify-center`}>
                          {/* UPDATED: Calling the getIcon helper with string iconName */}
                          {getIcon(cat.iconName)}
                       </div>
                       <div>
                          <input 
                            className="text-[10px] font-black text-slate-400 uppercase bg-transparent outline-none block w-full"
                            value={cat.name}
                            onChange={(e) => {
                              const newCats = currentGoal.categories.map(c => c.id === cat.id ? {...c, name: e.target.value} : c);
                              updateCurrentGoal({ categories: newCats });
                            }}
                          />
                          <div className="flex items-center">
                            <span className="text-slate-800 font-black">$</span>
                            <input 
                              type="number"
                              className="text-lg font-black text-slate-800 bg-transparent outline-none w-20"
                              value={cat.amount}
                              onChange={(e) => {
                                const newCats = currentGoal.categories.map(c => c.id === cat.id ? {...c, amount: parseInt(e.target.value) || 0} : c);
                                updateCurrentGoal({ categories: newCats });
                              }}
                            />
                          </div>
                       </div>
                    </div>
                    
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                       <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
             </div>

             {/* TREND CHART */}
             <div className="mt-10 h-48 w-full bg-slate-50 rounded-3xl p-4">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[{n: 'W1', v: 400}, {n: 'W2', v: 700}, {n: 'W3', v: 600}, {n: 'W4', v: 1200}]}>
                   <defs>
                     <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <Area type="monotone" dataKey="v" stroke="#6366f1" fillOpacity={1} fill="url(#colorPv)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SavingsGoals;