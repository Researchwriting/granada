import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  FileText, 
  Award, 
  TrendingUp, 
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Zap,
  Star
} from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  organization: string;
  amount: string;
  deadline: string;
  status: 'applied' | 'eligible' | 'deadline_passed' | 'awarded';
  description: string;
  requirements: string[];
  applicationProgress?: number;
}

interface Application {
  id: string;
  scholarshipTitle: string;
  submittedDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  nextStep?: string;
}

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'scholarships' | 'applications' | 'credits' | 'profile'>('overview');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [creditBalance, setCreditBalance] = useState(25);
  const [showCreditModal, setShowCreditModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setScholarships([
        {
          id: '1',
          title: 'Merit-Based Academic Scholarship',
          organization: 'University Foundation',
          amount: '$5,000',
          deadline: '2025-08-15',
          status: 'eligible',
          description: 'Scholarship for students with outstanding academic performance.',
          requirements: ['GPA 3.5+', 'Full-time enrollment', 'Essay submission'],
          applicationProgress: 0
        },
        {
          id: '2',
          title: 'STEM Excellence Grant',
          organization: 'Tech Innovation Fund',
          amount: '$10,000',
          deadline: '2025-09-30',
          status: 'applied',
          description: 'Supporting students pursuing STEM degrees.',
          requirements: ['STEM major', 'Research project', 'Faculty recommendation'],
          applicationProgress: 75
        },
        {
          id: '3',
          title: 'Community Service Award',
          organization: 'Local Community Foundation',
          amount: '$2,500',
          deadline: '2025-07-01',
          status: 'awarded',
          description: 'Recognizing students with exceptional community involvement.',
          requirements: ['100+ volunteer hours', 'Community impact essay'],
          applicationProgress: 100
        }
      ]);

      setApplications([
        {
          id: '1',
          scholarshipTitle: 'STEM Excellence Grant',
          submittedDate: '2025-06-01',
          status: 'under_review',
          nextStep: 'Interview scheduled for June 30th'
        },
        {
          id: '2',
          scholarshipTitle: 'Community Service Award',
          submittedDate: '2025-05-15',
          status: 'approved',
        },
        {
          id: '3',
          scholarshipTitle: 'First Generation College Grant',
          submittedDate: '2025-05-01',
          status: 'pending',
          nextStep: 'Waiting for transcript verification'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return 'text-green-400 bg-green-900';
      case 'applied': return 'text-blue-400 bg-blue-900';
      case 'awarded': return 'text-yellow-400 bg-yellow-900';
      case 'deadline_passed': return 'text-red-400 bg-red-900';
      case 'approved': return 'text-green-400 bg-green-900';
      case 'under_review': return 'text-yellow-400 bg-yellow-900';
      case 'pending': return 'text-gray-400 bg-gray-700';
      case 'rejected': return 'text-red-400 bg-red-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': case 'awarded': return <CheckCircle className="w-4 h-4" />;
      case 'under_review': case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': case 'deadline_passed': return <AlertCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
              <GraduationCap className="h-8 w-8 text-purple-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
                <CreditCard className="h-4 w-4 text-purple-400" />
                <span className="text-white font-medium">{creditBalance}</span>
                <span className="text-gray-400 text-sm">credits</span>
                <button 
                  onClick={() => setShowCreditModal(true)}
                  className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs"
                >
                  Buy
                </button>
              </div>
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">JS</span>
                </div>
                <span className="text-sm text-gray-300">John Student</span>
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
            { id: 'scholarships', label: 'Scholarships', icon: Award },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'credits', label: 'Credits', icon: CreditCard },
            { id: 'profile', label: 'Profile', icon: BookOpen }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
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
                    <p className="text-2xl font-bold text-white">12</p>
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
                    <p className="text-gray-400 text-sm">Awards Won</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <div className="bg-green-900 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-green-400" />
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
                    <p className="text-2xl font-bold text-white">$17,500</p>
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
                    <p className="text-gray-400 text-sm">Pending Reviews</p>
                    <p className="text-2xl font-bold text-white">5</p>
                  </div>
                  <div className="bg-purple-900 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-400" />
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
                        <p className="font-medium text-white">{app.scholarshipTitle}</p>
                        <p className="text-sm text-gray-400">Submitted on {app.submittedDate}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Upcoming Deadlines</h3>
              <div className="space-y-4">
                {scholarships.filter(s => s.status === 'eligible').map((scholarship) => (
                  <div key={scholarship.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{scholarship.title}</p>
                      <p className="text-sm text-gray-400">{scholarship.organization}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{scholarship.amount}</p>
                      <p className="text-sm text-yellow-400">Due: {scholarship.deadline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scholarships Tab */}
        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search scholarships..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>

            {/* Scholarships Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scholarships.map((scholarship) => (
                <motion.div
                  key={scholarship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{scholarship.title}</h3>
                      <p className="text-gray-400">{scholarship.organization}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(scholarship.status)}`}>
                      {scholarship.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-4">{scholarship.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white font-medium">{scholarship.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Deadline:</span>
                      <span className="text-white">{scholarship.deadline}</span>
                    </div>
                  </div>

                  {scholarship.applicationProgress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Application Progress</span>
                        <span className="text-white">{scholarship.applicationProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${scholarship.applicationProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      {scholarship.status === 'eligible' ? 'Apply Now' : 'View Details'}
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
                <h3 className="text-xl font-semibold text-white">My Applications</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {applications.map((app) => (
                  <div key={app.id} className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-medium text-white">{app.scholarshipTitle}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Submitted: {app.submittedDate}</span>
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

        {/* Credits Tab */}
        {activeTab === 'credits' && (
          <div className="space-y-6">
            {/* Credit Balance Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Credit Balance</h3>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                  <span className="text-2xl font-bold text-white">{creditBalance}</span>
                  <span className="text-gray-400">credits</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">This Month Used</div>
                  <div className="text-white text-xl font-semibold">15 credits</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">Total Purchased</div>
                  <div className="text-white text-xl font-semibold">50 credits</div>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">Savings This Month</div>
                  <div className="text-green-400 text-xl font-semibold">$12.50</div>
                </div>
              </div>

              <button 
                onClick={() => setShowCreditModal(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Purchase More Credits
              </button>
            </div>

            {/* Credit Packages */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Credit Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Starter', credits: 25, price: 9.99, popular: false },
                  { name: 'Student', credits: 100, price: 29.99, popular: true },
                  { name: 'Premium', credits: 250, price: 59.99, popular: false }
                ].map((pkg) => (
                  <div key={pkg.name} className={`relative bg-gray-900 rounded-lg p-6 border ${pkg.popular ? 'border-purple-500' : 'border-gray-700'}`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-white mb-2">{pkg.name}</h4>
                      <div className="text-3xl font-bold text-white mb-1">{pkg.credits}</div>
                      <div className="text-gray-400 text-sm mb-4">credits</div>
                      <div className="text-2xl font-bold text-purple-400 mb-4">${pkg.price}</div>
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Purchase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage History */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Recent Usage</h3>
              <div className="space-y-4">
                {[
                  { action: 'Advanced Scholarship Search', credits: 3, date: '2025-06-20', time: '2:30 PM' },
                  { action: 'AI Application Review', credits: 5, date: '2025-06-19', time: '4:15 PM' },
                  { action: 'Premium Filter Search', credits: 2, date: '2025-06-18', time: '10:45 AM' },
                  { action: 'Document Generation', credits: 4, date: '2025-06-17', time: '3:20 PM' }
                ].map((usage, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{usage.action}</p>
                      <p className="text-sm text-gray-400">{usage.date} at {usage.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-400">-{usage.credits} credits</p>
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
              <h3 className="text-xl font-semibold text-white mb-6">Student Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value="John Student"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value="john.student@university.edu"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">University</label>
                  <input
                    type="text"
                    value="State University"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Major</label>
                  <input
                    type="text"
                    value="Computer Science"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">GPA</label>
                  <input
                    type="text"
                    value="3.8"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Graduation Year</label>
                  <input
                    type="text"
                    value="2026"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Credit Purchase Modal */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Purchase Credits</h3>
              <button 
                onClick={() => setShowCreditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { name: 'Starter Pack', credits: 25, price: 9.99, savings: null },
                { name: 'Student Pack', credits: 100, price: 29.99, savings: '25% off', popular: true },
                { name: 'Premium Pack', credits: 250, price: 59.99, savings: '40% off' }
              ].map((pkg) => (
                <div key={pkg.name} className={`p-4 rounded-lg border cursor-pointer transition-colors ${pkg.popular ? 'border-purple-500 bg-purple-900/20' : 'border-gray-600 hover:border-gray-500'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white">{pkg.name}</h4>
                        {pkg.popular && (
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Popular</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{pkg.credits} credits</p>
                      {pkg.savings && (
                        <p className="text-green-400 text-sm">{pkg.savings}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">${pkg.price}</p>
                      <p className="text-gray-400 text-sm">${(pkg.price / pkg.credits).toFixed(2)}/credit</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Payment Method</label>
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center p-3 border border-gray-600 rounded-lg hover:border-gray-500">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-white">Card</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center p-3 border border-gray-600 rounded-lg hover:border-gray-500">
                    <span className="text-white">PayPal</span>
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreditModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;