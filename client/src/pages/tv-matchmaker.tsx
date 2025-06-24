import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, Play, Clock, Calendar, Tv, Search, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface TVShow {
  title: string;
  year: number;
  genre: string[];
  rating: number;
  seasons: number;
  status: string;
  plot: string;
  creator: string;
  cast: string[];
  poster: string;
  imdbId: string;
  matchScore: number;
  reasoning: string[];
  streamingPlatforms: string[];
}

interface TVPreferences {
  genres: string[];
  minRating: number;
  maxSeasons: number;
  status: string;
  decadePreference: string;
  moodPreference: string;
  excludeWatched: string[];
}

const genres = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
  'Music', 'Mystery', 'Reality', 'Romance', 'Sci-Fi', 'Sport',
  'Thriller', 'War', 'Western'
];

const decades = [
  { value: 'any', label: 'Any Decade' },
  { value: '2020s', label: '2020s' },
  { value: '2010s', label: '2010s' },
  { value: '2000s', label: '2000s' },
  { value: '1990s', label: '1990s' },
  { value: '1980s', label: '1980s' },
  { value: '1970s', label: '1970s' },
  { value: 'classic', label: 'Classic (Pre-1970)' }
];

const moods = [
  { value: 'any', label: 'Any Mood' },
  { value: 'feel-good', label: 'Feel Good' },
  { value: 'intense', label: 'Intense & Gripping' },
  { value: 'thought-provoking', label: 'Thought-Provoking' },
  { value: 'escapist', label: 'Pure Escapism' },
  { value: 'emotional', label: 'Emotional Journey' }
];

const statusOptions = [
  { value: 'any', label: 'Any Status' },
  { value: 'Ongoing', label: 'Currently Airing' },
  { value: 'Ended', label: 'Completed Series' },
  { value: 'Cancelled', label: 'Cancelled' }
];

export default function TVMatchmaker() {
  const [preferences, setPreferences] = useState<TVPreferences>({
    genres: [],
    minRating: 0,
    maxSeasons: 999,
    status: 'any',
    decadePreference: 'any',
    moodPreference: 'any',
    excludeWatched: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const queryClient = useQueryClient();

  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['/api/tv-recommendations', preferences],
    enabled: preferences.genres.length > 0 || preferences.minRating > 0 || preferences.maxSeasons < 999 || preferences.status !== 'any' || preferences.decadePreference !== 'any',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      return apiRequest('/api/tv-search', {
        method: 'POST',
        body: JSON.stringify({ query })
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/tv-recommendations', preferences], data.shows || []);
    }
  });

  const handleGenreToggle = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleTVSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      await searchMutation.mutateAsync(searchQuery);
    } finally {
      setIsSearching(false);
    }
  };

  const clearPreferences = () => {
    setPreferences({
      genres: [],
      minRating: 0,
      maxSeasons: 999,
      status: 'any',
      decadePreference: 'any',
      moodPreference: 'any',
      excludeWatched: []
    });
    setSearchQuery('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ongoing': return 'bg-green-500';
      case 'Ended': return 'bg-blue-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Tv className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">TV Show Matchmaker</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Discover your next binge-worthy series from 5000+ authentic TV shows
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Preferences Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Your Preferences
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tell us what you're in the mood for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* TV Show Search */}
                <div>
                  <Label className="text-white text-sm font-medium">Quick TV Show Search</Label>
                  <div className="flex mt-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a specific show..."
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && handleTVSearch()}
                    />
                    <Button 
                      onClick={handleTVSearch}
                      disabled={isSearching || !searchQuery.trim()}
                      className="ml-2 bg-purple-600 hover:bg-purple-700"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <Label className="text-white text-sm font-medium">Genres</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {genres.map(genre => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={genre}
                          checked={preferences.genres.includes(genre)}
                          onCheckedChange={() => handleGenreToggle(genre)}
                          className="border-white/20"
                        />
                        <Label htmlFor={genre} className="text-gray-300 text-xs">
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating & Seasons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white text-sm">Min Rating</Label>
                    <Select value={preferences.minRating.toString()} onValueChange={(value) => setPreferences(prev => ({ ...prev, minRating: parseFloat(value) }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Any Rating</SelectItem>
                        <SelectItem value="6">6.0+ Good</SelectItem>
                        <SelectItem value="7">7.0+ Great</SelectItem>
                        <SelectItem value="8">8.0+ Excellent</SelectItem>
                        <SelectItem value="9">9.0+ Masterpiece</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white text-sm">Max Seasons</Label>
                    <Select value={preferences.maxSeasons.toString()} onValueChange={(value) => setPreferences(prev => ({ ...prev, maxSeasons: parseInt(value) }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="999">Any Length</SelectItem>
                        <SelectItem value="1">1 Season</SelectItem>
                        <SelectItem value="3">1-3 Seasons</SelectItem>
                        <SelectItem value="5">1-5 Seasons</SelectItem>
                        <SelectItem value="10">1-10 Seasons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <Label className="text-white text-sm">Show Status</Label>
                  <Select value={preferences.status} onValueChange={(value) => setPreferences(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Decade */}
                <div>
                  <Label className="text-white text-sm">Era Preference</Label>
                  <Select value={preferences.decadePreference} onValueChange={(value) => setPreferences(prev => ({ ...prev, decadePreference: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {decades.map(decade => (
                        <SelectItem key={decade.value} value={decade.value}>
                          {decade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mood */}
                <div>
                  <Label className="text-white text-sm">Mood</Label>
                  <Select value={preferences.moodPreference} onValueChange={(value) => setPreferences(prev => ({ ...prev, moodPreference: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map(mood => (
                        <SelectItem key={mood.value} value={mood.value}>
                          {mood.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={clearPreferences}
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Clear All Preferences
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="text-center mb-6">
              {preferences.genres.length > 0 || preferences.minRating > 0 || preferences.maxSeasons < 999 || preferences.status !== 'any' || preferences.decadePreference !== 'any' ? (
                <div>
                  <Tv className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isLoading ? 'Finding Perfect Shows...' : `${recommendations?.length || 0} Shows Found`}
                  </h2>
                  <p className="text-gray-300">
                    {isLoading ? 'Analyzing 5000+ TV shows for your preferences' : 'Based on your preferences and viewing history'}
                  </p>
                </div>
              ) : (
                <div>
                  <Tv className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-white mb-2">Ready to Discover Amazing Shows?</h2>
                  <p className="text-gray-300">Set your preferences and get personalized recommendations</p>
                </div>
              )}
            </div>

            {error && (
              <Card className="bg-red-500/20 border-red-500/30 mb-6">
                <CardContent className="p-4">
                  <p className="text-red-200">Error loading recommendations. Please try again.</p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <div className="grid gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-36 bg-white/20 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-white/20 rounded w-3/4"></div>
                          <div className="h-3 bg-white/20 rounded w-1/2"></div>
                          <div className="h-3 bg-white/20 rounded w-full"></div>
                          <div className="h-3 bg-white/20 rounded w-2/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && recommendations && recommendations.length > 0 && (
              <div className="grid gap-6">
                {recommendations.map((show: TVShow, index: number) => (
                  <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img 
                          src={show.poster} 
                          alt={show.title}
                          className="w-24 h-36 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{show.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span>{show.year}</span>
                                <Clock className="w-4 h-4 ml-2" />
                                <span>{show.seasons} season{show.seasons > 1 ? 's' : ''}</span>
                                <div className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(show.status)}`}>
                                  {show.status}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-yellow-400 mb-1">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-semibold">{show.rating.toFixed(1)}</span>
                              </div>
                              <div className="text-xs text-green-400 font-medium">
                                {show.matchScore}% Match
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                            {show.plot}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {show.genre.map((g: string) => (
                              <Badge key={g} variant="secondary" className="bg-purple-500/20 text-purple-200 text-xs">
                                {g}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="text-xs text-gray-400 mb-3">
                            <span className="font-medium">Creator:</span> {show.creator}
                            <span className="mx-2">•</span>
                            <span className="font-medium">Cast:</span> {show.cast.join(', ')}
                          </div>
                          
                          {show.streamingPlatforms && show.streamingPlatforms.length > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <Play className="w-4 h-4 text-green-400" />
                              <span className="text-xs text-gray-300">Watch on:</span>
                              <div className="flex gap-1">
                                {show.streamingPlatforms.map((platform: string) => (
                                  <Badge key={platform} className="bg-green-500/20 text-green-200 text-xs">
                                    {platform}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {show.reasoning && show.reasoning.length > 0 && (
                            <div className="text-xs text-blue-200 bg-blue-500/10 rounded p-2">
                              <span className="font-medium">Why we recommend this:</span>
                              <ul className="mt-1 space-y-1">
                                {show.reasoning.map((reason: string, i: number) => (
                                  <li key={i}>• {reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}