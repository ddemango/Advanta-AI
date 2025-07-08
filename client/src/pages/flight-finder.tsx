import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Plane, Clock, Users, MapPin, Calendar, Star } from 'lucide-react';

interface FlightOption {
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

export default function FlightFinder() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async () => {
    if (!origin || !destination || !departureDate) {
      setError('Please fill in origin, destination, and departure date');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFlights([]);

    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: origin.trim(),
          destination: destination.trim(),
          departureDate,
          returnDate: returnDate || undefined,
          passengers: parseInt(passengers),
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      setFlights(data.flights || []);
      
      if (!data.flights || data.flights.length === 0) {
        setError('No flights found for your search criteria. Try different dates or destinations.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to search flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: { amount: number; currency: string }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency || 'USD'
    }).format(price.amount);
  };

  const formatDuration = (duration: string) => {
    return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Plane className="h-10 w-10 text-blue-600" />
            Flight Finder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search real flights with live pricing from airlines worldwide
          </p>
        </div>

        {/* Search Form */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Search Flights</CardTitle>
            <CardDescription>
              Find and compare flights from hundreds of airlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Origin city or airport"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Destination city or airport"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Return (optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    min="1"
                    max="9"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={searchFlights} 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching Flights...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Flights
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="max-w-4xl mx-auto mb-8 border-red-200">
            <CardContent className="pt-6">
              <div className="text-red-700 text-center">
                <p className="text-lg font-medium mb-2">Search Error</p>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {flights.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Flight Results ({flights.length} found)
              </h2>
              <p className="text-gray-600">
                Prices are live and sourced directly from airlines
              </p>
            </div>

            <div className="space-y-4">
              {flights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Flight Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          {flight.airlineLogo && (
                            <img 
                              src={flight.airlineLogo} 
                              alt={flight.airline}
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{flight.airline}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(flight.duration)}</span>
                              {flight.stops === 0 ? (
                                <Badge variant="secondary">Non-stop</Badge>
                              ) : (
                                <Badge variant="outline">
                                  {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">DEPARTURE</div>
                            <div className="font-bold text-xl">{flight.departure.time}</div>
                            <div className="text-sm text-gray-600">
                              {flight.departure.airport} • {flight.departure.city}
                            </div>
                            <div className="text-xs text-gray-500">{flight.departure.date}</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 mb-1">ARRIVAL</div>
                            <div className="font-bold text-xl">{flight.arrival.time}</div>
                            <div className="text-sm text-gray-600">
                              {flight.arrival.airport} • {flight.arrival.city}
                            </div>
                            <div className="text-xs text-gray-500">{flight.arrival.date}</div>
                          </div>
                        </div>
                      </div>

                      {/* Price and Book */}
                      <div className="lg:text-right">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatPrice(flight.price)}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">per person</div>
                        <Button asChild size="lg" className="w-full lg:w-auto">
                          <a 
                            href={flight.deepLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Book Now
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && flights.length === 0 && !error && (
          <Card className="max-w-4xl mx-auto">
            <CardContent className="text-center py-12">
              <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Ready to Search
              </h3>
              <p className="text-gray-600">
                Enter your travel details above to find flights
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}