import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Calendar,
  Award,
  Target
} from 'lucide-react';

interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'applied' | 'available' | 'interview' | 'offer';
  description: string;
  requirements: string[];
  postedDate: string;
  matchPercentage: number;
}

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: 'pending' | 'under_review' | 'interview_scheduled' | 'offer' | 'rejected';
  nextStep?: string;
}

interface TrainingProgram {
  id: string;
  title: string;
  provider: string;
  duration: string;
  cost: string;
  category: string;
  description: string;
  fundingAvailable: boolean;
}

const JobSeekerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'training' | 'profile'>('overview');
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs([
        {
          id: '1',
          title: 'Software Engineer',
          company: 'TechStart Inc.',
          location: 'San Francisco, CA',
          salary: '$80,000 - $120,000',
          type: 'full-time',
          status: 'available',
          description: 'Join our team to build innovative software solutions.',
          requirements: ['JavaScript', 'React', 'Node.js', 'Bachelor\'s degree'],
          postedDate: '2025-06-15',
          matchPercentage: 95
        },
        {
          id: '2',
          title: 'Data Analyst',
          company: 'DataCorp',
          location: 'Remote',
          salary: '$60,000 - $85,000',
          type: 'full-time',
          status: 'applied',
          description: 'Analyze data to drive business decisions.',
          requirements: ['Python', 'SQL', 'Statistics', 'Excel'],
          postedDate: '2025-06-10',
          matchPercentage: 88
        },
        {
          id: '3',
          title: 'Marketing Coordinator',
          company: 'Creative Agency',
          location: 'New York, NY',
          salary: '$45,000 - $60,000',
          type: 'full-time',
          status: 'interview',
          description: 'Coordinate marketing campaigns and events.',
          requirements: ['Marketing experience', 'Social media', 'Communication skills'],
          postedDate: '2025-06-08',
          matchPercentage: 82
        },
        {
          id: '4',
          title: 'UX Design Intern',
          company: 'Design Studio',
          location: 'Austin, TX',
          salary: '$20/hour',
          type: 'internship',
          status: 'offer',
          description: 'Learn UX design principles and work on real projects.',
          requirements: ['Design portfolio', 'Figma', 'User research'],
          postedDate: '2025-06-05',
          matchPercentage: 90
        }
      ]);

      setApplications([
        {
          id: '1',
          jobTitle: 'Data Analyst',
          company: 'DataCorp',
          appliedDate: '2025-06-12',
          status: 'under_review',
          nextStep: 'Technical assessment due June 25th'
        },
        {
          id: '2',
          jobTitle: 'Marketing Coordinator',
          company: 'Creative Agency',
          appliedDate: '2025-06-10',
          status: 'interview_scheduled',
          nextStep: 'Interview on June 28th at 2 PM'
        },
        {
          id: '3',
          jobTitle: 'UX Design Intern',
          company: 'Design Studio',
          appliedDate: '2025-06-08',
          status: 'offer',
          nextStep: 'Respond by June 30th'
        }
      ]);

      setTrainingPrograms([
        {
          id: '1',
          title: 'Full Stack Web Development Bootcamp',
          provider: 'CodeAcademy',
          duration: '12 weeks',
          cost: '$8,000',
          category: 'Technology',
          description: 'Comprehensive program covering front-end and back-end development.',
          fundingAvailable: true
        },
        {
          id: '2',
          title: 'Digital Marketing Certification',
          provider: 'Marketing Institute',
          duration: '6 weeks',
          cost: '$2,500',
          category: 'Marketing',
          description: 'Learn modern digital marketing strategies and tools.',
          fundingAvailable: true
        },
        {
          id: '3',
          title: 'Data Science with Python',
          provider: 'DataLearn',
          duration: '16 weeks',
          cost: '$6,000',
          category: 'Data Science',
          description: 'Master data analysis, machine learning, and visualization.',
          fundingAvailable: false
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-900';
      case 'applied': return 'text-blue-400 bg-blue-900';
      case 'interview': case 'interview_scheduled': return 'text-yellow-400 bg-yellow-900';
      case 'offer': return 'text-purple-400 bg-purple-900';
      case 'rejected': return 'text-red-400 bg-red-900';
      case 'under_review': return 'text-orange-400 bg-orange-900';
      case 'pending': return 'text-gray-400 bg-gray-700';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'offer': return <CheckCircle className="w-4 h-4" />;
      case 'interview': case 'interview_scheduled': return <Calendar className="w-4 h-4" />;
      case 'under_review': case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'text-green-400 bg-green-900';
      case 'part-time': return 'text-blue-400 bg-blue-900';
      case 'contract': return 'text-yellow-400 bg-yellow-900';
      case 'internship': return 'text-purple-400 bg-purple-900';
      default: return 'text-gray-400 bg-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
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
              <Briefcase className="h-8 w-8 text-green-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Job Seeker Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-white">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">AJ</span>
                </div>
                <span className="text-sm text-gray-300">Alex Johnson</span>
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
            { id: 'jobs', label: 'Job Opportunities', icon: Target },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'training', label: 'Training Programs', icon: Award },
            { id: 'profile', label: 'Profile', icon: User }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
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
                    <p className="text-gray-400 text-sm">Applications Sent</p>
                    <p className="text-2xl font-bold text-white">15</p>
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
                    <p className="text-gray-400 text-sm">Interviews</p>
                    <p className="text-2xl font-bold text-white">3</p>
                  </div>
                  <div className="bg-yellow-900 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-400" />
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
                    <p className="text-gray-400 text-sm">Job Offers</p>
                    <p className="text-2xl font-bold text-white">1</p>
                  </div>
                  <div className="bg-green-900 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
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
                    <p className="text-gray-400 text-sm">Response Rate</p>
                    <p className="text-2xl font-bold text-white">20%</p>
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
                        <p className="font-medium text-white">{app.jobTitle}</p>
                        <p className="text-sm text-gray-400">{app.company} • Applied on {app.appliedDate}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Match Jobs */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">High-Match Opportunities</h3>
              <div className="space-y-4">
                {jobs.filter(j => j.status === 'available' && j.matchPercentage > 90).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{job.title}</p>
                      <p className="text-sm text-gray-400">{job.company} • {job.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{job.salary}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-400">{job.matchPercentage}% match</span>
                        <span className={`px-2 py-1 rounded text-xs ${getTypeColor(job.type)}`}>
                          {job.type.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{job.title}</h3>
                      <p className="text-gray-400">{job.company}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
                        {job.type.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{job.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span className="text-white">{job.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Salary:</span>
                      <span className="text-white font-medium">{job.salary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Posted:</span>
                      <span className="text-white">{job.postedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Match:</span>
                      <span className="text-green-400 font-medium">{job.matchPercentage}%</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      {job.status === 'available' ? 'Apply Now' : 'View Details'}
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
                      <h4 className="text-lg font-medium text-white">{app.jobTitle}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex space-x-4">
                        <span className="text-gray-400">Company: {app.company}</span>
                        <span className="text-gray-400">Applied: {app.appliedDate}</span>
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

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trainingPrograms.map((program) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{program.title}</h3>
                      <p className="text-gray-400">{program.provider}</p>
                    </div>
                    {program.fundingAvailable && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-green-400 bg-green-900">
                        FUNDING AVAILABLE
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 mb-4">{program.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white">{program.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{program.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cost:</span>
                      <span className="text-white font-medium">{program.cost}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Learn More
                    </button>
                    {program.fundingAvailable && (
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                        Apply for Funding
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Job Seeker Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value="Alex Johnson"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value="alex.johnson@email.com"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value="+1 (555) 123-4567"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value="San Francisco, CA"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Current Title</label>
                  <input
                    type="text"
                    value="Junior Developer"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Experience Level</label>
                  <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                    <option>Executive</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Skills</label>
                <input
                  type="text"
                  value="JavaScript, React, Node.js, Python, SQL"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mt-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">Professional Summary</label>
                <textarea
                  rows={4}
                  value="Passionate software developer with 2+ years of experience in web development. Skilled in modern JavaScript frameworks and backend technologies."
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mt-6">
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
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

export default JobSeekerDashboard;