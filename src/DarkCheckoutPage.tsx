import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Lock, CreditCard, Calendar, User, Mail, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const DarkCheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('signup');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Get the plan from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get('plan') || 'pro';
  
  // Plan details
  const planDetails = {
    starter: {
      name: '7 Day Limited',
      price: '$0.90',
      description: 'Unlock essential features for 7 days',
      trial: true
    },
    standard: {
      name: '7 Day Pro',
      price: '$1.99',
      description: 'Unlock advanced features for 7 days',
      trial: true
    },
    pro: {
      name: 'Annual Pro',
      price: '$99.00',
      description: 'Get unlimited access for a year',
      trial: false
    }
  };
  
  const plan = planDetails[selectedPlan as keyof typeof planDetails];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Redirect to dashboard after successful signup/login
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 2000);
  };
  
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
          <Link to="/results" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            <span>Back to Results</span>
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-700">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Document Preview */}
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="bg-yellow-900 p-2 rounded-md mr-3">
                      <CreditCard className="w-5 h-5 text-yellow-400" />
                    </span>
                    Complete your order
                  </h2>
                  
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 mb-6">
                    <h3 className="font-semibold text-lg mb-4 text-white">Order Summary</h3>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">{plan.name}</span>
                      <span className="font-semibold text-white">{plan.price}</span>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-4">{plan.description}</div>
                    
                    {plan.trial && (
                      <div className="bg-blue-900 border border-blue-800 rounded-md p-3 text-sm text-blue-300 mb-4">
                        Your subscription will automatically renew after the trial period. You can cancel anytime.
                      </div>
                    )}
                    
                    <div className="border-t border-gray-700 pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">Total</span>
                        <span className="font-bold text-lg text-white">{plan.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Cancel anytime</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-gray-300">30-day money-back guarantee</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-gray-300">24/7 customer support</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-5 h-5 text-green-400 mr-3" />
                      <span className="text-gray-300">Secure payment processing</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Login/Signup Form */}
                <div className="md:w-1/2">
                  {isComplete ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Payment Successful!</h3>
                      <p className="text-gray-300 text-center mb-6">Thank you for your purchase. You're being redirected to your dashboard.</p>
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {/* Tabs */}
                      <div className="flex border-b border-gray-700 mb-6">
                        <button
                          className={`py-3 px-6 font-medium ${activeTab === 'signup' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
                          onClick={() => setActiveTab('signup')}
                        >
                          Sign Up
                        </button>
                        <button
                          className={`py-3 px-6 font-medium ${activeTab === 'login' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-gray-300'}`}
                          onClick={() => setActiveTab('login')}
                        >
                          Log In
                        </button>
                      </div>
                      
                      {/* Form */}
                      <form onSubmit={handleSubmit}>
                        {activeTab === 'signup' && (
                          <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <input
                                type="text"
                                className="pl-10 w-full px-4 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                placeholder="John Doe"
                                required
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                              type="email"
                              className="pl-10 w-full px-4 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                              type="password"
                              className="pl-10 w-full px-4 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                              placeholder={activeTab === 'signup' ? "Create a password" : "Enter your password"}
                              required
                            />
                          </div>
                        </div>
                        
                        {activeTab === 'signup' && (
                          <>
                            <div className="mb-6">
                              <label className="block text-gray-300 text-sm font-medium mb-2">Card Information</label>
                              <div className="relative mb-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <CreditCard className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                  type="text"
                                  className="pl-10 w-full px-4 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                  placeholder="Card number"
                                  required
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                  </div>
                                  <input
                                    type="text"
                                    className="pl-10 w-full px-4 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                    placeholder="MM/YY"
                                    required
                                  />
                                </div>
                                <div className="relative">
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-700 bg-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                    placeholder="CVC"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <label className="flex items-center">
                                <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-900" required />
                                <span className="ml-2 text-sm text-gray-400">
                                  I agree to the <a href="#" className="text-purple-400 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
                                </span>
                              </label>
                            </div>
                          </>
                        )}
                        
                        <button
                          type="submit"
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              {activeTab === 'signup' ? 'Create Account & Subscribe' : 'Log In & Subscribe'}
                              <ChevronRight className="ml-2 w-5 h-5" />
                            </>
                          )}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
              <div className="flex items-start mb-4">
                <div className="text-4xl text-purple-400 mr-4">"</div>
                <p className="text-gray-300">
                  "Granada revolutionized my productivity. From finding grants to detailed reports, it's my innovation partner."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-white">James Anderson</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
              <div className="flex items-start mb-4">
                <div className="text-4xl text-purple-400 mr-4">"</div>
                <p className="text-gray-300">
                  "As a marketing professional, Granada brings my ideas to life, creating compelling content that captivates my audience."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-white">Olivia Morgan</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
              <div className="flex items-start mb-4">
                <div className="text-4xl text-purple-400 mr-4">"</div>
                <p className="text-gray-300">
                  "Granada enriched my research process. Finding funding opportunities has never been easier. It's a revolution!"
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-medium text-white">Christopher Lee</h4>
                  <div className="flex text-yellow-400">
                    <span>★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="#bb86fc" />
                <path d="M30 10H10V30H30V10Z" fill="#03dac6" />
                <path d="M20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z" fill="#1e1e1e" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">Granada</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
            </div>
          </div>
          
          <div className="mt-4 text-center text-gray-500 text-sm">
            © 2025 Granada. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DarkCheckoutPage;