import axios from 'axios';

// Define the base URL for the API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface SearchFilters {
  [key: string]: any;
}

export interface SearchParams {
  query: string;
  userType?: 'student' | 'business' | 'jobseeker' | 'general' | 'nonprofit';
  filters?: SearchFilters;
  page?: number;
  pageSize?: number;
  sortBy?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  organization: string;
  amount?: string;
  deadline?: string;
  location?: string;
  url?: string;
  tags: string[];
  matchScore: number;
  type: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  executionTime: number;
  creditCost: number;
}

export interface CreditTransaction {
  id: number;
  amount: number;
  type: string;
  details: string;
  timestamp: string;
}

export interface CreditBalance {
  userId: string;
  balance: number;
}

export interface CreditHistory {
  userId: string;
  transactions: CreditTransaction[];
}

export interface CreditPurchaseParams {
  userId: string;
  amount: number;
  paymentMethod: string;
  paymentDetails: any;
}

// API functions
export const searchApi = {
  // Search for funding opportunities
  search: async (params: SearchParams, userId: string = 'anonymous'): Promise<SearchResponse> => {
    try {
      const response = await apiClient.post('/search', {
        query: params.query,
        user_type: params.userType || 'general',
        filters: params.filters || {},
        page: params.page || 1,
        page_size: params.pageSize || 10,
        sort_by: params.sortBy || 'relevance',
      }, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },

  // Get credit balance
  getCreditBalance: async (userId: string): Promise<CreditBalance> => {
    try {
      const response = await apiClient.get(`/credits/balance/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get credit balance API error:', error);
      throw error;
    }
  },

  // Get credit history
  getCreditHistory: async (userId: string): Promise<CreditHistory> => {
    try {
      const response = await apiClient.get(`/credits/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get credit history API error:', error);
      throw error;
    }
  },

  // Purchase credits
  purchaseCredits: async (params: CreditPurchaseParams): Promise<{ success: boolean; creditsAdded: number }> => {
    try {
      const response = await apiClient.post('/credits/purchase', {
        user_id: params.userId,
        amount: params.amount,
        payment_method: params.paymentMethod,
        payment_details: params.paymentDetails
      });
      return response.data;
    } catch (error) {
      console.error('Purchase credits API error:', error);
      throw error;
    }
  },

  // Mock search function for development when backend is not available
  mockSearch: async (params: SearchParams): Promise<SearchResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const query = params.query.toLowerCase();
    const userType = params.userType || 'general';
    
    // Generate mock results based on query and user type
    let results: SearchResult[] = [];
    
    if (query.includes('scholarship') || userType === 'student') {
      results = results.concat([
        {
          id: 'scholarship-1',
          title: 'Merit Scholarship Program',
          description: 'Scholarship for high-achieving students in all fields of study.',
          organization: 'National Education Foundation',
          amount: '$5,000',
          deadline: '2025-08-15',
          location: 'United States',
          tags: ['scholarship', 'merit', 'education'],
          matchScore: 0.95,
          type: 'scholarship'
        },
        {
          id: 'scholarship-2',
          title: 'STEM Excellence Scholarship',
          description: 'Supporting students pursuing degrees in Science, Technology, Engineering, or Mathematics.',
          organization: 'Technology Innovation Fund',
          amount: '$10,000',
          deadline: '2025-09-30',
          location: 'Global',
          tags: ['scholarship', 'STEM', 'technology'],
          matchScore: 0.87,
          type: 'scholarship'
        }
      ]);
    }
    
    if (query.includes('grant') || query.includes('research')) {
      results = results.concat([
        {
          id: 'grant-1',
          title: 'Research Innovation Grant',
          description: 'Funding for innovative research projects with commercial potential.',
          organization: 'National Science Foundation',
          amount: '$50,000',
          deadline: '2025-07-31',
          location: 'United States',
          tags: ['grant', 'research', 'innovation'],
          matchScore: 0.92,
          type: 'grant'
        },
        {
          id: 'grant-2',
          title: 'Community Development Grant',
          description: 'Supporting projects that improve local communities and infrastructure.',
          organization: 'Regional Development Agency',
          amount: '$25,000',
          deadline: '2025-08-20',
          location: 'Various Regions',
          tags: ['grant', 'community', 'development'],
          matchScore: 0.84,
          type: 'grant'
        }
      ]);
    }
    
    if (query.includes('business') || userType === 'business') {
      results = results.concat([
        {
          id: 'business-1',
          title: 'Small Business Innovation Fund',
          description: 'Funding for small businesses developing innovative products or services.',
          organization: 'Economic Development Corporation',
          amount: '$75,000',
          deadline: '2025-09-15',
          location: 'North America',
          tags: ['business', 'innovation', 'startup'],
          matchScore: 0.91,
          type: 'business_funding'
        },
        {
          id: 'business-2',
          title: 'Green Business Initiative',
          description: 'Supporting businesses implementing sustainable practices and technologies.',
          organization: 'Environmental Protection Agency',
          amount: '$40,000',
          deadline: '2025-10-01',
          location: 'United States',
          tags: ['business', 'sustainability', 'green'],
          matchScore: 0.83,
          type: 'business_funding'
        }
      ]);
    }
    
    if (query.includes('nonprofit') || query.includes('ngo') || userType === 'nonprofit') {
      results = results.concat([
        {
          id: 'nonprofit-1',
          title: 'Community Impact Grant',
          description: 'Funding for nonprofit organizations making a difference in local communities.',
          organization: 'Community Foundation',
          amount: '$30,000',
          deadline: '2025-08-10',
          location: 'United States',
          tags: ['nonprofit', 'community', 'impact'],
          matchScore: 0.89,
          type: 'nonprofit_funding'
        },
        {
          id: 'nonprofit-2',
          title: 'Global Humanitarian Fund',
          description: 'Supporting NGOs working on international humanitarian projects.',
          organization: 'International Relief Organization',
          amount: '$100,000',
          deadline: '2025-09-20',
          location: 'Global',
          tags: ['nonprofit', 'humanitarian', 'international'],
          matchScore: 0.85,
          type: 'nonprofit_funding'
        }
      ]);
    }
    
    // If no specific results, add some generic ones
    if (results.length === 0) {
      results = [
        {
          id: 'general-1',
          title: `Funding Opportunity for ${query}`,
          description: `General funding opportunity related to ${query}.`,
          organization: 'General Funding Agency',
          amount: '$25,000',
          deadline: '2025-08-30',
          location: 'Various',
          tags: ['funding', query],
          matchScore: 0.80,
          type: 'grant'
        },
        {
          id: 'general-2',
          title: `${query.charAt(0).toUpperCase() + query.slice(1)} Development Program`,
          description: `Program supporting development in the field of ${query}.`,
          organization: 'Development Foundation',
          amount: '$15,000',
          deadline: '2025-09-15',
          location: 'Global',
          tags: ['program', 'development', query],
          matchScore: 0.75,
          type: 'program'
        }
      ];
    }
    
    // Sort by match score
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    // Apply pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = results.slice(startIndex, startIndex + pageSize);
    
    return {
      results: paginatedResults,
      total: results.length,
      page,
      pageSize,
      query: params.query,
      executionTime: 0.5,
      creditCost: 1
    };
  }
};

export default searchApi;