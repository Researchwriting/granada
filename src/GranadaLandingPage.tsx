import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, DollarSign, GraduationCap, Briefcase, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const GranadaLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWord, setCurrentWord] = useState('Funding');
  
  // Words to cycle through
  const words = ['Funding', 'Scholarships', 'Grants', 'Opportunities'];
  
  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      // If empty search, use the current animated word
      navigate(`/search?q=${encodeURIComponent(currentWord)}`);
    }
  };
  
  // Handle enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prevWord => {
        const currentIndex = words.indexOf(prevWord);
        const nextIndex = (currentIndex + 1) % words.length;
        return words[nextIndex];
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 bg-opacity-50 font-sans">
      {/* Header/Navigation */}
      <header className="bg-purple-700 py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <div className="flex items-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="#0ea5e9" />
              <path d="M30 10H10V30H30V10Z" fill="#f97316" />
              <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z" fill="#ffffff" />
            </svg>
            <span className="ml-2 text-3xl font-bold text-white">Granada</span>
          </div>
          
          <nav className="hidden md:flex ml-12">
            <div className="relative group">
              <button className="px-4 py-2 text-white font-medium flex items-center hover:bg-purple-600 rounded transition-colors">
                DONORS
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 text-white font-medium flex items-center hover:bg-purple-600 rounded transition-colors">
                SCHOLARSHIPS
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 text-white font-medium flex items-center hover:bg-purple-600 rounded transition-colors">
                FUNDING
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 text-white font-medium flex items-center hover:bg-purple-600 rounded transition-colors">
                RESOURCES
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
          </nav>
        </div>
        
        <div>
          <Link to="/login">
            <button className="bg-white text-purple-700 rounded-md px-6 py-2 font-medium hover:bg-purple-100 transition-colors">
              SIGN IN
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-blue-50 overflow-hidden">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
            <defs>
              <pattern id="pattern-lines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                <path d="M0 0 L100 100 M100 0 L0 100 M-50 0 L50 100 M50 0 L150 100" stroke="#4299e1" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-lines)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative">
          {/* User Count Badge */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full shadow-md px-4 py-2 flex items-center">
              <div className="flex -space-x-2 mr-2">
                <img className="h-6 w-6 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/1.jpg" alt="User" />
                <img className="h-6 w-6 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" />
                <img className="h-6 w-6 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/2.jpg" alt="User" />
              </div>
              <span className="text-sm font-medium">50,000+ Users</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-800">
              Find your
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-purple-600 inline-block ml-2"
              >
                {currentWord}
              </motion.span>
              <br />in seconds
            </h1>
            <div className="bg-white bg-opacity-70 w-max mx-auto px-6 py-2 rounded-full shadow-sm">
              <p className="text-gray-700 font-medium">Discover over 50,000+ funding opportunities</p>
            </div>
          </div>

          {/* Category Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white shadow-md rounded-full text-blue-600 font-medium flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/search?q=donors')}
            >
              <DollarSign className="w-4 h-4" />
              <span>Donors</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white shadow-md rounded-full text-purple-600 font-medium flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/search?q=scholarships')}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Scholarships</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white shadow-md rounded-full text-green-600 font-medium flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/search?q=business funding')}
            >
              <Briefcase className="w-4 h-4" />
              <span>Business Funding</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-white shadow-md rounded-full text-orange-600 font-medium flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/search?q=donation locations')}
            >
              <MapPin className="w-4 h-4" />
              <span>Donation Locations</span>
            </motion.button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="relative">
              <motion.input
                whileFocus={{ boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.3)" }}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for donors, scholarships, funding, or jobs..."
                className="w-full px-6 py-4 pr-12 text-lg text-gray-800 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <motion.button 
                  onClick={handleSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-purple-600 rounded-full text-white shadow-md cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <div className="mt-3 bg-white bg-opacity-80 rounded-lg p-2 shadow-sm">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-medium">Try:</span> "STEM scholarships for women", "climate change grants", "startup funding in California"
              </p>
              {searchQuery && (
                <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm text-purple-700">You searched for: <span className="font-medium">{searchQuery}</span></p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Donor Discovery */}
            <motion.div 
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => window.location.href = '/donors'}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F59E0B" strokeWidth="2" />
                      <path d="M8 12H16M12 8V16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Donor Discovery</h3>
                    <p className="text-sm text-gray-600 mt-1">Find the perfect donors for your projects.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Funding
                  </button>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-gray-100 rounded-full"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L19 12L12 19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Proposal Generator */}
            <motion.div 
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => window.location.href = '/proposals'}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5H9C7.89543 5 7 5.89543 7 7V17C7 18.1046 7.89543 19 9 19H15C16.1046 19 17 18.1046 17 17V10M12 5L17 10M12 5V10H17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Proposal Generator</h3>
                    <p className="text-sm text-gray-600 mt-1">Create winning proposals tailored to donor requirements.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Academic
                  </button>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-gray-100 rounded-full"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L19 12L12 19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Scholarship Matcher */}
            <motion.div 
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => window.location.href = '/scholarships'}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 14L12.76 14.3C13.3149 14.5056 13.9158 14.5302 14.4846 14.3708C15.0534 14.2115 15.5593 13.8771 15.92 13.42L16 13.34" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4.9313 19L5.00011 18.9C5.47011 18.21 6.27011 17.75 7.17011 17.75H16.8301C17.7301 17.75 18.5301 18.21 19.0001 18.9L19.0701 19" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Scholarship Matcher</h3>
                    <p className="text-sm text-gray-600 mt-1">Smart scholarship matching for students.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Education
                  </button>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-gray-100 rounded-full"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L19 12L12 19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Grant Tracker */}
            <motion.div 
              whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              onClick={() => window.location.href = '/grants'}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Grant Tracker</h3>
                    <p className="text-sm text-gray-600 mt-1">Track and manage your grant applications in one place.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Management
                  </button>
                  <motion.button 
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-gray-100 rounded-full"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L19 12L12 19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tool Screenshots */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {/* Donor Discovery Screenshot */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-500 mx-auto">Donor Discovery</div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex flex-col h-40">
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="flex space-x-2 mb-2">
                      <div className="w-1/3 h-3 bg-blue-100 rounded"></div>
                      <div className="w-1/3 h-3 bg-green-100 rounded"></div>
                      <div className="w-1/3 h-3 bg-yellow-100 rounded"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <div className="w-full h-3 bg-gray-100 rounded mb-1"></div>
                        <div className="w-2/3 h-3 bg-gray-100 rounded"></div>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <div className="w-full h-3 bg-gray-100 rounded mb-1"></div>
                        <div className="w-2/3 h-3 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Proposal Generator Screenshot */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-500 mx-auto">Proposal Generator</div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex h-40">
                  <div className="w-1/3 border-r border-gray-100 p-2">
                    <div className="w-full h-4 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-4 bg-gray-100 rounded mb-2"></div>
                    <div className="w-3/4 h-4 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-4 bg-gray-100 rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="w-2/3 p-2">
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-3/4 h-3 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scholarship Matcher Screenshot */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-500 mx-auto">Scholarship Matcher</div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex h-40">
                  <div className="w-full p-2">
                    <div className="flex justify-between mb-2">
                      <div className="w-1/3 h-4 bg-gray-100 rounded"></div>
                      <div className="w-1/4 h-4 bg-blue-100 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-8 bg-gray-50 rounded border border-gray-200 p-1 flex items-center">
                        <div className="w-8 h-6 bg-blue-100 rounded mr-2"></div>
                        <div className="w-2/3 h-3 bg-gray-100 rounded"></div>
                      </div>
                      <div className="w-full h-8 bg-gray-50 rounded border border-gray-200 p-1 flex items-center">
                        <div className="w-8 h-6 bg-green-100 rounded mr-2"></div>
                        <div className="w-2/3 h-3 bg-gray-100 rounded"></div>
                      </div>
                      <div className="w-full h-8 bg-gray-50 rounded border border-gray-200 p-1 flex items-center">
                        <div className="w-8 h-6 bg-yellow-100 rounded mr-2"></div>
                        <div className="w-2/3 h-3 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Grant Tracker Screenshot */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-500 mx-auto">Grant Tracker</div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex h-40">
                  <div className="w-full p-2">
                    <div className="flex justify-between mb-3">
                      <div className="w-1/3 h-4 bg-gray-100 rounded"></div>
                      <div className="w-1/4 h-4 bg-blue-100 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full flex justify-between">
                        <div className="w-1/3 h-3 bg-gray-100 rounded"></div>
                        <div className="w-1/4 h-3 bg-gray-100 rounded"></div>
                        <div className="w-1/5 h-3 bg-green-100 rounded"></div>
                      </div>
                      <div className="w-full h-px bg-gray-200 my-1"></div>
                      <div className="w-full flex justify-between">
                        <div className="w-1/3 h-3 bg-gray-100 rounded"></div>
                        <div className="w-1/4 h-3 bg-gray-100 rounded"></div>
                        <div className="w-1/5 h-3 bg-yellow-100 rounded"></div>
                      </div>
                      <div className="w-full h-px bg-gray-200 my-1"></div>
                      <div className="w-full flex justify-between">
                        <div className="w-1/3 h-3 bg-gray-100 rounded"></div>
                        <div className="w-1/4 h-3 bg-gray-100 rounded"></div>
                        <div className="w-1/5 h-3 bg-red-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-purple-800 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Logo and About */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="#0ea5e9" />
                  <path d="M30 10H10V30H30V10Z" fill="#f97316" />
                  <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z" fill="#ffffff" />
                </svg>
                <span className="ml-2 text-2xl font-bold">Granada</span>
              </div>
              <p className="text-purple-200 mb-4">
                Granada helps researchers, students, and organizations find and secure funding opportunities worldwide.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-purple-200 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-purple-200 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-purple-200 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-purple-200 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Donor Directory</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Scholarship Database</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Grant Writing Tips</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Funding News</a></li>
                <li><a href="#" className="text-purple-200 hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <p className="text-purple-200 mb-4">Subscribe to our newsletter for the latest funding opportunities.</p>
              <form className="space-y-2">
                <div>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2 rounded-md bg-purple-900 border border-purple-700 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-purple-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-purple-300 text-sm">© 2025 Granada. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6">
                  <li><a href="#" className="text-sm text-purple-300 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-sm text-purple-300 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-sm text-purple-300 hover:text-white transition-colors">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GranadaLandingPage;