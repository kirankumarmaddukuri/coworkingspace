import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MemberDashboard from './pages/MemberDashboard';
import Workspaces from './pages/Workspaces';
import WorkspaceDetail from './pages/WorkspaceDetail';
import MyBookings from './pages/MyBookings';
import ManagerDashboard from './pages/ManagerDashboard';
import SpaceManagement from './pages/SpaceManagement';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import { useAuth } from './context/AuthContext';

const DashboardSwitch = () => {
  const { user } = useAuth();
  if (user?.roles.includes('ROLE_ADMIN')) return <AdminDashboard />;
  if (user?.roles.includes('ROLE_SPACE_MANAGER')) return <ManagerDashboard />;
  return <MemberDashboard />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<Layout><DashboardSwitch /></Layout>} />
        <Route path="/workspaces" element={<Layout><Workspaces /></Layout>} />
        <Route path="/workspace/:id" element={<Layout><WorkspaceDetail /></Layout>} />
        
        {/* Protected Member Routes */}
        <Route path="/my-bookings" element={<Layout><MyBookings /></Layout>} />
        
        {/* Protected Manager Routes */}
        <Route path="/manage-spaces" element={<Layout><SpaceManagement /></Layout>} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
        <Route path="/admin/users" element={<Layout><UserManagement /></Layout>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
