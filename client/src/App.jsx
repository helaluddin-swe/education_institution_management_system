import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/home/Home';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import Dashboard from './pages/dashboard/Dashboard';
import UnitsDetails from './pages/dashboard/building-management/components/UnitsDetails';
import UnitLists from './pages/dashboard/building-management/components/UnitsList';
import Campaign from './pages/dashboard/job-application-management/campaign/Campaign';
import { jobsData } from './pages/dashboard/job-application-management/jobs/jobsUtils';
import SchoolLandingPage from './pages/dashboard/school-management/home/Home';
import FinanceLandingPage from './pages/dashboard/personal-finance-management/LandingPage';

const App = () => {
  return (
    <div className='flex flex-col justify-between min-h-screen'>
      <Toaster position="top-right" reverseOrder={false} />

      <div> 
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<Home />} />
          
          {/* DASHBOARD ROUTES */}
          {/* Redirect base /dashboard to building overview */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/building/overview" />} />
          
          {/* This path captures both the mode (building/school/project) and the specific page */}
          <Route path="/dashboard/:mode/:page" element={<Dashboard />} />
          
          {/* Fallback for dashboard if page is missing */}
          <Route path="/dashboard/:mode" element={<Dashboard />} />
          {/* building section */}
          <Route path='/building/units' element={<UnitLists/>}/>
          <Route path='/school' element={<SchoolLandingPage/>}/>
          <Route path='/finance' element={<FinanceLandingPage/>}/>
          <Route path='/building/units/:id' element={<UnitsDetails/>}/>
          <Route path='/jobs/:id' element={<Campaign job={jobsData}/>}/>


          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;