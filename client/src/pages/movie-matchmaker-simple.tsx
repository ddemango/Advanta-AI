import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/layout/Header';
import { Helmet } from 'react-helmet';
import { 
  Film, 
  Tv, 
  Clock, 
  Users, 
  Heart, 
  Zap,
  Star,
  Calendar,
  Share2,
  BookmarkPlus,
  Loader2,
  Play
} from 'lucide-react';

interface MovieRecommendation {
  title: string;
  year: number;
  genre: string[];
  rating: number;
  runtime: number;
  platform: string[];
  description: string;
  poster: string;
  trailerUrl?: string;
  matchScore: number;
  reasonForRecommendation: string;
}

interface WatchlistResponse {
  mood: string;
  preferences: any;
  recommendations: MovieRecommendation[];
  totalMatches: number;
  personalizedMessage: string;
}

export default function MovieMatchmaker() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [watchlist, setWatchlist] = useState<WatchlistResponse | null>(null);
  
  // Form state
  const [mood, setMood] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [timeAvailable, setTimeAvailable] = useState([120]); // minutes
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [viewingContext, setViewingContext] = useState('');
  const [pastFavorites, setPastFavorites] = useState('');
  const [includeWildCard, setIncludeWildCard] = useState(false);

  const moods = [
    { value: 'chill', label: 'Chill & Relaxed', icon: '😌' },
    { value: 'inspired', label: 'Inspired & Motivated', icon: '✨' },
    { value: 'scared', label: 'Thrilled & Scared', icon: '😱' },
    { value: 'romantic', label: 'Romantic & Sweet', icon: '💕' },
    { value: 'funny', label: 'Funny & Light', icon: '😄' },
    { value: 'adventurous', label: 'Adventurous & Bold', icon: '🚀' },
    { value: 'thoughtful', label: 'Thoughtful & Deep', icon: '🤔' }
  ];

  const genreOptions = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'Horror', 'Music', 'Mystery',
    'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
  ];

  const platformOptions = [
    'Netflix', 'Hulu', 'Amazon Prime', 'Disney+', 'HBO Max', 'Apple TV+',
    'Paramount+', 'Peacock', 'Showtime', 'Starz', 'Any Platform'
  ];

  const viewingContexts = [
    { value: 'solo', label: 'Solo Viewing' },
    { value: 'date', label: 'Date Night' },
    { value: 'family', label: 'Family Time' },
    { value: 'friends', label: 'With Friends' },
    { value: 'party', label: 'Party/Group' }
  ];

  const handleGenreToggle = (genre: string) => {
    setGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handlePlatformToggle = (platform: string) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const generateWatchlist = async () => {
    if (!mood) {
      toast({
        title: "Mood Required",
        description: "Please select your current mood to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiRequest('POST', '/api/generate-watchlist', {
        mood,
        genres,
        timeAvailable: timeAvailable[0],
        platforms,
        viewingContext,
        pastFavorites,
        includeWildCard
      });
      
      const watchlistData = await response.json();
      setWatchlist(watchlistData);
      
      toast({
        title: "Watchlist Generated!",
        description: `Found ${watchlistData.recommendations.length} perfect matches for your mood.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate your personalized watchlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Movie Matchmaker - AI-Powered Watchlist Generator | Advanta AI</title>
        <meta name="description" content="Get personalized movie and TV recommendations based on your mood, preferences, and viewing context. AI-powered watchlist generator for Netflix, Hulu, and more." />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Movie Matchmaker
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered watchlist generator that matches your mood, preferences, and viewing context 
              to find the perfect movie or TV show for any moment.
            </p>
          </div>

          {!watchlist ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Preferences Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Tell Us Your Mood & Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mood Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">What's your mood?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {moods.map((m) => (
                        <Button
                          key={m.value}
                          variant={mood === m.value ? "default" : "outline"}
                          onClick={() => setMood(m.value)}
                          className="justify-start h-auto p-3"
                        >
                          <span className="mr-2">{m.icon}</span>
                          {m.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time Available */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Time Available: {formatRuntime(timeAvailable[0])}
                    </Label>
                    <Slider
                      value={timeAvailable}
                      onValueChange={setTimeAvailable}
                      max={300}
                      min={30}
                      step={15}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>30min</span>
                      <span>2h</span>
                      <span>5h+</span>
                    </div>
                  </div>

                  {/* Viewing Context */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Watching with?</Label>
                    <Select value={viewingContext} onValueChange={setViewingContext}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select viewing context" />
                      </SelectTrigger>
                      <SelectContent>
                        {viewingContexts.map((context) => (
                          <SelectItem key={context.value} value={context.value}>
                            {context.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Past Favorites */}
                  <div>
                    <Label htmlFor="favorites" className="text-base font-semibold mb-3 block">
                      Recent Favorites (Optional)
                    </Label>
                    <Input
                      id="favorites"
                      placeholder="e.g., Inception, The Office, Stranger Things..."
                      value={pastFavorites}
                      onChange={(e) => setPastFavorites(e.target.value)}
                    />
                  </div>

                  {/* Wild Card Option */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wildcard"
                      checked={includeWildCard}
                      onCheckedChange={(checked) => setIncludeWildCard(checked === true)}
                    />
                    <Label htmlFor="wildcard" className="text-sm">
                      Include a wild card surprise recommendation
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Genre & Platform Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tv className="h-5 w-5" />
                    Genres & Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Genres */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Preferred Genres</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {genreOptions.map((genre) => (
                        <Button
                          key={genre}
                          variant={genres.includes(genre) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleGenreToggle(genre)}
                          className="text-xs"
                        >
                          {genre}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Available Platforms</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {platformOptions.map((platform) => (
                        <Button
                          key={platform}
                          variant={platforms.includes(platform) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePlatformToggle(platform)}
                          className="text-xs"
                        >
                          {platform}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={generateWatchlist}
                    disabled={isGenerating || !mood}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Your Perfect Watchlist...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Generate My Watchlist
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Watchlist Results */
            <div className="space-y-8">
              {/* Results Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Your Personalized Watchlist</h2>
                    <p className="text-muted-foreground mb-4">{watchlist.personalizedMessage}</p>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3" />
                        {watchlist.totalMatches} Perfect Matches
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {moods.find(m => m.value === watchlist.mood)?.label}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setWatchlist(null)}
                      className="mt-4"
                    >
                      Generate New Watchlist
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlist.recommendations.map((movie, index) => (
                  <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      {/* Movie Poster */}
                      <div className="aspect-[2/3] bg-muted rounded-t-lg flex items-center justify-center">
                        {movie.poster ? (
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <Film className="h-16 w-16 text-muted-foreground" />
                        )}
                      </div>
                      
                      {/* Movie Details */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{movie.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{movie.year}</span>
                            <span>•</span>
                            <span>{formatRuntime(movie.runtime)}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current text-yellow-500" />
                              <span>{movie.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {movie.genre.slice(0, 3).map((g) => (
                            <Badge key={g} variant="outline" className="text-xs">
                              {g}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {movie.description}
                        </p>

                        <div className="space-y-2">
                          <div className="text-xs text-primary font-medium">
                            {movie.matchScore}% Match • {movie.reasonForRecommendation}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {movie.platform.map((p) => (
                              <Badge key={p} variant="secondary" className="text-xs">
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <BookmarkPlus className="h-3 w-3 mr-1" />
                            Add to List
                          </Button>
                          {movie.trailerUrl && (
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Share Watchlist */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Love your watchlist?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share it with friends or save it for later viewing sessions.
                    </p>
                    <Button variant="outline" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share Watchlist
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}