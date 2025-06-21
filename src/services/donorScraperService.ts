import axios from 'axios';

interface ScrapingRequest {
  url: string;
  country?: string;
  source?: string;
}

interface ScrapingResult {
  success: boolean;
  url: string;
  country: string;
  source: string;
  opportunities_found: number;
  opportunities: any[];
  screenshot: {
    id: string;
    url: string;
    base64: string;
  };
  error?: string;
}

class DonorScraperService {
  private supabaseUrl: string;
  private supabaseAnonKey: string;
  private isInitialized: boolean = false;
  private screenshotCache: Map<string, string> = new Map();

  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.warn('Missing Supabase configuration for donor scraper service');
    } else {
      this.isInitialized = true;
    }
  }

  async scrapeUrl(request: ScrapingRequest): Promise<ScrapingResult> {
    try {
      if (!this.isInitialized) {
        return this.generateMockResult(request);
      }

      const response = await axios.post(
        `${this.supabaseUrl}/functions/v1/scrape-donor`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.supabaseAnonKey}`
          },
          timeout: 60000 // 60 second timeout
        }
      );

      // Cache the screenshot
      if (response.data.screenshot && response.data.screenshot.base64) {
        this.screenshotCache.set(request.url, response.data.screenshot.base64);
      }

      return response.data;
    } catch (error) {
      console.error('Error scraping URL:', error);
      
      // Check if we have a cached screenshot
      const cachedScreenshot = this.screenshotCache.get(request.url);
      
      // Return error with cached screenshot if available
      return {
        success: false,
        url: request.url,
        country: request.country || 'Global',
        source: request.source || 'Unknown',
        opportunities_found: 0,
        opportunities: [],
        screenshot: {
          id: 'error',
          url: '',
          base64: cachedScreenshot || this.generateMockScreenshot()
        },
        error: error.message || 'Failed to scrape URL'
      };
    }
  }

  async getScreenshot(url: string): Promise<string> {
    // Check cache first
    const cachedScreenshot = this.screenshotCache.get(url);
    if (cachedScreenshot) {
      return cachedScreenshot;
    }

    // If not in cache, try to scrape
    try {
      const result = await this.scrapeUrl({ url });
      return result.screenshot.base64;
    } catch (error) {
      console.error('Error getting screenshot:', error);
      return this.generateMockScreenshot();
    }
  }

  private generateMockResult(request: ScrapingRequest): ScrapingResult {
    const { url, country = 'Global', source = 'Mock Source' } = request;
    
    // Generate 1-5 mock opportunities
    const opportunities = [];
    const count = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < count; i++) {
      opportunities.push({
        id: `mock-${Date.now()}-${i}`,
        title: `${source} Funding Opportunity ${i + 1}`,
        description: `This is a mock funding opportunity for ${country} from ${source}. It provides funding for various development projects.`,
        source_url: url,
        source_name: source,
        country,
        content_hash: `mock-hash-${Date.now()}-${i}`,
        scraped_at: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      url,
      country,
      source,
      opportunities_found: opportunities.length,
      opportunities,
      screenshot: {
        id: `mock-screenshot-${Date.now()}`,
        url: '',
        base64: this.generateMockScreenshot()
      }
    };
  }

  private generateMockScreenshot(): string {
    // Generate a more realistic mock screenshot
    // This creates a simple colored rectangle with text
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, 800, 600);
      
      // Header
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, 0, 800, 80);
      
      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('Funding Opportunity Portal', 20, 50);
      
      // Content area
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(20, 100, 760, 480);
      
      // Content text
      ctx.fillStyle = '#333333';
      ctx.font = '18px Arial';
      ctx.fillText('Mock Screenshot - Funding Opportunity', 40, 140);
      
      ctx.font = '14px Arial';
      ctx.fillText('This is a simulated view of a funding opportunity website.', 40, 180);
      ctx.fillText('In production, this would be a real screenshot of the source website.', 40, 210);
      
      // Opportunity box
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 250, 720, 150);
      
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Sample Funding Opportunity', 60, 280);
      
      ctx.fillStyle = '#333333';
      ctx.font = '14px Arial';
      ctx.fillText('Amount: $50,000 - $250,000', 60, 310);
      ctx.fillText('Deadline: December 31, 2024', 60, 340);
      ctx.fillText('Focus Area: Education, Health, Environment', 60, 370);
      
      // Footer
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(0, 550, 800, 50);
      
      return canvas.toDataURL('image/png');
    }
    
    // Fallback to a tiny transparent PNG if canvas fails
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  }
}

export const donorScraperService = new DonorScraperService();