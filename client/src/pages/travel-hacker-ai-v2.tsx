import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, PlaneIcon, MapPinIcon, DollarSignIcon, ClockIcon, AlertTriangleIcon, ExternalLinkIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface FlightResult {
  airline: string;
  price: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  route: string;
  departureDate: string;
  links?: {
    googleFlights: string;
    skyscanner: string;
    momondo: string;
  };
}

interface TravelHackResult {
  flights: FlightResult[];
  hotels: any[];
  carRentals: any[];
  mistakeFares: any[];
}

export default function TravelHackerAIV2() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TravelHackResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!from || !to || !startDate || !endDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults(null);

    try {
      const response = await fetch('/api/travel-hack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `flights from ${from} to ${to}`,
          from,
          to,
          startDate,
          endDate
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Unable to fetch flight data. Please check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const formatDateForDisplay = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  const isPriceAvailable = (price: string) => {
    return price && !price.includes('unavailable') && !price.includes('error') && price !== 'Price unavailable';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Travel Hacker AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find authentic flight deals with real-time pricing data. No fake prices, no placeholder content.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlaneIcon className="h-5 w-5" />
              Flight Search
            </CardTitle>
            <CardDescription>
              Enter your travel details to find real flight options with authentic pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
                <Input
                  placeholder="Departure city"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
                <Input
                  placeholder="Destination city"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="w-full md:w-auto"
            >
              {isSearching ? 'Searching Real-Time Data...' : 'Search Flights'}
            </Button>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangleIcon className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {searchResults && (
          <div className="space-y-8">
            {/* Flight Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlaneIcon className="h-5 w-5" />
                  Flight Options
                </CardTitle>
                <CardDescription>
                  Real-time flight data from authentic sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {searchResults.flights.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Real-Time Flight Data Available</h3>
                    <p className="text-gray-600">
                      Unable to retrieve authentic flight pricing at this time. Please try again later or check different dates.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {searchResults.flights.map((flight, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{flight.airline}</h3>
                              {flight.stops === 0 && (
                                <Badge variant="secondary">Non-stop</Badge>
                              )}
                              {flight.stops > 0 && (
                                <Badge variant="outline">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4 text-gray-500" />
                                <span>{flight.route}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-gray-500" />
                                <span>{flight.departureTime} - {flight.arrivalTime}</span>
                                <span className="text-gray-500">({flight.duration})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-gray-500" />
                                <span>{formatDateForDisplay(flight.departureDate)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              {isPriceAvailable(flight.price) ? (
                                <div className="text-2xl font-bold text-green-600">
                                  {flight.price}
                                </div>
                              ) : (
                                <div className="text-lg font-medium text-gray-500">
                                  Price Unavailable
                                </div>
                              )}
                            </div>
                            
                            {flight.links && isPriceAvailable(flight.price) && (
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <a href={flight.links.googleFlights} target="_blank" rel="noopener noreferrer">
                                    <ExternalLinkIcon className="h-3 w-3 mr-1" />
                                    Google
                                  </a>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={flight.links.skyscanner} target="_blank" rel="noopener noreferrer">
                                    <ExternalLinkIcon className="h-3 w-3 mr-1" />
                                    Skyscanner
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Data Integrity Notice */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">Data Integrity Notice</h3>
                    <p className="text-blue-700 text-sm">
                      All flight data is sourced from real-time APIs. When authentic pricing is unavailable, 
                      we clearly indicate this rather than showing placeholder prices. This ensures you only 
                      see genuine flight information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}