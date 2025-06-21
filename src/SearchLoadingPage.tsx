import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SearchLoadingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  // Get the search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || 'funding opportunities';
  
  // Loading messages based on the search query
  useEffect(() => {
    let messages: string[] = [];
    
    if (searchQuery.toLowerCase().includes('scholarship')) {
      messages = [
        "Searching for scholarship opportunities...",
        "Analyzing eligibility criteria...",
        "Finding matching scholarships...",
        "Sorting by application deadline...",
        "Preparing personalized recommendations..."
      ];
    } else if (searchQuery.toLowerCase().includes('grant')) {
      messages = [
        "Searching for grant opportunities...",
        "Analyzing grant requirements...",
        "Finding matching grants...",
        "Sorting by funding amount...",
        "Preparing personalized recommendations..."
      ];
    } else if (searchQuery.toLowerCase().includes('donor')) {
      messages = [
        "Searching for potential donors...",
        "Analyzing donor interests...",
        "Finding matching donors...",
        "Sorting by donation history...",
        "Preparing personalized recommendations..."
      ];
    } else {
      messages = [
        "Searching for funding opportunities...",
        "Analyzing funding requirements...",
        "Finding matching opportunities...",
        "Sorting by relevance...",
        "Preparing personalized recommendations..."
      ];
    }
    
    setLoadingMessages(messages);
  }, [searchQuery]);
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to results page after loading completes
          setTimeout(() => {
            navigate('/results?q=' + encodeURIComponent(searchQuery));
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [searchQuery, navigate]);
  
  // Update loading message based on progress
  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor(loadingProgress / (100 / loadingMessages.length)),
      loadingMessages.length - 1
    );
    setCurrentMessageIndex(messageIndex);
  }, [loadingProgress, loadingMessages]);
  
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
        </div>
        
        <div>
          <Link to="/login">
            <button className="bg-white text-purple-700 rounded-md px-6 py-2 font-medium hover:bg-purple-100 transition-colors">
              SIGN IN
            </button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-purple-700 hover:text-purple-800 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back</span>
          </Link>
        </div>
        
        {/* Search Query Display */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-8 max-w-md mx-auto">
          <div className="bg-purple-100 rounded-lg p-3 text-center">
            <span className="text-purple-800 font-medium">{searchQuery}</span>
          </div>
        </div>
        
        {/* Loading Animation */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"
            />
          </div>
          
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-600"
                initial={{ width: "0%" }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-gray-700 font-medium"
            >
              {loadingMessages[currentMessageIndex]}
            </motion.p>
          </div>
        </div>
        
        {/* Request Counter */}
        <div className="max-w-2xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">4 request(s) remaining</span>
          </div>
          <div className="text-sm text-gray-600">
            Powered by: <span className="font-semibold">DeepSeek 5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLoadingPage;