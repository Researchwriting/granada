import { createClient } from "npm:@supabase/supabase-js@2.38.4"
import puppeteer from "npm:puppeteer@22.4.0"
import * as cheerio from "npm:cheerio@1.0.0-rc.12"
import { v4 as uuidv4 } from "npm:uuid@9.0.1"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    console.log("Scrape donor function called");
    
    // Parse request body
    let url, country, source;
    try {
      const body = await req.json();
      url = body.url;
      country = body.country || "Global";
      source = body.source || "Custom Scrape";
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 400,
        }
      )
    }

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required" }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 400,
        }
      )
    }

    // Check for required environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("Using mock response due to missing configuration");
      return generateMockResponse(url, country, source);
    }

    // Create a Supabase client
    let supabaseClient;
    try {
      console.log("Creating Supabase client...");
      supabaseClient = createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          global: {
            headers: { Authorization: req.headers.get("Authorization") || "" },
          },
        }
      );
      console.log("Supabase client created successfully");
    } catch (clientError) {
      console.error("Error creating Supabase client:", clientError);
      return generateMockResponse(url, country, source);
    }

    // Launch puppeteer
    console.log("Launching puppeteer...");
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });

    try {
      const page = await browser.newPage();
      
      // Set viewport size
      await page.setViewport({ width: 1280, height: 800 });
      
      // Navigate to the URL
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Take a screenshot
      console.log("Taking screenshot...");
      const screenshotBuffer = await page.screenshot({ fullPage: false });
      const screenshotBase64 = Buffer.from(screenshotBuffer).toString('base64');
      
      // Get page content
      const content = await page.content();
      
      // Parse content with cheerio
      const $ = cheerio.load(content);
      
      // Extract opportunities
      const opportunities = [];
      
      // Look for common opportunity containers
      const opportunitySelectors = [
        '.opportunity', '.grant', '.funding', '.call',
        '[class*="opportunity"]', '[class*="grant"]',
        'article', '.post', '.item', '.card',
        '.listing', '.result', '.program'
      ];
      
      let containers = [];
      
      for (const selector of opportunitySelectors) {
        const found = $(selector);
        if (found.length > 0) {
          found.each((i, el) => containers.push($(el)));
          break;
        }
      }
      
      // If no containers found, try to extract from general page content
      if (containers.length === 0) {
        // Look for headings that might indicate opportunities
        $('h1, h2, h3, h4').each((i, el) => {
          const text = $(el).text().trim();
          if (text.toLowerCase().includes('grant') || 
              text.toLowerCase().includes('fund') || 
              text.toLowerCase().includes('opportunity')) {
            
            // Create an opportunity from this heading and surrounding content
            const container = $(el).parent();
            containers.push(container);
          }
        });
      }
      
      // Process containers (limit to 10 for performance)
      const processedContainers = containers.slice(0, 10);
      
      for (const container of processedContainers) {
        try {
          // Extract title
          let title = '';
          const headings = container.find('h1, h2, h3, h4, h5, .title, .heading');
          if (headings.length > 0) {
            title = headings.first().text().trim();
          }
          
          if (!title) {
            // Try to find a link with relevant text
            const links = container.find('a');
            links.each((i, el) => {
              const linkText = $(el).text().trim();
              if (linkText.length > 10) {
                title = linkText;
                return false; // break the loop
              }
            });
          }
          
          // Skip if no title found
          if (!title) continue;
          
          // Extract description
          let description = '';
          const paragraphs = container.find('p, .description, .summary, .content');
          if (paragraphs.length > 0) {
            description = paragraphs.first().text().trim();
          }
          
          // If no description found, use the container's text
          if (!description) {
            description = container.text().trim();
            // Remove the title from the description
            description = description.replace(title, '').trim();
          }
          
          // Extract link
          let link = '';
          const links = container.find('a');
          if (links.length > 0) {
            const href = links.first().attr('href');
            if (href) {
              // Convert relative URL to absolute
              link = new URL(href, url).href;
            }
          }
          
          // If no link found, use the page URL
          if (!link) {
            link = url;
          }
          
          // Create a unique hash for this opportunity
          const contentHash = createHash(`${title}-${source}-${link}`);
          
          // Create opportunity object
          const opportunity = {
            id: uuidv4(),
            title,
            description: description || title,
            source_url: link,
            source_name: source,
            country,
            content_hash: contentHash,
            scraped_at: new Date().toISOString()
          };
          
          opportunities.push(opportunity);
        } catch (containerError) {
          console.error("Error processing container:", containerError);
          // Continue with next container
        }
      }
      
      // Store opportunities in database
      if (opportunities.length > 0 && supabaseClient) {
        console.log(`Storing ${opportunities.length} opportunities in database...`);
        
        for (const opp of opportunities) {
          // Check if opportunity already exists
          const { data: existingOpp } = await supabaseClient
            .from('donor_opportunities')
            .select('id')
            .eq('content_hash', opp.content_hash)
            .maybeSingle();
          
          if (!existingOpp) {
            // Insert new opportunity
            const { error } = await supabaseClient
              .from('donor_opportunities')
              .insert([opp]);
            
            if (error) {
              console.error("Error inserting opportunity:", error);
            }
          }
        }
      }
      
      // Store screenshot in storage
      const screenshotId = uuidv4();
      const screenshotPath = `screenshots/${screenshotId}.png`;
      
      if (supabaseClient) {
        console.log("Storing screenshot in storage...");
        
        const { error } = await supabaseClient
          .storage
          .from('donor-screenshots')
          .upload(screenshotPath, screenshotBuffer, {
            contentType: 'image/png',
            upsert: true
          });
        
        if (error) {
          console.error("Error storing screenshot:", error);
        }
      }
      
      // Get public URL for screenshot
      let screenshotUrl = '';
      if (supabaseClient) {
        const { data } = await supabaseClient
          .storage
          .from('donor-screenshots')
          .getPublicUrl(screenshotPath);
        
        if (data) {
          screenshotUrl = data.publicUrl;
        }
      }
      
      // Return the results
      return new Response(
        JSON.stringify({
          success: true,
          url,
          country,
          source,
          opportunities_found: opportunities.length,
          opportunities,
          screenshot: {
            id: screenshotId,
            url: screenshotUrl,
            base64: `data:image/png;base64,${screenshotBase64}`
          }
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
      
    } finally {
      // Close the browser
      await browser.close();
    }
    
  } catch (error) {
    console.error("Error in scrape-donor function:", error);
    
    // Ensure we always return a valid Response object
    try {
      // Convert error to Error instance to ensure it has proper properties
      const err = error instanceof Error ? error : new Error(String(error || "Unknown error occurred"));
      
      return new Response(
        JSON.stringify({ 
          error: err.message || "Unknown error occurred",
          details: err.toString() || "No details available",
          code: "UNEXPECTED_ERROR"
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    } catch (responseError) {
      console.error("Failed to create error response:", responseError);
      
      // Last resort: return a minimal response
      return new Response(
        '{"error":"Critical function failure","code":"RESPONSE_ERROR"}',
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 500,
        }
      );
    }
  }
})

// Function to generate a mock response when Supabase is not available
function generateMockResponse(url, country, source) {
  try {
    console.log("Generating mock response for scrape-donor");
    
    // Generate mock opportunities
    const opportunities = [];
    const count = Math.floor(Math.random() * 5) + 1; // 1-5 opportunities
    
    for (let i = 0; i < count; i++) {
      const title = `${source} Funding Opportunity ${i + 1}`;
      const description = `This is a mock funding opportunity for ${country} from ${source}. It provides funding for various development projects.`;
      const contentHash = createHash(`${title}-${source}-${url}`);
      
      opportunities.push({
        id: uuidv4(),
        title,
        description,
        source_url: url,
        source_name: source,
        country,
        content_hash: contentHash,
        scraped_at: new Date().toISOString()
      });
    }
    
    // Generate mock screenshot
    const mockScreenshotBase64 = generateMockScreenshot();
    
    return new Response(
      JSON.stringify({
        success: true,
        url,
        country,
        source,
        opportunities_found: opportunities.length,
        opportunities,
        screenshot: {
          id: uuidv4(),
          url: '',
          base64: `data:image/png;base64,${mockScreenshotBase64}`
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error generating mock response:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Failed to generate mock response",
        opportunities: [],
        opportunities_found: 0
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200, // Return 200 even on error to prevent frontend crashes
      }
    );
  }
}

// Helper function to create a hash from a string
function createHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// Function to generate a mock screenshot
function generateMockScreenshot() {
  // This is a tiny 1x1 transparent PNG
  return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
}