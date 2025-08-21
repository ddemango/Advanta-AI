import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { NewHeader } from '@/components/redesign/NewHeader';
import { Helmet } from 'react-helmet';
import { 
  Film, 
  Tv, 
  Clock, 
  Search, 
  Star, 
  Play,
  Heart,
  Zap,
  Sparkles,
  ChevronRight,
  Filter,
  Calendar,
  Users,
  Download
} from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/animations';

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

interface ContentItem {
  id: number;
  media_type: 'movie' | 'tv';
  title: string;
  year?: number;
  runtime?: number;
  overview: string;
  poster_url?: string;
  tmdb_url?: string;
  providers?: {
    flatrate?: string[];
    ads?: string[];
    rent?: string[];
    buy?: string[];
  };
  popularity?: number;
  genres?: string[];
  match_score?: number;
  explanation?: string;
}

interface MatchmakerState {
  services: string[];
  moods: string[];
  contentTypes: string[];
  timeWindow: number;
  language: string;
  ageRating: string[];
}

export default function MovieTVMatchmaker() {
  const [preferences, setPreferences] = useState<MatchmakerState>({
    services: ['netflix'],
    moods: ['cozy'],
    contentTypes: ['movie', 'tv'],
    timeWindow: 120,
    language: 'en-US',
    ageRating: []
  });

  const [recommendations, setRecommendations] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleGenerateRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, retrieve candidates based on preferences
      const retrieveResponse = await fetch('/api/matchmaker/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: preferences.services,
          timeWindow: preferences.timeWindow,
          languages: [preferences.language],
          ageRatings: preferences.ageRating,
          mediaTypes: preferences.contentTypes,
          count: 50
        })
      });

      if (!retrieveResponse.ok) {
        throw new Error('Failed to retrieve content suggestions');
      }

      const candidates = await retrieveResponse.json();

      // Then rerank based on mood preferences
      const rerankResponse = await fetch('/api/matchmaker/rerank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidates: candidates.items || [],
          moods: preferences.moods,
          timeWindow: preferences.timeWindow
        })
      });

      if (!rerankResponse.ok) {
        throw new Error('Failed to rank recommendations');
      }

      const rankedResults = await rerankResponse.json();
      
      // Get explanations for top results
      const resultsWithExplanations = await Promise.all(
        rankedResults.items.slice(0, 8).map(async (item: ContentItem) => {
          try {
            const explainResponse = await fetch('/api/matchmaker/explain', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                item,
                moods: preferences.moods,
                timeWindow: preferences.timeWindow
              })
            });
            
            if (explainResponse.ok) {
              const explanation = await explainResponse.json();
              return { ...item, explanation: explanation.reason };
            }
          } catch (err) {
            console.warn('Failed to get explanation for:', item.title);
          }
          return item;
        })
      );

      setRecommendations(resultsWithExplanations);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <Helmet>
        <title>Movies & TV Shows Matchmaker - AI-Powered Recommendations | Advanta AI</title>
        <meta name="description" content="Find your perfect movie or TV show match with AI-powered recommendations based on your mood, available time, and streaming services." />
        <meta property="og:title" content="Movies & TV Shows Matchmaker - AI-Powered Recommendations" />
        <meta property="og:description" content="Discover personalized entertainment recommendations tailored to your preferences and viewing time." />
        <meta property="og:type" content="website" />
      </Helmet>

      <NewHeader />

      <motion.div 
        className="container mx-auto px-4 py-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Hero Section */}
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Movies & TV Matchmaker
            </h1>
          </div>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            AI-powered recommendations that match your mood, available time, and streaming services
          </p>
        </motion.div>

        {!showResults ? (
          /* Preference Selection */
          <motion.div variants={fadeIn} className="max-w-4xl mx-auto space-y-8">
            {/* Streaming Services */}
            <Card className="bg-neutral-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-purple-400" />
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
                      <label className="flex items-center space-x-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer">
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
            <Card className="bg-neutral-900/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-400" />
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
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-neutral-800/30 hover:border-white/20'
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
                        <span className="text-xs text-neutral-400 text-center mt-1">{mood.description}</span>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Type & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-neutral-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Film className="h-5 w-5 text-blue-400" />
                    Content Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {CONTENT_TYPES.map(type => (
                      <label key={type.key} className="flex items-center space-x-3 p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer">
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

              <Card className="bg-neutral-900/50 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-400" />
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
                    <div className="flex justify-between text-sm text-neutral-400">
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
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl"
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
                className="bg-red-900/20 border border-red-500/20 rounded-xl p-4 text-center"
              >
                <p className="text-red-400">{error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Results Section */
          <motion.div variants={fadeIn} className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Perfect Matches</h2>
                <p className="text-neutral-400">
                  Based on your {preferences.moods.map(m => MOOD_OPTIONS.find(o => o.key === m)?.name).join(', ')} mood
                </p>
              </div>
              <Button
                onClick={() => setShowResults(false)}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <Filter className="mr-2 h-4 w-4" />
                Adjust Preferences
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  custom={index}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="group"
                >
                  <Card className="bg-neutral-900/50 border-white/10 overflow-hidden h-full hover:border-purple-500/30 transition-all duration-300">
                    <div className="aspect-[2/3] relative overflow-hidden">
                      {item.poster_url ? (
                        <img
                          src={item.poster_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                          <Film className="h-12 w-12 text-neutral-600" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-purple-600 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          {item.match_score || 85}%
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                      {item.year && (
                        <p className="text-neutral-400 text-sm mb-2">{item.year}</p>
                      )}
                      {item.runtime && (
                        <div className="flex items-center gap-1 text-neutral-400 text-sm mb-3">
                          <Clock className="h-3 w-3" />
                          {item.runtime} min
                        </div>
                      )}
                      <p className="text-neutral-300 text-sm mb-4 line-clamp-3">{item.overview}</p>
                      {item.explanation && (
                        <p className="text-purple-300 text-xs italic mb-3">"{item.explanation}"</p>
                      )}
                      {item.tmdb_url && (
                        <Button 
                          asChild
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          size="sm"
                        >
                          <a href={item.tmdb_url} target="_blank" rel="noopener noreferrer">
                            View Details
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}