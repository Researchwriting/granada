import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText, 
  Calendar, 
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Target,
  Briefcase
} from 'lucide-react';

interface Grant {
  id: string;
  title: string;
  agency: string;
  amount: string;
  deadline: string;
  status: 'eligible' | 'applied' | 'awarded' | 'rejected';
  description: string;
  category: string;
  matchPercentage: number;
}

interface Application {
  id: string;
  grantTitle: string;
  submittedDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  amount: string;
  nextStep?: string;
}

const BusinessDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'grants' | 'applications' | 'analytics' | 'profile'>('overview');
  const [grants, setGrants] = useState<Grant[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGrants([
        {
          id: '1',
          title: 'Small Business Innovation Research (SBIR)',
          agency: 'National Science Foundation',
          amount: '$150,000',
          deadline: '2025-08-30',
          status: 'eligible',
          description: 'Funding for innovative research and development projects.',
          category: 'R&D',
          matchPercentage: 95
        },
        {
          id: '2',
          title: 'Economic Development Administration Grant',
          agency: 'U.S. Department of Commerce',
          amount: '$500,000',
          deadline: '2025-09-15',
          status: 'applied',
          description: 'Support for economic development and job creation.',
          category: 'Economic Development',
          matchPercentage: 88
        },
        {
          id: '3',
          title: 'Green Technology Innovation Fund',
          agency: 'Department of Energy',
          amount: '$250,000',
          deadline: '2025-10-01',
          status: 'eligible',
          description: 'Funding for clean energy and environmental technology.',
          category: 'Clean Energy',
          matchPercentage: 92
        },
        {
          id: '4',
          title: 'Manufacturing Extension Partnership',
          agency: 'NIST',
          amount: '$75,000',
          deadline: '2025-07-15',
          status: 'awarded',
          description: 'Support for manufacturing process improvements.',
          category: 'Manufacturing',
          matchPercentage: 100
        }
      ]);

      setApplications([
        {
          id: '1',
          grantTitle: 'Economic Development Administration Grant',
          submittedDate: '2025-06-01',
          status: 'under_review',
          amount: '$500,000',
          nextStep: 'Site visit scheduled for July 10th'
        },
        {
          id: '2',
          grantTitle: 'Manufacturing Extension Partnership',
          submittedDate: '2025-05-15',
          status: 'approved',
          amount: '$75,000'
        },
        {
          id: '3',
          grantTitle: 'Technology Commercialization Grant',
          submittedDate: '2025-04-20',
          status: 'pending',
          amount: '$100,000',
          nextStep: 'Waiting for financial review'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return 'text-green-400 bg-green-900';
      case 'applied': return 'text-blue-400 bg-blue-900';
      case 'awarded': case 'approved': return 'text-yellow-400 bg-yellow-900';
      case 'rejected': return 'text-red-400 bg-red-900';
      case 'under_review': return 'text-orange-400 bg-orange-900';
      case 'pending': return 'text-gray-400 bg-gray-700';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': case 'awarded': return <CheckCircle className="w-4 h-4" />;
      case 'under_review': case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
              <Building2 className="h-8 w-8 text-blue-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Business Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">TC</span>
                </div>
                <span className="text-sm text-gray-300">TechCorp Inc.</span>
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
            { id: 'grants', label: 'Grants', icon: Target },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'profile', label: 'Company Profile', icon: Building2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Applied</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                  <div className="bg-blue-900 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-400" />
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
                    <p className="text-gray-400 text-sm">Grants Awarded</p>
                    <p className="text-2xl font-bold text-white">2</p>
                  </div>
                  <div className="bg-green-900 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-green-400" />
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
                    <p className="text-gray-400 text-sm">Total Funding</p>
                    <p className="text-2xl font-bold text-white">$1.2M</p>
                  </div>
                  <div className="bg-yellow-900 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
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
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold text-white">25%</p>
                  </div>
                  <div className="bg-purple-900 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(app.status)}
                      <div>
                        <p className="font-medium text-white">{app.grantTitle}</p>
                        <p className="text-sm text-gray-400">Submitted on {app.submittedDate} • {app.amount}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Opportunities */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">High-Match Opportunities</h3>
              <div className="space-y-4">
                {grants.filter(g => g.status === 'eligible' && g.matchPercentage > 90).map((grant) => (
                  <div key={grant.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{grant.title}</p>
                      <p className="text-sm text-gray-400">{grant.agency} • {grant.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{grant.amount}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-400">{grant.matchPercentage}% match</span>
                        <span className="text-sm text-yellow-400">Due: {grant.deadline}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grants Tab */}
        {activeTab === 'grants' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search grants..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>

            {/* Grants Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {grants.map((grant) => (
                <motion.div
                  key={grant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{grant.title}</h3>
                      <p className="text-gray-400">{grant.agency}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(grant.status)}`}>
                      {grant.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4">{grant.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white font-medium">{grant.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white">{grant.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deadline:</span>
                      <span className="text-white">{grant.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Match:</span>
                      <span className="text-green-400 font-medium">{grant.matchPercentage}%</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      {grant.status === 'eligible' ? 'Apply Now' : 'View Details'}
                    </button>
                    <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Grant Applications</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {applications.map((app) => (
                  <div key={app.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-white">{app.grantTitle}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex space-x-4">
                        <span className="text-gray-400">Submitted: {app.submittedDate}</span>
                        <span className="text-gray-400">Amount: {app.amount}</span>
                      </div>
                      {app.nextStep && (
                        <span className="text-yellow-400">{app.nextStep}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funding by Category */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Funding by Category</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">R&D</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-white text-sm">$720K</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Clean Energy</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-white text-sm">$420K</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Manufacturing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-white text-sm">$300K</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Timeline */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4">Application Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Grant Awarded</p>
                      <p className="text-gray-400 text-sm">Manufacturing Extension Partnership - $75K</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Under Review</p>
                      <p className="text-gray-400 text-sm">Economic Development Grant - $500K</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">Application Submitted</p>
                      <p className="text-gray-400 text-sm">Technology Commercialization - $100K</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Success Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">25%</div>
                  <div className="text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">45</div>
                  <div className="text-gray-400">Days Avg. Review</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">$150K</div>
                  <div className="text-gray-400">Avg. Grant Size</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Company Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    value="TechCorp Inc."
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Industry</label>
                  <input
                    type="text"
                    value="Technology"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Employee Count</label>
                  <input
                    type="text"
                    value="50-100"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Annual Revenue</label>
                  <input
                    type="text"
                    value="$5M - $10M"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">DUNS Number</label>
                  <input
                    type="text"
                    value="123456789"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">NAICS Code</label>
                  <input
                    type="text"
                    value="541511"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Company Description</label>
                <textarea
                  rows={4}
                  value="TechCorp Inc. is a leading technology company specializing in innovative software solutions and research & development."
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
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

export default BusinessDashboard;