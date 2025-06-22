import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Star, 
  DollarSign, 
  BookOpen, 
  Briefcase, 
  Users,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  userType?: 'student' | 'business' | 'jobseeker' | 'general';
}

const Dashboard: React.FC<DashboardProps> = ({ userType = 'general' }) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedOpportunities, setSavedOpportunities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [creditUsage, setCreditUsage] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on user type
      let searches: string[] = [];
      let opportunities: any[] = [];
      let recs: any[] = [];
      
      switch (userType) {
        case 'student':
          searches = ['scholarship for engineering', 'research grant biology', 'international student funding'];
          opportunities = [
            { id: 1, title: 'Merit Scholarship Program', organization: 'National Science Foundation', amount: '$5,000', deadline: '2025-08-15', type: 'scholarship' },
            { id: 2, title: 'Graduate Research Fellowship', organization: 'Department of Education', amount: '$25,000', deadline: '2025-09-30', type: 'grant' },
            { id: 3, title: 'International Student Fund', organization: 'Global Education Initiative', amount: '$3,500', deadline: '2025-07-22', type: 'scholarship' }
          ];
          recs = [
            { id: 1, title: 'STEM Excellence Scholarship', match: '95%', type: 'scholarship' },
            { id: 2, title: 'Undergraduate Research Grant', match: '87%', type: 'grant' },
            { id: 3, title: 'Academic Achievement Award', match: '82%', type: 'scholarship' }
          ];
          break;
          
        case 'business':
          searches = ['small business grant', 'startup funding', 'innovation grant technology'];
          opportunities = [
            { id: 1, title: 'Small Business Innovation Grant', organization: 'Economic Development Agency', amount: '$50,000', deadline: '2025-08-10', type: 'grant' },
            { id: 2, title: 'Tech Startup Accelerator Program', organization: 'Innovation Hub', amount: '$75,000', deadline: '2025-09-15', type: 'funding' },
            { id: 3, title: 'Green Business Initiative', organization: 'Environmental Protection Fund', amount: '$30,000', deadline: '2025-07-30', type: 'grant' }
          ];
          recs = [
            { id: 1, title: 'Business Expansion Grant', match: '93%', type: 'grant' },
            { id: 2, title: 'Angel Investor Network', match: '89%', type: 'investment' },
            { id: 3, title: 'R&D Tax Credit Program', match: '85%', type: 'tax credit' }
          ];
          break;
          
        case 'jobseeker':
          searches = ['career development grant', 'professional certification funding', 'job training program'];
          opportunities = [
            { id: 1, title: 'Career Transition Assistance', organization: 'Department of Labor', amount: '$3,000', deadline: '2025-08-05', type: 'grant' },
            { id: 2, title: 'Professional Certification Scholarship', organization: 'Industry Association', amount: '$1,500', deadline: '2025-09-20', type: 'scholarship' },
            { id: 3, title: 'Skills Development Program', organization: 'Workforce Development Agency', amount: '$2,500', deadline: '2025-07-25', type: 'program' }
          ];
          recs = [
            { id: 1, title: 'Technical Skills Grant', match: '94%', type: 'grant' },
            { id: 2, title: 'Leadership Development Scholarship', match: '88%', type: 'scholarship' },
            { id: 3, title: 'Industry Transition Program', match: '83%', type: 'program' }
          ];
          break;
          
        default:
          searches = ['community grant', 'personal development funding', 'nonprofit organization grant'];
          opportunities = [
            { id: 1, title: 'Community Development Grant', organization: 'Local Foundation', amount: '$10,000', deadline: '2025-08-20', type: 'grant' },
            { id: 2, title: 'Personal Growth Scholarship', organization: 'Education Trust', amount: '$2,000', deadline: '2025-09-10', type: 'scholarship' },
            { id: 3, title: 'Nonprofit Capacity Building Grant', organization: 'Community Foundation', amount: '$15,000', deadline: '2025-07-15', type: 'grant' }
          ];
          recs = [
            { id: 1, title: 'Arts & Culture Grant', match: '91%', type: 'grant' },
            { id: 2, title: 'Community Leadership Program', match: '86%', type: 'program' },
            { id: 3, title: 'Social Impact Fund', match: '80%', type: 'funding' }
          ];
      }
      
      // Mock credit usage data
      const usage = [
        { date: '2025-06-15', credits: 10, activity: 'Search: ' + searches[0] },
        { date: '2025-06-17', credits: 5, activity: 'Document generation' },
        { date: '2025-06-20', credits: 15, activity: 'Advanced search' }
      ];
      
      setRecentSearches(searches);
      setSavedOpportunities(opportunities);
      setRecommendations(recs);
      setCreditUsage(usage);
      setIsLoading(false);
    };
    
    fetchDashboardData();
  }, [userType]);

  // Get user-specific welcome message and stats
  const getUserWelcomeMessage = () => {
    switch (userType) {
      case 'student':
        return 'Find scholarships and research grants tailored to your academic profile.';
      case 'business':
        return 'Discover funding opportunities to grow your business and connect with investors.';
      case 'jobseeker':
        return 'Access career development resources and funding for professional growth.';
      default:
        return 'Explore funding opportunities customized to your specific needs.';
    }
  };

  const getStats = () => {
    switch (userType) {
      case 'student':
        return [
          { label: 'Scholarships', value: '15,420', icon: <BookOpen className="w-5 h-5 text-blue-400" /> },
          { label: 'Research Grants', value: '8,753', icon: <Search className="w-5 h-5 text-green-400" /> },
          { label: 'Educational Programs', value: '3,289', icon: <Users className="w-5 h-5 text-purple-400" /> },
          { label: 'Total Funding', value: '$1.2B', icon: <DollarSign className="w-5 h-5 text-yellow-400" /> }
        ];
      case 'business':
        return [
          { label: 'Business Grants', value: '9,845', icon: <Briefcase className="w-5 h-5 text-blue-400" /> },
          { label: 'Investors', value: '2,130', icon: <Users className="w-5 h-5 text-green-400" /> },
          { label: 'Tax Credits', value: '1,756', icon: <DollarSign className="w-5 h-5 text-purple-400" /> },
          { label: 'Total Funding', value: '$3.5B', icon: <TrendingUp className="w-5 h-5 text-yellow-400" /> }
        ];
      case 'jobseeker':
        return [
          { label: 'Career Grants', value: '5,280', icon: <Briefcase className="w-5 h-5 text-blue-400" /> },
          { label: 'Training Programs', value: '3,975', icon: <BookOpen className="w-5 h-5 text-green-400" /> },
          { label: 'Certifications', value: '2,340', icon: <Star className="w-5 h-5 text-purple-400" /> },
          { label: 'Total Funding', value: '$850M', icon: <DollarSign className="w-5 h-5 text-yellow-400" /> }
        ];
      default:
        return [
          { label: 'Grants', value: '12,750', icon: <DollarSign className="w-5 h-5 text-blue-400" /> },
          { label: 'Programs', value: '5,430', icon: <Users className="w-5 h-5 text-green-400" /> },
          { label: 'Resources', value: '8,920', icon: <BookOpen className="w-5 h-5 text-purple-400" /> },
          { label: 'Total Funding', value: '$2.8B', icon: <TrendingUp className="w-5 h-5 text-yellow-400" /> }
        ];
    }
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-900 to-gray-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome to your Granada Dashboard</h1>
        <p className="text-gray-300 mb-4">{getUserWelcomeMessage()}</p>
        <div className="flex flex-wrap gap-4">
          <Link 
            to="/dashboard/search" 
            className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            New Search
          </Link>
          <Link 
            to="/dashboard/credits" 
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Buy Credits
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-700 p-3 rounded-lg">
                {stat.icon}
              </div>
              <span className="text-2xl font-bold text-white">{stat.value}</span>
            </div>
            <h3 className="text-gray-400 font-medium">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Searches */}
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
          <div className="p-4 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-400" />
              Recent Searches
            </h2>
            <Link to="/dashboard/search-history" className="text-sm text-purple-400 hover:text-purple-300">
              View All
            </Link>
          </div>
          <div className="p-4">
            {recentSearches.length > 0 ? (
              <ul className="space-y-2">
                {recentSearches.map((search, index) => (
                  <li key={index}>
                    <Link 
                      to={`/dashboard/search?q=${encodeURIComponent(search)}`}
                      className="flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      <Search className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-300">{search}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">No recent searches</p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Opportunities */}
        <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
          <div className="p-4 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Saved Opportunities
            </h2>
            <Link to="/dashboard/saved" className="text-sm text-purple-400 hover:text-purple-300">
              View All
            </Link>
          </div>
          <div className="p-4">
            {savedOpportunities.length > 0 ? (
              <ul className="space-y-3">
                {savedOpportunities.map((opportunity) => (
                  <li key={opportunity.id} className="border border-gray-700 rounded-md overflow-hidden">
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-white">{opportunity.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          opportunity.type === 'scholarship' ? 'bg-blue-900 text-blue-300' :
                          opportunity.type === 'grant' ? 'bg-green-900 text-green-300' :
                          'bg-purple-900 text-purple-300'
                        }`}>
                          {opportunity.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{opportunity.organization}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{opportunity.amount}</span>
                        <span className="text-gray-400">Due: {opportunity.deadline}</span>
                      </div>
                    </div>
                    <div className="bg-gray-700 p-2 flex justify-end">
                      <Link 
                        to={`/dashboard/opportunity/${opportunity.id}`}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
                      >
                        View Details
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">No saved opportunities</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations & Credit Usage */}
        <div className="space-y-6">
          {/* Recommendations */}
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
            <div className="p-4 bg-gray-700 border-b border-gray-600">
              <h2 className="font-semibold text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Recommended For You
              </h2>
            </div>
            <div className="p-4">
              {recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.map((rec) => (
                    <li key={rec.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded-md transition-colors">
                      <div>
                        <h3 className="font-medium text-white">{rec.title}</h3>
                        <span className={`text-xs ${
                          rec.type === 'scholarship' ? 'text-blue-400' :
                          rec.type === 'grant' ? 'text-green-400' :
                          'text-purple-400'
                        }`}>
                          {rec.type}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-green-400 mr-2">{rec.match}</span>
                        <Link 
                          to={`/dashboard/recommendation/${rec.id}`}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No recommendations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Credit Usage */}
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700">
            <div className="p-4 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
              <h2 className="font-semibold text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-400" />
                Credit Usage
              </h2>
              <Link to="/dashboard/credits" className="text-sm text-purple-400 hover:text-purple-300">
                Details
              </Link>
            </div>
            <div className="p-4">
              {creditUsage.length > 0 ? (
                <ul className="space-y-2">
                  {creditUsage.map((usage, index) => (
                    <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded-md transition-colors">
                      <div>
                        <p className="text-sm text-gray-300">{usage.activity}</p>
                        <p className="text-xs text-gray-500">{usage.date}</p>
                      </div>
                      <span className="text-sm font-medium text-purple-400">-{usage.credits}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No credit usage yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Purchase CTA */}
      <div className="bg-gradient-to-r from-purple-900 to-gray-800 rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold mb-2">Need more credits?</h2>
          <p className="text-gray-300">Purchase credits to continue searching and accessing premium features.</p>
        </div>
        <Link 
          to="/dashboard/credits" 
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          Buy Credits
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;