// Unified travel API using Kiwi.com, Travel Hacking Tool, and Hotels APIs via RapidAPI
const RAPIDAPI_KEY = process.env.TRAVELPAYOUTS_TOKEN;
const KIWI_HOST = 'kiwi-com-cheap-flights.p.rapidapi.com';
const TRAVEL_HACK_HOST = 'travel-hacking-tool.p.rapidapi.com';
const PRICELINE_HOST = 'priceline-com2.p.rapidapi.com';
const BOOKING_V15_HOST = 'booking-com15.p.rapidapi.com';
const HOTEL_API_HOST = 'hotelapi5.p.rapidapi.com';
const GOOGLE_HOTELS_HOST = 'google-hotels-data.p.rapidapi.com';
const SKY_SCRAPPER_HOST = 'sky-scrapper.p.rapidapi.com';
const SKY_HOST = 'flights-sky.p.rapidapi.com';
const GOOGLE_FLIGHTS_HOST = 'google-flights4.p.rapidapi.com';
const BOOKING_HOST = 'booking-com-api5.p.rapidapi.com';
const TRAVELPAYOUTS_HOST = 'travelpayouts-travelpayouts-flight-data-v1.p.rapidapi.com';
const KIWI_BASE_URL = `https://${KIWI_HOST}`;
const TRAVEL_HACK_BASE_URL = `https://${TRAVEL_HACK_HOST}`;
const PRICELINE_BASE_URL = `https://${PRICELINE_HOST}`;
const BOOKING_V15_BASE_URL = `https://${BOOKING_V15_HOST}`;
const HOTEL_API_BASE_URL = `https://${HOTEL_API_HOST}`;
const GOOGLE_HOTELS_BASE_URL = `https://${GOOGLE_HOTELS_HOST}`;
const SKY_SCRAPPER_BASE_URL = `https://${SKY_SCRAPPER_HOST}`;
const SKY_BASE_URL = `https://${SKY_HOST}`;
const GOOGLE_FLIGHTS_BASE_URL = `https://${GOOGLE_FLIGHTS_HOST}`;
const BOOKING_BASE_URL = `https://${BOOKING_HOST}`;
const TRAVELPAYOUTS_BASE_URL = `https://${TRAVELPAYOUTS_HOST}`;

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
    // Try all available APIs in parallel for maximum coverage
    const [kiwiFlights, travelHackDeals, skyScrapperFlights, pricelineHotels, bookingV15Hotels, hotelApiHotels, googleHotels, skyFlights, googleFlights, travelpayoutsFlights, travelpayoutsDeals, bookingHotels] = await Promise.all([
      fetchKiwiFlights(from, to, departDate, returnDate).catch((err: any) => {
        console.error('Kiwi.com API error:', err);
        return [];
      }),
      fetchTravelHackDeals(from, to, departDate).catch((err: any) => {
        console.error('Travel Hacking Tool API error:', err);
        return [];
      }),
      fetchSkyScrapperFlights(from, to, departDate, returnDate).catch((err: any) => {
        console.error('Sky Scrapper API error:', err);
        return [];
      }),
      fetchPricelineHotels(to, departDate, returnDate).catch((err: any) => {
        console.error('Priceline API error:', err);
        return [];
      }),
      fetchBookingV15Hotels(to, departDate, returnDate).catch((err: any) => {
        console.error('Booking.com v15 API error:', err);
        return [];
      }),
      fetchHotelApiHotels(to, departDate, returnDate).catch((err: any) => {
        console.error('Hotel API error:', err);
        return [];
      }),
      fetchGoogleHotels(to, departDate, returnDate).catch((err: any) => {
        console.error('Google Hotels API error:', err);
        return [];
      }),
      fetchSkyFlights(from, to, departDate, returnDate).catch((err: any) => {
        console.error('Sky API error:', err);
        return [];
      }),
      fetchGoogleFlights(from, to, departDate, returnDate).catch((err: any) => {
        console.error('Google Flights API error:', err);
        return [];
      }),
      fetchTravelpayoutsFlights(from, to, departDate, returnDate).catch((err: any) => {
        console.error('Travelpayouts flights API error:', err);
        return [];
      }),
      fetchTravelpayoutsCheapFlights(from, to, departDate).catch((err: any) => {
        console.error('Travelpayouts cheap flights API error:', err);
        return [];
      }),
      fetchBookingHotels(to, departDate, returnDate).catch((err: any) => {
        console.error('Booking.com hotels API error:', err);
        return [];
      })
    ]);

    // Combine all flight data sources
    const allFlights = [...kiwiFlights, ...skyScrapperFlights, ...skyFlights, ...googleFlights, ...travelpayoutsFlights];
    const allHotels = [...pricelineHotels, ...bookingV15Hotels, ...hotelApiHotels, ...googleHotels, ...bookingHotels];
    const allDeals = [...travelHackDeals, ...travelpayoutsDeals];
    
    return {
      flights: allFlights,
      hotels: allHotels,
      carRentals: [], // Car rentals not available in current API  
      mistakeFares: allDeals
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
      'X-RapidAPI-Host': TRAVELPAYOUTS_HOST
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
      'X-RapidAPI-Host': TRAVELPAYOUTS_HOST
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

async function fetchSkyScrapperFlights(from: string, to: string, departDate: string, returnDate?: string): Promise<Flight[]> {
  console.log('Fetching Sky Scrapper flights:', { from, to, departDate, returnDate });
  
  try {
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': SKY_SCRAPPER_HOST
    };

    // First, search for airports
    const originResponse = await fetch(
      `${SKY_SCRAPPER_BASE_URL}/api/v1/flights/searchAirport?query=${encodeURIComponent(from)}`,
      { headers }
    );

    const destinationResponse = await fetch(
      `${SKY_SCRAPPER_BASE_URL}/api/v1/flights/searchAirport?query=${encodeURIComponent(to)}`,
      { headers }
    );

    if (!originResponse.ok || !destinationResponse.ok) {
      throw new Error('Sky Scrapper airport search failed');
    }

    const originData = await originResponse.json();
    const destinationData = await destinationResponse.json();

    if (!originData.data || !destinationData.data || !originData.data.length || !destinationData.data.length) {
      throw new Error('No airports found for the given locations');
    }

    const origin = originData.data[0];
    const destination = destinationData.data[0];

    // Search for flights
    const flightResponse = await fetch(
      `${SKY_SCRAPPER_BASE_URL}/api/v1/flights/searchFlights?originSkyId=${origin.skyId}&destinationSkyId=${destination.skyId}&originEntityId=${origin.entityId}&destinationEntityId=${destination.entityId}&date=${departDate}&adults=1&sortBy=best&currency=USD&market=US&countryCode=US`,
      { headers }
    );

    if (!flightResponse.ok) {
      throw new Error(`Sky Scrapper flights API error: ${flightResponse.status} ${flightResponse.statusText}`);
    }

    const flightData = await flightResponse.json();
    console.log('Sky Scrapper flights response:', flightData);

    // Parse Sky Scrapper flight results
    if (flightData.data && flightData.data.itineraries && Array.isArray(flightData.data.itineraries)) {
      return flightData.data.itineraries.slice(0, 5).map((itinerary: any) => {
        const leg = itinerary.legs[0];
        const price = itinerary.price;
        
        return {
          airline: leg.carriers?.marketing?.[0]?.name || 'Various Airlines',
          price: price?.formatted || 'Price unavailable',
          departureTime: leg.departure || 'Check airline',
          arrivalTime: leg.arrival || 'Check airline',
          duration: leg.durationInMinutes ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : 'Check airline',
          stops: leg.stopCount || 0,
          route: `${origin.iata || origin.skyId} → ${destination.iata || destination.skyId}`
        };
      });
    }

    return [];
  } catch (error) {
    console.error('Sky Scrapper API error:', error);
    return [];
  }
}

async function fetchKiwiFlights(from: string, to: string, departDate: string, returnDate?: string): Promise<Flight[]> {
  console.log('Fetching Kiwi.com flights:', { from, to, departDate, returnDate });
  
  try {
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': KIWI_HOST
    };

    // Use Kiwi.com API for comprehensive flight search
    const response = await fetch(
      `${KIWI_BASE_URL}/round-trip?source=Country%3A${from}&destination=City%3A${to}&currency=usd&locale=en&adults=1&children=0&infants=0&handbags=1&holdbags=0&cabinClass=ECONOMY&sortBy=QUALITY&sortOrder=ASCENDING&applyMixedClasses=true&allowReturnFromDifferentCity=true&allowChangeInboundDestination=true&allowChangeInboundSource=true&allowDifferentStationConnection=true&enableSelfTransfer=true&allowOvernightStopover=true&enableTrueHiddenCity=true&enableThrowAwayTicketing=true&outbound=SUNDAY%2CWEDNESDAY%2CTHURSDAY%2CFRIDAY%2CSATURDAY%2CMONDAY%2CTUESDAY&transportTypes=FLIGHT&contentProviders=FLIXBUS_DIRECTS%2CFRESH%2CKAYAK%2CKIWI&limit=20`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Kiwi.com API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Kiwi.com API response:', data);

    // Parse Kiwi.com response structure
    if (data.data && Array.isArray(data.data)) {
      return data.data.slice(0, 5).map((flight: any) => ({
        airline: flight.airlines?.join(', ') || 'Various Airlines',
        price: flight.price ? `$${flight.price}` : 'Price unavailable',
        departureTime: flight.local_departure || 'Check airline',
        arrivalTime: flight.local_arrival || 'Check airline',
        duration: flight.duration ? `${Math.floor(flight.duration / 3600)}h ${Math.floor((flight.duration % 3600) / 60)}m` : 'Check airline',
        stops: flight.technical_stops || 0,
        route: `${flight.flyFrom} → ${flight.flyTo}`
      }));
    }

    return [];
  } catch (error) {
    console.error('Kiwi.com API error:', error);
    return [];
  }
}

async function fetchTravelHackDeals(from: string, to: string, departDate: string): Promise<MistakeFare[]> {
  console.log('Fetching Travel Hacking Tool deals:', { from, to, departDate });
  
  try {
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': TRAVEL_HACK_HOST
    };

    const response = await fetch(
      `${TRAVEL_HACK_BASE_URL}/api/alliances/`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Travel Hacking Tool API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Travel Hacking Tool API response:', data);

    // Parse travel hacking deals
    if (data && Array.isArray(data)) {
      return data.slice(0, 3).map((deal: any) => ({
        route: `${from} → ${to}`,
        price: deal.price || 'Check airline',
        source: deal.source || 'Travel Hacking Tool',
        urgency: deal.urgency || 'Limited time',
        departureDistance: deal.distance || 'Various dates'
      }));
    }

    return [];
  } catch (error) {
    console.error('Travel Hacking Tool API error:', error);
    return [];
  }
}

async function fetchPricelineHotels(destination: string, checkIn: string, checkOut?: string): Promise<Hotel[]> {
  console.log('Fetching Priceline hotels:', { destination, checkIn, checkOut });
  
  try {
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': PRICELINE_HOST
    };

    const response = await fetch(
      `${PRICELINE_BASE_URL}/hotels/search?location=${destination}&checkin=${checkIn}&checkout=${checkOut || checkIn}&adults=2&children=0`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Priceline API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Priceline API response:', data);

    // Parse Priceline results
    if (data.hotels && Array.isArray(data.hotels)) {
      return data.hotels.slice(0, 5).map((hotel: any) => ({
        name: hotel.name || 'Hotel Available',
        price: hotel.price || 'Check rates',
        rating: hotel.rating || 4.0,
        location: hotel.location || destination,
        amenities: hotel.amenities || ['WiFi', 'Breakfast'],
        imageUrl: hotel.image
      }));
    }

    return [];
  } catch (error) {
    console.error('Priceline API error:', error);
    return [];
  }
}

async function fetchBookingV15Hotels(destination: string, checkIn: string, checkOut?: string): Promise<Hotel[]> {
  console.log('Fetching Booking.com v15 hotels:', { destination, checkIn, checkOut });
  
  try {
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': BOOKING_V15_HOST
    };

    const response = await fetch(
      `${BOOKING_V15_BASE_URL}/hotels/search?location=${destination}&checkin=${checkIn}&checkout=${checkOut || checkIn}&adults=2&children=0`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Booking.com v15 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Booking.com v15 API response:', data);

    // Parse Booking.com v15 results
    if (data.hotels && Array.isArray(data.hotels)) {
      return data.hotels.slice(0, 5).map((hotel: any) => ({
        name: hotel.name || 'Hotel Available',
        price: hotel.price || 'Check rates',
        rating: hotel.rating || 4.0,
        location: hotel.location || destination,
        amenities: hotel.amenities || ['WiFi', 'Breakfast'],
        imageUrl: hotel.image
      }));
    }

    return [];
  } catch (error) {
    console.error('Booking.com v15 API error:', error);
    return [];
  }
}

async function fetchHotelApiHotels(destination: string, checkIn: string, checkOut?: string): Promise<Hotel[]> {
  console.log('Fetching Hotel API hotels:', { destination, checkIn, checkOut });
  
  try {
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': HOTEL_API_HOST
    };

    const response = await fetch(
      `${HOTEL_API_BASE_URL}/hotels/search?query=${destination}&checkin=${checkIn}&checkout=${checkOut || checkIn}&adults=2&children=0`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Hotel API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Hotel API response:', data);

    // Parse Hotel API results
    if (data.hotels && Array.isArray(data.hotels)) {
      return data.hotels.slice(0, 5).map((hotel: any) => ({
        name: hotel.name || 'Hotel Available',
        price: hotel.price || 'Check rates',
        rating: hotel.rating || 4.0,
        location: hotel.location || destination,
        amenities: hotel.amenities || ['WiFi', 'Breakfast'],
        imageUrl: hotel.image
      }));
    }

    return [];
  } catch (error) {
    console.error('Hotel API error:', error);
    return [];
  }
}

async function fetchGoogleHotels(destination: string, checkIn: string, checkOut?: string): Promise<Hotel[]> {
  console.log('Fetching Google Hotels data:', { destination, checkIn, checkOut });
  
  try {
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': GOOGLE_HOTELS_HOST
    };

    const response = await fetch(
      `${GOOGLE_HOTELS_BASE_URL}/hotels/search?query=${destination}&checkin=${checkIn}&checkout=${checkOut || checkIn}&adults=2&children=0`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Google Hotels API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Google Hotels API response:', data);

    // Parse Google Hotels results
    if (data.hotels && Array.isArray(data.hotels)) {
      return data.hotels.slice(0, 5).map((hotel: any) => ({
        name: hotel.name || 'Hotel Available',
        price: hotel.price || 'Check rates',
        rating: hotel.rating || 4.0,
        location: hotel.location || destination,
        amenities: hotel.amenities || ['WiFi', 'Breakfast'],
        imageUrl: hotel.image
      }));
    }

    return [];
  } catch (error) {
    console.error('Google Hotels API error:', error);
    return [];
  }
}

async function fetchSkyFlights(from: string, to: string, departDate: string, returnDate?: string): Promise<Flight[]> {
  console.log('Fetching Sky API flights:', { from, to, departDate, returnDate });
  
  try {
    const fromCode = await getAirportCode(from);
    const toCode = await getAirportCode(to);
    
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': SKY_HOST
    };

    // Use Sky API for flight search
    const response = await fetch(
      `${SKY_BASE_URL}/flights/search-one-way?fromEntityId=${fromCode}&toEntityId=${toCode}&departDate=${departDate}&adults=1&currency=USD&market=US&locale=en-US`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Sky API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Sky API response:', data);

    // Parse Sky API response structure
    if (data.data && data.data.itineraries && Array.isArray(data.data.itineraries)) {
      return data.data.itineraries.slice(0, 5).map((itinerary: any) => {
        const leg = itinerary.legs[0];
        const carrier = leg.carriers && leg.carriers.marketing[0];
        
        return {
          airline: carrier?.name || 'Various Airlines',
          price: itinerary.price?.formatted || 'Price unavailable',
          departureTime: leg.departure || 'Check airline',
          arrivalTime: leg.arrival || 'Check airline',
          duration: leg.durationInMinutes ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : 'Check airline',
          stops: leg.stopCount || 0,
          route: `${fromCode} → ${toCode}`
        };
      });
    }

    return [];
  } catch (error) {
    console.error('Sky API error:', error);
    return [];
  }
}

async function fetchGoogleFlights(from: string, to: string, departDate: string, returnDate?: string): Promise<Flight[]> {
  console.log('Fetching Google Flights data:', { from, to, departDate, returnDate });
  
  try {
    const fromCode = await getAirportCode(from);
    const toCode = await getAirportCode(to);
    
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': GOOGLE_FLIGHTS_HOST
    };

    // Try multiple Google Flights endpoint variations
    let response = await fetch(
      `${GOOGLE_FLIGHTS_BASE_URL}/v1/flights/search?origin=${fromCode}&destination=${toCode}&departure_date=${departDate}&return_date=${returnDate || ''}&adults=1&children=0&infants=0&currency=USD&language=en`,
      { headers }
    );

    if (!response.ok) {
      // Try alternative endpoint structure
      response = await fetch(
        `${GOOGLE_FLIGHTS_BASE_URL}/flights/search?from=${fromCode}&to=${toCode}&date=${departDate}&return=${returnDate || ''}&adults=1&currency=USD`,
        { headers }
      );
    }

    if (!response.ok) {
      throw new Error(`Google Flights API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Google Flights API response:', data);

    // Parse Google Flights response structure
    if (data.data && data.data.flights && Array.isArray(data.data.flights)) {
      return data.data.flights.slice(0, 5).map((flight: any) => ({
        airline: flight.airline_name || flight.airline || 'Various Airlines',
        price: flight.price ? `$${flight.price}` : 'Price unavailable',
        departureTime: flight.departure_time || 'Check airline',
        arrivalTime: flight.arrival_time || 'Check airline',
        duration: flight.duration || 'Check airline',
        stops: flight.stops || 0,
        route: `${fromCode} → ${toCode}`
      }));
    }

    return [];
  } catch (error) {
    console.error('Google Flights API error:', error);
    return [];
  }
}

async function fetchBookingHotels(destination: string, checkIn: string, checkOut?: string): Promise<Hotel[]> {
  console.log('Fetching Booking.com hotels:', { destination, checkIn, checkOut });
  
  try {
    const headers = {
      'X-RapidAPI-Key': RAPIDAPI_KEY!,
      'X-RapidAPI-Host': BOOKING_HOST
    };

    // First get destination ID from Booking.com
    const destResponse = await fetch(
      `${BOOKING_BASE_URL}/v1/hotels/searchDestination?query=${encodeURIComponent(destination)}`,
      { headers }
    );

    if (!destResponse.ok) {
      throw new Error(`Booking destination API error: ${destResponse.status} ${destResponse.statusText}`);
    }

    const destData = await destResponse.json();
    console.log('Booking destination response:', destData);

    if (!destData.data || destData.data.length === 0) {
      console.log('No destination found for:', destination);
      return [];
    }

    const destId = destData.data[0].dest_id;
    const destType = destData.data[0].dest_type;

    // Search for hotels using the destination ID
    const hotelResponse = await fetch(
      `${BOOKING_BASE_URL}/v1/hotels/search?dest_id=${destId}&dest_type=${destType}&checkin_date=${checkIn}&checkout_date=${checkOut || checkIn}&adults=1&children_ages=&room_qty=1&units=metric&temperature_unit=c&languagecode=en-us&currency_code=USD&page_number=1`,
      { headers }
    );

    if (!hotelResponse.ok) {
      throw new Error(`Booking hotels API error: ${hotelResponse.status} ${hotelResponse.statusText}`);
    }

    const hotelData = await hotelResponse.json();
    console.log('Booking hotels response:', hotelData);

    if (hotelData.data && hotelData.data.hotels && Array.isArray(hotelData.data.hotels)) {
      return hotelData.data.hotels.slice(0, 5).map((hotel: any) => ({
        name: hotel.hotel_name || 'Hotel Name Unavailable',
        price: hotel.min_total_price ? `$${hotel.min_total_price}/night` : 'Price on request',
        rating: hotel.review_score || 0,
        location: hotel.address || destination,
        amenities: hotel.property_highlight_strip || [],
        imageUrl: hotel.main_photo_url || undefined
      }));
    }

    return [];
  } catch (error) {
    console.error('Booking.com hotels API error:', error);
    return [];
  }
}