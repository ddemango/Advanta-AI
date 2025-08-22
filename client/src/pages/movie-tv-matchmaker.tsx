import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { NewHeader } from '@/components/redesign/NewHeader';
import { Helmet } from 'react-helmet';
import { 
  Film, 
  Tv, 
  Clock, 
  Star, 
  Play,
  Heart,
  Sparkles,
  ExternalLink,
  Filter as FilterIcon,
  Search,
  Calendar,
  Shield
} from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

// Storage for tracking seen content
const SEEN_KEY = 'matchmaker_seen_v1';
const SEEN_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days
type Seen = { id: number; ts: number };
const loadSeen = (): Seen[] => {
  try {
    return (JSON.parse(localStorage.getItem(SEEN_KEY) || '[]') as Seen[]).filter(
      (e) => Date.now() - e.ts < SEEN_TTL_MS
    );
  } catch {
    return [];
  }
};
const saveSeen = (arr: Seen[]) => localStorage.setItem(SEEN_KEY, JSON.stringify(arr.slice(-80)));
const markSeen = (ids: number[]) =>
  saveSeen([...loadSeen(), ...ids.map((id) => ({ id, ts: Date.now() }))]);
const filterUnseen = (items: ContentItem[], take: number) => {
  const seen = new Set(loadSeen().map((s) => s.id));
  const unseen = items.filter((i) => !seen.has(i.id));
  return (unseen.length >= take
    ? unseen
    : [...unseen, ...items.filter((i) => seen.has(i.id))]
  ).slice(0, take);
};

// Provider helpers (map names -> primary platform + deep search link)
const NAME_MAP: Record<string, string> = {
  netflix: 'netflix',
  hulu: 'hulu',
  'amazon prime video': 'prime',
  'prime video': 'prime',
  'disney+': 'disney',
  'disney plus': 'disney',
  max: 'max',
  'hbo max': 'max',
  peacock: 'peacock',
  'paramount+': 'paramount',
  'paramount plus': 'paramount',
  'apple tv+': 'apple',
  'apple tv plus': 'apple',
};

const WATCH_URL: Record<string, (t: string) => string> = {
  netflix: (t) => `https://www.netflix.com/search?q=${encodeURIComponent(t)}`,
  hulu: (t) => `https://www.hulu.com/search?q=${encodeURIComponent(t)}`,
  prime: (t) => `https://www.amazon.com/s?k=${encodeURIComponent(t)}&i=instant-video`,
  disney: (t) => `https://www.disneyplus.com/search?q=${encodeURIComponent(t)}`,
  max: (t) => `https://play.max.com/search?q=${encodeURIComponent(t)}`,
  peacock: (t) => `https://www.peacocktv.com/search?query=${encodeURIComponent(t)}`,
  paramount: (t) => `https://www.paramountplus.com/shows/?searchTerm=${encodeURIComponent(t)}`,
  apple: (t) => `https://tv.apple.com/us/search?term=${encodeURIComponent(t)}`,
};

const providerKeys = (item: ContentItem) => {
  const names = [
    ...(item.providers?.flatrate || []),
    ...(item.providers?.ads || []),
    ...(item.providers?.rent || []),
    ...(item.providers?.buy || []),
  ].map((n) => n.toLowerCase());
  const keys = new Set<string>();
  for (const n of names) {
    for (const k in NAME_MAP) {
      if (n.includes(k)) keys.add(NAME_MAP[k]);
    }
  }
  return Array.from(keys);
};

// Service options mapping
const STREAMING_SERVICES = [
  { key: 'netflix', name: 'Netflix', color: 'bg-red-600' },
  { key: 'hulu', name: 'Hulu', color: 'bg-green-600' },
  { key: 'prime', name: 'Prime Video', color: 'bg-blue-600' },
  { key: 'disney', name: 'Disney+', color: 'bg-blue-700' },
  { key: 'max', name: 'Max (HBO)', color: 'bg-purple-600' },
  { key: 'peacock', name: 'Peacock', color: 'bg-yellow-600' },
  { key: 'paramount', name: 'Paramount+', color: 'bg-blue-800' },
  { key: 'apple', name: 'Apple TV+', color: 'bg-gray-800' }
];

const MOOD_OPTIONS = [
  { key: 'cozy', name: 'Cozy', icon: '🏠', description: 'Warm and comfortable vibes' },
  { key: 'light', name: 'Light', icon: '☀️', description: 'Fun and easy-going' },
  { key: 'intense', name: 'Intense', icon: '⚡', description: 'High stakes and thrilling' },
  { key: 'smart', name: 'Smart', icon: '🧠', description: 'Thought-provoking content' },
  { key: 'gritty', name: 'Gritty', icon: '🌑', description: 'Raw and realistic' },
  { key: 'comfort', name: 'Comfort', icon: '🤗', description: 'Familiar and soothing' },
  { key: 'high_energy', name: 'High Energy', icon: '🚀', description: 'Action-packed excitement' },
  { key: 'low_energy', name: 'Low Energy', icon: '😌', description: 'Calm and relaxing' },
  { key: 'multitask', name: 'Multitask', icon: '📱', description: 'Background-friendly' },
  { key: 'focus', name: 'Focus', icon: '🎯', description: 'Demands full attention' }
];

const CONTENT_TYPES = [
  { key: 'movie', name: 'Movies', icon: Film },
  { key: 'tv', name: 'TV Shows', icon: Tv }
];

// TMDb genre keys → { movie, tv } IDs
const GENRE_OPTIONS = [
  { key: 'action',       name: 'Action',        ids: { movie: 28,    tv: 10759 } },
  { key: 'adventure',    name: 'Adventure',     ids: { movie: 12,    tv: 10759 } },
  { key: 'animation',    name: 'Animation',     ids: { movie: 16,    tv: 16 } },
  { key: 'comedy',       name: 'Comedy',        ids: { movie: 35,    tv: 35 } },
  { key: 'crime',        name: 'Crime',         ids: { movie: 80,    tv: 80 } },
  { key: 'documentary',  name: 'Documentary',   ids: { movie: 99,    tv: 99 } },
  { key: 'drama',        name: 'Drama',         ids: { movie: 18,    tv: 18 } },
  { key: 'family',       name: 'Family',        ids: { movie: 10751, tv: 10751 } },
  { key: 'fantasy',      name: 'Fantasy',       ids: { movie: 14,    tv: 10765 } },
  { key: 'history',      name: 'History',       ids: { movie: 36,    tv: null as any } },
  { key: 'horror',       name: 'Horror',        ids: { movie: 27,    tv: null as any } }, // TV doesn't have a Horror genre
  { key: 'music',        name: 'Music',         ids: { movie: 10402, tv: null as any } },
  { key: 'mystery',      name: 'Mystery',       ids: { movie: 9648,  tv: 9648 } },
  { key: 'romance',      name: 'Romance',       ids: { movie: 10749, tv: null as any } },
  { key: 'scifi',        name: 'Sci-Fi',        ids: { movie: 878,   tv: 10765 } },
  { key: 'thriller',     name: 'Thriller',      ids: { movie: 53,    tv: 9648 } },
  { key: 'war',          name: 'War',           ids: { movie: 10752, tv: 10768 } },
  { key: 'western',      name: 'Western',       ids: { movie: 37,    tv: 37 } },
  // Not a first-class TMDb genre, so we'll keyword/fallback filter on the server:
  { key: 'sports',       name: 'Sports',        ids: { movie: null as any, tv: null as any } },
];

const ALL_GENRE_KEYS = GENRE_OPTIONS.map(g => g.key);

interface ContentItem {
  id: number;
  media_type: 'movie' | 'tv';
  title: string;
  year?: number;
  runtime?: number;
  overview: string;
  poster_url?: string;
  tmdb_url?: string;
  certification?: string; // Add certification field
  providers?: {
    flatrate?: string[];
    ads?: string[];
    rent?: string[];
    buy?: string[];
  };
  popularity?: number;
  genres?: number[];
  match_score?: number;
  explanation?: string;
}

type Rating = 'PG' | 'PG-13' | 'R' | 'NR';

interface MatchmakerState {
  services: string[];
  moods: string[];
  contentTypes: string[];
  timeWindow: number;
  genres: string[];
  language: string;
  ageRating: string[];
  ratings: Rating[];
  yearRange: [number, number];
}

export default function MovieTVMatchmaker() {
  const CURRENT_YEAR = new Date().getFullYear();
  const [preferences, setPreferences] = useState<MatchmakerState>({
    services: ['netflix'],
    moods: ['cozy'],
    contentTypes: ['movie', 'tv'],
    timeWindow: 120,
    language: 'en-US',
    ageRating: [],
    genres: [],
    ratings: ['PG', 'PG-13', 'R'],
    yearRange: [2000, CURRENT_YEAR]
  });

  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const retrieveResponse = await fetch('/api/matchmaker/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: preferences.services,
          timeWindow: preferences.timeWindow,
          languages: [preferences.language],
          mediaTypes: preferences.contentTypes,
          genres: preferences.genres,
          yearFrom: preferences.yearRange[0],
          yearTo: preferences.yearRange[1],
          ratings: preferences.ratings,
          count: 160
        })
      });
      const retrieveJson = await safeJson(retrieveResponse);
      if (!retrieveResponse.ok) throw new Error(retrieveJson?.error || `retrieve ${retrieveResponse.status}`);
      const candidates: ContentItem[] = retrieveJson.items || [];

      const rerankResponse = await fetch('/api/matchmaker/rerank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidates, moods: preferences.moods, timeWindow: preferences.timeWindow })
      });
      const rerankJson = await safeJson(rerankResponse);
      if (!rerankResponse.ok) throw new Error(rerankJson?.error || `rerank ${rerankResponse.status}`);

      const ranked: ContentItem[] = rerankJson.items || [];
      // Apply client-side filtering for year range and ratings
      const clientFiltered = clientFilter(ranked);
      const five = filterUnseen(clientFiltered.length > 0 ? clientFiltered : ranked, 5);
      markSeen(five.map(i => i.id));

      const withReasons = await Promise.all(five.map(async (item) => {
        const ex = await fetch('/api/matchmaker/explain', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item, moods: preferences.moods, timeWindow: preferences.timeWindow })
        });
        const exJson = await safeJson(ex);
        return ex.ok && exJson?.reason ? { ...item, explanation: exJson.reason } : item;
      }));

      setRecommendations(withReasons);
      setShowResults(true);
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  async function safeJson(r: Response) {
    try { return await r.json(); } catch { return null; }
  }

  const updatePreference = <K extends keyof MatchmakerState>(
    key: K,
    value: MatchmakerState[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = <T,>(array: T[], item: T): T[] => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const isAllGenresSelected = (list: string[]) => ALL_GENRE_KEYS.every(k => list.includes(k));
  const toggleAllGenres = () => {
    updatePreference('genres', isAllGenresSelected(preferences.genres) ? [] : ALL_GENRE_KEYS);
  };

  const ALL_RATINGS: Rating[] = ['PG', 'PG-13', 'R', 'NR'];
  const ratingChecked = (r: Rating) => preferences.ratings.includes(r);
  const toggleRating = (r: Rating) => {
    const has = ratingChecked(r);
    const next = has ? preferences.ratings.filter(x => x !== r) : [...preferences.ratings, r];
    updatePreference('ratings', next);
  };

  // Client-side filtering function
  const clientFilter = (items: ContentItem[]) => {
    const [from, to] = preferences.yearRange;
    return items.filter(x => {
      const y = Number(x.year || 0);
      const inYear = y >= from && y <= to;
      
      // For now, we'll assume all content is suitable (would need TMDB certification data for real filtering)
      const inRating = preferences.ratings.length > 0;
      
      return inYear && inRating;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Movies & TV Shows Matchmaker - AI-Powered Recommendations | Advanta AI</title>
        <meta name="description" content="Find your perfect movie or TV show match with AI-powered recommendations based on your mood, available time, and streaming services." />
        <meta property="og:title" content="Movies & TV Shows Matchmaker - AI-Powered Recommendations" />
        <meta property="og:description" content="Discover personalized entertainment recommendations tailored to your preferences and viewing time." />
        <meta property="og:type" content="website" />
      </Helmet>
      <NewHeader />
      
      {/* Hero Section */}
      <section className="pt-16 pb-6 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Matchmaker
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Movies & TV Shows
                <span className="block text-primary">Perfect Match Finder</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get personalized recommendations based on your mood, available time, and streaming services
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >


        {!showResults ? (
          /* Preference Selection */
          (<motion.div variants={fadeIn} className="max-w-4xl mx-auto space-y-8">
            {/* Streaming Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Streaming Services
                </CardTitle>
                <CardDescription>Which platforms do you have access to?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {STREAMING_SERVICES.map(service => (
                    <motion.div
                      key={service.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <label className="flex items-center space-x-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <Checkbox
                          checked={preferences.services.includes(service.key)}
                          onCheckedChange={() => 
                            updatePreference('services', toggleArrayItem(preferences.services, service.key))
                          }
                        />
                        <div className={`w-3 h-3 rounded-full ${service.color}`} />
                        <span className="text-sm font-medium">{service.name}</span>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Mood Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Current Mood
                </CardTitle>
                <CardDescription>What vibe are you going for? (Select multiple)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {MOOD_OPTIONS.map(mood => (
                    <motion.div
                      key={mood.key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <label className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        preferences.moods.includes(mood.key)
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-muted/50 hover:border-primary/50'
                      }`}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={preferences.moods.includes(mood.key)}
                          onChange={() => 
                            updatePreference('moods', toggleArrayItem(preferences.moods, mood.key))
                          }
                        />
                        <span className="text-2xl mb-2">{mood.icon}</span>
                        <span className="font-medium text-sm">{mood.name}</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">{mood.description}</span>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Genres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Genres
                </CardTitle>
                <CardDescription>Filter by one or more genres</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {/* ALL GENRES */}
                  <label className="flex items-center space-x-3 p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer">
                    <Checkbox checked={isAllGenresSelected(preferences.genres)} onCheckedChange={toggleAllGenres} />
                    <span className="text-sm font-medium">All Genres</span>
                  </label>
                  {/* INDIVIDUAL GENRES */}
                  {GENRE_OPTIONS.map(g => (
                    <label key={g.key} className="flex items-center space-x-3 p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer">
                      <Checkbox
                        checked={preferences.genres.includes(g.key)}
                        onCheckedChange={() => updatePreference('genres', toggleArrayItem(preferences.genres, g.key))}
                      />
                      <span className="text-sm font-medium">{g.name}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Rating and Year Filters */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* MPAA Rating */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    MPAA Rating
                  </CardTitle>
                  <CardDescription>Filter by content rating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {ALL_RATINGS.map(r => (
                        <label key={r} className="inline-flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={ratingChecked(r)}
                            onCheckedChange={() => toggleRating(r)}
                            aria-label={`Filter ${r}`}
                          />
                          <span className="text-sm">{r}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        onClick={() => updatePreference('ratings', ALL_RATINGS)}
                        className="cursor-pointer text-xs"
                      >
                        All
                      </Badge>
                      <Badge
                        onClick={() => updatePreference('ratings', [])}
                        className="cursor-pointer text-xs"
                        variant="secondary"
                      >
                        None
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Year Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Release Years
                  </CardTitle>
                  <CardDescription>
                    {preferences.yearRange[0]}–{preferences.yearRange[1]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      min={1960}
                      max={CURRENT_YEAR}
                      step={1}
                      value={[preferences.yearRange[0], preferences.yearRange[1]]}
                      onValueChange={([a, b]) => updatePreference('yearRange', [Math.min(a, b), Math.max(a, b)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1960</span>
                      <span>{CURRENT_YEAR}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Content Type & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary" />
                    Content Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {CONTENT_TYPES.map(type => (
                      <label key={type.key} className="flex items-center space-x-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                        <Checkbox
                          checked={preferences.contentTypes.includes(type.key)}
                          onCheckedChange={() => 
                            updatePreference('contentTypes', toggleArrayItem(preferences.contentTypes, type.key))
                          }
                        />
                        <type.icon className="h-4 w-4" />
                        <span className="font-medium">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Available Time
                  </CardTitle>
                  <CardDescription>How much time do you have? ({preferences.timeWindow} minutes)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[preferences.timeWindow]}
                      onValueChange={([value]) => updatePreference('timeWindow', value)}
                      min={30}
                      max={300}
                      step={15}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>30 min</span>
                      <span>2.5 hours</span>
                      <span>5 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Generate Button */}
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleGenerateRecommendations}
                disabled={isLoading || preferences.services.length === 0 || preferences.moods.length === 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Finding Your Perfect Match...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Get My Recommendations
                  </>
                )}
              </Button>
            </motion.div>
            {error && (
              <motion.div 
                variants={fadeIn}
                className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 text-center"
              >
                <p className="text-destructive">{error}</p>
              </motion.div>
            )}
          </motion.div>)
        ) : (
          /* Results Section */
          (<motion.div variants={fadeIn} className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Perfect Matches</h2>
                <p className="text-muted-foreground">
                  Based on your {preferences.moods.map(m => MOOD_OPTIONS.find(o => o.key === m)?.name).join(', ')} mood
                </p>
              </div>
              <Button
                onClick={() => setShowResults(false)}
                variant="outline"
              >
                <FilterIcon className="mr-2 h-4 w-4" />
                Adjust Preferences
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {recommendations.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group"
                >
                  <Card className="overflow-hidden h-full hover:border-primary/30 transition-all duration-300">
                    <div className="aspect-[2/3] relative overflow-hidden">
                      {item.poster_url ? (
                        <img
                          src={item.poster_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Film className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="h-3 w-3 mr-1" />
                          {item.match_score || 85}%
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary">
                          {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                      {item.year && (
                        <p className="text-muted-foreground text-sm mb-2">{item.year}</p>
                      )}
                      {item.runtime && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                          <Clock className="h-3 w-3" />
                          {item.runtime} min
                        </div>
                      )}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{item.overview}</p>
                      {item.explanation && (
                        <p className="text-primary text-xs italic mb-3">"{item.explanation}"</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {providerKeys(item).map(p => (
                          <Badge key={p} variant="secondary">{p}</Badge>
                        ))}
                      </div>
                      {(() => {
                        const prefFirst = providerKeys(item).find(p => preferences.services.includes(p)) || providerKeys(item)[0];
                        return prefFirst ? (
                          <Button asChild className="w-full bg-primary hover:bg-primary/90" size="sm">
                            <a href={WATCH_URL[prefFirst](item.title)} target="_blank" rel="noopener noreferrer">
                              Open on {prefFirst}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        ) : item.tmdb_url ? (
                          <Button 
                            asChild
                            className="w-full bg-primary hover:bg-primary/90"
                            size="sm"
                          >
                            <a href={item.tmdb_url} target="_blank" rel="noopener noreferrer">
                              View Details
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        ) : null;
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {recommendations.length === 0 && (
              <Card className="bg-neutral-900/50 border-white/10 p-8 text-center">
                <Film className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No matches found</h3>
                <p className="text-neutral-400 mb-4">
                  Try adjusting your preferences or selecting more streaming services.
                </p>
                <Button onClick={() => setShowResults(false)} className="bg-purple-600 hover:bg-purple-700">
                  Adjust Preferences
                </Button>
              </Card>
            )}
          </motion.div>)
        )}
      </motion.div>
    </div>
  );
}