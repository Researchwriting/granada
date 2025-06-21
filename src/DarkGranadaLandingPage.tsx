import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, DollarSign, GraduationCap, Briefcase, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const DarkGranadaLandingPage: React.FC = () => {
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
    <div className="min-h-screen bg-gray-900 font-sans text-white">
      {/* Header/Navigation */}
      <header className="bg-gray-800 py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <div className="flex items-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="#bb86fc" />
              <path d="M30 10H10V30H30V10Z" fill="#03dac6" />
              <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z" fill="#1e1e1e" />
            </svg>
            <span className="ml-2 text-3xl font-bold text-white">Granada</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <a href="#" className="text-white hover:text-purple-300 transition-colors">Features</a>
          <a href="#" className="text-white hover:text-purple-300 transition-colors">Pricing</a>
          <a href="#" className="text-white hover:text-purple-300 transition-colors">About</a>
          <a href="#" className="text-white hover:text-purple-300 transition-colors">Contact</a>
          <button className="bg-purple-600 text-white rounded-md px-6 py-2 font-medium hover:bg-purple-700 transition-colors">
            SIGN IN
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 opacity-30"></div>
            </div>

            {/* Main Headline */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
                Find your
                <motion.span
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-purple-400 inline-block ml-2"
                >
                  {currentWord}
                </motion.span>
                <br />in seconds
              </h1>
              <div className="bg-gray-800 bg-opacity-70 w-max mx-auto px-6 py-2 rounded-full shadow-sm">
                <p className="text-gray-300 font-medium">Discover over 50,000+ funding opportunities</p>
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
                className="px-4 py-2 bg-gray-800 shadow-md rounded-full text-blue-400 font-medium flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/search?q=donors')}
              >
                <DollarSign className="w-4 h-4" />
                <span>Donors</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-800 shadow-md rounded-full text-purple-400 font-medium flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/search?q=scholarships')}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Scholarships</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-800 shadow-md rounded-full text-green-400 font-medium flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate('/search?q=business funding')}
              >
                <Briefcase className="w-4 h-4" />
                <span>Business Funding</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-800 shadow-md rounded-full text-orange-400 font-medium flex items-center space-x-2 cursor-pointer"
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
              className="w-full max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for funding opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-4 pr-16 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Suggestions */}
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-gray-400">Popular searches:</span>
                <button 
                  onClick={() => setSearchQuery("research grants")}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  research grants
                </button>
                <button 
                  onClick={() => setSearchQuery("small business funding")}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  small business funding
                </button>
                <button 
                  onClick={() => setSearchQuery("education scholarships")}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  education scholarships
                </button>
              </div>
            </motion.div>
          </div>

          {/* Tools Section */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful Tools for Your Success</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Discover a suite of powerful tools designed to help you find, apply for, and secure the funding you need.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
              >
                <div className="bg-purple-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Funding Finder</h3>
                <p className="text-gray-300 mb-4">
                  Discover funding opportunities tailored to your specific needs and qualifications.
                </p>
                <Link to="/search?q=funding" className="text-purple-400 hover:text-purple-300 font-medium flex items-center">
                  Try it now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
              >
                <div className="bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Application Assistant</h3>
                <p className="text-gray-300 mb-4">
                  Get step-by-step guidance and templates to complete your funding applications.
                </p>
                <Link to="/search?q=application" className="text-blue-400 hover:text-blue-300 font-medium flex items-center">
                  Try it now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
              >
                <div className="bg-green-900 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Funding Analytics</h3>
                <p className="text-gray-300 mb-4">
                  Track your applications and analyze success rates to optimize your funding strategy.
                </p>
                <Link to="/search?q=analytics" className="text-green-400 hover:text-green-300 font-medium flex items-center">
                  Try it now
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose Granada</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Our platform is designed to make finding and securing funding as simple and efficient as possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Comprehensive Database</h3>
                <p className="text-gray-300">
                  Access over 50,000 funding opportunities from government agencies, foundations, corporations, and more.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Personalized Recommendations</h3>
                <p className="text-gray-300">
                  Receive tailored funding suggestions based on your profile, interests, and qualifications.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Expert Guidance</h3>
                <p className="text-gray-300">
                  Get insights and advice from funding experts to increase your chances of success.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Time-Saving Tools</h3>
                <p className="text-gray-300">
                  Streamline your funding search and application process with our intuitive tools and templates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Granada</h3>
              <p className="text-gray-400 mb-4">
                Empowering individuals and organizations to find and secure the funding they need to achieve their goals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 5.16c-.94.42-1.95.7-3 .82 1.08-.65 1.9-1.68 2.3-2.9-1.03.61-2.17 1.05-3.37 1.28-1-.1-1.9-.4-2.65-1.1-.75-.7-1.2-1.6-1.3-2.6-.1-1 .2-2 .8-2.8.6-.8 1.5-1.3 2.5-1.5-1.03.06-2.03.3-2.97.7v-.07c0-1.02.35-2 1-2.8.65-.8 1.54-1.3 2.54-1.4-.5-.14-1.03-.2-1.57-.2-.38 0-.74.04-1.1.1.27-.8.8-1.5 1.5-2 .7-.5 1.6-.8 2.5-.8-1.5-1.2-3.3-1.8-5.2-1.8-.33 0-.67.02-1 .06 1.9-1.2 4.1-1.9 6.4-1.9 2.3 0 4.4.7 6.2 2 1.8 1.3 3.2 3 4.1 5 .9 2 1.3 4.2 1.3 6.4v.6c1 .7 1.8 1.6 2.5 2.6z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2c-2.7 0-3 0-4.1.1-1.1 0-1.8.2-2.5.5-.7.3-1.3.7-1.8 1.2-.5.5-.9 1.1-1.2 1.8-.3.7-.5 1.4-.5 2.5C2 9.3 2 9.6 2 12.3v.4c0 2.7 0 3 .1 4.1 0 1.1.2 1.8.5 2.5.3.7.7 1.3 1.2 1.8.5.5 1.1.9 1.8 1.2.7.3 1.4.5 2.5.5 1.1 0 1.4.1 4.1.1 2.7 0 3 0 4.1-.1 1.1 0 1.8-.2 2.5-.5.7-.3 1.3-.7 1.8-1.2.5-.5.9-1.1 1.2-1.8.3-.7.5-1.4.5-2.5 0-1.1.1-1.4.1-4.1 0-2.7 0-3-.1-4.1 0-1.1-.2-1.8-.5-2.5-.3-.7-.7-1.3-1.2-1.8-.5-.5-1.1-.9-1.8-1.2-.7-.3-1.4-.5-2.5-.5-1.1 0-1.4-.1-4.1-.1zm0 1.8c2.7 0 3 0 4 .1 1 0 1.5.2 1.9.3.5.2.8.4 1.1.7.3.3.5.6.7 1.1.1.4.3.9.3 1.9 0 1 .1 1.3.1 4s0 3-.1 4c0 1-.2 1.5-.3 1.9-.2.5-.4.8-.7 1.1-.3.3-.6.5-1.1.7-.4.1-.9.3-1.9.3-1 0-1.3.1-4 .1s-3 0-4-.1c-1 0-1.5-.2-1.9-.3-.5-.2-.8-.4-1.1-.7-.3-.3-.5-.6-.7-1.1-.1-.4-.3-.9-.3-1.9 0-1-.1-1.3-.1-4s0-3 .1-4c0-1 .2-1.5.3-1.9.2-.5.4-.8.7-1.1.3-.3.6-.5 1.1-.7.4-.1.9-.3 1.9-.3 1 0 1.3-.1 4-.1z" />
                    <path d="M12 15.3a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm0-8.4a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm6.5-.2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Funding Database</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Application Templates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Expert Advice</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GDPR Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-center">
              © {new Date().getFullYear()} Granada. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DarkGranadaLandingPage;