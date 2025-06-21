import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Target, 
  Download, 
  Eye,
  Star,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  Globe,
  MapPin,
  Tag,
  Zap,
  Bot,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Send,
  Info,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { realDonorSearchEngine, RealDonorOpportunity, SearchFilters } from '../services/realDonorSearchEngine';
import BotStatusPanel from './DonorDiscovery/BotStatusPanel';
import ViewDetailsButton from './DonorDiscovery/ViewDetailsButton';
import ApplyButton from './DonorDiscovery/ApplyButton';
import ScreenshotViewer from './DonorDiscovery/ScreenshotViewer';
import InteractiveTooltip from './shared/InteractiveTooltip';

const DonorDiscovery: React.FC = () => {
  const { user, deductCredits } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, setOpportunities] = useState<RealDonorOpportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<RealDonorOpportunity | null>(null);
  const [showOpportunityDetails, setShowOpportunityDetails] = useState(false);
  const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState<Set<string>>(new Set());
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotTitle, setScreenshotTitle] = useState('');
  const [showBotStatus, setShowBotStatus] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState<SearchFilters>({
    countries: [],
    sectors: [],
    fundingRange: { min: undefined, max: undefined },
    donorTypes: [],
    verified: false
  });
  
  // Available filter options
  const countries = [
    'Global', 'Kenya', 'Nigeria', 'South Sudan', 'Uganda', 'Tanzania', 
    'Rwanda', 'Ghana', 'South Africa', 'Senegal', 'United States', 
    'United Kingdom', 'Germany', 'France'
  ];
  
  const sectors = [
    'Education', 'Health', 'Environment', 'Climate Change', 'Water & Sanitation',
    'Agriculture', 'Economic Development', 'Human Rights', 'Gender Equality',
    'Youth', 'Technology', 'Arts & Culture', 'Humanitarian Aid', 'Peace & Security'
  ];
  
  const donorTypes = [
    'foundation', 'government', 'multilateral', 'corporate', 'individual'
  ];

  // Check for query params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
    
    // Check if there's a state with query from navigation
    if (location.state && location.state.query) {
      setSearchQuery(location.state.query);
      handleSearch(location.state.query);
    }
  }, [location]);

  const handleSearch = async (query: string = searchQuery) => {
    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    
    try {
      // Deduct credits based on search type
      if (useAI) {
        if (!deductCredits(15)) {
          setError('Insufficient credits for AI-enhanced search. Please purchase more credits or use basic search.');
          setLoading(false);
          return;
        }
      } else {
        if (!deductCredits(5)) {
          setError('Insufficient credits for search. Please purchase more credits.');
          setLoading(false);
          return;
        }
      }
      
      // Perform search
      const result = await realDonorSearchEngine.searchOpportunities(query, filters, useAI);
      setOpportunities(result.opportunities);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search for opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'country':
          newFilters.countries = [value];
          break;
        case 'sector':
          newFilters.sectors = [value];
          break;
        case 'minAmount':
          newFilters.fundingRange = { ...prev.fundingRange, min: value ? parseInt(value) : undefined };
          break;
        case 'maxAmount':
          newFilters.fundingRange = { ...prev.fundingRange, max: value ? parseInt(value) : undefined };
          break;
        case 'donorType':
          newFilters.donorTypes = [value];
          break;
        case 'verified':
          newFilters.verified = value;
          break;
      }
      
      return newFilters;
    });
  };

  const resetFilters = () => {
    setFilters({
      countries: [],
      sectors: [],
      fundingRange: { min: undefined, max: undefined },
      donorTypes: [],
      verified: false
    });
  };

  const toggleBookmark = (opportunityId: string) => {
    setBookmarkedOpportunities(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(opportunityId)) {
        newBookmarks.delete(opportunityId);
      } else {
        newBookmarks.add(opportunityId);
      }
      return newBookmarks;
    });
  };

  const viewOpportunityDetails = (opportunity: RealDonorOpportunity) => {
    setSelectedOpportunity(opportunity);
    setShowOpportunityDetails(true);
  };

  const viewSourceWebsite = (url: string, title: string) => {
    setScreenshotUrl(url);
    setScreenshotTitle(title);
    setShowScreenshot(true);
  };

  const formatCurrency = (min?: number, max?: number, currency: string = 'USD') => {
    if (!min && !max) return 'Amount not specified';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    });
    
    if (min && max && min === max) {
      return formatter.format(min);
    } else if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`;
    } else if (min) {
      return `From ${formatter.format(min)}`;
    } else if (max) {
      return `Up to ${formatter.format(max)}`;
    }
    
    return 'Amount not specified';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No deadline specified';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'Deadline passed';
    } else if (diffDays === 0) {
      return 'Deadline today!';
    } else if (diffDays === 1) {
      return 'Deadline tomorrow!';
    } else if (diffDays <= 7) {
      return `${diffDays} days left`;
    } else if (diffDays <= 30) {
      return `${Math.floor(diffDays / 7)} weeks left`;
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  const getDeadlineColor = (dateString?: string) => {
    if (!dateString) return 'text-slate-400';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return 'text-red-400';
    } else if (diffDays <= 7) {
      return 'text-orange-400';
    } else if (diffDays <= 30) {
      return 'text-yellow-400';
    } else {
      return 'text-green-400';
    }
  };

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    
    if (score >= 90) {
      return 'text-green-400';
    } else if (score >= 75) {
      return 'text-blue-400';
    } else if (score >= 60) {
      return 'text-yellow-400';
    } else {
      return 'text-slate-400';
    }
  };

  const renderOpportunityDetails = () => {
    if (!selectedOpportunity) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-white">{selectedOpportunity.title}</h2>
                {selectedOpportunity.isVerified && (
                  <div className="px-2 py-1 bg-green-600/20 text-green-400 rounded-lg text-xs font-medium">
                    Verified
                  </div>
                )}
              </div>
              <p className="text-slate-400">{selectedOpportunity.donor.name}</p>
            </div>
            <button
              onClick={() => setShowOpportunityDetails(false)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-slate-300 whitespace-pre-line">{selectedOpportunity.description}</p>
                </div>
                
                {/* Eligibility */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Eligibility</h3>
                  <ul className="space-y-2">
                    {selectedOpportunity.eligibility.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2 text-slate-300">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Application Process */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Application Process</h3>
                  <p className="text-slate-300 whitespace-pre-line">{selectedOpportunity.applicationProcess}</p>
                </div>
                
                {/* Focus Areas */}
                {selectedOpportunity.focusAreas && selectedOpportunity.focusAreas.length > 0 && (
                  <div className="bg-slate-700/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Focus Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.focusAreas.map((area, index) => (
                        <div key={index} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-sm">
                          {area}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Key Details */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Amount:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(
                          selectedOpportunity.fundingAmount.min,
                          selectedOpportunity.fundingAmount.max,
                          selectedOpportunity.fundingAmount.currency
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Deadline:</span>
                      <span className={`font-medium ${getDeadlineColor(selectedOpportunity.deadline?.application?.toString())}`}>
                        {formatDate(selectedOpportunity.deadline?.application?.toString())}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Country:</span>
                      <span className="text-white font-medium">{selectedOpportunity.donor.country}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Donor Type:</span>
                      <span className="text-white font-medium capitalize">{selectedOpportunity.donor.type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Match Score:</span>
                      <span className={`font-medium ${getMatchScoreColor(selectedOpportunity.matchScore)}`}>
                        {selectedOpportunity.matchScore ? `${selectedOpportunity.matchScore}%` : 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Last Updated:</span>
                      <span className="text-white font-medium">
                        {new Date(selectedOpportunity.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Donor Information */}
                <div className="bg-slate-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Donor Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-slate-400 block mb-1">Organization:</span>
                      <span className="text-white font-medium">{selectedOpportunity.donor.name}</span>
                    </div>
                    
                    <div>
                      <span className="text-slate-400 block mb-1">Website:</span>
                      <a 
                        href={selectedOpportunity.donor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    
                    {selectedOpportunity.contactInfo?.email && (
                      <div>
                        <span className="text-slate-400 block mb-1">Contact Email:</span>
                        <a 
                          href={`mailto:${selectedOpportunity.contactInfo.email}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {selectedOpportunity.contactInfo.email}
                        </a>
                      </div>
                    )}
                    
                    {selectedOpportunity.contactInfo?.phone && (
                      <div>
                        <span className="text-slate-400 block mb-1">Contact Phone:</span>
                        <a 
                          href={`tel:${selectedOpportunity.contactInfo.phone}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {selectedOpportunity.contactInfo.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-3">
                  <ApplyButton 
                    opportunity={selectedOpportunity} 
                    variant="primary" 
                    className="w-full"
                    showTooltip
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => viewSourceWebsite(selectedOpportunity.sourceUrl, selectedOpportunity.donor.name)}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>View Source Website</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleBookmark(selectedOpportunity.id)}
                    className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl transition-all ${
                      bookmarkedOpportunities.has(selectedOpportunity.id)
                        ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${bookmarkedOpportunities.has(selectedOpportunity.id) ? 'fill-current' : ''}`} />
                    <span>{bookmarkedOpportunities.has(selectedOpportunity.id) ? 'Bookmarked' : 'Bookmark'}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-600/20 rounded-xl">
            <Target className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Donor Discovery</h1>
            <p className="text-slate-300">Find and match with relevant funding opportunities</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowBotStatus(!showBotStatus)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden md:inline">Bot Status</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden md:inline">Filters</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        id="search-section"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for funding opportunities, donors, or sectors..."
                className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3" id="ai-enhanced-toggle">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={() => setUseAI(!useAI)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ml-3 text-sm font-medium text-slate-300 peer-checked:text-purple-400">
                  AI Enhanced
                </span>
              </label>
              
              <InteractiveTooltip
                content={
                  <div className="space-y-2">
                    <p>AI-enhanced search uses advanced algorithms to find better matches for your organization.</p>
                    <p>This uses 15 credits instead of 5, but provides significantly better results.</p>
                  </div>
                }
                title="AI-Enhanced Search"
                showGem={true}
                gemCost={15}
              >
                <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
              </InteractiveTooltip>
            </div>
            
            <div className="text-sm text-slate-400">
              Cost: <span className="text-emerald-400 font-medium">{useAI ? '15' : '5'} credits</span>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Search Filters</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={resetFilters}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Reset Filters
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Country Filter */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Country</label>
                  <select
                    value={filters.countries?.[0] || ''}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sector Filter */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Sector</label>
                  <select
                    value={filters.sectors?.[0] || ''}
                    onChange={(e) => handleFilterChange('sector', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Sectors</option>
                    {sectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                
                {/* Donor Type Filter */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Donor Type</label>
                  <select
                    value={filters.donorTypes?.[0] || ''}
                    onChange={(e) => handleFilterChange('donorType', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Donor Types</option>
                    {donorTypes.map(type => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                
                {/* Funding Range */}
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Minimum Funding</label>
                  <input
                    type="number"
                    value={filters.fundingRange?.min || ''}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Min Amount"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 font-medium mb-2">Maximum Funding</label>
                  <input
                    type="number"
                    value={filters.fundingRange?.max || ''}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Max Amount"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Verified Only */}
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.verified || false}
                      onChange={(e) => handleFilterChange('verified', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    <span className="ml-3 text-sm font-medium text-slate-300 peer-checked:text-green-400">
                      Verified Opportunities Only
                    </span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                >
                  <Filter className="w-5 h-5" />
                  <span>Apply Filters</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bot Status Panel */}
      <AnimatePresence>
        {showBotStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <BotStatusPanel />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
            <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Searching for Opportunities</h3>
            <p className="text-slate-400">
              {useAI 
                ? 'Our AI is analyzing funding sources to find the best matches for you...' 
                : 'Searching for relevant funding opportunities...'}
            </p>
          </div>
        ) : error ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Error</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => handleSearch()}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
            >
              Try Again
            </motion.button>
          </div>
        ) : opportunities.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Found {opportunities.length} Opportunities
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSearch()}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opportunity) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all"
                  id="opportunity-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">{opportunity.title}</h4>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleBookmark(opportunity.id)}
                      className="p-1 text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                      <Star className={`w-5 h-5 ${bookmarkedOpportunities.has(opportunity.id) ? 'text-yellow-400 fill-current' : ''}`} />
                    </motion.button>
                  </div>
                  
                  <p className="text-slate-400 mb-4 line-clamp-2">{opportunity.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">
                          {formatCurrency(
                            opportunity.fundingAmount.min,
                            opportunity.fundingAmount.max,
                            opportunity.fundingAmount.currency
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className={getDeadlineColor(opportunity.deadline?.application?.toString())}>
                          {formatDate(opportunity.deadline?.application?.toString())}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300">{opportunity.donor.country}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className={getMatchScoreColor(opportunity.matchScore)}>
                          {opportunity.matchScore ? `${opportunity.matchScore}% Match` : 'No Match Score'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <ViewDetailsButton 
                      onClick={() => viewOpportunityDetails(opportunity)} 
                      className="flex-1"
                      showTooltip
                    />
                    <ApplyButton 
                      opportunity={opportunity} 
                      size="sm" 
                      className="flex-1"
                      showTooltip
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : searchPerformed ? (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Opportunities Found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search terms or filters</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={resetFilters}
              className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700 transition-all"
            >
              Reset Filters
            </motion.button>
          </div>
        ) : (
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-700/50 text-center">
            <Target className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Discover Funding Opportunities</h3>
            <p className="text-slate-400 mb-6">Search for grants, funding programs, and donor opportunities</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSearch('Education')}
                className="px-6 py-3 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-all"
              >
                Education Funding
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSearch('Health')}
                className="px-6 py-3 bg-green-600/20 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-600/30 transition-all"
              >
                Health Grants
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSearch('Climate')}
                className="px-6 py-3 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-all"
              >
                Climate Initiatives
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Opportunity Details Modal */}
      {renderOpportunityDetails()}

      {/* Screenshot Viewer */}
      <ScreenshotViewer
        url={screenshotUrl}
        isOpen={showScreenshot}
        onClose={() => setShowScreenshot(false)}
        title={screenshotTitle}
      />
    </div>
  );
};

export default DonorDiscovery;