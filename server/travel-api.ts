// Unified travel API using Travelpayouts Flight Data API via RapidAPI
const RAPIDAPI_KEY = process.env.TRAVELPAYOUTS_TOKEN;
const RAPIDAPI_HOST = 'travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com';
const TRAVELPAYOUTS_BASE_URL = `https://${RAPIDAPI_HOST}`;

interface Flight {
  airline: string;
  price: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  route: string;
}

interface Hotel {
  name: string;
  price: string;
  rating: number;
  location: string;
  amenities: string[];
  imageUrl?: string;
}

interface CarRental {
  company: string;
  vehicleType: string;
  price: string;
  location: string;
  features: string[];
}

interface MistakeFare {
  route: string;
  price: string;
  source: string;
  urgency: string;
  departureDistance?: string;
}

interface UnifiedTravelResult {
  flights: Flight[];
  hotels: Hotel[];
  carRentals: CarRental[];
  mistakeFares: MistakeFare[];
}

export async function fetchUnifiedTravelData(
  from: string,
  to: string,
  departDate: string,
  returnDate?: string,
  budget?: number
): Promise<UnifiedTravelResult> {
  console.log('Fetching unified travel data:', { from, to, departDate, returnDate });

  try {
    // Use RapidAPI Travelpayouts for authentic flight data
    const [flights, mistakeFares] = await Promise.all([
      fetchTravelpayoutsFlights(from, to, departDate, returnDate).catch((err: any) => {
        console.error('Travelpayouts flights API error:', err);
        return [];
      }),
      fetchTravelpayoutsCheapFlights(from, to, departDate).catch((err: any) => {
        console.error('Travelpayouts cheap flights API error:', err);
        return [];
      })
    ]);

    return {
      flights,
      hotels: [], // Hotels not available in current API
      carRentals: [], // Car rentals not available in current API  
      mistakeFares
    };
  } catch (error) {
    console.error('Travel API error:', error);
    throw error;
  }
}

async function fetchTravelpayoutsFlights(from: string, to: string, departDate: string, returnDate?: string): Promise<Flight[]> {
  console.log('Fetching Travelpayouts flights:', { from, to, departDate, returnDate });
  
  try {
    // Convert city names to IATA codes
    const fromCode = await getAirportCode(from);
    const toCode = await getAirportCode(to);
    
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    };

    // Try multiple endpoint variations for Travelpayouts
    let response = await fetch(
      `${TRAVELPAYOUTS_BASE_URL}/v2/prices/latest?currency=USD&origin=${fromCode}&destination=${toCode}&page=1&limit=10`,
      { headers }
    );
    
    // If that fails, try alternate endpoint
    if (!response.ok) {
      response = await fetch(
        `${TRAVELPAYOUTS_BASE_URL}/v1/prices/cheap?origin=${fromCode}&destination=${toCode}&depart_date=${departDate.slice(0,7)}&currency=USD`,
        { headers }
      );
    }

    if (!response.ok) {
      throw new Error(`Travelpayouts API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Travelpayouts API response:', data);

    if (data.data && Array.isArray(data.data)) {
      return data.data.slice(0, 5).map((flight: any) => ({
        airline: flight.airline || 'Various Airlines',
        price: `$${flight.value || flight.price || 'N/A'}`,
        departureTime: flight.departure_at || 'Check airline',
        arrivalTime: flight.return_at || 'Check airline', 
        duration: flight.duration ? `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` : 'Check airline',
        stops: flight.transfers || 0,
        route: `${fromCode} → ${toCode}`
      }));
    }

    return [];
  } catch (error) {
    console.error('Travelpayouts flights API error:', error);
    return [];
  }
}

async function fetchTravelpayoutsCheapFlights(from: string, to: string, departDate: string): Promise<MistakeFare[]> {
  console.log('Fetching cheap flights:', { from, to, departDate });
  
  try {
    const fromCode = await getAirportCode(from);
    const toCode = await getAirportCode(to);
    
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    };

    // Try the latest prices endpoint first  
    const response = await fetch(
      `${TRAVELPAYOUTS_BASE_URL}/v2/prices/latest?currency=USD&origin=${fromCode}&destination=${toCode}&sorting=price&page=1&limit=5`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Cheap flights API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Cheap flights API response:', data);

    if (data.data && typeof data.data === 'object') {
      const deals = Object.values(data.data).slice(0, 3) as any[];
      return deals.map((deal: any) => ({
        route: `${fromCode} → ${toCode}`,
        price: `$${deal.value || deal.price || 'N/A'}`,
        source: 'Travelpayouts',
        urgency: deal.found_at ? 'Recent deal' : 'Limited time',
        departureDistance: deal.distance ? `${deal.distance}km` : undefined
      }));
    }

    return [];
  } catch (error) {
    console.error('Cheap flights API error:', error);
    return [];
  }
}

function getDatePlusWeek(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
}

async function getDestinationId(location: string): Promise<string> {
  // Simple mapping for major destinations
  const locationMap: { [key: string]: string } = {
    'london': 'LON',
    'new york': 'NYC',
    'paris': 'PAR',
    'tokyo': 'TYO',
    'los angeles': 'LAX',
    'miami': 'MIA',
    'sydney': 'SYD',
    'barcelona': 'BCN',
    'rome': 'ROM',
    'dubai': 'DXB'
  };

  const key = location.toLowerCase();
  return locationMap[key] || location.toUpperCase().slice(0, 3);
}

async function getLocationId(location: string): Promise<string> {
  return getDestinationId(location);
}

async function getAirportCode(location: string): Promise<string> {
  // Comprehensive IATA code mapping for major cities and airports
  const iataMap: { [key: string]: string } = {
    // North America
    'new york': 'NYC',
    'nyc': 'NYC',
    'new york city': 'NYC',
    'manhattan': 'NYC',
    'los angeles': 'LAX',
    'la': 'LAX',
    'chicago': 'CHI',
    'miami': 'MIA',
    'san francisco': 'SFO',
    'sf': 'SFO',
    'las vegas': 'LAS',
    'vegas': 'LAS',
    'seattle': 'SEA',
    'boston': 'BOS',
    'washington': 'DCA',
    'dc': 'DCA',
    'atlanta': 'ATL',
    'denver': 'DEN',
    'phoenix': 'PHX',
    'dallas': 'DFW',
    'houston': 'IAH',
    'orlando': 'MCO',
    'toronto': 'YYZ',
    'vancouver': 'YVR',
    'montreal': 'YUL',
    
    // Europe
    'london': 'LON',
    'paris': 'PAR',
    'madrid': 'MAD',
    'barcelona': 'BCN',
    'rome': 'ROM',
    'milan': 'MIL',
    'amsterdam': 'AMS',
    'berlin': 'BER',
    'munich': 'MUC',
    'frankfurt': 'FRA',
    'zurich': 'ZUR',
    'vienna': 'VIE',
    'prague': 'PRG',
    'brussels': 'BRU',
    'copenhagen': 'CPH',
    'stockholm': 'ARN',
    'oslo': 'OSL',
    'helsinki': 'HEL',
    'dublin': 'DUB',
    'lisbon': 'LIS',
    'athens': 'ATH',
    'istanbul': 'IST',
    'moscow': 'SVO',
    
    // Asia
    'tokyo': 'TYO',
    'seoul': 'ICN',
    'beijing': 'PEK',
    'shanghai': 'PVG',
    'hong kong': 'HKG',
    'singapore': 'SIN',
    'bangkok': 'BKK',
    'kuala lumpur': 'KUL',
    'jakarta': 'CGK',
    'manila': 'MNL',
    'mumbai': 'BOM',
    'delhi': 'DEL',
    'bangalore': 'BLR',
    'dubai': 'DXB',
    'doha': 'DOH',
    'riyadh': 'RUH',
    'tel aviv': 'TLV',
    
    // Oceania
    'sydney': 'SYD',
    'melbourne': 'MEL',
    'brisbane': 'BNE',
    'perth': 'PER',
    'auckland': 'AKL',
    
    // South America
    'sao paulo': 'GRU',
    'rio de janeiro': 'GIG',
    'buenos aires': 'EZE',
    'lima': 'LIM',
    'bogota': 'BOG',
    'santiago': 'SCL',
    
    // Africa
    'cairo': 'CAI',
    'johannesburg': 'JNB',
    'cape town': 'CPT',
    'casablanca': 'CMN',
    'nairobi': 'NBO',
    'lagos': 'LOS'
  };

  const key = location.toLowerCase().trim();
  const code = iataMap[key];
  
  if (code) {
    console.log(`Mapped ${location} to IATA code: ${code}`);
    return code;
  }
  
  // If no mapping found, try to extract or generate a reasonable code
  const words = location.split(' ');
  if (words.length === 1 && words[0].length === 3) {
    // Already looks like an IATA code
    return words[0].toUpperCase();
  }
  
  // Generate code from first 3 letters
  const generated = location.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
  console.log(`Generated IATA code for ${location}: ${generated}`);
  return generated;
}