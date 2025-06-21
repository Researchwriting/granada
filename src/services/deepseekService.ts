// DeepSeek API integration service
const DEEPSEEK_API_KEY = 'sk-ba79588160b742b58ba715bb6bdc7c92';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}

export const generateAIResponse = async (
  query: string, 
  context: string = ''
): Promise<{ content: string; options: string[] }> => {
  try {
    const systemPrompt = `You are Granada AI, an intelligent assistant for impact-driven organizations. 
    Your goal is to help users find funding opportunities, scholarships, grants, and other resources.
    Always provide helpful, concise responses with 2-3 suggested next steps or options.
    ${context ? `Context about the user: ${context}` : ''}`;
    
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query }
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      // Fallback to local response if API fails
      return generateLocalResponse(query);
    }

    const data = await response.json() as DeepSeekResponse;
    const content = data.choices[0].message.content;
    
    // Extract or generate options
    const options = extractOptionsFromContent(content);
    
    return { content, options };
  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    // Fallback to local response
    return generateLocalResponse(query);
  }
};

// Extract options from AI response or generate them
const extractOptionsFromContent = (content: string): string[] => {
  // Try to find numbered or bulleted lists in the content
  const listRegex = /(?:^|\n)(?:\d+\.\s|\*\s|-\s)(.+?)(?=\n|$)/g;
  const matches = [...content.matchAll(listRegex)];
  
  if (matches.length >= 2) {
    return matches.slice(0, 3).map(match => match[1].trim());
  }
  
  // If no list found, generate generic options
  if (content.toLowerCase().includes('funding') || content.toLowerCase().includes('grant')) {
    return [
      'Show me matching opportunities',
      'What are the eligibility requirements?',
      'Help me prepare an application'
    ];
  }
  
  if (content.toLowerCase().includes('scholarship')) {
    return [
      'View scholarship details',
      'Check application deadlines',
      'See success stories'
    ];
  }
  
  // Default options
  return [
    'Tell me more',
    'Show me examples',
    'How do I get started?'
  ];
};

// Fallback local response generator
const generateLocalResponse = (query: string): { content: string; options: string[] } => {
  const lowerQuery = query.toLowerCase();
  let content = '';
  let options: string[] = [];
  
  if (lowerQuery.includes('scholarship') || lowerQuery.includes('education')) {
    content = "I've found several scholarship opportunities that might be a good match for you. These include programs for undergraduate and graduate students with various focus areas.";
    options = [
      'Show top scholarship matches',
      'Filter by field of study',
      'See application requirements'
    ];
  } else if (lowerQuery.includes('grant') || lowerQuery.includes('funding')) {
    content = "I've identified multiple grant opportunities that align with your interests. These grants range from $5,000 to $500,000 with various focus areas and requirements.";
    options = [
      'View matching grants',
      'Filter by amount',
      'See application deadlines'
    ];
  } else if (lowerQuery.includes('business') || lowerQuery.includes('startup')) {
    content = "There are several funding options available for businesses and startups like yours. These include seed funding, angel investments, and specialized grants for innovation.";
    options = [
      'Show business funding options',
      'Compare funding types',
      'See eligibility criteria'
    ];
  } else {
    content = `I've found several opportunities related to "${query}". Would you like to explore these options or refine your search further?`;
    options = [
      'Show all results',
      'Refine my search',
      'Get personalized recommendations'
    ];
  }
  
  return { content, options };
};