import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Target, 
  FileText, 
  DollarSign, 
  Users,
  Home,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is a student
  const isStudent = user?.userType === 'student';

  // Different navigation items based on user type
  const studentNavigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'scholarships', label: 'Scholarships', icon: Target, path: '/scholarships' },
    { id: 'courses', label: 'Courses', icon: FileText, path: '/courses' },
    { id: 'research', label: 'Research', icon: BarChart3, path: '/research' },
    { id: 'human-help', label: 'Help', icon: Users, path: '/human-help' },
  ];

  const ngoNavigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'donor-discovery', label: 'Donors', icon: Target, path: '/donor-discovery' },
    { id: 'proposal-generator', label: 'Proposals', icon: Sparkles, path: '/proposal-generator' },
    { id: 'funding', label: 'Funding', icon: DollarSign, path: '/funding' },
    { id: 'human-help', label: 'Help', icon: Users, path: '/human-help' },
  ];

  // Choose navigation items based on user type
  const navigationItems = isStudent ? studentNavigationItems : ngoNavigationItems;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Bottom tab navigation for mobile
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 ${
                isActive ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;