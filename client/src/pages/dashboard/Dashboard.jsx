import React, { useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { 
  Building2, School, Briefcase, ChevronDown, 
  Home, LayoutGrid, Megaphone, Zap, FileText, 
  Wrench, DollarSign, LayoutDashboard, Users, 
  UserRoundCheck, GraduationCap, Wallet, Bus, 
  FileSpreadsheet, CalendarDays, ClipboardCheck, 
  Tablets, Users2, Settings, Menu, X,
  ArrowLeftRight,
  Target,
  Receipt,
} from 'lucide-react';

import { BuildingManagement } from './building-management/BuildingManagement';
import { SchoolManagement } from './school-management/SchoolDashboard';
import HotelManagement from './hotel-management/HotelManagement';
import ProductivityManagement from './productivity-management/ProductivityManagement';
import InventoryManagement from './inventory-management/InventoryManagement';
import JobManagement from './job-application-management/JobManagement';
import PersonalFinanceManagement from './personal-finance-management/PersonalFinanceManagement';

const sidebars = {
  building: [
    { name: 'Overview', slug: 'building/overview', icon: <Home size={18} /> },
    { name: 'Units & Inventory', slug: 'building/units', icon: <LayoutGrid size={18} /> },
    { name: 'Tenants', slug: 'building/tenants', icon: <Users size={18} /> },
    { name: 'Payments & Accounting', slug: 'building/finance', icon: <DollarSign size={18} /> },
    { name: 'Maintenance', slug: 'building/maintenance', icon: <Wrench size={18} /> },
    { name: 'Documents & Leases', slug: 'building/documents', icon: <FileText size={18} /> },
    { name: 'Utility Tracking', slug: 'building/utilities', icon: <Zap size={18} /> },
    { name: 'Marketing / Leads', slug: 'building/marketing', icon: <Megaphone size={18} /> },
  ],
  school: [
    { name: 'Dashboard', slug: 'school/overview', icon: <LayoutDashboard size={18} /> },
    { name: 'Students (1-12)', slug: 'school/students', icon: <Users size={18} /> },
    { name: 'Faculty & Staff', slug: 'school/teachers', icon: <UserRoundCheck size={18} /> },
    { name: 'Academic & Exams', slug: 'school/exams', icon: <GraduationCap size={18} /> },
    { name: 'Fee Management', slug: 'school/fees', icon: <Wallet size={18} /> },
    { name: 'Attendance', slug: 'school/attendance', icon: <ClipboardCheck size={18} /> },
    { name: 'Transport Fleet', slug: 'school/transport', icon: <Bus size={18} /> },
    { name: 'Report Cards', slug: 'school/documents', icon: <FileSpreadsheet size={18} /> },
    { name: 'School Events', slug: 'school/events', icon: <CalendarDays size={18} /> },
  ],
  project: [
    { name: 'Overview', slug: 'building/overview', icon: <Home size={18} /> },
    { name: 'Units & Inventory', slug: 'building/units', icon: <LayoutGrid size={18} /> },
    { name: 'Tenants', slug: 'building/tenants', icon: <Users size={18} /> },
  ],
  hotel: [
    { name: 'Dashboard', slug: 'hotel/overview', icon: <Home size={18} /> },
    { name: 'Front Desk', slug: 'hotel/front-desk', icon: <LayoutGrid size={18} /> },
    { name: 'Guests', slug: 'hotel/guests', icon: <Users size={18} /> },
    { name: 'Rooms', slug: 'hotel/rooms', icon: <DollarSign size={18} /> },
    { name: 'Deals', slug: 'hotel/deals', icon: <Wrench size={18} /> },
    { name: 'Rate', slug: 'hotel/rate', icon: <FileText size={18} /> },
    { name: 'Worker', slug: 'hotel/worker', icon: <Users2 size={18} /> },
  ],
  productivity: [
    { name: 'Dashboard', slug: 'productivity/overview', icon: <Home size={18} /> },
    { name: 'Tasks', slug: 'productivity/tasks', icon: <LayoutGrid size={18} /> },
    { name: 'performance', slug: 'productivity/performance', icon: <Users size={18} /> },
    { name: 'Teams', slug: 'productivity/teams', icon: <Users2 size={18} /> },
    { name: 'Settings', slug: 'productivity/settings', icon: <Settings size={18} /> },
  ],
   inventory: [
    { name: 'Dashboard', slug: 'inventory/overview', icon: <Home size={18} /> },
    { name: 'Products', slug: 'inventory/products', icon: <LayoutGrid size={18} /> },
    { name: 'performance', slug: 'inventory/performance', icon: <Users size={18} /> },
    { name: 'Teams', slug: 'inventory/teams', icon: <Users2 size={18} /> },
    { name: 'Settings', slug: 'inventory/settings', icon: <Settings size={18} /> },
  ],
  job: [
    { name: 'Dashboard', slug: 'job/overview', icon: <Home size={18} /> },
    { name: 'Job List', slug: 'job/jobs', icon: <LayoutGrid size={18} /> },
    { name: 'Job Status', slug: 'job/status', icon: <LayoutGrid size={18} /> },
    { name: 'performance', slug: 'job/performance', icon: <Users size={18} /> },
    { name: 'Teams', slug: 'job/teams', icon: <Users2 size={18} /> },
    { name: 'Applyed', slug: 'job/admin', icon: <Users2 size={18} /> },
    { name: 'Settings', slug: 'job/settings', icon: <Settings size={18} /> },
    { name: 'Campaign', slug: 'job/campaign', icon: <Settings size={18} /> },
  ],
  finance: [
  { 
    name: 'Overview', 
    slug: 'finance/overview', 
    icon: <LayoutDashboard size={18} /> 
  },
  { 
    name: 'Transactions', 
    slug: 'finance/transactions', 
    icon: <ArrowLeftRight size={18} /> 
  },
  { 
    name: 'Expenses', // Corrected spelling from 'Expence'
    slug: 'finance/expenses', 
    icon: <Receipt size={18} /> 
  },
  { 
    name: 'Goals', 
    slug: 'finance/goals', 
    icon: <Target size={18} /> 
  },
  { 
    name: 'Accounts', // Renamed from 'Balance' for better UX (viewing balances per account)
    slug: 'finance/accounts', 
    icon: <Wallet size={18} /> 
  },
  { 
    name: 'Settings', 
    slug: 'finance/settings', 
    icon: <Settings size={18} /> 
  },
],
};

function Dashboard() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { mode, page } = useParams();
  const currentMode = mode || 'building';

  const managementTypes = [
    { id: 'building', label: 'Building Management', icon: <Building2 size={20} className="text-blue-400" /> },
    { id: 'school', label: 'School Management', icon: <School size={20} className="text-emerald-400" /> },
    { id: 'project', label: 'Project Management', icon: <Briefcase size={20} className="text-amber-400" /> },
    { id: 'hotel', label: 'Hotel Management', icon: <Briefcase size={20} className="text-amber-400" /> },
    { id: 'productivity', label: 'Productivity Management', icon: <Tablets size={20} className="text-amber-400" /> },
     { id: 'inventory', label: 'Inventory Management', icon: <Tablets size={20} className="text-amber-400" /> },
      { id: 'job', label: 'Job Management', icon: <Tablets size={20} className="text-amber-400" /> },
      { id: 'finance', label: 'Personal Finance Management', icon: <DollarSign size={20} className="text-amber-400" /> },
  ];

  const handleModeChange = (typeId) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/dashboard/${typeId}/overview`);
  };

  const SidebarContent = () => (
    <>
      <div className="relative p-4 border-b border-slate-800">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              {managementTypes.find(t => t.id === currentMode)?.icon}
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none mb-1">Workspace</p>
              <p className="text-sm font-bold text-slate-200 capitalize">{currentMode} Manager</p>
            </div>
          </div>
          <ChevronDown size={16} className={`text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-4 right-4 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            {managementTypes.map((type) => (
              <button 
                key={type.id} 
                onClick={() => handleModeChange(type.id)} 
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-sm font-medium border-b border-slate-700 last:border-0"
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className='flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar'>
        <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Menu</p>
        {sidebars[currentMode]?.map((item) => (
          <NavLink 
            key={item.slug} 
            to={`/dashboard/${item.slug}`} 
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[inset_0px_0px_10px_rgba(79,70,229,0.1)]' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`
            }
          >
            {item.icon}
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <div className='flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans relative'>
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            {managementTypes.find(t => t.id === currentMode)?.icon}
          </div>
          <span className="font-bold text-sm capitalize">{currentMode}</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className='hidden lg:flex w-72 border-r border-slate-800 bg-slate-900 flex-col z-20'>
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileMenuOpen && (
        <aside className='fixed inset-0 bg-slate-900 z-40 flex flex-col lg:hidden pt-16 animate-in slide-in-from-left duration-300'>
          <SidebarContent />
        </aside>
      )}

      {/* CONTENT AREA */}
      <main className='flex-1 flex flex-col overflow-hidden bg-slate-950 mt-16 lg:mt-0'>
        <div className='flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar'>
          <div className="max-w-6xl mx-auto">
            {currentMode === 'building' && <BuildingManagement subPage={page} />}
            {currentMode === 'school' && <SchoolManagement subPage={page}/>}
            {currentMode === 'hotel' && <HotelManagement subPage={page}/>}
            {currentMode === 'productivity' && <ProductivityManagement subPage={page}/>}
            {currentMode === 'inventory' && <InventoryManagement subPage={page}/>}
            {currentMode === 'job' && <JobManagement subPage={page}/>}
            {currentMode === 'finance' && <PersonalFinanceManagement subPage={page}/>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;