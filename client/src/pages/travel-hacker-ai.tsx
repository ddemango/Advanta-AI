import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Plane, MapPin, Calendar, DollarSign, Zap, ExternalLink, Search, Clock, Target } from 'lucide-react';
import { fadeIn, fadeInUp } from '@/lib/animations';

interface TravelHackResult {
  flightDeals: Array<{
    route: string;
    price: string;
    dates: string;
    airline: string;
    tools: string[];
    dealQuality?: string;
    source?: string;
  }>;
  hotels?: Array<{
    location: string;
    price: string;
    hotel: string;
    rating: string;
    tips: string[];
  }>;
  carRentals?: Array<{
    location: string;
    price: string;
    company: string;
    vehicleType: string;
    tips: string[];
  }>;
  mistakeFares: Array<{
    route: string;
    price: string;
    source: string;
    urgency: string;
    departureDistance?: string;
  }>;
  dateOptimization: {
    suggestion: string;
    savings: string;
  } | null;
  bonusHacks: string[];
  helpfulLinks: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  error?: string;
}

export default function TravelHackerAI() {
  const [formData, setFormData] = useState({
    departureCity: '',
    destinationCity: '',
    startDate: '',
    endDate: '',
    budget: '',
    flexibility: 'exact',
    datePreset: 'custom',
    preferences: {
      flightsOnly: true,
      includeHotels: true,
      includeCarRentals: true,
      mistakeFares: true
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<TravelHackResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Build date information with actual dates when available
      let dateInfo = '';
      if (formData.datePreset === 'spontaneous') {
        dateInfo = 'I am completely flexible with dates - find the cheapest possible times to travel';
      } else if (formData.startDate && formData.endDate) {
        dateInfo = `from ${formData.startDate} to ${formData.endDate}`;
      } else if (formData.startDate) {
        dateInfo = `departing ${formData.startDate}`;
      } else {
        // Fallback for presets without specific dates
        const now = new Date();
        if (formData.datePreset === 'this-month') {
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          dateInfo = `from ${now.toISOString().split('T')[0]} to ${endOfMonth.toISOString().split('T')[0]}`;
        } else if (formData.datePreset === 'next-month') {
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
          dateInfo = `from ${nextMonth.toISOString().split('T')[0]} to ${endOfNextMonth.toISOString().split('T')[0]}`;
        } else if (formData.datePreset === 'this-year') {
          const endOfYear = new Date(now.getFullYear(), 11, 31);
          dateInfo = `from ${now.toISOString().split('T')[0]} to ${endOfYear.toISOString().split('T')[0]}`;
        } else {
          dateInfo = 'I am flexible with dates';
        }
      }

      const prompt = `Find cheap flights from ${formData.departureCity} to ${formData.destinationCity || 'anywhere flexible'} 
        ${dateInfo}. 
        Budget: ${formData.budget || 'flexible'}. 
        Date Flexibility: ${formData.flexibility}. 
        Preferences: ${Object.entries(formData.preferences).filter(([_, value]) => value).map(([key]) => key).join(', ')}.
        
        Find the best deals, mistake fares, and travel hacks.`;

      const response = await fetch('/api/travel-hack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          from: formData.departureCity,
          to: formData.destinationCity,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget,
          preferences: formData.preferences
        })
      });

      if (!response.ok) {
        if (response.status === 503) {
          const errorData = await response.json();
          throw new Error(errorData.message + ': ' + errorData.error);
        }
        throw new Error('Failed to generate travel hack');
      }
      
      const data = await response.json();
      console.log('Travel API response:', data);
      setResult(data);
    } catch (error) {
      console.error('Error generating travel hack:', error);
      // Set a clear error message for the user
      setResult({
        flightDeals: [],
        mistakeFares: [],
        bonusHacks: [],
        helpfulLinks: [
          {
            name: 'Google Flights',
            url: 'https://flights.google.com',
            description: 'Compare flight prices across airlines'
          },
          {
            name: 'Skyscanner',
            url: 'https://skyscanner.com',
            description: 'Flight comparison and booking'
          },
          {
            name: 'Kayak',
            url: 'https://kayak.com',
            description: 'Travel search engine'
          }
        ],
        dateOptimization: null,
        error: error instanceof Error ? error.message : 'Travel data currently unavailable'
      });
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Travel Hacker AI - Cheap Flights & Budget Travel Deals | Advanta AI</title>
        <meta name="description" content="Find ultra-cheap flights, mistake fares, and budget travel deals with AI-powered search. Save money on flights and travel with smart hacks." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://advanta-ai.com/travel-hacker-ai" />
        <meta property="og:title" content="Advanta AI - AI-Powered Workflow Automation Platform" />
        <meta property="og:description" content="Build, automate, and scale with AI. Smart automation, AI workflows, and free AI tools including Travel Hacker AI for finding cheap flights." />
        <meta property="og:image" content="/travel-hacker-ai-og.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://advanta-ai.com/travel-hacker-ai" />
        <meta property="twitter:title" content="Advanta AI - AI-Powered Workflow Automation Platform" />
        <meta property="twitter:description" content="Build, automate, and scale with AI. Smart automation, AI workflows, and free AI tools including Travel Hacker AI for finding cheap flights." />
        <meta property="twitter:image" content="/travel-hacker-ai-og.png" />
      </Helmet>
      <NewHeader />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Plane className="w-12 h-12 text-blue-600 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Travel Hacker AI
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Let Travel Hacker AI do all the heavy lifting and remove the headaches of planning a trip. 
              Find ultra-cheap flights, mistake fares, and budget travel deals with AI-powered search.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-gray-700 border-gray-300 bg-gray-100">
                💸 Ultra-cheap roundtrip flights
              </Badge>
              <Badge variant="outline" className="text-gray-700 border-gray-300 bg-gray-100">
                ⚡ Rare mistake fares
              </Badge>
              <Badge variant="outline" className="text-gray-700 border-gray-300 bg-gray-100">
                🧳 Full budget travel plans
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gray-50 border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Find My Travel Deal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="departure" className="text-gray-900">Departure City</Label>
                        <Input
                          id="departure"
                          placeholder="e.g., Nashville, New York"
                          value={formData.departureCity}
                          onChange={(e) => setFormData(prev => ({ ...prev, departureCity: e.target.value }))}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="destination" className="text-gray-900">Destination (Optional)</Label>
                        <Input
                          id="destination"
                          placeholder="Leave empty for anywhere"
                          value={formData.destinationCity}
                          onChange={(e) => setFormData(prev => ({ ...prev, destinationCity: e.target.value }))}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-900 mb-3 block">When do you want to travel?</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`border-gray-300 text-gray-700 hover:bg-gray-100 bg-white ${
                            formData.datePreset === 'spontaneous' ? 'bg-purple-600 border-purple-500 text-white' : ''
                          }`}
                          onClick={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              datePreset: 'spontaneous',
                              startDate: '',
                              endDate: ''
                            }));
                          }}
                        >
                          ⚡ Spontaneous
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`border-gray-300 text-gray-700 hover:bg-gray-100 bg-white ${
                            formData.datePreset === 'this-month' ? 'bg-purple-600 border-purple-500 text-white' : ''
                          }`}
                          onClick={() => {
                            const now = new Date();
                            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                            setFormData(prev => ({ 
                              ...prev, 
                              datePreset: 'this-month',
                              startDate: now.toISOString().split('T')[0],
                              endDate: endOfMonth.toISOString().split('T')[0]
                            }));
                          }}
                        >
                          📅 This Month
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`border-gray-300 text-gray-700 hover:bg-gray-100 bg-white ${
                            formData.datePreset === 'next-month' ? 'bg-purple-600 border-purple-500 text-white' : ''
                          }`}
                          onClick={() => {
                            const now = new Date();
                            const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                            const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
                            setFormData(prev => ({ 
                              ...prev, 
                              datePreset: 'next-month',
                              startDate: nextMonth.toISOString().split('T')[0],
                              endDate: endOfNextMonth.toISOString().split('T')[0]
                            }));
                          }}
                        >
                          🗓️ Next Month
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`border-gray-300 text-gray-700 hover:bg-gray-100 bg-white ${
                            formData.datePreset === 'this-year' ? 'bg-purple-600 border-purple-500 text-white' : ''
                          }`}
                          onClick={() => {
                            const now = new Date();
                            const endOfYear = new Date(now.getFullYear(), 11, 31);
                            setFormData(prev => ({ 
                              ...prev, 
                              datePreset: 'this-year',
                              startDate: now.toISOString().split('T')[0],
                              endDate: endOfYear.toISOString().split('T')[0]
                            }));
                          }}
                        >
                          📆 This Year
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate" className="text-gray-900">Departure Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value, datePreset: 'custom' }))}
                            className="bg-white border-gray-300 text-gray-900"
                            required={formData.datePreset !== 'spontaneous'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-gray-900">Return Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value, datePreset: 'custom' }))}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget" className="text-gray-900">Budget (Optional)</Label>
                        <Input
                          id="budget"
                          placeholder="e.g., $500"
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="flexibility" className="text-gray-900">Date Flexibility</Label>
                        <Select value={formData.flexibility} onValueChange={(value) => setFormData(prev => ({ ...prev, flexibility: value }))}>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="exact">Exact dates</SelectItem>
                            <SelectItem value="plus-minus-1">± 1 day</SelectItem>
                            <SelectItem value="plus-minus-3">± 3 days</SelectItem>
                            <SelectItem value="weekend-only">Weekends only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-900 mb-3 block">Preferences</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="flightsOnly"
                            checked={formData.preferences.flightsOnly}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ 
                                ...prev, 
                                preferences: { ...prev.preferences, flightsOnly: !!checked }
                              }))
                            }
                            className="border-gray-300"
                          />
                          <Label htmlFor="flightsOnly" className="text-gray-700">✈️ Flights only</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeHotels"
                            checked={formData.preferences.includeHotels}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ 
                                ...prev, 
                                preferences: { ...prev.preferences, includeHotels: !!checked }
                              }))
                            }
                            className="border-gray-300"
                          />
                          <Label htmlFor="includeHotels" className="text-gray-700">🏨 Include hotels</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="includeCarRentals"
                            checked={formData.preferences.includeCarRentals}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ 
                                ...prev, 
                                preferences: { ...prev.preferences, includeCarRentals: !!checked }
                              }))
                            }
                            className="border-gray-300"
                          />
                          <Label htmlFor="includeCarRentals" className="text-gray-700">🚗 Include car rentals</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="mistakeFares"
                            checked={formData.preferences.mistakeFares}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ 
                                ...prev, 
                                preferences: { ...prev.preferences, mistakeFares: !!checked }
                              }))
                            }
                            className="border-gray-300"
                          />
                          <Label htmlFor="mistakeFares" className="text-gray-700">⚡ Mistake fares</Label>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Finding Deals...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Find My Deal
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.4 }}
            >
              {result ? (
                <div className="space-y-6">
                  {/* Error State Display */}
                  {result.error && (
                    <Card className="bg-red-50 border-red-200">
                      <CardHeader>
                        <CardTitle className="text-red-700 flex items-center">
                          <Zap className="w-5 h-5 mr-2" />
                          Travel Data Unavailable
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-red-600 mb-4">{result.error}</p>
                        <p className="text-gray-700 text-sm">
                          You can still find great travel deals using these recommended platforms:
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Flight Deals */}
                  <Card className="bg-gray-50 border-gray-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-900 flex items-center">
                        ✈️ Best Flight Deals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.flightDeals && result.flightDeals.length > 0 ? result.flightDeals.map((deal, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex justify-between items-start">
                            <div className="font-semibold text-gray-900 text-lg">{deal.route}: {deal.price}</div>
                            {deal.dealQuality && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  deal.dealQuality.includes('AMAZING') ? 'text-green-700 border-green-300 bg-green-50' :
                                  deal.dealQuality.includes('GREAT') ? 'text-blue-700 border-blue-300 bg-blue-50' :
                                  deal.dealQuality.includes('GOOD') ? 'text-yellow-700 border-yellow-300 bg-yellow-50' :
                                  deal.dealQuality.includes('FAIR') ? 'text-gray-700 border-gray-300 bg-gray-50' :
                                  'text-orange-700 border-orange-300 bg-orange-50'
                                }`}
                              >
                                {deal.dealQuality}
                              </Badge>
                            )}
                          </div>
                          <div className="text-gray-600 text-sm">Dates: {deal.dates} • {deal.airline || deal.source}</div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(deal.tools || ['Skyscanner', 'Google Flights']).map((tool, i) => (
                              <Badge key={i} variant="outline" className="text-xs text-blue-700 border-blue-300 bg-blue-50">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )) : (
                        <div className="text-center text-gray-600 py-8">
                          <Plane className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <div className="mb-2">Enter your travel details to find the best deals</div>
                          <p className="text-sm mb-4">We'll search for ultra-cheap flights and mistake fares for you.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Hotels */}
                  {formData.preferences.includeHotels && (
                    <Card className="bg-gray-50 border-gray-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-gray-900 flex items-center">
                          🏨 Best Hotel Deals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result?.hotels && result.hotels.length > 0 ? result.hotels.map((hotel, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="font-semibold text-gray-900 text-lg">{hotel.name}: {hotel.price}/night</div>
                            <div className="text-gray-600 text-sm">{hotel.location} • ⭐ {hotel.rating}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {hotel.amenities && hotel.amenities.map((amenity, i) => (
                                <Badge key={i} variant="outline" className="text-xs text-blue-700 border-blue-300 bg-blue-50">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center text-gray-600 py-8">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                              <p className="text-yellow-800 font-medium">🔄 Real-Time Data Status</p>
                              <p className="text-yellow-700 text-sm mt-1">
                                Hotel data APIs are currently experiencing access limitations. 
                                We only display real-time data and never show placeholder content.
                              </p>
                            </div>
                            <p>No hotel deals available from real-time sources.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Car Rentals */}
                  {formData.preferences.includeCarRentals && (
                    <Card className="bg-gray-50 border-gray-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-gray-900 flex items-center">
                          🚗 Car Rental Deals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result?.carRentals && result.carRentals.length > 0 ? result.carRentals.map((rental, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="font-semibold text-gray-900 text-lg">{rental.company}: {rental.price}</div>
                            <div className="text-gray-600 text-sm">{rental.vehicleType} • {rental.location}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {rental.features && rental.features.map((feature, i) => (
                                <Badge key={i} variant="outline" className="text-xs text-green-700 border-green-300 bg-green-50">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center text-gray-600 py-8">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                              <p className="text-yellow-800 font-medium">🔄 Real-Time Data Status</p>
                              <p className="text-yellow-700 text-sm mt-1">
                                Car rental APIs are currently experiencing access limitations. 
                                We only display real-time data and never show placeholder content.
                              </p>
                            </div>
                            <p>No car rental deals available from real-time sources.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Mistake Fares */}
                  {formData.preferences.mistakeFares && (
                    <Card className="bg-gray-50 border-gray-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-gray-900 flex items-center">
                          ⚡ Mistake Fare Deals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result?.mistakeFares && result.mistakeFares.length > 0 ? result.mistakeFares.map((fare, index) => (
                          <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="font-semibold text-gray-900 text-lg">{fare.route}: {fare.price}</div>
                            <div className="text-gray-600 text-sm">
                              <span className="line-through text-gray-400">{fare.originalPrice}</span> → 
                              <span className="text-green-600 font-medium ml-1">{fare.savings}</span>
                            </div>
                            <div className="text-gray-600 text-sm">{fare.airline} • Expires in {fare.expiresIn}</div>
                            <Badge variant="outline" className="text-xs text-red-700 border-red-300 bg-red-50 mt-2">
                              {fare.source}
                            </Badge>
                          </div>
                        )) : (
                          <div className="text-center text-gray-600 py-8">
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                              <p className="text-yellow-800 font-medium">🔄 Real-Time Data Status</p>
                              <p className="text-yellow-700 text-sm mt-1">
                                Deal finder APIs are currently experiencing access limitations. 
                                We only display real-time data and never show placeholder content.
                              </p>
                            </div>
                            <p>No mistake fares currently available for this route. Try:</p>
                            <ul className="text-gray-500 text-sm mt-2">
                              <li>• Checking nearby airports</li>
                              <li>• Flexible travel dates</li>
                              <li>• Alternative search dates</li>
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Date Optimization */}
                  {result?.dateOptimization && (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          📅 Better Date Tip
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="text-green-300 font-medium">
                            💡 {result.dateOptimization.suggestion} drops fare by {result.dateOptimization.savings}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Bonus Hacks */}
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        🧠 Bonus Travel Hacks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result?.bonusHacks && result.bonusHacks.length > 0 ? result.bonusHacks.map((hack, index) => (
                          <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-gray-300">{hack}</div>
                          </div>
                        )) : (
                          <div className="text-center text-gray-300 py-8">
                            <p>No bonus travel hacks available from real-time sources.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Helpful Links */}
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        🔗 Helpful Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result?.helpfulLinks && result.helpfulLinks.length > 0 ? result.helpfulLinks.map((link, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <div>
                              <div className="text-white font-medium">{link.name}</div>
                              <div className="text-gray-400 text-sm">{link.description}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(link.url, '_blank')}
                              className="border-white/30 text-white hover:bg-white/10"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        )) : (
                          <div className="text-center text-gray-300 py-8">
                            <p>No helpful links available from real-time sources.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Plane className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Travel Deals Preview
                    </h3>
                    <p className="text-sm text-gray-400">
                      Enter your travel details to find the best deals
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.6 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Why Travel Hacker AI Works
              </h2>
              <p className="text-xl text-gray-300">
                Advanced AI algorithms that outperform traditional search engines
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-white font-semibold mb-2">Multi-Source Search</h3>
                  <p className="text-gray-300 text-sm">Scours multiple platforms simultaneously for the best deals</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-white font-semibold mb-2">Mistake Fares</h3>
                  <p className="text-gray-300 text-sm">Instantly surfaces rare pricing errors and hidden city deals</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-white font-semibold mb-2">Smart Optimization</h3>
                  <p className="text-gray-300 text-sm">AI suggests better dates and routing strategies</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-white font-semibold mb-2">Maximum Savings</h3>
                  <p className="text-gray-300 text-sm">Advanced hacks that search engines can't provide</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}