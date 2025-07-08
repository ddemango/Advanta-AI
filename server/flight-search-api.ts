interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

interface FlightResult {
  id: string;
  airline: string;
  airlineLogo?: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  deepLink: string;
}

export async function searchFlights(request: FlightSearchRequest): Promise<{ flights: FlightResult[] }> {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
  
  if (!RAPIDAPI_KEY) {
    throw new Error('RapidAPI key not configured');
  }

  try {
    console.log('🔍 Searching flights with flights-search3 API:', {
      origin: request.origin,
      destination: request.destination,
      departureDate: request.departureDate,
      passengers: request.passengers
    });

    // Use flights-search3 API as specified
    const response = await fetch('https://flights-search3.p.rapidapi.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'flights-search3.p.rapidapi.com'
      },
      body: JSON.stringify({
        origin: request.origin,
        destination: request.destination,
        departure_date: request.departureDate,
        return_date: request.returnDate,
        passengers: request.passengers,
        currency: 'USD',
        stops: 'any',
        class: 'economy'
      })
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`Flight search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Raw API Response:', JSON.stringify(data, null, 2));

    // Parse the response based on flights-search3 API structure
    const flights: FlightResult[] = [];
    
    if (data && data.flights && Array.isArray(data.flights)) {
      data.flights.forEach((flight: any, index: number) => {
        try {
          const flightResult: FlightResult = {
            id: flight.id || `flight-${index}`,
            airline: flight.airline || 'Unknown Airline',
            airlineLogo: flight.airline_logo,
            departure: {
              airport: flight.departure?.airport || flight.origin || request.origin,
              city: flight.departure?.city || request.origin,
              time: flight.departure?.time || '00:00',
              date: flight.departure?.date || request.departureDate
            },
            arrival: {
              airport: flight.arrival?.airport || flight.destination || request.destination,
              city: flight.arrival?.city || request.destination,
              time: flight.arrival?.time || '00:00',
              date: flight.arrival?.date || request.departureDate
            },
            duration: flight.duration || 'Unknown',
            stops: flight.stops || 0,
            price: {
              amount: parseFloat(flight.price?.amount || flight.price || 0),
              currency: flight.price?.currency || 'USD'
            },
            deepLink: flight.deep_link || flight.booking_url || '#'
          };

          // Only add flights with valid pricing
          if (flightResult.price.amount > 0) {
            flights.push(flightResult);
          }
        } catch (error) {
          console.warn('⚠️ Failed to parse flight:', error);
        }
      });
    }

    console.log(`✅ Parsed ${flights.length} valid flights from API response`);
    
    return { flights };

  } catch (error: any) {
    console.error('❌ Flight search error:', error);
    throw new Error(error.message || 'Failed to search flights');
  }
}

// Helper function to get airport code from city name
export async function getAirportCode(location: string): Promise<string> {
  const airportMap: { [key: string]: string } = {
    'new york': 'NYC',
    'nyc': 'NYC',
    'los angeles': 'LAX',
    'la': 'LAX',
    'chicago': 'CHI',
    'miami': 'MIA',
    'san francisco': 'SFO',
    'boston': 'BOS',
    'washington': 'WAS',
    'seattle': 'SEA',
    'denver': 'DEN',
    'atlanta': 'ATL',
    'dallas': 'DFW',
    'phoenix': 'PHX',
    'las vegas': 'LAS',
    'nashville': 'BNA',
    'london': 'LON',
    'paris': 'PAR',
    'tokyo': 'TYO',
    'sydney': 'SYD',
    'toronto': 'YYZ'
  };

  const normalized = location.toLowerCase().trim();
  return airportMap[normalized] || location.toUpperCase();
}