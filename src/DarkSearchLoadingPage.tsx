import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DarkSearchLoadingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingMessage, setLoadingMessage] = useState('Searching for the best opportunities...');
  const [progress, setProgress] = useState(0);
  
  // Get the search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  // Loading messages based on search query
  const getLoadingMessages = (query: string): string[] => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('scholarship')) {
      return [
        'Finding scholarship opportunities...',
        'Analyzing eligibility requirements...',
        'Sorting by application deadlines...',
        'Checking for matching scholarships...',
        'Preparing your personalized results...'
      ];
    } else if (lowerQuery.includes('grant')) {
      return [
        'Searching for grant opportunities...',
        'Analyzing funding sources...',
        'Checking application requirements...',
        'Finding matching grants for your needs...',
        'Preparing your personalized results...'
      ];
    } else if (lowerQuery.includes('business')) {
      return [
        'Finding business funding opportunities...',
        'Analyzing small business loans...',
        'Checking venture capital options...',
        'Finding angel investors in your area...',
        'Preparing your personalized results...'
      ];
    } else if (lowerQuery.includes('donor')) {
      return [
        'Searching for potential donors...',
        'Analyzing philanthropic organizations...',
        'Finding matching donor interests...',
        'Checking donation history and patterns...',
        'Preparing your personalized results...'
      ];
    } else {
      return [
        'Searching for funding opportunities...',
        'Analyzing thousands of sources...',
        'Finding the perfect matches for you...',
        'Checking eligibility requirements...',
        'Preparing your personalized results...'
      ];
    }
  };
  
  useEffect(() => {
    const messages = getLoadingMessages(searchQuery);
    let currentMessageIndex = 0;
    
    // Update loading message every 2 seconds
    const messageInterval = setInterval(() => {
      currentMessageIndex = (currentMessageIndex + 1) % messages.length;
      setLoadingMessage(messages[currentMessageIndex]);
    }, 2000);
    
    // Update progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          
          // Navigate to results page after loading completes
          setTimeout(() => {
            navigate('/results?q=' + encodeURIComponent(searchQuery));
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 100);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [searchQuery, navigate]);
  
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
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {/* Search Query Display */}
          <div className="bg-gray-800 rounded-lg p-4 shadow-md mb-8">
            <div className="flex justify-between items-center">
              <div className="bg-purple-900 rounded-lg p-3">
                <span className="text-purple-300 font-medium">{searchQuery}</span>
              </div>
              <div className="text-gray-400 text-sm">
                Searching...
              </div>
            </div>
          </div>
          
          {/* Loading Animation */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"
                style={{ animationDuration: '1.5s' }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="#bb86fc" />
                  <path d="M30 10H10V30H30V10Z" fill="#03dac6" />
                  <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z" fill="#1e1e1e" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Finding Your Opportunities</h2>
            
            <div className="text-center mb-8">
              <p className="text-gray-300 mb-2">{loadingMessage}</p>
              <p className="text-gray-400 text-sm">This may take a moment</p>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md bg-gray-800 rounded-full h-2.5 mb-4">
              <div 
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-gray-400 text-sm">{progress}% complete</p>
          </div>
          
          {/* Tips Section */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4 text-white">While you wait...</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 className="font-medium text-white mb-2">Funding Tip</h4>
                <p className="text-gray-300 text-sm">
                  Always read eligibility requirements carefully before applying. This saves time and increases your chances of success.
                </p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <h4 className="font-medium text-white mb-2">Did You Know?</h4>
                <p className="text-gray-300 text-sm">
                  Many funding opportunities go unclaimed each year because people don't know they exist or don't apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkSearchLoadingPage;