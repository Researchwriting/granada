import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  BookOpen, 
  Briefcase, 
  Users, 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

interface DashboardLayoutProps {
  userType?: 'student' | 'business' | 'jobseeker' | 'general';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userType = 'general' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [credits, setCredits] = useState(100);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  // Navigation items based on user type
  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
      { name: 'Search', icon: <Search className="w-5 h-5" />, path: '/dashboard/search' },
      { name: 'Credits', icon: <CreditCard className="w-5 h-5" />, path: '/dashboard/credits' },
      { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/dashboard/settings' },
    ];

    switch (userType) {
      case 'student':
        return [
          ...commonItems,
          { name: 'Scholarships', icon: <BookOpen className="w-5 h-5" />, path: '/dashboard/scholarships' },
          { name: 'Research Grants', icon: <BookOpen className="w-5 h-5" />, path: '/dashboard/research-grants' },
          { name: 'Educational Resources', icon: <BookOpen className="w-5 h-5" />, path: '/dashboard/resources' },
        ];
      case 'business':
        return [
          ...commonItems,
          { name: 'Business Grants', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard/business-grants' },
          { name: 'Investors', icon: <Users className="w-5 h-5" />, path: '/dashboard/investors' },
          { name: 'Market Analysis', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard/market-analysis' },
        ];
      case 'jobseeker':
        return [
          ...commonItems,
          { name: 'Job Opportunities', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard/jobs' },
          { name: 'Career Development', icon: <User className="w-5 h-5" />, path: '/dashboard/career' },
          { name: 'Skill Building', icon: <BookOpen className="w-5 h-5" />, path: '/dashboard/skills' },
        ];
      default:
        return [
          ...commonItems,
          { name: 'Opportunities', icon: <Briefcase className="w-5 h-5" />, path: '/dashboard/opportunities' },
          { name: 'Resources', icon: <BookOpen className="w-5 h-5" />, path: '/dashboard/resources' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <aside 
        className={`bg-gray-800 fixed inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="#bb86fc" />
              <path d="M30 10H10V30H30V10Z" fill="#03dac6" />
              <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z" fill="#1e1e1e" />
            </svg>
            <span className="ml-2 text-xl font-bold">Granada</span>
          </Link>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Credits Display */}
        <div className="p-4 bg-purple-900 bg-opacity-30 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300">Available Credits</span>
            <span className="text-lg font-bold text-purple-400">{credits}</span>
          </div>
          <Link 
            to="/dashboard/credits" 
            className="mt-2 block text-center text-sm bg-purple-700 hover:bg-purple-600 text-white py-1 px-3 rounded-md transition-colors"
          >
            Buy More
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-purple-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <button
            className="flex items-center w-full px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            onClick={() => navigate('/dashboard/profile')}
          >
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">{userType.charAt(0).toUpperCase() + userType.slice(1)} Account</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 shadow-md py-3 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="lg:hidden text-gray-400 hover:text-white mr-4"
              onClick={toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">
              {userType.charAt(0).toUpperCase() + userType.slice(1)} Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                className="text-gray-400 hover:text-white relative"
                onClick={toggleNotifications}
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-2 hover:bg-gray-700 border-b border-gray-700">
                      <p className="text-sm">New funding opportunity available</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-700 border-b border-gray-700">
                      <p className="text-sm">Your search results are ready</p>
                      <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-700">
                      <p className="text-sm">Credit purchase successful</p>
                      <p className="text-xs text-gray-400">3 days ago</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-700">
                    <Link to="/dashboard/notifications" className="text-xs text-purple-400 hover:text-purple-300">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                className="flex items-center text-gray-400 hover:text-white"
                onClick={toggleProfileMenu}
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <Link 
                    to="/dashboard/profile" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Your Profile
                  </Link>
                  <Link 
                    to="/dashboard/settings" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Settings
                  </Link>
                  <Link 
                    to="/dashboard/credits" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Credits: {credits}
                  </Link>
                  <div className="border-t border-gray-700"></div>
                  <Link 
                    to="/" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;