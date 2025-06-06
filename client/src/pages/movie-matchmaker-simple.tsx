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

interface ContentRecommendation {
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
  contentType: 'movie' | 'tv_show';
  seasons?: number; // For TV shows
  episodes?: number; // For TV shows
}

interface WatchlistResponse {
  mood: string;
  preferences: any;
  recommendations: ContentRecommendation[];
  totalMatches: number;
  personalizedMessage: string;
}

export default function MovieMatchmaker() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [watchlist, setWatchlist] = useState<WatchlistResponse | null>(null);
  
  // Form state
  const [mood, setMood] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>(['movies']); // movies, tv_shows, or both
  const [genres, setGenres] = useState<string[]>([]);
  const [timeAvailable, setTimeAvailable] = useState([120]); // minutes
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [viewingContext, setViewingContext] = useState('');
  const [pastFavorites, setPastFavorites] = useState('');
  const [includeWildCard, setIncludeWildCard] = useState(false);
  const [releaseYearRange, setReleaseYearRange] = useState([2000, 2024]);

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

  const contentTypeOptions = [
    { value: 'movies', label: 'Movies', icon: Film },
    { value: 'tv_shows', label: 'TV Shows', icon: Tv },
  ];

  const viewingContexts = [
    { value: 'solo', label: 'Solo Viewing' },
    { value: 'date', label: 'Date Night' },
    { value: 'family', label: 'Family Time' },
    { value: 'friends', label: 'With Friends' },
    { value: 'party', label: 'Party/Group' }
  ];

  const handleContentTypeToggle = (contentType: string) => {
    setContentTypes(prev => 
      prev.includes(contentType) 
        ? prev.filter(ct => ct !== contentType)
        : [...prev, contentType]
    );
  };

  const handleGenreToggle = (genre: string) => {
    setGenres(prev => {
      const newGenres = prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre];
      console.log('Genre toggled:', genre, 'New genres:', newGenres);
      return newGenres;
    });
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
        contentTypes,
        genres,
        timeAvailable: timeAvailable[0],
        platforms,
        viewingContext,
        pastFavorites,
        includeWildCard,
        releaseYearRange
      });
      
      const watchlistData = await response.json();
      setWatchlist(watchlistData);
      
      // Scroll to top of page to show watchlist
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
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
        <title>Movie and TV Show Matchmaker - AI-Powered Watchlist Generator | Advanta AI</title>
        <meta name="description" content="Get personalized movie and TV show recommendations based on your mood, preferences, and viewing context. AI-powered watchlist generator for Netflix, Hulu, and more." />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
              <Film className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Movie and TV Show Matchmaker
              </h1>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              AI-powered watchlist generator that matches your mood, preferences, and viewing context 
              to find the perfect movie or TV show for any moment.
            </p>
          </div>

          {!watchlist ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Preferences Form */}
              <Card className="mx-2 sm:mx-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Heart className="h-5 w-5" />
                    Tell Us Your Mood & Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  {/* Content Type Selection - FIRST QUESTION */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base font-semibold block">What would you like to watch?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {contentTypeOptions.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <Button
                            key={type.value}
                            variant={contentTypes.includes(type.value) ? "default" : "outline"}
                            onClick={() => handleContentTypeToggle(type.value)}
                            className="justify-start h-auto p-3 text-sm sm:text-base"
                          >
                            <IconComponent className="mr-2 h-4 w-4" />
                            {type.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mood Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base font-semibold block">What's your mood?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {moods.map((m) => (
                        <Button
                          key={m.value}
                          variant={mood === m.value ? "default" : "outline"}
                          onClick={() => setMood(m.value)}
                          className="justify-start h-auto p-3 text-sm sm:text-base"
                        >
                          <span className="mr-2">{m.icon}</span>
                          {m.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time Available */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base font-semibold block">
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
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>30min</span>
                      <span>2h</span>
                      <span>5h+</span>
                    </div>
                  </div>

                  {/* Viewing Context */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base font-semibold block">Watching with?</Label>
                    <Select value={viewingContext} onValueChange={setViewingContext}>
                      <SelectTrigger className="h-12">
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
                  <div className="space-y-3">
                    <Label htmlFor="favorites" className="text-sm sm:text-base font-semibold block">
                      Recent Favorites (Optional)
                    </Label>
                    <Input
                      id="favorites"
                      placeholder="e.g., Inception, The Office, Stranger Things..."
                      value={pastFavorites}
                      onChange={(e) => setPastFavorites(e.target.value)}
                    />
                  </div>

                  {/* Release Year Range */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base font-semibold block">
                      Release Year Range: {releaseYearRange[0]} - {releaseYearRange[1]}
                    </Label>
                    <Slider
                      value={releaseYearRange}
                      onValueChange={setReleaseYearRange}
                      max={2024}
                      min={1980}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1980</span>
                      <span>2000</span>
                      <span>2024</span>
                    </div>
                  </div>

                  {/* Wild Card Option */}
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="wildcard"
                      checked={includeWildCard}
                      onCheckedChange={(checked) => setIncludeWildCard(checked === true)}
                    />
                    <Label htmlFor="wildcard" className="text-sm sm:text-base cursor-pointer">
                      Include a wild card surprise recommendation
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Genre & Platform Selection */}
              <Card className="mx-2 sm:mx-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Tv className="h-5 w-5" />
                    Genres & Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  {/* Genres */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base font-semibold block">Preferred Genres</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {genreOptions.map((genre) => {
                        const isSelected = genres.includes(genre);
                        console.log(`Genre ${genre} is selected:`, isSelected);
                        return (
                          <Button
                            key={genre}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleGenreToggle(genre)}
                            className="text-xs sm:text-sm h-9 sm:h-10"
                          >
                            {genre}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="space-y-3">
                    <Label className="text-sm sm:text-base font-semibold block">Available Platforms</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {platformOptions.map((platform) => (
                        <Button
                          key={platform}
                          variant={platforms.includes(platform) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePlatformToggle(platform)}
                          className="text-xs sm:text-sm h-9 sm:h-10"
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
                    className="w-full h-12 sm:h-14 text-sm sm:text-lg"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span className="hidden sm:inline">Generating Your Perfect Watchlist...</span>
                        <span className="sm:hidden">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Generate My Watchlist</span>
                        <span className="sm:hidden">Generate Watchlist</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Watchlist Results */
            <div className="space-y-6 sm:space-y-8">
              {/* Results Header */}
              <Card className="mx-2 sm:mx-0">
                <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Your Personalized Watchlist</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 px-2">{watchlist.personalizedMessage}</p>
                    <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
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
                      className="mt-4 text-sm sm:text-base"
                    >
                      Generate New Watchlist
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
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
                          movie.contentType === 'tv_show' ? (
                            <Tv className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                          ) : (
                            <Film className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                          )
                        )}
                      </div>
                      
                      {/* Movie Details */}
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div>
                          <h3 className="font-bold text-base sm:text-lg leading-tight">{movie.title}</h3>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                            <span>{movie.year}</span>
                            <span>•</span>
                            {movie.contentType === 'tv_show' ? (
                              <>
                                <span className="hidden sm:inline">{movie.seasons} seasons</span>
                                <span className="sm:hidden">{movie.seasons}s</span>
                                <span>•</span>
                                <span className="hidden sm:inline">{movie.episodes} episodes</span>
                                <span className="sm:hidden">{movie.episodes}ep</span>
                                <span>•</span>
                                <span>{formatRuntime(movie.runtime)}/ep</span>
                              </>
                            ) : (
                              <span>{formatRuntime(movie.runtime)}</span>
                            )}
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

                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
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

                        {movie.trailerUrl && (
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1 text-xs sm:text-sm">
                              <Play className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Watch Trailer</span>
                              <span className="sm:hidden">Trailer</span>
                            </Button>
                          </div>
                        )}
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