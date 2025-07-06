import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/Header';
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
      includeHotels: false,
      includeCarRentals: false,
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

      if (!response.ok) throw new Error('Failed to generate travel hack');
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error generating travel hack:', error);
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
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
      <Header />
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
              <Plane className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Travel Hacker AI
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Let Travel Hacker AI do all the heavy lifting and remove the headaches of planning a trip. 
              Find ultra-cheap flights, mistake fares, and budget travel deals with AI-powered search.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                💸 Ultra-cheap roundtrip flights
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                ⚡ Rare mistake fares
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
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
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Find My Travel Deal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="departure" className="text-white">Departure City</Label>
                        <Input
                          id="departure"
                          placeholder="e.g., Nashville, New York"
                          value={formData.departureCity}
                          onChange={(e) => setFormData(prev => ({ ...prev, departureCity: e.target.value }))}
                          className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="destination" className="text-white">Destination (Optional)</Label>
                        <Input
                          id="destination"
                          placeholder="Leave empty for anywhere"
                          value={formData.destinationCity}
                          onChange={(e) => setFormData(prev => ({ ...prev, destinationCity: e.target.value }))}
                          className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white mb-3 block">When do you want to travel?</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={`border-white/30 text-white hover:bg-white/10 bg-white/5 ${
                            formData.datePreset === 'spontaneous' ? 'bg-purple-600 border-purple-500' : ''
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
                          className={`border-white/30 text-white hover:bg-white/10 bg-white/5 ${
                            formData.datePreset === 'this-month' ? 'bg-purple-600 border-purple-500' : ''
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
                          className={`border-white/30 text-white hover:bg-white/10 bg-white/5 ${
                            formData.datePreset === 'next-month' ? 'bg-purple-600 border-purple-500' : ''
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
                          className={`border-white/30 text-white hover:bg-white/10 bg-white/5 ${
                            formData.datePreset === 'this-year' ? 'bg-purple-600 border-purple-500' : ''
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
                          <Label htmlFor="startDate" className="text-white">Departure Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value, datePreset: 'custom' }))}
                            className="bg-white/10 border-white/30 text-white"
                            required={formData.datePreset !== 'spontaneous'}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-white">Return Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value, datePreset: 'custom' }))}
                            className="bg-white/10 border-white/30 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget" className="text-white">Budget (Optional)</Label>
                        <Input
                          id="budget"
                          placeholder="e.g., $500"
                          value={formData.budget}
                          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                          className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="flexibility" className="text-white">Date Flexibility</Label>
                        <Select value={formData.flexibility} onValueChange={(value) => setFormData(prev => ({ ...prev, flexibility: value }))}>
                          <SelectTrigger className="bg-white/10 border-white/30 text-white">
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
                      <Label className="text-white mb-3 block">Preferences</Label>
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
                          />
                          <Label htmlFor="flightsOnly" className="text-white">✈️ Flights only</Label>
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
                          />
                          <Label htmlFor="includeHotels" className="text-white">🏨 Include hotels</Label>
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
                          />
                          <Label htmlFor="includeCarRentals" className="text-white">🚗 Include car rentals</Label>
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
                          />
                          <Label htmlFor="mistakeFares" className="text-white">⚡ Mistake fares</Label>
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
                  {/* Flight Deals */}
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        ✈️ Best Flight Deals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.flightDeals && result.flightDeals.length > 0 ? result.flightDeals.map((deal, index) => (
                        <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex justify-between items-start">
                            <div className="font-semibold text-white text-lg">{deal.route}: {deal.price}</div>
                            {deal.dealQuality && (
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  deal.dealQuality.includes('AMAZING') ? 'text-green-300 border-green-300/50 bg-green-500/10' :
                                  deal.dealQuality.includes('GREAT') ? 'text-blue-300 border-blue-300/50 bg-blue-500/10' :
                                  deal.dealQuality.includes('GOOD') ? 'text-yellow-300 border-yellow-300/50 bg-yellow-500/10' :
                                  deal.dealQuality.includes('FAIR') ? 'text-gray-300 border-gray-300/50 bg-gray-500/10' :
                                  'text-orange-300 border-orange-300/50 bg-orange-500/10'
                                }`}
                              >
                                {deal.dealQuality}
                              </Badge>
                            )}
                          </div>
                          <div className="text-gray-300 text-sm">Dates: {deal.dates} • {deal.airline || deal.source}</div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(deal.tools || ['Skyscanner', 'Google Flights']).map((tool, i) => (
                              <Badge key={i} variant="outline" className="text-xs text-blue-300 border-blue-300/50">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )) : (
                        <div className="text-center text-gray-300 py-8">
                          <div className="mb-2">⚠️ Flight API Access Required</div>
                          <p className="text-sm">To display live flight data, valid API access is needed for flight search services.</p>
                          <p className="text-xs mt-2 text-gray-400">Contact support to configure flight API credentials.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Hotels */}
                  {formData.preferences.includeHotels && (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          🏨 Best Hotel Deals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result?.hotels && result.hotels.length > 0 ? result.hotels.map((hotel, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="font-semibold text-white text-lg">{hotel.location}: {hotel.price}</div>
                            <div className="text-gray-300 text-sm">{hotel.hotel} • {hotel.rating}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {hotel.tips.map((tip, i) => (
                                <Badge key={i} variant="outline" className="text-xs text-purple-300 border-purple-300/50">
                                  {tip}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center text-gray-300 py-8">
                            <p>No hotel deals available from real-time sources.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Car Rentals */}
                  {formData.preferences.includeCarRentals && (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          🚗 Best Car Rental Deals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result?.carRentals && result.carRentals.length > 0 ? result.carRentals.map((rental, index) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="font-semibold text-white text-lg">{rental.location}: {rental.price}</div>
                            <div className="text-gray-300 text-sm">{rental.vehicleType} • {rental.company}</div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {rental.tips.map((tip, i) => (
                                <Badge key={i} variant="outline" className="text-xs text-green-300 border-green-300/50">
                                  {tip}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center text-gray-300 py-8">
                            <p>No car rental deals available from real-time sources.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Mistake Fares - Only show if real fares exist */}
                  {(result?.mistakeFares && result.mistakeFares.length > 0) ? (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          ⚡ Real Mistake Fares Found
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.mistakeFares.map((fare, index) => (
                          <div key={index} className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                            <div className="font-semibold text-orange-300 text-lg">🚨 {fare.route}: {fare.price}</div>
                            <div className="text-gray-300 text-sm">{fare.urgency} via {fare.source}</div>
                            {fare.departureDistance && (
                              <div className="text-xs text-orange-300 mt-1 flex items-center">
                                <span className="mr-1">📍</span>
                                {fare.departureDistance}
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          ⚡ Mistake Fare Search
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-gray-500/10 rounded-lg border border-gray-500/20">
                          <div className="text-gray-300">
                            🔍 No mistake fares currently available for this route. Try:
                          </div>
                          <ul className="text-gray-400 text-sm mt-2 ml-4">
                            <li>• Checking nearby airports</li>
                            <li>• Flexible travel dates</li>
                            <li>• Secret Flying alerts</li>
                          </ul>
                        </div>
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