import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Edit3, FileText, Check, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  
  // Get the search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || 'funding opportunities';
  
  // Mock search results based on the query
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate mock results based on the search query
    let results = [];
    
    if (searchQuery.toLowerCase().includes('scholarship')) {
      results = [
        {
          title: "Women in STEM Scholarship",
          organization: "National Science Foundation",
          amount: "$10,000",
          deadline: "August 15, 2025",
          location: "United States",
          description: "Scholarship for women pursuing degrees in Science, Technology, Engineering, or Mathematics.",
          tags: ["STEM", "Women", "Undergraduate", "Graduate"]
        },
        {
          title: "Global Leaders Scholarship",
          organization: "International Education Fund",
          amount: "$15,000",
          deadline: "September 30, 2025",
          location: "Worldwide",
          description: "Supporting future leaders in international development and global studies.",
          tags: ["International", "Leadership", "Graduate"]
        },
        {
          title: "First Generation College Student Scholarship",
          organization: "Education Access Foundation",
          amount: "$5,000",
          deadline: "October 1, 2025",
          location: "United States",
          description: "Supporting students who are the first in their family to attend college.",
          tags: ["First Generation", "Undergraduate"]
        }
      ];
    } else if (searchQuery.toLowerCase().includes('grant')) {
      results = [
        {
          title: "Climate Change Research Grant",
          organization: "Environmental Protection Agency",
          amount: "$50,000",
          deadline: "July 31, 2025",
          location: "United States",
          description: "Funding for innovative research addressing climate change challenges.",
          tags: ["Environment", "Research", "Climate"]
        },
        {
          title: "Community Development Block Grant",
          organization: "Department of Housing and Urban Development",
          amount: "$100,000 - $500,000",
          deadline: "Rolling",
          location: "United States",
          description: "Funding for local community development activities such as affordable housing and infrastructure development.",
          tags: ["Community", "Housing", "Infrastructure"]
        },
        {
          title: "Arts and Culture Project Grant",
          organization: "National Endowment for the Arts",
          amount: "$25,000",
          deadline: "September 15, 2025",
          location: "United States",
          description: "Supporting projects that engage communities through artistic and cultural initiatives.",
          tags: ["Arts", "Culture", "Community"]
        }
      ];
    } else if (searchQuery.toLowerCase().includes('donor')) {
      results = [
        {
          title: "Gates Foundation",
          focus: "Global Health, Education, Development",
          annual_giving: "$5+ billion",
          location: "Seattle, WA",
          description: "One of the largest private foundations focused on enhancing healthcare and reducing extreme poverty globally.",
          tags: ["Health", "Education", "Global Development"]
        },
        {
          title: "Ford Foundation",
          focus: "Social Justice, Democracy, Economic Opportunity",
          annual_giving: "$500+ million",
          location: "New York, NY",
          description: "Working to reduce poverty and injustice, strengthen democratic values, and advance human achievement.",
          tags: ["Social Justice", "Democracy", "Economic Opportunity"]
        },
        {
          title: "Rockefeller Foundation",
          focus: "Health, Food, Power, Economic Mobility",
          annual_giving: "$200+ million",
          location: "New York, NY",
          description: "Promoting the well-being of humanity throughout the world through advancing new frontiers of science, data, policy, and innovation.",
          tags: ["Health", "Food Security", "Economic Mobility"]
        }
      ];
    } else if (searchQuery.toLowerCase().includes('business')) {
      results = [
        {
          title: "Small Business Innovation Research (SBIR) Grant",
          organization: "Small Business Administration",
          amount: "Up to $150,000 (Phase I), Up to $1 million (Phase II)",
          deadline: "Various",
          location: "United States",
          description: "Federal funding for small businesses engaged in research and development with potential for commercialization.",
          tags: ["Small Business", "Innovation", "R&D"]
        },
        {
          title: "Economic Development Administration (EDA) Grants",
          organization: "U.S. Department of Commerce",
          amount: "Varies",
          deadline: "Rolling",
          location: "United States",
          description: "Funding for economically distressed communities to generate new employment and stimulate industrial and commercial growth.",
          tags: ["Economic Development", "Job Creation", "Infrastructure"]
        },
        {
          title: "Startup Accelerator Program",
          organization: "Y Combinator",
          amount: "$500,000",
          deadline: "Biannual applications",
          location: "Global",
          description: "Seed funding and mentorship for early-stage startups with high growth potential.",
          tags: ["Startups", "Tech", "Venture Capital"]
        }
      ];
    } else {
      results = [
        {
          title: "Research Fellowship Program",
          organization: "National Institutes of Health",
          amount: "$50,000 - $100,000",
          deadline: "October 12, 2025",
          location: "United States",
          description: "Supporting innovative research in health and medical sciences.",
          tags: ["Research", "Health", "Science"]
        },
        {
          title: "Community Impact Grant",
          organization: "Local Community Foundation",
          amount: "$25,000",
          deadline: "August 30, 2025",
          location: "Various Cities",
          description: "Supporting local initiatives that address community needs and improve quality of life.",
          tags: ["Community", "Local", "Social Impact"]
        },
        {
          title: "Educational Innovation Fund",
          organization: "Department of Education",
          amount: "$75,000",
          deadline: "September 15, 2025",
          location: "United States",
          description: "Funding for innovative approaches to education and learning.",
          tags: ["Education", "Innovation", "Technology"]
        }
      ];
    }
    
    setSearchResults(results);
  }, [searchQuery]);
  
  const handleContinue = () => {
    setIsGeneratingDocument(true);
    
    // Simulate document generation
    setTimeout(() => {
      setIsGeneratingDocument(false);
      setDocumentReady(true);
      
      // Navigate to checkout page after a short delay
      setTimeout(() => {
        navigate(`/checkout?plan=${selectedPlan}`);
      }, 1000);
    }, 2000);
  };
  
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
            <span>Back to Search</span>
          </Link>
        </div>
        
        {/* Search Query Display */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-8">
          <div className="flex justify-between items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <span className="text-purple-800 font-medium">{searchQuery}</span>
            </div>
            <div className="text-gray-500 text-sm">
              Found {searchResults.length} results
            </div>
          </div>
        </div>
        
        {/* Search Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {searchResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="font-semibold text-xl text-gray-900 mb-2">{result.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {result.tags && result.tags.map((tag: string, tagIndex: number) => (
                    <span key={tagIndex} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{result.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {result.organization && (
                    <div>
                      <span className="text-gray-500">Organization:</span>
                      <p className="font-medium">{result.organization}</p>
                    </div>
                  )}
                  {result.focus && (
                    <div>
                      <span className="text-gray-500">Focus:</span>
                      <p className="font-medium">{result.focus}</p>
                    </div>
                  )}
                  {result.amount && (
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-medium">{result.amount}</p>
                    </div>
                  )}
                  {result.annual_giving && (
                    <div>
                      <span className="text-gray-500">Annual Giving:</span>
                      <p className="font-medium">{result.annual_giving}</p>
                    </div>
                  )}
                  {result.deadline && (
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <p className="font-medium">{result.deadline}</p>
                    </div>
                  )}
                  {result.location && (
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="font-medium">{result.location}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Document Preview and Subscription Options */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Download your Document</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Document Preview */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Preview</h3>
                
                {isGeneratingDocument ? (
                  <div className="flex flex-col items-center justify-center h-80">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-700 font-medium">Finalising...</p>
                  </div>
                ) : documentReady ? (
                  <div className="flex flex-col items-center justify-center h-80">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-700 font-medium mb-4">Your document is ready!</p>
                    <button className="bg-purple-600 text-white px-6 py-2 rounded-md flex items-center">
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 h-80 overflow-hidden">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                  </div>
                )}
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                    <Edit3 className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Seamless Editing</h4>
                      <p className="text-sm text-gray-600">Revise on the fly with our built-in text editor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <h4 className="font-semibold">Multi-Format</h4>
                      <p className="text-sm text-gray-600">Download your final copy in PDF, Word and more.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Subscription Options */}
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download your Document
                </h3>
                
                {/* Starter Plan */}
                <div 
                  className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all ${selectedPlan === 'starter' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                  onClick={() => setSelectedPlan('starter')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${selectedPlan === 'starter' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'} mr-3 flex items-center justify-center`}>
                        {selectedPlan === 'starter' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <h4 className="font-semibold text-lg">Starter</h4>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">$8.99</span>
                    </div>
                  </div>
                  <p className="text-gray-600 ml-8">Complete access for 7 days, then renews as Standard.</p>
                </div>
                
                {/* Standard Plan */}
                <div 
                  className={`border rounded-lg p-4 mb-4 cursor-pointer transition-all ${selectedPlan === 'standard' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                  onClick={() => setSelectedPlan('standard')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${selectedPlan === 'standard' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'} mr-3 flex items-center justify-center`}>
                        {selectedPlan === 'standard' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <h4 className="font-semibold text-lg">Standard</h4>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">$1.17</span>
                      <span className="text-gray-500 ml-1">/day</span>
                    </div>
                  </div>
                  <p className="text-gray-600 ml-8">Comprehensive access and flexibility. Billed monthly.</p>
                </div>
                
                {/* Pro Plan */}
                <div 
                  className={`border rounded-lg p-4 mb-6 cursor-pointer transition-all ${selectedPlan === 'pro' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                  onClick={() => setSelectedPlan('pro')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${selectedPlan === 'pro' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'} mr-3 flex items-center justify-center`}>
                        {selectedPlan === 'pro' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <h4 className="font-semibold text-lg">Pro</h4>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">$0.26</span>
                      <span className="text-gray-500 ml-1">/day</span>
                    </div>
                  </div>
                  <div className="flex justify-between ml-8">
                    <p className="text-gray-600">Best value for complete access. Billed yearly.</p>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Save 51%
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleContinue}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <span>CONTINUE</span>
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                
                <div className="mt-8">
                  <h4 className="text-center font-semibold text-gray-700 mb-4 relative">
                    <span className="bg-white px-4 relative z-10">Your plan includes</span>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200 z-0"></div>
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Check className="w-5 h-5 text-purple-600 mr-2" />
                        <h5 className="font-semibold">Academic tools</h5>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Like Essay Writer, Report Writer, AI Detector, Researcher, Essay Grader...</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Check className="w-5 h-5 text-purple-600 mr-2" />
                        <h5 className="font-semibold">Business tools</h5>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Like Logo Generator, Presentation Generator, Business Plan Generator...</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Check className="w-5 h-5 text-purple-600 mr-2" />
                        <h5 className="font-semibold">Lifestyle tools</h5>
                      </div>
                      <p className="text-sm text-gray-600 ml-7">Like Recipe Generator, Workout Planner, Travel Itinerary...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;