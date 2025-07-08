// Unified travel API using Travelpayouts Flight Data API
const TRAVELPAYOUTS_TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
const TRAVELPAYOUTS_BASE_URL = 'https://api.travelpayouts.com';

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
    // Since external APIs are not properly configured, provide clear error state
    // instead of mock data to maintain data integrity
    throw new Error(
      'Travel API access unavailable. External flight data APIs require valid subscription tokens. ' +
      'Please configure working API credentials to provide authentic travel data.'
    );
  } catch (error) {
    console.error('Travel API configuration error:', error);
    throw error;
  }
}

// Skyscanner Flight API integration
async function fetchSkyscannerFlights(from: string, to: string, departDate: string): Promise<Flight[]> {
  try {
    const fromEntityId = await getAirportCode(from);
    const toEntityId = await getAirportCode(to);
    
    const response = await fetch(`https://${RAPIDAPI_HOST_FLIGHTS}/flights/search-one-way`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY!,
        'X-RapidAPI-Host': RAPIDAPI_HOST_FLIGHTS,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromEntityId: fromEntityId,
        toEntityId: toEntityId,
        departDate: departDate,
        adults: 1,
        currency: 'USD',
        market: 'US',
        locale: 'en-US'
      })
    });

    const data = await response.json();
    console.log('Skyscanner API Response:', JSON.stringify(data, null, 2));
    
    // Check if API access is available
    if (data?.message?.includes('not subscribed') || data?.message?.includes("doesn't exists")) {
      console.log('Flight API access not available:', data.message);
      return [];
    }
    
    // Parse flight data from Skyscanner response structure
    let itineraries = data?.data?.itineraries || data?.itineraries || data?.results || [];
    
    // Handle Skyscanner's specific response structure
    if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      // Skyscanner returns flights as an object with flight IDs as keys
      itineraries = Object.values(data.data).filter((item: any) => Array.isArray(item) && item.length >= 3);
      console.log('Parsed itineraries from Skyscanner data:', itineraries.length);
    }
    
    if (!Array.isArray(itineraries) || itineraries.length === 0) {
      console.log('No flight data found. Response structure:', Object.keys(data));
      console.log('Data sample:', JSON.stringify(data, null, 2).slice(0, 500));
      return [];
    }

    // Process flight data from Skyscanner API structure
    const flights: Flight[] = [];
    
    for (const itinerary of itineraries.slice(0, 10)) {
      if (Array.isArray(itinerary) && itinerary.length >= 3) {
        // Extract flight segments, price, and stops
        const [segments, price, stops] = itinerary;
        
        if (Array.isArray(segments) && segments.length > 0) {
          const firstSegment = segments[0];
          const lastSegment = segments[segments.length - 1];
          
          const flight: Flight = {
            airline: firstSegment[0] || 'Multiple Airlines', // Flight code like "AA519"
            price: price ? `$${price}` : 'Check prices',
            departureTime: firstSegment[2] || 'Various times', // Departure time
            arrivalTime: lastSegment[4] || 'Various times', // Arrival time
            duration: segments.length > 1 ? `${segments.length} segments` : 'Direct',
            stops: stops || 0,
            route: `${from} → ${to}`
          };
          
          flights.push(flight);
        }
      }
    }
    
    console.log('Parsed flights:', flights.length);
    return flights;
  } catch (error) {
    console.error('Skyscanner API error:', error);
    return [];
  }
}

// Hotels.com API integration
async function fetchHotelsData(destination: string, checkIn: string, checkOut?: string): Promise<Hotel[]> {
  try {
    const destinationId = await getDestinationId(destination);
    const checkOutDate = checkOut || getDatePlusWeek(checkIn);
    
    const params = new URLSearchParams({
      destinationId: destinationId,
      pageNumber: '1',
      checkIn: checkIn,
      checkOut: checkOutDate,
      adults1: '1',
      sortOrder: 'PRICE',
      currency: 'USD',
      locale: 'en_US'
    });

    const response = await fetch(`https://${RAPIDAPI_HOST_HOTELS}/properties/list?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY!,
        'X-RapidAPI-Host': RAPIDAPI_HOST_HOTELS
      }
    });

    const data = await response.json();
    const properties = data?.data?.body?.searchResults?.results || [];

    return properties.slice(0, 8).map((hotel: any) => ({
      name: hotel.name || 'Hotel Name Available',
      price: hotel.ratePlan?.price?.current || 'Check rates',
      rating: hotel.starRating || hotel.guestReviews?.rating || 0,
      location: hotel.address?.locality || destination,
      amenities: hotel.amenities?.map((a: any) => a.description).slice(0, 3) || ['Standard amenities'],
      imageUrl: hotel.optimizedThumbUrls?.srpDesktop || undefined
    }));
  } catch (error) {
    console.error('Hotels API error:', error);
    return [];
  }
}

// Amadeus Car Rental API integration
async function fetchCarRentalsData(location: string, pickupDate: string, returnDate?: string): Promise<CarRental[]> {
  try {
    const returnDateFinal = returnDate || getDatePlusWeek(pickupDate);
    const airportCode = await getAirportCode(location);
    
    const params = new URLSearchParams({
      pickupLocationCode: airportCode,
      dropoffLocationCode: airportCode,
      pickupDate: pickupDate,
      pickupTime: '10:00:00',
      dropoffDate: returnDateFinal,
      dropoffTime: '10:00:00',
      currency: 'USD'
    });

    const response = await fetch(`https://${RAPIDAPI_HOST_AMADEUS}/v1/shopping/car-rental-offers?${params}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY!,
        'X-RapidAPI-Host': RAPIDAPI_HOST_AMADEUS
      }
    });

    const data = await response.json();
    console.log('Amadeus Car Rental Response:', JSON.stringify(data, null, 2));
    
    // Check if API access is available
    if (data?.message?.includes('not subscribed') || data?.message?.includes("doesn't exists")) {
      console.log('Car rental API access not available:', data.message);
      return [];
    }

    const offers = data?.data || [];
    if (!Array.isArray(offers) || offers.length === 0) {
      console.log('No car rental data found');
      return [];
    }

    return offers.slice(0, 6).map((rental: any) => ({
      company: rental.vendor?.name || 'Car Rental Company',
      vehicleType: rental.vehicle?.category || 'Economy',
      price: rental.price?.total || 'Check rates',
      location: `${location} Airport`,
      features: rental.vehicle?.acrissCode ? ['Air conditioning', 'Manual transmission'] : ['Standard features']
    }));
  } catch (error) {
    console.error('Car rentals API error:', error);
    return [];
  }
}

// Mistake fares from Skiplagged and other sources
async function fetchMistakeFares(from: string, to: string, departDate: string): Promise<MistakeFare[]> {
  try {
    const mistakeFares: MistakeFare[] = [];
    
    // Try Skiplagged API for hidden city fares with correct parameters
    const fromCode = await getAirportCode(from);
    const toCode = await getAirportCode(to);
    const skiplaggedParams = new URLSearchParams({
      from: fromCode,
      to: toCode,
      depart: departDate
    });
    
    const skiplaggedUrl = `https://skiplagged.com/api/search.php?${skiplaggedParams}`;
    
    const skiplaggedResponse = await fetch(skiplaggedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (skiplaggedResponse.ok) {
      const skiplaggedData = await skiplaggedResponse.json();
      console.log('Skiplagged Response:', JSON.stringify(skiplaggedData, null, 2));
      
      const flights = skiplaggedData.flights || skiplaggedData.trips || skiplaggedData.results || [];
      if (Array.isArray(flights) && flights.length > 0) {
        flights.slice(0, 2).forEach((flight: any) => {
          const price = flight.price || flight.cost || 0;
          if (price > 0 && price < 400) { // Only show actual mistake fares
            mistakeFares.push({
              route: `${from} → ${to}`,
              price: `$${price}`,
              source: 'Skiplagged',
              urgency: 'Hidden city deal - Book carefully',
              departureDistance: '0 miles'
            });
          }
        });
      }
    } else {
      console.log('Skiplagged API not accessible, status:', skiplaggedResponse.status);
    }

    // Check for pricing anomalies using main flight API
    const flightResponse = await fetch(`https://${RAPIDAPI_HOST_FLIGHTS}/flights/search-one-way`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY!,
        'X-RapidAPI-Host': RAPIDAPI_HOST_FLIGHTS,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fromEntityId: await getAirportCode(from),
        toEntityId: await getAirportCode(to),
        departDate: departDate,
        adults: 1,
        currency: 'USD'
      })
    });

    if (flightResponse.ok) {
      const flightData = await flightResponse.json();
      const flights = flightData?.data?.itineraries || [];
      
      if (flights.length > 0) {
        const prices = flights.map((f: any) => parseFloat(f.price?.raw || '0')).filter((p: number) => p > 0);
        const averagePrice = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;

        flights.forEach((flight: any) => {
          const price = parseFloat(flight.price?.raw || '0');
          if (price > 0 && price < averagePrice * 0.4) { // 60% below average = potential mistake
            mistakeFares.push({
              route: `${from} → ${to}`,
              price: flight.price?.formatted || `$${price}`,
              source: flight.legs?.[0]?.carriers?.marketing?.[0]?.name || 'Airline Error',
              urgency: 'URGENT: Possible mistake fare - expires soon',
              departureDistance: '0 miles'
            });
          }
        });
      }
    }

    return mistakeFares.slice(0, 5); // Limit to top 5 real deals
  } catch (error) {
    console.error('Mistake fares API error:', error);
    return [];
  }
}

// Helper functions
function getDatePlusWeek(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
}

async function getDestinationId(location: string): Promise<string> {
  const destinationMap: { [key: string]: string } = {
    'london': '1506246',
    'paris': '1506265',
    'new york': '1506271',
    'tokyo': '1506260',
    'madrid': '1506240',
    'berlin': '1506268',
    'rome': '1506159',
    'barcelona': '1506246',
    'amsterdam': '1506243',
    'dubai': '1506270'
  };
  return destinationMap[location.toLowerCase()] || '1506246';
}

async function getLocationId(location: string): Promise<string> {
  return await getAirportCode(location);
}

async function getAirportCode(location: string): Promise<string> {
  // Map common cities to airport codes
  const airportMap: { [key: string]: string } = {
    'new york': 'JFK', 'nyc': 'JFK', 'los angeles': 'LAX', 'la': 'LAX',
    'chicago': 'ORD', 'miami': 'MIA', 'london': 'LHR', 'paris': 'CDG',
    'tokyo': 'NRT', 'bangkok': 'BKK', 'dubai': 'DXB', 'singapore': 'SIN',
    'hong kong': 'HKG', 'sydney': 'SYD', 'berlin': 'BER', 'rome': 'FCO',
    'barcelona': 'BCN', 'amsterdam': 'AMS', 'istanbul': 'IST', 'mumbai': 'BOM',
    'delhi': 'DEL', 'beijing': 'PEK', 'shanghai': 'PVG', 'seoul': 'ICN',
    'nashville': 'BNA', 'vancouver': 'YVR', 'toronto': 'YYZ', 'montreal': 'YUL'
  };
  
  return airportMap[location.toLowerCase()] || location.toUpperCase();
}