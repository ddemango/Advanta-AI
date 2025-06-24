import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Film, Star, Calendar, Clock, Users, Heart, Search, Sparkles } from 'lucide-react';

interface MovieRecommendation {
  title: string;
  year: number;
  genre: string[];
  rating: number;
  runtime: number;
  plot: string;
  director: string;
  cast: string[];
  poster: string;
  imdbId: string;
  tmdbId?: string;
  matchScore: number;
  reasoning: string[];
  streamingPlatforms?: string[];
}

interface MoviePreferences {
  genres: string[];
  minRating: number;
  maxRuntime: number;
  decadePreference: string;
  moodPreference: string;
  contentRating: string;
  excludeWatched: string[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } }
};

export default function MovieMatchmaker() {
  const [preferences, setPreferences] = useState<MoviePreferences>({
    genres: [],
    minRating: 6.0,
    maxRuntime: 180,
    decadePreference: 'any',
    moodPreference: 'any',
    contentRating: 'any',
    excludeWatched: []
  });
  
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const genres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 
    'Documentary', 'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 
    'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
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
    { value: 'uplifting', label: 'Uplifting & Feel-Good' },
    { value: 'intense', label: 'Intense & Thrilling' },
    { value: 'thoughtful', label: 'Thoughtful & Deep' },
    { value: 'funny', label: 'Funny & Light' },
    { value: 'romantic', label: 'Romantic & Emotional' },
    { value: 'dark', label: 'Dark & Gritty' }
  ];

  const handleGenreToggle = (genre: string) => {
    setPreferences(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleGetRecommendations = async () => {
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch('/api/movie-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) throw new Error('Failed to get recommendations');
      
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError('Unable to fetch movie recommendations. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleMovieSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/movie-search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setRecommendations(data.results || []);
    } catch (err) {
      setError('Movie search unavailable. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Helmet>
        <title>AI Movie Matchmaker - Personalized Film Recommendations | Advanta AI</title>
        <meta name="description" content="Discover your next favorite movie with our AI-powered recommendation engine. Get personalized film suggestions based on your preferences, mood, and viewing history." />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://advanta-ai.com/movie-matchmaker" />
        <meta property="og:title" content="AI Movie Matchmaker - Personalized Film Recommendations" />
        <meta property="og:description" content="Discover your next favorite movie with AI-powered recommendations tailored to your taste." />
        <meta property="og:image" content="/advanta-ai-og.png" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="AI Movie Matchmaker - Personalized Film Recommendations" />
        <meta property="twitter:description" content="Discover your next favorite movie with AI-powered recommendations tailored to your taste." />
        <meta property="twitter:image" content="/advanta-ai-og.png" />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Film className="w-12 h-12 text-purple-400 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Movie Matchmaker
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover your next favorite film with AI-powered recommendations tailored to your unique taste and mood
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preferences Panel */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                    Your Preferences
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Tell us what you're in the mood for
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Movie Search */}
                  <div>
                    <Label className="text-white text-sm font-medium">Quick Movie Search</Label>
                    <div className="flex mt-2">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a specific movie..."
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleMovieSearch()}
                      />
                      <Button 
                        onClick={handleMovieSearch}
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

                  {/* Rating & Runtime */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white text-sm">Min Rating</Label>
                      <Select value={preferences.minRating.toString()} onValueChange={(value) => setPreferences(prev => ({ ...prev, minRating: parseFloat(value) }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5.0">5.0+</SelectItem>
                          <SelectItem value="6.0">6.0+</SelectItem>
                          <SelectItem value="7.0">7.0+</SelectItem>
                          <SelectItem value="8.0">8.0+</SelectItem>
                          <SelectItem value="9.0">9.0+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-white text-sm">Max Runtime</Label>
                      <Select value={preferences.maxRuntime.toString()} onValueChange={(value) => setPreferences(prev => ({ ...prev, maxRuntime: parseInt(value) }))}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="90">90 min</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="150">2.5 hours</SelectItem>
                          <SelectItem value="180">3 hours</SelectItem>
                          <SelectItem value="999">Any length</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Decade & Mood */}
                  <div>
                    <Label className="text-white text-sm">Decade Preference</Label>
                    <Select value={preferences.decadePreference} onValueChange={(value) => setPreferences(prev => ({ ...prev, decadePreference: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
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

                  <div>
                    <Label className="text-white text-sm">Mood</Label>
                    <Select value={preferences.moodPreference} onValueChange={(value) => setPreferences(prev => ({ ...prev, moodPreference: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
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
                    onClick={handleGetRecommendations}
                    disabled={isSearching}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Finding Movies...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        Get My Recommendations
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results Panel */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              {error && (
                <Card className="bg-red-500/10 backdrop-blur-md border-red-500/30 mb-6">
                  <CardContent className="text-center py-8">
                    <div className="text-red-400 text-6xl mb-4">🎬</div>
                    <h3 className="text-lg font-medium text-red-300 mb-2">
                      Recommendations Unavailable
                    </h3>
                    <p className="text-sm text-red-200 mb-4">{error}</p>
                    <Button 
                      onClick={() => setError(null)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {recommendations.length === 0 && !error && !isSearching && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="text-center py-16">
                    <Film className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Ready to Discover Amazing Movies?
                    </h3>
                    <p className="text-sm text-gray-400">
                      Set your preferences and get personalized recommendations
                    </p>
                  </CardContent>
                </Card>
              )}

              {recommendations.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Perfect Matches for You
                  </h2>
                  {recommendations.map((movie, index) => (
                    <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Movie Poster */}
                          <div className="flex-shrink-0">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-32 h-48 object-cover rounded-lg border border-white/20"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/200x300/333/fff?text=No+Image';
                              }}
                            />
                          </div>

                          {/* Movie Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                  {movie.title}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-300">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {movie.year}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {movie.runtime}m
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                    {movie.rating}
                                  </span>
                                </div>
                              </div>
                              {movie.matchScore && (
                                <Badge className="bg-green-600 text-white">
                                  {movie.matchScore}% Match
                                </Badge>
                              )}
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {movie.genre.map(g => (
                                <Badge key={g} variant="outline" className="border-purple-400 text-purple-300">
                                  {g}
                                </Badge>
                              ))}
                            </div>

                            {/* Plot */}
                            <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                              {movie.plot}
                            </p>

                            {/* Cast & Director */}
                            <div className="text-sm text-gray-400 mb-3">
                              <p><strong>Director:</strong> {movie.director}</p>
                              <p><strong>Cast:</strong> {movie.cast.slice(0, 3).join(', ')}</p>
                            </div>

                            {/* Streaming Platforms */}
                            {movie.streamingPlatforms && movie.streamingPlatforms.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                  </svg>
                                  Watch on:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {movie.streamingPlatforms.map((platform, pIndex) => (
                                    <Badge key={pIndex} className="bg-green-600/80 text-white text-xs px-2 py-1">
                                      {platform}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Reasoning */}
                            {movie.reasoning && movie.reasoning.length > 0 && (
                              <div className="mt-4 p-3 bg-white/5 rounded-lg">
                                <h4 className="text-white font-semibold mb-2 text-sm">Why This Movie?</h4>
                                {movie.reasoning.map((reason, i) => (
                                  <p key={i} className="text-gray-300 text-xs mb-1">• {reason}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}