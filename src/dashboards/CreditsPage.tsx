import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  Check, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Download,
  Search,
  FileText,
  Zap
} from 'lucide-react';

const CreditsPage: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showFAQ, setShowFAQ] = useState<number | null>(null);
  const [creditHistory, setCreditHistory] = useState([
    { id: 1, date: '2025-06-15', type: 'purchase', amount: 100, cost: '$9.99', status: 'completed' },
    { id: 2, date: '2025-06-15', type: 'usage', amount: -10, activity: 'Advanced search', status: 'completed' },
    { id: 3, date: '2025-06-17', type: 'usage', amount: -5, activity: 'Document generation', status: 'completed' },
    { id: 4, date: '2025-06-20', type: 'usage', amount: -15, activity: 'Bulk search', status: 'completed' },
  ]);

  const creditPackages = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 50,
      price: '$4.99',
      perCredit: '$0.10',
      features: [
        'Basic search functionality',
        'Document downloads',
        'Email support'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      credits: 100,
      price: '$9.99',
      perCredit: '$0.10',
      popular: true,
      features: [
        'Advanced search functionality',
        'Document downloads',
        'Priority email support',
        'Save search results'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      credits: 250,
      price: '$19.99',
      perCredit: '$0.08',
      features: [
        'All Standard features',
        'Bulk search operations',
        'API access',
        'Priority support',
        'Custom document generation'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      credits: 1000,
      price: '$69.99',
      perCredit: '$0.07',
      features: [
        'All Professional features',
        'Dedicated account manager',
        'Custom integrations',
        'Team collaboration tools',
        'Advanced analytics'
      ]
    }
  ];

  const faqs = [
    {
      question: 'What are Granada credits?',
      answer: 'Granada credits are the currency used within our platform to access various features such as advanced searches, document generation, and premium content. Credits allow you to pay only for what you use.'
    },
    {
      question: 'How long do credits last?',
      answer: 'Credits do not expire and remain in your account until used. You can purchase credits at any time and use them whenever you need them.'
    },
    {
      question: 'Can I get a refund for unused credits?',
      answer: 'We do not offer refunds for purchased credits. However, since credits never expire, you can use them at any time in the future.'
    },
    {
      question: 'How many credits do different actions cost?',
      answer: 'Basic searches cost 1 credit, advanced searches cost 5-10 credits depending on complexity, document generation costs 5 credits, and bulk operations vary based on volume. You can see the credit cost before performing any action.'
    },
    {
      question: 'Do you offer discounts for nonprofits or educational institutions?',
      answer: 'Yes, we offer special pricing for nonprofits, educational institutions, and qualified organizations. Please contact our support team for more information.'
    }
  ];

  const selectedPkg = creditPackages.find(pkg => pkg.id === selectedPackage) || creditPackages[1];

  const handlePurchase = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      // Update credit history
      setCreditHistory(prev => [
        {
          id: prev.length + 1,
          date: new Date().toISOString().split('T')[0],
          type: 'purchase',
          amount: selectedPkg.credits,
          cost: selectedPkg.price,
          status: 'completed'
        },
        ...prev
      ]);
      
      // Reset after showing success message
      setTimeout(() => {
        setIsComplete(false);
      }, 3000);
    }, 2000);
  };

  const toggleFAQ = (index: number) => {
    if (showFAQ === index) {
      setShowFAQ(null);
    } else {
      setShowFAQ(index);
    }
  };

  // Calculate current credit balance
  const creditBalance = creditHistory.reduce((total, item) => total + item.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-gray-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Credits Management</h1>
        <p className="text-gray-300 mb-4">Purchase and manage your Granada credits to access premium features.</p>
        
        <div className="bg-gray-800 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-purple-900 p-3 rounded-full mr-4">
              <DollarSign className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Current Balance</p>
              <p className="text-2xl font-bold text-white">{creditBalance} Credits</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button 
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => window.scrollTo({ top: document.getElementById('credit-history')?.offsetTop, behavior: 'smooth' })}
            >
              View History
            </button>
            <button 
              className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => window.scrollTo({ top: document.getElementById('purchase-credits')?.offsetTop, behavior: 'smooth' })}
            >
              Buy More
            </button>
          </div>
        </div>
      </div>

      {/* Credit Usage Guide */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
        <h2 className="text-xl font-bold mb-4">How Credits Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="bg-purple-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Search Operations</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex justify-between">
                <span>Basic Search</span>
                <span className="font-medium">1 Credit</span>
              </li>
              <li className="flex justify-between">
                <span>Advanced Search</span>
                <span className="font-medium">5 Credits</span>
              </li>
              <li className="flex justify-between">
                <span>Bulk Search</span>
                <span className="font-medium">10+ Credits</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="bg-blue-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Documents</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex justify-between">
                <span>Generate Document</span>
                <span className="font-medium">5 Credits</span>
              </li>
              <li className="flex justify-between">
                <span>Download Results</span>
                <span className="font-medium">3 Credits</span>
              </li>
              <li className="flex justify-between">
                <span>Custom Templates</span>
                <span className="font-medium">8 Credits</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Premium Features</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex justify-between">
                <span>API Access (per call)</span>
                <span className="font-medium">2 Credits</span>
              </li>
              <li className="flex justify-between">
                <span>Analytics Reports</span>
                <span className="font-medium">10 Credits</span>
              </li>
              <li className="flex justify-between">
                <span>Priority Support</span>
                <span className="font-medium">5 Credits</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Purchase Credits */}
      <div id="purchase-credits" className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Purchase Credits</h2>
        
        {isComplete ? (
          <div className="bg-green-900 bg-opacity-20 border border-green-700 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-green-900 rounded-full mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Purchase Successful!</h3>
            <p className="text-gray-300 mb-4">
              {selectedPkg.credits} credits have been added to your account.
            </p>
          </div>
        ) : (
          <>
            {/* Credit Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {creditPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all relative ${
                    selectedPackage === pkg.id 
                      ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                      : 'border-gray-700 hover:border-purple-500'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                      <span className="bg-green-900 text-green-300 text-xs font-medium px-2 py-1 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${
                        selectedPackage === pkg.id 
                          ? 'border-purple-500 bg-purple-500' 
                          : 'border-gray-600'
                        } mr-3 flex items-center justify-center`}
                      >
                        {selectedPackage === pkg.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <h3 className="font-semibold text-lg text-white">{pkg.name}</h3>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-white">{pkg.price}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-purple-400 font-medium">{pkg.credits} Credits</span>
                      <span className="text-gray-400 text-sm">{pkg.perCredit}/credit</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Payment Method */}
            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
              
              <div className="space-y-4 mb-6">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'credit_card' 
                      ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                      : 'border-gray-600 hover:border-purple-500'
                  }`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border ${
                      paymentMethod === 'credit_card' 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-600'
                      } mr-3 flex items-center justify-center`}
                    >
                      {paymentMethod === 'credit_card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="font-medium text-white">Credit / Debit Card</span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'credit_card' && (
                    <div className="mt-4 pl-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Card Number</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Cardholder Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">Expiration Date</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-sm mb-1">CVC</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'paypal' 
                      ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                      : 'border-gray-600 hover:border-purple-500'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border ${
                      paymentMethod === 'paypal' 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-600'
                      } mr-3 flex items-center justify-center`}
                    >
                      {paymentMethod === 'paypal' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="font-medium text-white">PayPal</span>
                  </div>
                  
                  {paymentMethod === 'paypal' && (
                    <div className="mt-4 pl-8">
                      <p className="text-gray-300 mb-2">You will be redirected to PayPal to complete your purchase.</p>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'crypto' 
                      ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                      : 'border-gray-600 hover:border-purple-500'
                  }`}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border ${
                      paymentMethod === 'crypto' 
                        ? 'border-purple-500 bg-purple-500' 
                        : 'border-gray-600'
                      } mr-3 flex items-center justify-center`}
                    >
                      {paymentMethod === 'crypto' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="font-medium text-white">Cryptocurrency</span>
                  </div>
                  
                  {paymentMethod === 'crypto' && (
                    <div className="mt-4 pl-8">
                      <p className="text-gray-300 mb-2">We accept Bitcoin, Ethereum, and other major cryptocurrencies.</p>
                      <div className="flex space-x-4 mt-3">
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors">
                          Bitcoin
                        </button>
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors">
                          Ethereum
                        </button>
                        <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors">
                          Other
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="border-t border-gray-600 pt-4">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{selectedPkg.name} Package</span>
                    <span className="text-white">{selectedPkg.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Credits</span>
                    <span className="text-white">{selectedPkg.credits}</span>
                  </div>
                  {/* Add tax or other fees if applicable */}
                </div>
                
                <div className="border-t border-gray-600 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-lg text-white">Total</span>
                  <span className="font-bold text-xl text-white">{selectedPkg.price}</span>
                </div>
              </div>
            </div>
            
            {/* Purchase Button */}
            <div className="flex justify-end">
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Purchase
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Credit History */}
      <div id="credit-history" className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Credit History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Transaction</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Credits</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Details</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {creditHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-300">{item.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'purchase' 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-blue-900 text-blue-300'
                    }`}>
                      {item.type === 'purchase' ? 'Purchase' : 'Usage'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-medium ${
                      item.amount > 0 ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {item.amount > 0 ? '+' : ''}{item.amount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {item.type === 'purchase' 
                      ? `Credit package (${item.cost})` 
                      : item.activity}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' 
                        ? 'bg-green-900 text-green-300' 
                        : item.status === 'pending'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700">
        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 flex justify-between items-center bg-gray-700 hover:bg-gray-600 transition-colors text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-white">{faq.question}</span>
                {showFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {showFAQ === index && (
                <div className="px-6 py-4 bg-gray-800">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Special Offers for NGOs */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-6 md:w-2/3">
            <h2 className="text-xl font-bold mb-2">Special Pricing for Nonprofits and NGOs</h2>
            <p className="text-gray-300 mb-4">
              We offer discounted credit packages for nonprofit organizations and NGOs. Our mission is to help you maximize your impact with affordable access to funding opportunities.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-200">Up to 50% discount on credit packages</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-200">Free initial consultation</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span className="text-gray-200">Dedicated support for grant applications</span>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/3">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-4 text-center">NGO Discount Program</h3>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-md font-medium transition-colors">
                Apply Now
              </button>
              <p className="text-center text-sm text-gray-400 mt-3">
                Verification required. Response within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsPage;