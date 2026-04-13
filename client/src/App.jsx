import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/home/Home';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import Dashboard from './pages/dashboard/Dashboard';
import SchoolLandingPage from './pages/dashboard/school-management/home/Home';
import { useAuth } from './context/AuthContext';
import StudentProfile from './pages/dashboard/admin/components/StudentProfile';
import StudentProfileDetails from './pages/dashboard/admin/components/StudentProfile';
import TeacherProfileDetails from './pages/dashboard/teacher/components/StaffDetails';

const App = () => {
  const { user } = useAuth();
  
  return (
    <div className='flex flex-col justify-between min-h-screen'>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/school" element={<SchoolLandingPage />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/dashboard/admin/students/view/:id" element={<StudentProfileDetails />} />
        <Route path="/dashboard/admin/teachers/view/:id" element={<TeacherProfileDetails />} />
        
        {/* DASHBOARD ROUTES */}
        {/* Redirect base /dashboard to the user's role or 'student' */}
        <Route 
          path="/dashboard" 
          element={<Navigate to={`/dashboard/${user?.role || 'student'}/overview`} replace />} 
        />
        
        {/* Changed :page to * so it captures nested paths and prevents routing lag */}
        <Route path="/dashboard/:mode/:page" element={<Dashboard />} />
        
        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;