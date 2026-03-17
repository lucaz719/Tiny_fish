import process from 'node:process';

export class ScraperService {
  private apiKey: string;
  private endpoint: string;

  constructor() {
    this.apiKey = process.env.TINYFISH_API_KEY || '';
    this.endpoint = 'https://api.tinyfish.ai/v1/agentic-scrape';
  }

  async fetchExternalMarketPrices(productName: string, sku: string): Promise<number[]> {
    if (!this.apiKey) {
      console.warn('ScraperService: No TINYFISH_API_KEY configured. Skipping external scrape.');
      return [];
    }

    try {
      // Prompt construction for the agentic web AI
      const prompt = `Find the current retail market prices in Nepal for the product: "${productName}" (SKU: ${sku}).
      Return only a JSON array of numbers representing at least 3-5 different price points found on local marketplaces like Daraz, Sastodeal, or Gyapu.
      Example: [1200, 1250, 1180]`;

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          query: prompt,
          max_samples: 5,
          search_depth: 'deep'
        })
      });

      if (!response.ok) {
        throw new Error(`TinyFish AI API error: ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // We expect the agent to return an array of prices in its results
      // Assuming a structure like { prices: [100, 200, 300] } or data as array
      if (Array.isArray(data)) return data.filter(p => typeof p === 'number');
      if (data.prices && Array.isArray(data.prices)) return data.prices.filter((p: any) => typeof p === 'number');

      return [];
    } catch (error) {
      console.error('ScraperService: Failed to fetch external prices', error);
      return [];
    }
  }
}
