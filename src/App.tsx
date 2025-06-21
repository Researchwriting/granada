import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/shared/Header';
import Sidebar from './components/shared/Sidebar';
import Dashboard from './components/Dashboard';
import DonorDashboard from './components/DonorDashboard';
import DonorDiscovery from './components/DonorDiscovery';
import ProposalGenerator from './components/ProposalGenerator';
import ProposalManager from './components/ProposalManager';
import ProjectManager from './components/ProjectManager';
import AIAssistant from './components/AIAssistant';
import Settings from './components/Settings';
import Funding from './components/Funding';
import Documents from './components/Documents';
import Analytics from './components/Analytics';
import CreditsPurchase from './components/CreditsPurchase';
import NGOPipeline from './components/NGOPipeline';
import AdminDashboard from './components/AdminDashboard';
import MobileNavigation from './components/shared/MobileNavigation';
import LandingPage from './LandingPage';
import StudentDashboard from './components/StudentDashboard';
import HumanHelpPage from './pages/HumanHelpPage';
import CreditsPage from './pages/CreditsPage';
import PurchasePage from './pages/PurchasePage';
import HumanHelpButton from './components/shared/HumanHelpButton';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('/landing') && 
        !location.pathname.includes('/login') && 
        !location.pathname.includes('/register') && 
        !location.pathname.includes('/forgot-password')) {
      navigate('/landing');
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // If not authenticated, don't render the app
  if (!isAuthenticated) {
    return null;
  }

  // Check if user is a student
  const isStudent = user?.userType === 'student';

  return (
    <div className="min-h-screen safari-fix" style={{ background: 'var(--theme-background)' }}>
      <Header />
      
      <div className="flex">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className={`flex-1 transition-all duration-300 pt-16 ${sidebarCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-64'}`}>
          <Routes>
            {/* Render student dashboard for student users */}
            <Route path="/" element={isStudent ? <StudentDashboard /> : <DonorDashboard />} />
            <Route path="/donor-dashboard" element={<DonorDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/donor-discovery" element={<DonorDiscovery />} />
            <Route path="/proposal-generator" element={<ProposalGenerator />} />
            <Route path="/proposals" element={<ProposalManager />} />
            <Route path="/projects" element={<ProjectManager />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/human-help" element={<HumanHelpPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/funding" element={<Funding />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/purchase/:packageId" element={<PurchasePage />} />
            <Route path="/ngo-pipeline" element={<NGOPipeline />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Human Help Button */}
      <HumanHelpButton />
    </div>
  );
}

function App() {
  const location = useLocation();
  
  // Check if current path is an auth page or landing page
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isLandingPage = location.pathname === '/landing';

  // For landing page and auth pages, render without the app layout
  if (isLandingPage) {
    return <LandingPage />;
  }

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    );
  }

  // For all other routes, render the app with layout
  return (
    <AppContent />
  );
}

// Main export with all providers
function AppWithProviders() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default AppWithProviders;