import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  Gem, 
  Users, 
  Plus, 
  Bell, 
  Settings, 
  Search, 
  Sparkles,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { countries } from './countries';
import ThemeSelector from '../ThemeSelector';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to Global
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const notificationCount = 2; // This would come from a notification service in a real app
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const countrySelectorRef = useRef<HTMLDivElement>(null);

  // Auto-detect country on initial load
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('Failed to fetch IP info');
        const data = await response.json();
        const foundCountry = countries.find(c => c.code === data.country_code);
        if (foundCountry) {
          setSelectedCountry(foundCountry);
        }
      } catch (error) {
        console.warn('Country auto-detection failed, defaulting to Global.', error);
      }
    };
    detectCountry();
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (countrySelectorRef.current && !countrySelectorRef.current.contains(event.target as Node)) {
        setShowCountrySelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCountryChange = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    setShowCountrySelector(false);
    // In a real app, you might want to update user preferences or trigger a context change
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/donor-discovery', { state: { query: searchTerm } });
      setSearchTerm('');
    }
  };

  const filteredCountries = searchTerm 
    ? countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : countries;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1e2027] z-50 border-b border-slate-800">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">Granada</span>
        </motion.button>

        {/* Search Bar - Desktop Only */}
        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for funding opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Main Navigation Items - Always Visible */}
        <div className="flex items-center space-x-2">
          {/* Country Selector */}
          <div className="relative" ref={countrySelectorRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowCountrySelector(!showCountrySelector)}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <span className="text-lg" role="img" aria-label={`Flag of ${selectedCountry.name}`}>
                {selectedCountry.flag}
              </span>
              <span className="text-slate-300 text-sm hidden sm:inline">{selectedCountry.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.button>

            {/* Country Dropdown */}
            <AnimatePresence>
              {showCountrySelector && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {filteredCountries.map((country) => (
                      <motion.button
                        key={country.code}
                        whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
                        onClick={() => handleCountryChange(country)}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-slate-300">{country.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Admin Link for Superusers */}
          {user?.is_superuser && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/admin')}
              className="hidden md:flex items-center space-x-1 px-3 py-2 bg-red-900/30 border border-red-800/50 text-red-400 rounded-lg hover:bg-red-900/50 transition-all"
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium">Admin</span>
            </motion.button>
          )}

          {/* Credits Display */}
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/credits')}
              className="flex items-center space-x-1 px-3 py-2 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-all"
            >
              <Gem className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">{user.credits.toLocaleString()}</span>
              <span className="text-slate-400 text-sm hidden sm:inline">Credits</span>
            </motion.button>
          )}

          {/* Human Help Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/human-help')}
            className="hidden md:flex items-center space-x-1 px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
          >
            <Users className="w-4 h-4" />
            <span className="font-medium">Human</span>
          </motion.button>

          {/* New Proposal Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/proposal-generator')}
            className="flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">New Proposal</span>
          </motion.button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {notificationCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 max-w-[90vw]"
                >
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-2">
                    {/* Sample notifications - would be dynamic in a real app */}
                    <div className="p-3 bg-slate-700/50 rounded-lg mb-2">
                      <h4 className="text-white font-medium">New Funding Match</h4>
                      <p className="text-slate-300 text-sm">USAID funding call matches your profile</p>
                      <p className="text-slate-500 text-xs mt-1">2 hours ago</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-medium">Proposal Deadline</h4>
                      <p className="text-slate-300 text-sm">Climate Action proposal due in 3 days</p>
                      <p className="text-slate-500 text-xs mt-1">5 hours ago</p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-slate-700">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/notifications');
                      }}
                      className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-800"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
            </motion.button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50"
                >
                  <div className="p-4 border-b border-slate-700">
                    <p className="font-medium text-white">{user?.fullName || 'User'}</p>
                    <p className="text-sm text-slate-400">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigate('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-800 border-b border-slate-700"
          >
            <div className="p-4 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for funding..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-10 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  >
                    <ChevronDown className="w-4 h-4 transform rotate-90" />
                  </button>
                </div>
              </form>
              
              {user?.is_superuser && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-red-900/30 border border-red-800/50 text-red-400 rounded-lg"
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin Dashboard</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  navigate('/human-help');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 text-slate-300 rounded-lg"
              >
                <Users className="w-5 h-5" />
                <span>Get Human Help</span>
              </button>
              
              <button
                onClick={() => {
                  navigate('/credits');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 text-slate-300 rounded-lg"
              >
                <Gem className="w-5 h-5 text-emerald-400" />
                <span>Credits: {user?.credits.toLocaleString() || '0'}</span>
              </button>
              
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-slate-700/50 text-slate-300 rounded-lg"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-red-900/20 text-red-400 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;