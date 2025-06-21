import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Star,
  DollarSign,
  Users,
  Award,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Target,
  ChevronDown,
  Play,
  X,
  Menu,
  Globe,
  BookOpen,
  Briefcase,
  Building,
  Search,
  MessageCircle,
  GraduationCap,
  Heart,
  MapPin,
  Send,
  Loader,
  Lock
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { generateAIResponse } from './services/deepseekService';

const MarketingLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChatPreview, setShowChatPreview] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Show email capture after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmailCapture(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom of chat container when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "PhD Student, Stanford University",
      quote: "Granada helped me secure $45,000 in scholarships in just 3 months. The AI matching is incredible!",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      amount: "$45,000",
      timeframe: "3 months"
    },
    {
      id: 2,
      name: "Michael Okonkwo",
      role: "Executive Director, Clean Water Initiative",
      quote: "We've raised over $2.3M using Granada's proposal tools. It's transformed our fundraising.",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      amount: "$2.3M",
      timeframe: "12 months"
    },
    {
      id: 3,
      name: "Lisa Chen",
      role: "Undergraduate, MIT",
      quote: "Found my dream research internship through Granada. The platform made everything so simple.",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      amount: "$15,000",
      timeframe: "2 weeks"
    }
  ];

  const stats = [
    { number: "$127M+", label: "Funding Secured", icon: DollarSign },
    { number: "50,000+", label: "Active Users", icon: Users },
    { number: "98%", label: "Success Rate", icon: Award },
    { number: "24/7", label: "AI Support", icon: Clock }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "10x Faster Applications",
      description: "AI-powered matching finds opportunities you'd never discover manually"
    },
    {
      icon: Target,
      title: "95% Match Accuracy",
      description: "Our algorithm analyzes 500+ criteria to find perfect matches"
    },
    {
      icon: Shield,
      title: "Guaranteed Results",
      description: "Find funding in 30 days or get your money back"
    }
  ];

  const pricingPlans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "14 days",
      description: "Perfect for getting started",
      features: [
        "5 scholarship matches",
        "Basic proposal templates",
        "Email support",
        "Application tracking"
      ],
      cta: "Start Free Trial",
      popular: false,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "For serious opportunity seekers",
      features: [
        "Unlimited scholarship matches",
        "AI proposal generation",
        "Priority support",
        "Advanced analytics",
        "Custom alerts",
        "Direct donor connections"
      ],
      cta: "Start Pro Trial",
      popular: true,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For organizations and institutions",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "White-label options",
        "API access",
        "Dedicated account manager",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email capture
    console.log('Email captured:', email);
    setShowEmailCapture(false);
    
    // Show chat interface with personalized message
    setShowChatPreview(true);
    
    setIsTyping(true);
    
    try {
      // Get AI response
      const aiResponse = await generateAIResponse(`I'm interested in ${searchQuery || 'funding opportunities'}. Can you help me?`);
      
      // Add AI response after a short delay for typing effect
      setTimeout(() => {
        setChatMessages([
          {
            role: 'assistant',
            type: 'assistant',
            content: aiResponse.content,
            options: aiResponse.options
          }
        ]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      
      // Fallback response
      setChatMessages([
        {
          role: 'assistant',
          type: 'assistant',
          content: `Thanks for your interest in ${searchQuery || 'funding opportunities'}! I've found several matches that might be perfect for you. Would you like to see the top results or refine your search further?`,
          options: ['Show top results', 'Refine my search', 'Create an account to save matches']
        }
      ]);
    }
    
    // After a short delay, show subscription prompt
    setTimeout(() => {
      setShowSubscriptionPrompt(true);
    }, 10000);
  };
  
  const handleOptionClick = async (option: string) => {
    // Add user message with selected option
    setChatMessages(prev => [...prev, { 
      role: 'user',
      type: 'user',
      content: option 
    }]);
    
    setIsTyping(true);
    
    try {
      // Get AI response based on the selected option
      const context = chatMessages.map(msg => `${msg.role || msg.type}: ${msg.content}`).join('\n');
      const aiResponse = await generateAIResponse(option, context);
      
      // Simulate typing delay
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          role: 'assistant',
          type: 'assistant',
          content: aiResponse.content,
          options: aiResponse.options
        }]);
        setIsTyping(false);
        
        // Show subscription prompt after 2 interactions if not already shown
        if (chatMessages.length >= 4 && !showSubscriptionPrompt) {
          setTimeout(() => {
            setShowSubscriptionPrompt(true);
          }, 2000);
        }
      }, 1500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
      
      // Fallback response
      setChatMessages(prev => [...prev, { 
        role: 'assistant',
        type: 'assistant',
        content: `Here's what I found about "${option}":`,
        options: [
          'Tell me more',
          'Show me examples',
          'How do I get started?'
        ]
      }]);
    }
  };
  
  const handleChatInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      // Add user message
      setChatMessages(prev => [...prev, { 
        role: 'user',
        type: 'user',
        content: userInput 
      }]);
      
      setIsTyping(true);
      
      try {
        // Get context from previous messages
        const context = chatMessages.map(msg => `${msg.role || msg.type}: ${msg.content}`).join('\n');
        
        // Get AI response
        const aiResponse = await generateAIResponse(userInput, context);
        
        // Simulate typing delay
        setTimeout(() => {
          setChatMessages(prev => [...prev, { 
            role: 'assistant',
            type: 'assistant',
            content: aiResponse.content,
            options: aiResponse.options
          }]);
          setIsTyping(false);
          
          // Show subscription prompt after several interactions
          if (chatMessages.length >= 4 && !showSubscriptionPrompt) {
            setTimeout(() => {
              setShowSubscriptionPrompt(true);
            }, 2000);
          }
        }, 1500);
      } catch (error) {
        console.error('Error getting AI response:', error);
        setIsTyping(false);
        
        // Fallback response
        setChatMessages(prev => [...prev, { 
          role: 'assistant',
          type: 'assistant',
          content: `I found some information related to "${userInput}". Would you like to explore further?`,
          options: [
            'Yes, tell me more',
            'Show me specific examples',
            'No, try something else'
          ]
        }]);
      }
      
      // Clear input
      setUserInput('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Granada</span>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#benefits" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">Benefits</a>
              <a href="#testimonials" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">Success Stories</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">Pricing</a>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Log In
                </motion.button>
              </Link>
              
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Start Free Trial
                </motion.button>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Search Focused */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full opacity-10 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Find Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfect Match</span><br />
              in Seconds
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto"
            >
              Join 50,000+ students and organizations who've secured over <strong>$127 million</strong> in scholarships, grants, and funding using Granada's AI-powered platform.
            </motion.p>

            {/* Category Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white shadow-md rounded-full text-blue-600 font-medium flex items-center space-x-2"
                onClick={() => setSearchQuery("donors ")}
              >
                <DollarSign className="w-4 h-4" />
                <span>Donors</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white shadow-md rounded-full text-purple-600 font-medium flex items-center space-x-2"
                onClick={() => setSearchQuery("scholarships ")}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Scholarships</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white shadow-md rounded-full text-green-600 font-medium flex items-center space-x-2"
                onClick={() => setSearchQuery("business funding ")}
              >
                <Briefcase className="w-4 h-4" />
                <span>Business Funding</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white shadow-md rounded-full text-orange-600 font-medium flex items-center space-x-2"
                onClick={() => setSearchQuery("donation locations ")}
              >
                <MapPin className="w-4 h-4" />
                <span>Donation Locations</span>
              </motion.button>
            </motion.div>

            {/* Central Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for donors, scholarships, funding, or jobs..."
                  className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                  onKeyPress={async (e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      setShowChatPreview(true);
                      
                      // Add user message
                      setChatMessages([
                        { 
                          role: 'user', 
                          content: searchQuery,
                          type: 'user'
                        }
                      ]);
                      
                      setIsTyping(true);
                      
                      try {
                        // Get AI response
                        const aiResponse = await generateAIResponse(searchQuery);
                        
                        // Add AI response after a short delay for typing effect
                        setTimeout(() => {
                          setChatMessages(prev => [...prev, { 
                            role: 'assistant',
                            type: 'assistant', 
                            content: aiResponse.content,
                            options: aiResponse.options
                          }]);
                          setIsTyping(false);
                          
                          // Set result count (3 for free users)
                          setResultCount(3);
                        }, 1500);
                      } catch (error) {
                        console.error('Error getting AI response:', error);
                        setIsTyping(false);
                        
                        // Fallback response
                        setChatMessages(prev => [...prev, { 
                          role: 'assistant',
                          type: 'assistant', 
                          content: `I found several matches for "${searchQuery}". Let me help you narrow down the results.`,
                          options: [
                            'Show top results', 
                            'Refine my search', 
                            'Filter by location'
                          ]
                        }]);
                      }
                    }
                  }}
                />
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white"
                  onClick={async () => {
                    if (searchQuery.trim()) {
                      setShowChatPreview(true);
                      
                      // Add user message
                      setChatMessages([
                        { 
                          role: 'user', 
                          content: searchQuery,
                          type: 'user'
                        }
                      ]);
                      
                      setIsTyping(true);
                      
                      try {
                        // Get AI response
                        const aiResponse = await generateAIResponse(searchQuery);
                        
                        // Add AI response after a short delay for typing effect
                        setTimeout(() => {
                          setChatMessages(prev => [...prev, { 
                            role: 'assistant',
                            type: 'assistant', 
                            content: aiResponse.content,
                            options: aiResponse.options
                          }]);
                          setIsTyping(false);
                          
                          // Set result count (3 for free users)
                          setResultCount(3);
                        }, 1500);
                      } catch (error) {
                        console.error('Error getting AI response:', error);
                        setIsTyping(false);
                        
                        // Fallback response
                        setChatMessages(prev => [...prev, { 
                          role: 'assistant',
                          type: 'assistant', 
                          content: `I found several matches for "${searchQuery}". Let me help you narrow down the results.`,
                          options: [
                            'Show top results', 
                            'Refine my search', 
                            'Filter by location'
                          ]
                        }]);
                      }
                    }
                  }}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Try: "STEM scholarships for women", "climate change grants", "startup funding in California"
              </p>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center space-x-2 mb-8"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <img
                    key={i}
                    src={`https://randomuser.me/api/portraits/women/${i}.jpg`}
                    alt={`User ${i}`}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">4.9/5 from 2,847 reviews</span>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm text-gray-500 flex flex-wrap justify-center gap-x-8 gap-y-2"
            >
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-1" />
                <span>Verified by TrustPilot</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                <span>Used in 120+ Countries</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Conversational Search Experience */}
      <AnimatePresence>
        {showChatPreview && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Conversational Search Experience
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Granada's AI understands your needs and helps you find the perfect opportunities through natural conversation.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-100 flex items-center">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Granada AI</h3>
                      <p className="text-sm text-gray-500">Intelligent Matching Assistant</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div ref={chatContainerRef} className="p-6 max-h-96 overflow-y-auto space-y-6">
                    {/* Initial Query Display */}
                    {searchQuery && (
                      <div className="bg-blue-50 rounded-lg p-3 inline-block">
                        <span className="text-sm font-medium text-blue-800">
                          Search: "{searchQuery}"
                        </span>
                      </div>
                    )}

                    {/* Chat Messages */}
                    {chatMessages.map((message, index) => (
                      <div key={index} className="space-y-4">
                        {message.type === 'user' || message.role === 'user' ? (
                          <div className="flex justify-end">
                            <div className="bg-blue-100 rounded-2xl p-4 max-w-[80%]">
                              <p className="text-gray-800">{message.content}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-gray-100 rounded-2xl p-4 max-w-[80%]">
                              <p className="text-gray-800">{message.content}</p>
                            </div>
                          </div>
                        )}

                        {/* Suggested Options */}
                        {message.options && message.type === 'assistant' && (
                          <div className={`${message.type === 'user' || message.role === 'user' ? 'mr-11 flex justify-end' : 'ml-11'} flex flex-wrap gap-2`}>
                            {message.options.map((option: string, optIndex: number) => (
                              <button
                                key={optIndex}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                onClick={() => handleOptionClick(option)}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl p-4">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Results Preview */}
                    {resultCount > 0 && chatMessages.length > 1 && (
                      <div className="space-y-4 mt-4">
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-medium text-gray-900 mb-3">Top Matches (Preview)</h4>
                        </div>
                        
                        {/* Result Cards */}
                        {[1, 2, 3].map((item) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: item * 0.1 }}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-semibold text-gray-900">
                                  {item === 1 ? 'Gates Foundation Scholarship' : 
                                   item === 2 ? 'NSF Graduate Research Fellowship' : 
                                   'Thiel Fellowship for Entrepreneurs'}
                                </h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item === 1 ? 'For underrepresented students in STEM fields' : 
                                   item === 2 ? 'For graduate students pursuing research-based degrees' : 
                                   'For young entrepreneurs under 23 years old'}
                                </p>
                              </div>
                              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                {item === 1 ? '$25,000' : item === 2 ? '$34,000/yr' : '$100,000'}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>Deadline: {item === 1 ? 'Dec 15, 2025' : item === 2 ? 'Oct 30, 2025' : 'Rolling'}</span>
                              </div>
                              <div className="text-xs text-blue-600 font-medium">
                                {item === 3 ? (
                                  <span className="flex items-center">
                                    <Lock className="w-3 h-3 mr-1" />
                                    Unlock with Pro
                                  </span>
                                ) : (
                                  <span>View Details</span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {/* Subscription Prompt */}
                        {showSubscriptionPrompt && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 mt-6"
                          >
                            <div className="flex items-start">
                              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-4 flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Unlock Full Access</h4>
                                <p className="text-gray-600 mb-4">
                                  I've found <strong>27 more opportunities</strong> that match your criteria. Create a free account to see all results and get personalized recommendations.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  <Link to="/register">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
                                    >
                                      Create Free Account
                                    </motion.button>
                                  </Link>
                                  <Link to="/login">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                                    >
                                      Log In
                                    </motion.button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-gray-100">
                    <form onSubmit={handleChatInput} className="flex items-center">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your question here..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="ml-2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white"
                        disabled={!userInput.trim()}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Granada AI uses your search history to provide better recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Highlighted Opportunities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Highlighted Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trending funding options our users are applying for this week
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Opportunity Cards */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="h-3 bg-blue-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">Gates Foundation Scholarship</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">$25,000</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  For underrepresented students in STEM fields pursuing undergraduate or graduate degrees.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Deadline: Dec 15, 2025</span>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-800">View Details</button>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="h-3 bg-purple-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">NSF Graduate Research Fellowship</h3>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">$34,000/yr</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  For graduate students pursuing research-based master's and doctoral degrees in STEM fields.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Deadline: Oct 30, 2025</span>
                  </div>
                  <button className="text-purple-600 text-sm font-medium hover:text-purple-800">View Details</button>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            >
              <div className="h-3 bg-green-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">Thiel Fellowship</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">$100,000</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  For young entrepreneurs under 23 years old who want to build innovative companies instead of attending college.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Deadline: Rolling</span>
                  </div>
                  <button className="text-green-600 text-sm font-medium hover:text-green-800">View Details</button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-10">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                See All Opportunities
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Granada?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform revolutionizes how you find and secure funding opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full shadow-md mb-6">
                  <benefit.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students and organizations who've transformed their futures with Granada
            </p>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="flex-shrink-0">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                    />
                  </div>
                  <div>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 italic mb-6">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                        <div className="text-gray-600 text-sm">{testimonials[currentTestimonial].role}</div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {testimonials[currentTestimonial].amount}
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {testimonials[currentTestimonial].timeframe}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border ${
                  plan.popular ? 'border-blue-200' : 'border-gray-100'
                } relative`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${plan.gradient}`}></div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-600">/{plan.period}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 rounded-lg font-semibold ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {plan.cta}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              All plans include a 14-day money-back guarantee
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-600">No credit card required for trial</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-gray-600">Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section with Search */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Join thousands of students and organizations who've transformed their futures with Granada
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What kind of funding are you looking for?"
                  className="w-full px-6 py-4 pr-12 text-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/70"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setShowChatPreview(true);
                    }
                  }}
                />
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full text-blue-600"
                  onClick={() => {
                    setShowChatPreview(true);
                  }}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Search Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-colors"
                onClick={() => {
                  setSearchQuery("scholarships for undergraduates");
                  setShowChatPreview(true);
                }}
              >
                Scholarships for Undergraduates
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-colors"
                onClick={() => {
                  setSearchQuery("research grants");
                  setShowChatPreview(true);
                }}
              >
                Research Grants
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-colors"
                onClick={() => {
                  setSearchQuery("startup funding");
                  setShowChatPreview(true);
                }}
              >
                Startup Funding
              </motion.button>
            </div>

            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg shadow-lg hover:shadow-xl transition-all font-bold text-lg"
              >
                Start Your Free Trial
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Granada</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Granada, Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Email Capture Modal */}
      <AnimatePresence>
        {showEmailCapture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowEmailCapture(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Get Personalized Recommendations
                </h3>
                <p className="text-gray-600">
                  Enter your email to receive tailored funding opportunities based on your search for "{searchQuery || 'funding opportunities'}"
                </p>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-start">
                  <input
                    id="consent"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                  <label htmlFor="consent" className="ml-2 block text-sm text-gray-600">
                    I agree to receive personalized funding recommendations and updates from Granada
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Get My Recommendations
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                We respect your privacy and will never share your information with third parties.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-4 max-w-3xl w-full relative"
            >
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-200"
              >
                <X className="w-8 h-8" />
              </button>
              
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center p-8">
                  <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Video player would be embedded here</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-16 bg-white shadow-lg z-40 border-t border-gray-100"
          >
            <div className="px-4 py-6 space-y-6">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#benefits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Benefits
                </a>
                <a
                  href="#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Success Stories
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                >
                  Pricing
                </a>
              </nav>
              
              <div className="space-y-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
                    Log In
                  </button>
                </Link>
                
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                    Start Free Trial
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarketingLandingPage;