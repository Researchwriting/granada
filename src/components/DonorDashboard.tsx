import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  Target, 
  BarChart3,
  TrendingUp,
  ArrowUp,
  CheckCircle,
  Clock,
  Search,
  Sparkles,
  Calendar,
  AlertTriangle,
  Users,
  Star,
  Eye,
  Edit,
  Plus,
  Gem,
  Bell,
  Settings,
  RefreshCw,
  MapPin,
  Flag,
  Zap,
  Lightbulb,
  Award,
  Gift,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardStats, ActivityItem } from '../types';
import { realDonorSearchEngine } from '../services/realDonorSearchEngine';

const DonorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, deductCredits } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalFundingSecured: 2300000,
    fundingGrowth: 12.5,
    activeProposals: 24,
    proposalGrowth: 8,
    matchedDonors: 156,
    donorGrowth: 15,
    successRate: 89
  });

  const [recentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'grant_approved',
      title: 'Grant Approved',
      description: 'Gates Foundation - $500K',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: 'check'
    },
    {
      id: '2',
      type: 'proposal_submitted',
      title: 'Proposal Submitted',
      description: 'Climate Action Initiative',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      icon: 'file'
    },
    {
      id: '3',
      type: 'donor_match',
      title: 'New Donor Match',
      description: '15 potential funders found',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      icon: 'target'
    },
    {
      id: '4',
      type: 'ai_proposal',
      title: 'Professional Proposal',
      description: 'Education for All project',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: 'sparkles'
    }
  ]);

  const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState([
    { id: '1', title: 'USAID Digital Literacy Grant', donor: 'USAID', deadline: '15 days', amount: '$250K' },
    { id: '2', title: 'Ford Foundation Education', donor: 'Ford Foundation', deadline: '8 days', amount: '$150K' },
    { id: '3', title: 'Gates Health Initiative', donor: 'Gates Foundation', deadline: '22 days', amount: '$500K' }
  ]);
  
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [countryFlag, setCountryFlag] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingOpportunities] = useState([
    { id: '5', title: 'Climate Resilience Fund', donor: 'World Bank', deadline: '30 days', amount: '$750K', match: '94%' },
    { id: '6', title: 'Youth Empowerment Program', donor: 'UNICEF', deadline: '45 days', amount: '$350K', match: '92%' },
    { id: '7', title: 'Digital Innovation Grant', donor: 'Google.org', deadline: '60 days', amount: '$200K', match: '90%' }
  ]);
  const [showCreditAnimation, setShowCreditAnimation] = useState(false);
  const [featuredOpportunity] = useState({
    title: "Global Innovation Challenge",
    donor: "Bill & Melinda Gates Foundation",
    amount: "$1.5M",
    deadline: "30 days remaining",
    description: "Seeking innovative solutions to address global health challenges with a focus on technology-enabled approaches.",
    match: 96
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Get user's country from search engine
    const country = realDonorSearchEngine.getUserCountry();
    if (country) {
      setUserCountry(country);
      setCountryFlag(realDonorSearchEngine.getFlagEmoji(realDonorSearchEngine.getCountryCode(country)));
      
      // Update bookmarked opportunities to include country-specific ones
      if (country !== 'Global') {
        const countryOpportunity = {
          id: '4',
          title: `${country} Development Fund`,
          donor: `${country} Ministry of Finance`,
          deadline: '30 days',
          amount: '$300K'
        };
        setBookmarkedOpportunities(prev => [...prev, countryOpportunity]);
      }
    }

    // Add 10,000 credits for testing
    const addTestingCredits = () => {
      deductCredits(-10000); // Negative deduction = adding credits
      setShowCreditAnimation(true);
      setTimeout(() => setShowCreditAnimation(false), 5000);
    };
    
    addTestingCredits();

    return () => clearTimeout(timer);
  }, []);

  const getFlagEmoji = (country: string): string => {
    // Convert country name to ISO code (simplified)
    const countryCodes: Record<string, string> = {
      'Kenya': 'KE',
      'Nigeria': 'NG',
      'South Africa': 'ZA',
      'Ghana': 'GH',
      'Uganda': 'UG',
      'Tanzania': 'TZ',
      'Rwanda': 'RW',
      'Senegal': 'SN',
      'Mali': 'ML',
      'Ivory Coast': 'CI',
      'Cameroon': 'CM',
      'South Sudan': 'SS',
      'United States': 'US',
      'United Kingdom': 'GB',
      'Germany': 'DE',
      'France': 'FR'
    };
    
    const code = countryCodes[country] || '';
    if (!code) return '🌍';
    
    // Convert country code to flag emoji
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    
    return String.fromCodePoint(...codePoints);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'grant_approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'proposal_submitted': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'donor_match': return <Target className="w-5 h-5 text-purple-500" />;
      case 'ai_proposal': return <Sparkles className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const handleStatClick = (statType: string) => {
    switch (statType) {
      case 'funding':
        navigate('/funding');
        break;
      case 'proposals':
        navigate('/proposals');
        break;
      case 'donors':
        navigate('/donor-discovery');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      default:
        break;
    }
  };

  const handleActivityClick = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'grant_approved':
      case 'proposal_submitted':
        navigate('/funding');
        break;
      case 'donor_match':
        navigate('/donor-discovery');
        break;
      case 'ai_proposal':
        navigate('/proposal-generator');
        break;
      default:
        break;
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'ai-proposal':
        navigate('/proposal-generator');
        break;
      case 'find-donors':
        navigate('/donor-discovery');
        break;
      case 'view-analytics':
        navigate('/analytics');
        break;
      case 'manage-projects':
        navigate('/projects');
        break;
      default:
        break;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/donor-discovery', { state: { query: searchQuery } });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Loading Dashboard</h3>
          <p className="text-slate-400">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Credit Animation */}
      {showCreditAnimation && (
        <motion.div 
          initial={{ opacity: 0, y: -50, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.5 }}
          className="fixed top-20 right-10 z-50 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-4 rounded-xl shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <Gift className="w-6 h-6 animate-bounce" />
            <div>
              <p className="font-bold text-lg">+10,000 Credits Added!</p>
              <p className="text-sm">Thank you for testing our system</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome back, Granada! 👋
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl">
              Here's what's happening with your impact organization today.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {userCountry && (
              <div className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">{userCountry}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="max-w-3xl mt-6"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for funding opportunities, donors, or sectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 pr-20 bg-slate-700/50 border border-slate-600/50 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all"
            >
              Find
            </motion.button>
          </div>
        </motion.form>

        {/* User Profile Card - Clickable */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/settings')}
            className="inline-flex items-center space-x-4 px-6 py-4 bg-slate-700/50 rounded-2xl border border-slate-600/50 hover:border-blue-500/30 hover:bg-slate-700/80 transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                GA
              </span>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">Granada Admin</h3>
              <div className="flex items-center space-x-2">
                <p className="text-slate-400">Executive Director</p>
                {userCountry && (
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-400">•</span>
                    <span className="text-lg" role="img" aria-label={`Flag of ${userCountry}`}>
                      {countryFlag || '🌍'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Opportunity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-800/50 shadow-lg"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Featured Opportunity</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{featuredOpportunity.title}</h2>
            <p className="text-slate-300 mb-4">{featuredOpportunity.description}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="px-3 py-1 bg-slate-700/50 rounded-lg text-sm">
                <span className="font-medium text-white">{featuredOpportunity.donor}</span>
              </div>
              <div className="px-3 py-1 bg-slate-700/50 rounded-lg text-sm">
                <span className="font-medium text-white">{featuredOpportunity.amount}</span>
              </div>
              <div className="px-3 py-1 bg-slate-700/50 rounded-lg text-sm">
                <span className="font-medium text-white">{featuredOpportunity.deadline}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/donor-discovery')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <span>View Opportunity</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-blue-400/10 rounded-full"></div>
              <div className="absolute inset-2 bg-blue-400/20 rounded-full"></div>
              <div className="absolute inset-4 bg-blue-400/30 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">{featuredOpportunity.match}%</div>
                  <div className="text-sm text-blue-300">Match Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - All Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-stats">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          onClick={() => handleStatClick('funding')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-green-500/30 hover:bg-slate-700/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-900/30 rounded-xl group-hover:bg-green-900/50 transition-colors">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+{stats.fundingGrowth}%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            ${(stats.totalFundingSecured / 1000000).toFixed(1)}M
          </h3>
          <p className="text-slate-400">Total Funding Secured</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
          onClick={() => handleStatClick('proposals')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-700/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-900/30 rounded-xl group-hover:bg-blue-900/50 transition-colors">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+{stats.proposalGrowth}</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.activeProposals}</h3>
          <p className="text-slate-400">Active Proposals</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
          onClick={() => handleStatClick('donors')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/30 hover:bg-slate-700/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-900/30 rounded-xl group-hover:bg-purple-900/50 transition-colors">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>+{stats.donorGrowth}</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.matchedDonors}</h3>
          <p className="text-slate-400">Matched Donors</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05, y: -5 }}
          onClick={() => handleStatClick('analytics')}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-orange-500/30 hover:bg-slate-700/80 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-900/30 rounded-xl group-hover:bg-orange-900/50 transition-colors">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-orange-400 text-sm font-medium">{stats.successRate}%</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{stats.successRate}%</h3>
          <p className="text-slate-400">Success Rate</p>
        </motion.div>
      </div>

      {/* Trending Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Trending Opportunities</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/donor-discovery')}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
          >
            View All <ArrowUp className="w-3 h-3 ml-1 transform rotate-45" />
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/donor-discovery')}
              className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 hover:border-blue-500/30 hover:bg-slate-700/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{opportunity.title}</h4>
                <div className="px-2 py-1 bg-green-900/30 text-green-400 rounded-lg text-xs font-medium">
                  {opportunity.match}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-3">{opportunity.donor}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1 text-orange-400">
                  <Clock className="w-4 h-4" />
                  <span>{opportunity.deadline}</span>
                </div>
                <span className="text-blue-400 font-medium">{opportunity.amount}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funding Pipeline Chart - Clickable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/analytics')}
          className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-700/80 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Funding Pipeline</h3>
            <div className="flex items-center space-x-3">
              <select className="bg-slate-700/50 text-slate-300 rounded-lg px-3 py-2 border border-slate-600/50">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>This year</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          {/* Interactive Chart */}
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 40}
                  x2="400"
                  y2={i * 40}
                  stroke="rgba(71, 85, 105, 0.3)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Funding Secured Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                d="M 0 160 Q 100 140 200 100 T 400 80"
                fill="none"
                stroke="rgb(59 130 246)"
                strokeWidth="3"
                className="hover:stroke-blue-400 cursor-pointer"
              />
              
              {/* Applications Submitted Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.7 }}
                d="M 0 180 Q 100 160 200 120 T 400 100"
                fill="none"
                stroke="rgb(147 51 234)"
                strokeWidth="3"
                className="hover:stroke-purple-400 cursor-pointer"
              />

              {/* Interactive Data Points */}
              {[80, 140, 200, 260, 320, 380].map((x, index) => (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={120 - index * 8}
                  r="4"
                  fill="rgb(59 130 246)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.5 }}
                  className="cursor-pointer"
                />
              ))}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">Funding Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">Applications Submitted</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity - All Items Clickable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => handleActivityClick(activity)}
                className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all cursor-pointer group"
              >
                <div className="p-2 bg-slate-600/50 rounded-lg group-hover:bg-slate-600 transition-colors">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{activity.title}</h4>
                  <p className="text-slate-400 text-sm">{activity.description}</p>
                  <p className="text-slate-500 text-xs mt-1">{formatTimeAgo(activity.timestamp)}</p>
                </div>
                <ArrowUp className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transform rotate-45 transition-all" />
              </motion.div>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/notifications')}
            className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            View All Activity →
          </motion.button>
        </motion.div>
      </div>

      {/* Quick Actions & Bookmarked Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions - All Clickable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
          id="quick-actions"
        >
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction('ai-proposal')}
              className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-700/30 rounded-xl text-left group hover:border-blue-500/50 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-blue-900/50 rounded-xl w-fit mb-4 group-hover:bg-blue-800/70 transition-colors">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Professional Proposal</h4>
              <p className="text-slate-400 text-sm">Generate with AI</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction('find-donors')}
              className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-700/30 rounded-xl text-left group hover:border-purple-500/50 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-purple-900/50 rounded-xl w-fit mb-4 group-hover:bg-purple-800/70 transition-colors">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Find Donors</h4>
              <p className="text-slate-400 text-sm">Discover opportunities</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction('view-analytics')}
              className="p-6 bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-700/30 rounded-xl text-left group hover:border-green-500/50 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-green-900/50 rounded-xl w-fit mb-4 group-hover:bg-green-800/70 transition-colors">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Analytics</h4>
              <p className="text-slate-400 text-sm">View insights</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAction('manage-projects')}
              className="p-6 bg-gradient-to-br from-orange-900/30 to-orange-800/30 border border-orange-700/30 rounded-xl text-left group hover:border-orange-500/50 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-orange-900/50 rounded-xl w-fit mb-4 group-hover:bg-orange-800/70 transition-colors">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Projects</h4>
              <p className="text-slate-400 text-sm">Manage projects</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Bookmarked Opportunities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Bookmarked Opportunities</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate('/donor-discovery')}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="space-y-4">
            {bookmarkedOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/donor-discovery')}
                className="p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{opportunity.title}</h4>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{opportunity.donor}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>Amount: {opportunity.amount}</span>
                      <span>Deadline: {opportunity.deadline}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/donor-discovery');
                      }}
                      className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/proposal-generator');
                      }}
                      className="p-1 text-slate-500 hover:text-green-400 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/donor-discovery')}
            className="w-full mt-4 py-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
          >
            View All Bookmarks →
          </motion.button>
        </motion.div>
      </div>

      {/* Funding Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-yellow-900/30 rounded-lg">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Funding Tips & Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
            <h4 className="font-medium text-white mb-2">Proposal Success Tip</h4>
            <p className="text-slate-400 text-sm">Focus on clear impact metrics and sustainability plans in your proposals to increase approval chances.</p>
          </div>
          
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
            <h4 className="font-medium text-white mb-2">Trending Sector</h4>
            <p className="text-slate-400 text-sm">Climate resilience funding is up 34% this quarter. Consider highlighting environmental aspects of your work.</p>
          </div>
          
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50">
            <h4 className="font-medium text-white mb-2">Upcoming Deadline</h4>
            <p className="text-slate-400 text-sm">UNDP Innovation Fund applications close in 14 days. <a href="#" className="text-blue-400">Start your application</a>.</p>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Deadlines - Clickable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Upcoming Deadlines</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate('/proposals')}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/proposals')}
            className="p-4 bg-red-900/20 border border-red-800/30 rounded-xl hover:border-red-700/50 hover:bg-red-900/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium group-hover:text-red-400 transition-colors">UN Climate Fund</h4>
                <p className="text-slate-400 text-sm">Final submission due</p>
              </div>
              <div className="text-right">
                <p className="text-red-400 font-bold">2 days</p>
                <p className="text-slate-500 text-xs">remaining</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/proposals')}
            className="p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-xl hover:border-yellow-700/50 hover:bg-yellow-900/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium group-hover:text-yellow-400 transition-colors">Ford Foundation</h4>
                <p className="text-slate-400 text-sm">Application deadline</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-bold">7 days</p>
                <p className="text-slate-500 text-xs">remaining</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Professional Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900/30 rounded-lg">
              <Award className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Professional Help</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate('/human-help')}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Users className="w-4 h-4" />
          </motion.button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/human-help')}
            className="flex-1 p-4 bg-green-900/20 border border-green-800/30 rounded-xl hover:border-green-700/50 hover:bg-green-900/30 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-green-900/50 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-white font-medium">Expert Consultation</h4>
            </div>
            <p className="text-slate-400 text-sm mb-3">Get personalized assistance from our funding experts</p>
            <div className="flex items-center text-green-400 text-sm font-medium">
              <span>Connect with an expert</span>
              <ArrowUp className="w-4 h-4 ml-1 transform rotate-45" />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/human-help')}
            className="flex-1 p-4 bg-blue-900/20 border border-blue-800/30 rounded-xl hover:border-blue-700/50 hover:bg-blue-900/30 transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-white font-medium">Proposal Review</h4>
            </div>
            <p className="text-slate-400 text-sm mb-3">Get professional feedback on your grant proposals</p>
            <div className="flex items-center text-blue-400 text-sm font-medium">
              <span>Submit for review</span>
              <ArrowUp className="w-4 h-4 ml-1 transform rotate-45" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DonorDashboard;