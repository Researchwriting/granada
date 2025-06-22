import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  BookOpen, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Bell,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Award,
  Target,
  MapPin,
  Heart
} from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'scholarship' | 'grant' | 'job' | 'volunteer' | 'training';
  amount?: string;
  location: string;
  deadline: string;
  status: 'available' | 'applied' | 'saved' | 'expired';
  description: string;
  category: string;
  matchPercentage: number;
}

interface SavedItem {
  id: string;
  title: string;
  type: string;
  savedDate: string;
  status: string;
}

const GeneralDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'saved' | 'applications' | 'profile'>('overview');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOpportunities([
        {
          id: '1',
          title: 'Community Leadership Scholarship',
          organization: 'Local Foundation',
          type: 'scholarship',
          amount: '$3,000',
          location: 'Nationwide',
          deadline: '2025-08-15',
          status: 'available',
          description: 'Supporting emerging community leaders.',
          category: 'Leadership',
          matchPercentage: 92
        },
        {
          id: '2',
          title: 'Environmental Research Grant',
          organization: 'Green Future Fund',
          type: 'grant',
          amount: '$25,000',
          location: 'California',
          deadline: '2025-09-30',
          status: 'available',
          description: 'Funding for environmental research projects.',
          category: 'Environment',
          matchPercentage: 88
        },
        {
          id: '3',
          title: 'Marketing Assistant',
          organization: 'Creative Agency',
          type: 'job',
          amount: '$45,000/year',
          location: 'Remote',
          deadline: '2025-07-20',
          status: 'applied',
          description: 'Entry-level marketing position with growth opportunities.',
          category: 'Marketing',
          matchPercentage: 85
        },
        {
          id: '4',
          title: 'Youth Mentorship Program',
          organization: 'Community Center',
          type: 'volunteer',
          location: 'Local',
          deadline: '2025-08-01',
          status: 'saved',
          description: 'Mentor young people in your community.',
          category: 'Education',
          matchPercentage: 95
        },
        {
          id: '5',
          title: 'Digital Skills Bootcamp',
          organization: 'TechLearn',
          type: 'training',
          amount: '$2,500',
          location: 'Online',
          deadline: '2025-07-30',
          status: 'available',
          description: 'Learn in-demand digital skills.',
          category: 'Technology',
          matchPercentage: 90
        }
      ]);

      setSavedItems([
        {
          id: '1',
          title: 'Youth Mentorship Program',
          type: 'Volunteer',
          savedDate: '2025-06-15',
          status: 'Active'
        },
        {
          id: '2',
          title: 'Small Business Grant',
          type: 'Grant',
          savedDate: '2025-06-10',
          status: 'Deadline Approaching'
        },
        {
          id: '3',
          title: 'Professional Development Course',
          type: 'Training',
          savedDate: '2025-06-08',
          status: 'Available'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-900';
      case 'applied': return 'text-blue-400 bg-blue-900';
      case 'saved': return 'text-yellow-400 bg-yellow-900';
      case 'expired': return 'text-red-400 bg-red-900';
      case 'Active': return 'text-green-400 bg-green-900';
      case 'Deadline Approaching': return 'text-orange-400 bg-orange-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'text-purple-400 bg-purple-900';
      case 'grant': return 'text-blue-400 bg-blue-900';
      case 'job': return 'text-green-400 bg-green-900';
      case 'volunteer': return 'text-yellow-400 bg-yellow-900';
      case 'training': return 'text-orange-400 bg-orange-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return <Award className="w-4 h-4" />;
      case 'grant': return <DollarSign className="w-4 h-4" />;
      case 'job': return <Target className="w-4 h-4" />;
      case 'volunteer': return <Heart className="w-4 h-4" />;
      case 'training': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-orange-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <span className="text-sm text-gray-300">Jane Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'opportunities', label: 'All Opportunities', icon: Search },
            { id: 'saved', label: 'Saved Items', icon: Heart },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'profile', label: 'Profile', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Scholarships</p>
                    <p className="text-2xl font-bold text-white">5</p>
                  </div>
                  <div className="bg-purple-900 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Grants</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <div className="bg-blue-900 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Jobs</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                  <div className="bg-green-900 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Volunteer</p>
                    <p className="text-2xl font-bold text-white">4</p>
                  </div>
                  <div className="bg-yellow-900 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Training</p>
                    <p className="text-2xl font-bold text-white">6</p>
                  </div>
                  <div className="bg-orange-900 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors">
                  <Search className="w-5 h-5 text-orange-400 mr-3" />
                  <span className="text-white">Find Scholarships</span>
                </button>
                <button className="flex items-center p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors">
                  <DollarSign className="w-5 h-5 text-blue-400 mr-3" />
                  <span className="text-white">Browse Grants</span>
                </button>
                <button className="flex items-center p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors">
                  <Target className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white">Job Search</span>
                </button>
                <button className="flex items-center p-4 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors">
                  <Heart className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-white">Volunteer</span>
                </button>
              </div>
            </div>

            {/* Recommended Opportunities */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Recommended for You</h3>
              <div className="space-y-4">
                {opportunities.filter(o => o.matchPercentage > 90).slice(0, 3).map((opportunity) => (
                  <div key={opportunity.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(opportunity.type)}
                      <div>
                        <p className="font-medium text-white">{opportunity.title}</p>
                        <p className="text-sm text-gray-400">{opportunity.organization} • {opportunity.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {opportunity.amount && (
                        <p className="font-medium text-white">{opportunity.amount}</p>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-400">{opportunity.matchPercentage}% match</span>
                        <span className={`px-2 py-1 rounded text-xs ${getTypeColor(opportunity.type)}`}>
                          {opportunity.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                {opportunities.filter(o => o.status === 'available').slice(0, 3).map((opportunity) => (
                  <div key={opportunity.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{opportunity.title}</p>
                      <p className="text-sm text-gray-400">{opportunity.organization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-yellow-400">Due: {opportunity.deadline}</p>
                      <span className={`px-2 py-1 rounded text-xs ${getTypeColor(opportunity.type)}`}>
                        {opportunity.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search all opportunities..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunities.map((opportunity) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{opportunity.title}</h3>
                      <p className="text-gray-400">{opportunity.organization}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                        {opportunity.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(opportunity.type)}`}>
                        {opportunity.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{opportunity.description}</p>

                  <div className="space-y-3 mb-4">
                    {opportunity.amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-white font-medium">{opportunity.amount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white">{opportunity.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deadline:</span>
                      <span className="text-white">{opportunity.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Match:</span>
                      <span className="text-green-400 font-medium">{opportunity.matchPercentage}%</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      {opportunity.status === 'available' ? 'Apply Now' : 'View Details'}
                    </button>
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Items Tab */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Saved Opportunities</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {savedItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-white">{item.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex space-x-4">
                        <span className="text-gray-400">Type: {item.type}</span>
                        <span className="text-gray-400">Saved: {item.savedDate}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-orange-400 hover:text-orange-300">View</button>
                        <button className="text-red-400 hover:text-red-300">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">My Applications</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {opportunities.filter(o => o.status === 'applied').map((app) => (
                  <div key={app.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-white">{app.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex space-x-4">
                        <span className="text-gray-400">Organization: {app.organization}</span>
                        <span className="text-gray-400">Type: {app.type}</span>
                      </div>
                      <span className="text-yellow-400">Deadline: {app.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">User Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value="Jane Doe"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value="jane.doe@email.com"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value="+1 (555) 987-6543"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value="Chicago, IL"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value="28"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Interests</label>
                  <input
                    type="text"
                    value="Education, Technology, Community Service"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Bio</label>
                <textarea
                  rows={4}
                  value="Passionate about making a positive impact in my community through education and technology initiatives."
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="mt-6">
                <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralDashboard;