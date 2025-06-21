import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';

const KiinLandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-blue-50 bg-opacity-50 font-sans">
      {/* Header/Navigation */}
      <header className="bg-white py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="#FF6B00" />
              <path d="M30 10H10V30H30V10Z" fill="#FFC700" />
              <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z" fill="#00B2FF" />
            </svg>
            <span className="ml-2 text-3xl font-bold">kiin</span>
          </div>
          
          <nav className="hidden md:flex ml-12">
            <div className="relative group">
              <button className="px-4 py-2 text-gray-700 font-medium flex items-center">
                BUSINESS
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 text-gray-700 font-medium flex items-center">
                ACADEMIC
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 text-gray-700 font-medium flex items-center">
                LIFESTYLE
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
            
            <div className="relative group">
              <button className="px-4 py-2 text-gray-700 font-medium flex items-center">
                ESSENTIAL
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
          </nav>
        </div>
        
        <div>
          <button className="border border-gray-300 rounded-md px-6 py-2 font-medium">
            SIGN IN
          </button>
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
              <span className="text-sm font-medium">30,373 Users</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              AI that takes your<span className="text-orange-600">Essay</span>
              <br />to new heights
            </h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask NimbusAI 5.0 anything..."
                className="w-full px-6 py-4 pr-12 text-lg border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 rounded-full text-white">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tool Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Logo Generator */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F59E0B" strokeWidth="2" />
                      <path d="M8 12H16M12 8V16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Logo Generator</h3>
                    <p className="text-sm text-gray-600 mt-1">Generate logo for your brand.</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Business
                  </button>
                </div>
              </div>
            </div>

            {/* Essay Writer */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5H9C7.89543 5 7 5.89543 7 7V17C7 18.1046 7.89543 19 9 19H15C16.1046 19 17 18.1046 17 17V10M12 5L17 10M12 5V10H17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Essay Writer</h3>
                    <p className="text-sm text-gray-600 mt-1">Create flawless essays with AI, tailored to your requirements.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Academic
                  </button>
                  <button className="p-1 bg-gray-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L19 12L12 19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Lyric Writer */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18V5L21 3V16M9 18C9 19.1046 7.88071 20 6.5 20C5.11929 20 4 19.1046 4 18C4 16.8954 5.11929 16 6.5 16C7.88071 16 9 16.8954 9 18ZM21 16C21 17.1046 19.8807 18 18.5 18C17.1193 18 16 17.1046 16 16C16 14.8954 17.1193 14 18.5 14C19.8807 14 21 14.8954 21 16Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Lyric Writer</h3>
                    <p className="text-sm text-gray-600 mt-1">AI-powered custom song lyrics creation tool.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Lifestyle
                  </button>
                  <button className="p-1 bg-gray-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L19 12L12 19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Cover Letter</h3>
                    <p className="text-sm text-gray-600 mt-1">Design persuasive cover letters with our AI-driven tool.</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    Business
                  </button>
                  <button className="p-1 bg-gray-100 rounded-full">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L19 12L12 19M5 12H19" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tool Screenshots */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {/* Logo Generator Screenshot */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-500 mx-auto">Logo Generator</div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" />
                      <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="mt-4 text-sm font-medium text-gray-700">Aurora Cloud</div>
                  <div className="text-xs text-gray-500">Virtual Data Space</div>
                </div>
              </div>
            </div>
            
            {/* Essay Writer Screenshot */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-500 mx-auto">Essay Writer</div>
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
            
            {/* Lyric Writer Screenshot */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-500 mx-auto">Lyric Writer</div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex h-40">
                  <div className="w-full p-2">
                    <div className="text-center mb-2">
                      <div className="text-sm font-medium">Song Title Goes Here</div>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-3/4 h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-3/4 h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cover Letter Screenshot */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 p-2 border-b border-gray-100 flex items-center">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-500 mx-auto">Cover Letter</div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex h-40">
                  <div className="w-full p-2">
                    <div className="w-1/3 h-3 bg-gray-100 rounded mb-4"></div>
                    <div className="w-1/2 h-3 bg-gray-100 rounded mb-6"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-full h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="w-3/4 h-3 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KiinLandingPage;