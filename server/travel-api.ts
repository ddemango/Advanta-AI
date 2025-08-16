import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// IATA code mappings for parsing
const IATA_GUESS: Record<string, string> = {
  "nyc": "JFK", "new": "JFK", "york": "JFK",
  "sf": "SFO", "sfo": "SFO", "bay": "SFO",
  "la": "LAX", "los": "LAX", "angeles": "LAX",
  "miami": "MIA", "chicago": "ORD",
  "rome": "FCO", "tokyo": "HND", "london": "LHR", "paris": "CDG",
  "nashville": "BNA", "dallas": "DFW", "houston": "IAH"
};

const CITY_CODE_GUESS: Record<string, string> = {
  "paris": "PAR", "rome": "ROM", "london": "LON", 
  "new": "NYC", "york": "NYC", "tokyo": "TYO", 
  "miami": "MIA", "chicago": "CHI"
};

const MONTHS: Record<string, number> = {
  "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
  "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6,
  "jul": 7, "july": 7, "aug": 8, "august": 8,
  "sep": 9, "sept": 9, "september": 9,
  "oct": 10, "october": 10, "nov": 11, "november": 11,
  "dec": 12, "december": 12
};

// Helper functions for basic parsing
function extractTokens(text: string): string[] {
  return text.toLowerCase().match(/[a-z]{2,}/g) || [];
}

function pickIATACodes(tokens: string[]): [string, string] {
  const mapped = tokens.filter(t => IATA_GUESS[t]).map(t => IATA_GUESS[t]);
  const origin = mapped[0] || "JFK";
  const dest = mapped[1] || "FCO";
  return [origin, dest];
}

function pickCityCode(tokens: string[]): string {
  for (const token of tokens) {
    if (CITY_CODE_GUESS[token]) {
      return CITY_CODE_GUESS[token];
    }
  }
  return "PAR";
}

function pickDates(tokens: string[]): [string | null, string | null] {
  for (const token of tokens) {
    if (MONTHS[token]) {
      const year = 2025; // Use 2025 for future travel dates
      const month = MONTHS[token];
      return [`${year}-${month.toString().padStart(2, '0')}-10`, `${year}-${month.toString().padStart(2, '0')}-17`];
    }
  }
  return [null, null];
}

function parseBasic(text: string) {
  const tokens = extractTokens(text);
  const [origin, destination] = pickIATACodes(tokens);
  const [depart, ret] = pickDates(tokens);
  
  // Extract budget
  const budgetMatch = text.match(/\$?\s*(\d{2,5})\b/);
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;
  
  // Extract preferences
  const nonstop = /nonstop|non-stop|no stops/i.test(text);
  let cabin = "ECONOMY";
  if (/business/i.test(text)) cabin = "BUSINESS";
  else if (/first/i.test(text)) cabin = "FIRST";
  else if (/premium/i.test(text)) cabin = "PREMIUM_ECONOMY";
  
  const cityCode = pickCityCode(tokens);
  
  return {
    // Flight parameters
    origin,
    destination,
    departDate: depart,
    returnDate: ret,
    nonStop: nonstop,
    cabin,
    maxPrice: budget,
    
    // Hotel parameters
    cityCode: pickCityCode(tokens),
    checkInDate: depart,
    checkOutDate: ret,
    adults: 2,
    
    // Car parameters
    pickUpDateTime: depart ? `${depart}T10:00:00` : null,
    dropOffDateTime: ret ? `${ret}T10:00:00` : null,
    passengers: 2
  };
}

async function parseWithAI(text: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a travel query parser. Extract travel parameters from natural language queries and return them as JSON.

Extract these parameters:
- origin: IATA airport code (e.g., JFK, LAX, LHR)
- destination: IATA airport code
- departDate: YYYY-MM-DD format
- returnDate: YYYY-MM-DD format (null if one-way)
- nonStop: boolean
- cabin: "ECONOMY", "BUSINESS", "FIRST", or "PREMIUM_ECONOMY"
- maxPrice: number or null
- cityCode: IATA city code for hotels/cars (e.g., NYC, PAR, LON)
- checkInDate: YYYY-MM-DD (same as departDate usually)
- checkOutDate: YYYY-MM-DD (same as returnDate usually)
- adults: number of adults
- passengers: number for car rental

Common mappings:
NYC/New York -> JFK (airport), NYC (city)
Paris -> CDG (airport), PAR (city)
London -> LHR (airport), LON (city)
Rome -> FCO (airport), ROM (city)
Tokyo -> HND (airport), TYO (city)

If dates are vague (like "next month" or "March"), use 2025 for future travel dates. Current date is August 2025.`
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('AI parsing failed:', error);
    return parseBasic(text);
  }
}

// Mock Amadeus API responses for demo purposes
function mockFlightSearch(params: any) {
  const { origin, destination, departDate, returnDate, maxPrice } = params;
  
  const basePrice = Math.floor(Math.random() * 800) + 200;
  const offers = [];
  
  for (let i = 0; i < 5; i++) {
    const price = basePrice + (Math.random() * 400) - 200;
    if (maxPrice && price > maxPrice) continue;
    
    const tier = price < 500 ? 'EXCELLENT' : price < 800 ? 'GOOD' : 'FAIR';
    const cpm = (price / 3000) * 100; // Rough cost per mile calculation
    
    offers.push({
      id: `FLIGHT_${i}_${Date.now()}`,
      priceUSD: Math.round(price * 100) / 100,
      tier,
      cpm: Math.round(cpm * 10000) / 10000,
      validatingAirline: ['AA', 'UA', 'DL', 'LH', 'AF'][Math.floor(Math.random() * 5)],
      itineraries: [
        {
          duration: `PT${Math.floor(Math.random() * 12) + 6}H${Math.floor(Math.random() * 60)}M`,
          segments: [
            {
              from: origin,
              to: destination,
              dep: `${departDate}T${String(Math.floor(Math.random() * 12) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
              arr: `${departDate}T${String(Math.floor(Math.random() * 12) + 12).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
              carrier: ['AA', 'UA', 'DL'][Math.floor(Math.random() * 3)],
              number: String(Math.floor(Math.random() * 9000) + 1000)
            }
          ]
        },
        ...(returnDate ? [{
          duration: `PT${Math.floor(Math.random() * 12) + 6}H${Math.floor(Math.random() * 60)}M`,
          segments: [
            {
              from: destination,
              to: origin,
              dep: `${returnDate}T${String(Math.floor(Math.random() * 12) + 6).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
              arr: `${returnDate}T${String(Math.floor(Math.random() * 12) + 12).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
              carrier: ['AA', 'UA', 'DL'][Math.floor(Math.random() * 3)],
              number: String(Math.floor(Math.random() * 9000) + 1000)
            }
          ]
        }] : [])
      ]
    });
  }
  
  return { offers: offers.sort((a, b) => a.priceUSD - b.priceUSD) };
}

function mockHotelSearch(params: any) {
  const { cityCode, checkInDate, checkOutDate } = params;
  
  const hotels = [
    'Grand Hotel', 'City Center Inn', 'Luxury Suites', 'Business Hotel', 'Boutique Stay'
  ];
  
  const data = hotels.map((name, index) => ({
    type: "hotel-offer",
    hotel: {
      name: `${name} ${cityCode}`,
      hotelId: `HOTEL_${index}_${cityCode}`,
      cityCode
    },
    offers: [{
      id: `OFFER_${index}_${Date.now()}`,
      price: {
        currency: "USD",
        total: String(Math.floor(Math.random() * 300) + 80)
      },
      checkInDate,
      checkOutDate
    }]
  }));
  
  return { data };
}

function mockCarSearch(params: any) {
  const { cityCode, pickUpDateTime, dropOffDateTime } = params;
  
  const cars = [
    { vehicle: 'Economy', supplier: 'Budget', basePrice: 35 },
    { vehicle: 'Compact', supplier: 'Hertz', basePrice: 45 },
    { vehicle: 'Midsize', supplier: 'Avis', basePrice: 55 },
    { vehicle: 'SUV', supplier: 'Enterprise', basePrice: 75 },
    { vehicle: 'Luxury', supplier: 'Premium Cars', basePrice: 120 }
  ];
  
  const offers = cars.map((car, index) => ({
    id: `CAR_${index}_${Date.now()}`,
    supplier: car.supplier,
    vehicle: car.vehicle,
    priceUSD: car.basePrice + Math.floor(Math.random() * 20),
    pickUp: {
      cityCode,
      at: pickUpDateTime
    },
    dropOff: {
      cityCode,
      at: dropOffDateTime
    }
  }));
  
  return { offers };
}

// API Routes

// Parse natural language travel query
router.post('/parse', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const useAI = process.env.OPENAI_API_KEY && process.env.USE_AI_PARSER !== '0';
    let params;
    let usingAI = false;
    
    if (useAI) {
      try {
        params = await parseWithAI(text);
        usingAI = true;
      } catch (error) {
        console.error('AI parsing failed, falling back to basic:', error);
        params = parseBasic(text);
      }
    } else {
      params = parseBasic(text);
    }
    
    res.json({
      params,
      using_ai: usingAI
    });
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ error: 'Failed to parse travel query' });
  }
});

// Search flights
router.post('/flights/search', async (req, res) => {
  try {
    const { origin, destination, departDate, returnDate, nonStop, cabin, maxPrice, maxOffers = 20, currency = 'USD' } = req.body;
    
    if (!origin || !destination || !departDate) {
      return res.status(400).json({ error: 'Origin, destination, and departure date are required' });
    }
    
    // In a real implementation, this would call the Amadeus API
    // For demo purposes, we're using mock data
    const result = mockFlightSearch({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departDate,
      returnDate,
      nonStop,
      cabin,
      maxPrice,
      maxOffers,
      currency
    });
    
    res.json(result);
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ error: 'Flight search failed' });
  }
});

// Search hotels
router.post('/hotels/search', async (req, res) => {
  try {
    const { cityCode, checkInDate, checkOutDate, adults = 2, roomQuantity = 1, currency = 'USD' } = req.body;
    
    if (!cityCode || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'City code, check-in date, and check-out date are required' });
    }
    
    // In a real implementation, this would call the Amadeus Hotel Search API
    // For demo purposes, we're using mock data
    const result = mockHotelSearch({
      cityCode: cityCode.toUpperCase(),
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      currency
    });
    
    res.json(result);
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ error: 'Hotel search failed' });
  }
});

// Search car rentals
router.post('/cars/search', async (req, res) => {
  try {
    const { cityCode, pickUpDateTime, dropOffDateTime, passengers = 2 } = req.body;
    
    if (!cityCode || !pickUpDateTime || !dropOffDateTime) {
      return res.status(400).json({ error: 'City code, pickup, and dropoff times are required' });
    }
    
    // In a real implementation, this would call the Amadeus Cars & Transfers API
    // For demo purposes, we're using mock data
    const result = mockCarSearch({
      cityCode: cityCode.toUpperCase(),
      pickUpDateTime,
      dropOffDateTime,
      passengers
    });
    
    res.json(result);
  } catch (error) {
    console.error('Car search error:', error);
    res.status(500).json({ error: 'Car search failed' });
  }
});

// Generate AI summary of travel options
router.post('/summary', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'AI summary not available - OpenAI API key not configured' });
    }
    
    const { flightOffers = [], hotelOffers = [], carOffers = [], origin, destination } = req.body;
    
    if (flightOffers.length === 0 && hotelOffers.length === 0 && carOffers.length === 0) {
      return res.status(400).json({ error: 'No travel options provided for summary' });
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a travel advisor AI. Analyze the provided flight, hotel, and car rental options and create a personalized summary with recommendations.

Focus on:
- Best value options and why they're good deals
- Travel tips and insights
- Potential cost savings
- Booking recommendations
- Any notable patterns in pricing or availability

Be conversational and helpful, like a knowledgeable travel agent.`
        },
        {
          role: "user",
          content: `Please analyze these travel options for a trip from ${origin} to ${destination}:

FLIGHTS (${flightOffers.length} options):
${flightOffers.map((f: any, i: number) => `${i+1}. $${f.priceUSD} - ${f.tier} deal (${f.cpm}¢/mile) - ${f.validatingAirline}`).join('\n')}

HOTELS (${hotelOffers.length} options):
${hotelOffers.map((h: any, i: number) => `${i+1}. ${h.hotel.name} - $${h.offers[0]?.price.total}/night in ${h.hotel.cityCode}`).join('\n')}

CARS (${carOffers.length} options):
${carOffers.map((c: any, i: number) => `${i+1}. ${c.vehicle} from ${c.supplier} - $${c.priceUSD}/day`).join('\n')}

Provide a comprehensive travel summary with recommendations.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const summary = completion.choices[0].message.content || 'Unable to generate summary';
    
    res.json({ summary });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({ error: 'Failed to generate AI summary' });
  }
});

export default router;