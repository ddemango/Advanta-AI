import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  Hotel, 
  Car, 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Star,
  Loader2,
  Sparkles,
  TrendingUp,
  Globe,
  CreditCard,
  ArrowRight
} from 'lucide-react';

interface FlightOffer {
  id: string;
  priceUSD: number;
  tier: string;
  cpm: number;
  validatingAirline: string;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      from: string;
      to: string;
      dep: string;
      arr: string;
      carrier: string;
      number: string;
    }>;
  }>;
}

interface HotelOffer {
  type: string;
  hotel: {
    name: string;
    hotelId: string;
    cityCode: string;
  };
  offers: Array<{
    id: string;
    price: {
      currency: string;
      total: string;
    };
    checkInDate: string;
    checkOutDate: string;
  }>;
}

interface CarOffer {
  id: string;
  supplier: string;
  vehicle: string;
  priceUSD: number;
  pickUp: {
    cityCode: string;
    at: string;
  };
  dropOff: {
    cityCode: string;
    at: string;
  };
}

interface SearchParams {
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
  nonStop?: boolean;
  cabin?: string;
  maxPrice?: number;
  cityCode?: string;
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  pickUpDateTime?: string;
  dropOffDateTime?: string;
  passengers?: number;
}

export default function TravelHackerAIV2() {
  const [activeTab, setActiveTab] = useState('search');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [isParsingQuery, setIsParsingQuery] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  
  // Search states
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);
  const [isSearchingHotels, setIsSearchingHotels] = useState(false);
  const [isSearchingCars, setIsSearchingCars] = useState(false);
  
  // Results
  const [flightOffers, setFlightOffers] = useState<FlightOffer[]>([]);
  const [hotelOffers, setHotelOffers] = useState<HotelOffer[]>([]);
  const [carOffers, setCarOffers] = useState<CarOffer[]>([]);
  
  // AI Summary
  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  const { toast } = useToast();

  // Parse natural language query
  const handleParseQuery = async () => {
    if (!naturalLanguageQuery.trim()) {
      toast({
        title: 'Query Required',
        description: 'Please enter your travel plans in natural language.',
        variant: 'destructive'
      });
      return;
    }

    setIsParsingQuery(true);
    try {
      const response = await fetch('/api/travel/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: naturalLanguageQuery })
      });
      
      if (!response.ok) throw new Error('Failed to parse query');
      
      const data = await response.json();
      setSearchParams(data.params);
      setActiveTab('flights');
      
      // Auto-trigger searches if we have the required params
      if (data.params.origin && data.params.destination && data.params.departDate) {
        setTimeout(() => {
          triggerFlightSearch(data.params);
        }, 500);
      }
      
      // Auto-trigger hotel search if we have city and checkin (create checkout date if missing)
      if (data.params.cityCode && data.params.checkInDate) {
        const enhancedParams = { ...data.params };
        if (!enhancedParams.checkOutDate && enhancedParams.checkInDate) {
          const checkIn = new Date(enhancedParams.checkInDate);
          checkIn.setDate(checkIn.getDate() + 7);
          enhancedParams.checkOutDate = checkIn.toISOString().split('T')[0];
        }
        setTimeout(() => {
          triggerHotelSearch(enhancedParams);
        }, 1000);
      }
      
      // Auto-trigger car search if we have city and dates
      if (data.params.cityCode && (data.params.pickUpDateTime || data.params.checkInDate)) {
        const enhancedParams = { ...data.params };
        if (!enhancedParams.pickUpDateTime && enhancedParams.checkInDate) {
          enhancedParams.pickUpDateTime = `${enhancedParams.checkInDate}T10:00:00`;
        }
        if (!enhancedParams.dropOffDateTime) {
          const dropDate = enhancedParams.checkOutDate || (() => {
            const checkIn = new Date(enhancedParams.checkInDate);
            checkIn.setDate(checkIn.getDate() + 7);
            return checkIn.toISOString().split('T')[0];
          })();
          enhancedParams.dropOffDateTime = `${dropDate}T10:00:00`;
        }
        setTimeout(() => {
          triggerCarSearch(enhancedParams);
        }, 1500);
      }
      
      toast({
        title: 'Query Parsed Successfully',
        description: data.using_ai ? 'Using AI for enhanced parsing' : 'Using basic parsing',
      });
    } catch (error) {
      toast({
        title: 'Parsing Failed',
        description: error instanceof Error ? error.message : 'Failed to parse travel query',
        variant: 'destructive'
      });
    } finally {
      setIsParsingQuery(false);
    }
  };

  // Helper function to trigger flight search with specific params
  const triggerFlightSearch = async (params = searchParams) => {
    if (!params.origin || !params.destination || !params.departDate) {
      toast({
        title: 'Missing Flight Details',
        description: 'Please provide origin, destination, and departure date.',
        variant: 'destructive'
      });
      return;
    }

    setIsSearchingFlights(true);
    try {
      const response = await fetch('/api/travel/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: params.origin,
          destination: params.destination,
          departDate: params.departDate,
          returnDate: params.returnDate,
          nonStop: params.nonStop || false,
          cabin: params.cabin || 'ECONOMY',
          maxPrice: params.maxPrice,
          maxOffers: 20,
          currency: 'USD'
        })
      });
      
      if (!response.ok) throw new Error('Flight search failed');
      
      const data = await response.json();
      setFlightOffers(data.offers || []);
      
      toast({
        title: 'Flight Search Complete',
        description: `Found ${data.offers?.length || 0} flight options`,
      });
    } catch (error) {
      toast({
        title: 'Flight Search Failed',
        description: error instanceof Error ? error.message : 'Failed to search flights',
        variant: 'destructive'
      });
    } finally {
      setIsSearchingFlights(false);
    }
  };

  // Search flights
  const searchFlights = async () => {
    await triggerFlightSearch();
  };

  // Helper function to trigger hotel search with specific params
  const triggerHotelSearch = async (params = searchParams) => {
    if (!params.cityCode || !params.checkInDate || !params.checkOutDate) {
      toast({
        title: 'Missing Hotel Details',
        description: 'Please provide city, check-in, and check-out dates.',
        variant: 'destructive'
      });
      return;
    }

    setIsSearchingHotels(true);
    try {
      const response = await fetch('/api/travel/hotels/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityCode: params.cityCode,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          adults: params.adults || 2,
          roomQuantity: 1,
          currency: 'USD'
        })
      });
      
      if (!response.ok) throw new Error('Hotel search failed');
      
      const data = await response.json();
      setHotelOffers(data.data || []);
      
      toast({
        title: 'Hotel Search Complete',
        description: `Found ${data.data?.length || 0} hotel options`,
      });
    } catch (error) {
      toast({
        title: 'Hotel Search Failed',
        description: error instanceof Error ? error.message : 'Failed to search hotels',
        variant: 'destructive'
      });
    } finally {
      setIsSearchingHotels(false);
    }
  };

  // Helper function to trigger car search with specific params
  const triggerCarSearch = async (params = searchParams) => {
    if (!params.cityCode || !params.pickUpDateTime || !params.dropOffDateTime) {
      toast({
        title: 'Missing Car Details',
        description: 'Please provide pickup location and dates.',
        variant: 'destructive'
      });
      return;
    }

    setIsSearchingCars(true);
    try {
      const response = await fetch('/api/travel/cars/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityCode: params.cityCode,
          pickUpDateTime: params.pickUpDateTime,
          dropOffDateTime: params.dropOffDateTime,
          passengers: params.passengers || 2
        })
      });
      
      if (!response.ok) throw new Error('Car search failed');
      
      const data = await response.json();
      setCarOffers(data.offers || []);
      
      toast({
        title: 'Car Search Complete',
        description: `Found ${data.offers?.length || 0} car rental options`,
      });
    } catch (error) {
      toast({
        title: 'Car Search Failed',
        description: error instanceof Error ? error.message : 'Failed to search car rentals',
        variant: 'destructive'
      });
    } finally {
      setIsSearchingCars(false);
    }
  };

  // Search hotels
  const searchHotels = async () => {
    await triggerHotelSearch();
  };

  // Search cars
  const searchCars = async () => {
    await triggerCarSearch();
  };

  // Generate AI summary
  const generateAISummary = async () => {
    if (flightOffers.length === 0 && hotelOffers.length === 0 && carOffers.length === 0) {
      toast({
        title: 'No Results to Summarize',
        description: 'Please search for flights, hotels, or cars first.',
        variant: 'destructive'
      });
      return;
    }

    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/travel/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightOffers: flightOffers.slice(0, 5),
          hotelOffers: hotelOffers.slice(0, 5),
          carOffers: carOffers.slice(0, 3),
          origin: searchParams.origin,
          destination: searchParams.destination
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate summary');
      
      const data = await response.json();
      setAiSummary(data.summary);
      
      toast({
        title: 'AI Summary Generated',
        description: 'Your personalized travel recommendations are ready',
      });
    } catch (error) {
      toast({
        title: 'Summary Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate AI summary',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'EXCELLENT': return 'bg-green-100 text-green-800 border-green-200';
      case 'GOOD': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'FAIR': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (duration: string) => {
    return duration?.replace('PT', '').replace('H', 'h ').replace('M', 'm') || '';
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Travel Hacker AI
              </h1>
              <p className="text-gray-600 mt-1">Complete trip planning with live prices powered by Amadeus</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </TabsTrigger>
            <TabsTrigger value="flights" className="flex items-center space-x-2">
              <Plane className="w-4 h-4" />
              <span>Flights</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center space-x-2">
              <Hotel className="w-4 h-4" />
              <span>Hotels</span>
            </TabsTrigger>
            <TabsTrigger value="cars" className="flex items-center space-x-2">
              <Car className="w-4 h-4" />
              <span>Cars</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Summary</span>
            </TabsTrigger>
          </TabsList>

          {/* Natural Language Search */}
          <TabsContent value="search" className="space-y-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Describe Your Trip</span>
                </CardTitle>
                <p className="text-gray-600">
                  Tell us about your travel plans in natural language and we'll find the best options
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Textarea
                    value={naturalLanguageQuery}
                    onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                    placeholder="Example: I want to go from NYC to Rome in March with my partner, looking for business class flights under $2000, a nice hotel near the city center, and a rental car..."
                    className="min-h-[120px] text-lg"
                  />
                  <Button 
                    onClick={handleParseQuery}
                    disabled={isParsingQuery || !naturalLanguageQuery.trim()}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isParsingQuery ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Parsing your request...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Find My Trip
                      </>
                    )}
                  </Button>
                </div>

                {/* Parsed Parameters Preview */}
                {Object.keys(searchParams).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <h4 className="font-medium mb-3 text-gray-900">Parsed Travel Parameters:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {searchParams.origin && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>From: {searchParams.origin}</span>
                        </div>
                      )}
                      {searchParams.destination && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span>To: {searchParams.destination}</span>
                        </div>
                      )}
                      {searchParams.departDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span>Depart: {searchParams.departDate}</span>
                        </div>
                      )}
                      {searchParams.returnDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <span>Return: {searchParams.returnDate}</span>
                        </div>
                      )}
                      {searchParams.maxPrice && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-red-600" />
                          <span>Budget: ${searchParams.maxPrice}</span>
                        </div>
                      )}
                      {searchParams.adults && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <span>Adults: {searchParams.adults}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Example Queries */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Example Queries:</h4>
                  <div className="grid gap-2">
                    {[
                      "Business trip from NYC to London next month, need hotel near financial district",
                      "Family vacation to Tokyo in July, 4 people, budget $5000 total",
                      "Weekend getaway from LA to San Francisco, prefer non-stop flights",
                      "Honeymoon to Paris in May, looking for luxury hotel and car rental"
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setNaturalLanguageQuery(example)}
                        className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flight Search Results */}
          <TabsContent value="flights" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Flight Options</h2>
              <Button 
                onClick={searchFlights}
                disabled={isSearchingFlights}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSearchingFlights ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Plane className="w-4 h-4 mr-2" />
                    Search Flights
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {flightOffers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl font-bold text-green-600">
                              ${offer.priceUSD}
                            </div>
                            <Badge className={getTierColor(offer.tier)}>
                              {offer.tier}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {offer.cpm} ¢/mile
                            </span>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {offer.validatingAirline}
                          </div>
                        </div>

                        {offer.itineraries.map((itinerary, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {idx === 0 ? 'Outbound' : 'Return'}
                              </span>
                              <span className="text-sm text-gray-500">
                                Duration: {formatDuration(itinerary.duration)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {itinerary.segments.map((segment, segIdx) => (
                                <div key={segIdx} className="flex items-center space-x-4 text-sm">
                                  <span className="font-mono">
                                    {segment.carrier}{segment.number}
                                  </span>
                                  <span>{segment.from}</span>
                                  <ArrowRight className="w-4 h-4" />
                                  <span>{segment.to}</span>
                                  <span className="text-gray-500">
                                    {formatDateTime(segment.dep)} - {formatDateTime(segment.arr)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {flightOffers.length === 0 && !isSearchingFlights && (
              <div className="text-center py-12">
                <Plane className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No flight results yet. Click "Search Flights" to begin.</p>
              </div>
            )}
          </TabsContent>

          {/* Hotel Search Results */}
          <TabsContent value="hotels" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Hotel Options</h2>
              <Button 
                onClick={searchHotels}
                disabled={isSearchingHotels}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSearchingHotels ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Hotel className="w-4 h-4 mr-2" />
                    Search Hotels
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {hotelOffers.map((hotel, index) => (
                  <motion.div
                    key={hotel.hotel.hotelId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              {hotel.hotel.name}
                            </h3>
                            <p className="text-gray-500 flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {hotel.hotel.cityCode}
                            </p>
                          </div>
                          <div className="text-right">
                            {hotel.offers.map((offer, idx) => (
                              <div key={idx} className="text-2xl font-bold text-green-600">
                                ${offer.price.total}
                              </div>
                            ))}
                          </div>
                        </div>

                        {hotel.offers.map((offer, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                              {offer.checkInDate} to {offer.checkOutDate}
                            </span>
                            <span>{offer.price.currency}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {hotelOffers.length === 0 && !isSearchingHotels && (
              <div className="text-center py-12">
                <Hotel className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No hotel results yet. Click "Search Hotels" to begin.</p>
              </div>
            )}
          </TabsContent>

          {/* Car Rental Results */}
          <TabsContent value="cars" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Car Rental Options</h2>
              <Button 
                onClick={searchCars}
                disabled={isSearchingCars}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSearchingCars ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Car className="w-4 h-4 mr-2" />
                    Search Cars
                  </>
                )}
              </Button>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {carOffers.map((car, index) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              {car.vehicle}
                            </h3>
                            <p className="text-gray-500">{car.supplier}</p>
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            ${car.priceUSD}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>Pick-up:</span>
                            <span>{car.pickUp.cityCode} - {formatDateTime(car.pickUp.at)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Drop-off:</span>
                            <span>{car.dropOff.cityCode} - {formatDateTime(car.dropOff.at)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {carOffers.length === 0 && !isSearchingCars && (
              <div className="text-center py-12">
                <Car className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No car rental results yet. Click "Search Cars" to begin.</p>
              </div>
            )}
          </TabsContent>

          {/* AI Summary */}
          <TabsContent value="summary" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Travel Summary</h2>
              <Button 
                onClick={generateAISummary}
                disabled={isGeneratingSummary}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isGeneratingSummary ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Summary
                  </>
                )}
              </Button>
            </div>

            {aiSummary ? (
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {aiSummary}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">
                  Get personalized AI insights about your travel options
                </p>
                <p className="text-sm text-gray-400">
                  Search for flights, hotels, or cars first, then generate an AI summary
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}