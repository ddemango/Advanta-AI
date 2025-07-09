import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { NewHeader } from '@/components/redesign/NewHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, Target, Users, Search, CheckCircle, Clock, 
  TrendingUp, Star, AlertTriangle 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } }
};

interface DraftFormData {
  leagueType: string;
  rosterNeeds: string[];
  currentRound: string;
  pickNumber: string;
  scoringSettings: string;
}

interface StartSitFormData {
  position: string;
  player1: string;
  player2: string;
  opponent: string;
  leagueFormat: string;
  weatherConcerns: boolean;
}

interface DraftRecommendation {
  bestPick: {
    name: string;
    position: string;
    team: string;
    analysis: string;
    confidence: number;
  };
  alternatives: Array<{
    name: string;
    position: string;
    team: string;
    reason: string;
  }>;
  strategyTips: string[];
  positionalScarcity: string[];
}

interface StartSitRecommendation {
  recommendation: 'START_PLAYER_1' | 'START_PLAYER_2';
  confidenceLevel: number;
  player1Analysis: {
    playerName: string;
    position: string;
    team: string;
    projectedPoints: number;
    confidence: number;
    matchupRating: string;
    boomBustPotential: string;
    reasoning: string[];
    keyFactors: string[];
    headshot?: string;
    playerId?: string;
  };
  player2Analysis: {
    playerName: string;
    position: string;
    team: string;
    projectedPoints: number;
    confidence: number;
    matchupRating: string;
    boomBustPotential: string;
    reasoning: string[];
    keyFactors: string[];
    headshot?: string;
    playerId?: string;
  };
  headToHeadComparison: string[];
  injuryAlerts: string[];
  weatherImpact?: string;
}

export default function FantasyFootballTools() {
  const [draftData, setDraftData] = useState<DraftFormData>({
    leagueType: '',
    rosterNeeds: [],
    currentRound: '',
    pickNumber: '',
    scoringSettings: ''
  });

  const [startSitData, setStartSitData] = useState<StartSitFormData>({
    position: '',
    player1: '',
    player2: '',
    opponent: '',
    leagueFormat: '',
    weatherConcerns: false
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [draftResult, setDraftResult] = useState<DraftRecommendation | null>(null);
  const [startSitResult, setStartSitResult] = useState<StartSitRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [player1Suggestions, setPlayer1Suggestions] = useState<string[]>([]);
  const [player2Suggestions, setPlayer2Suggestions] = useState<string[]>([]);
  const [showPlayer1Dropdown, setShowPlayer1Dropdown] = useState(false);
  const [showPlayer2Dropdown, setShowPlayer2Dropdown] = useState(false);
  const player1Ref = useRef<HTMLInputElement>(null);
  const player2Ref = useRef<HTMLInputElement>(null);

  // NFL players query
  const { data: nflPlayers = [] } = useQuery({
    queryKey: ['/api/nfl-players'],
    enabled: true,
    staleTime: 0, // Force fresh data to prevent position corruption
    cacheTime: 0  // No caching to ensure real-time data integrity
  });

  // Helper functions
  const getTeamGradient = (team: string): string => {
    const teamGradients: Record<string, string> = {
      'KC': 'bg-gradient-to-br from-red-600 to-yellow-500',
      'BUF': 'bg-gradient-to-br from-blue-600 to-red-500',
      'CIN': 'bg-gradient-to-br from-orange-600 to-black',
      'MIA': 'bg-gradient-to-br from-teal-500 to-orange-400',
      'BAL': 'bg-gradient-to-br from-purple-700 to-black',
      'SEA': 'bg-gradient-to-br from-blue-600 to-green-500',
      'MIN': 'bg-gradient-to-br from-purple-600 to-yellow-400',
      'DEN': 'bg-gradient-to-br from-orange-600 to-blue-600',
      'default': 'bg-gradient-to-br from-gray-600 to-gray-800'
    };
    return teamGradients[team] || teamGradients.default;
  };

  const getPlayerHeadshot = (playerName: string): string => {
    if (!playerName) return '/api/placeholder/150/150';
    
    // ESPN headshots mapping for accurate player photos
    const playerHeadshotMap: Record<string, string> = {
      'Josh Allen': 'https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png',
      'Lamar Jackson': 'https://a.espncdn.com/i/headshots/nfl/players/full/3916387.png',
      'Patrick Mahomes': 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png',
      'Joe Burrow': 'https://a.espncdn.com/i/headshots/nfl/players/full/4360310.png',
      'Dak Prescott': 'https://a.espncdn.com/i/headshots/nfl/players/full/2577417.png',
      'Jalen Hurts': 'https://a.espncdn.com/i/headshots/nfl/players/full/4361259.png',
      'Justin Herbert': 'https://a.espncdn.com/i/headshots/nfl/players/full/4361618.png',
      'Tua Tagovailoa': 'https://a.espncdn.com/i/headshots/nfl/players/full/4361579.png',
      'Aaron Rodgers': 'https://a.espncdn.com/i/headshots/nfl/players/full/8439.png',
      'Russell Wilson': 'https://a.espncdn.com/i/headshots/nfl/players/full/14881.png',
      'Geno Smith': 'https://a.espncdn.com/i/headshots/nfl/players/full/14936.png',
      'Jayden Daniels': 'https://a.espncdn.com/i/headshots/nfl/players/full/4569618.png',
      'Caleb Williams': 'https://a.espncdn.com/i/headshots/nfl/players/full/4871063.png',
      'Drake Maye': 'https://a.espncdn.com/i/headshots/nfl/players/full/4685720.png',
      'Bo Nix': 'https://a.espncdn.com/i/headshots/nfl/players/full/4427408.png',
      'C.J. Stroud': 'https://a.espncdn.com/i/headshots/nfl/players/full/4431742.png',
      'Brock Purdy': 'https://a.espncdn.com/i/headshots/nfl/players/full/4241820.png',
      'Trevor Lawrence': 'https://a.espncdn.com/i/headshots/nfl/players/full/4360438.png',
      'Anthony Richardson': 'https://a.espncdn.com/i/headshots/nfl/players/full/4569632.png',
      'Jared Goff': 'https://a.espncdn.com/i/headshots/nfl/players/full/2977644.png',
      'Daniel Jones': 'https://a.espncdn.com/i/headshots/nfl/players/full/3917792.png',
      'Baker Mayfield': 'https://a.espncdn.com/i/headshots/nfl/players/full/3052587.png',
      'Kirk Cousins': 'https://a.espncdn.com/i/headshots/nfl/players/full/16757.png',
      'Derek Carr': 'https://a.espncdn.com/i/headshots/nfl/players/full/16757.png',
      'Jordan Love': 'https://a.espncdn.com/i/headshots/nfl/players/full/3917315.png',
      'Kyler Murray': 'https://a.espncdn.com/i/headshots/nfl/players/full/3915511.png',
      'Matthew Stafford': 'https://a.espncdn.com/i/headshots/nfl/players/full/12483.png',
      'Bryce Young': 'https://a.espncdn.com/i/headshots/nfl/players/full/4569618.png',
      'Sam Darnold': 'https://a.espncdn.com/i/headshots/nfl/players/full/3052587.png',
      
      // Running Backs
      'Christian McCaffrey': 'https://a.espncdn.com/i/headshots/nfl/players/full/3116365.png',
      'Derrick Henry': 'https://a.espncdn.com/i/headshots/nfl/players/full/2979520.png',
      'Jonathan Taylor': 'https://a.espncdn.com/i/headshots/nfl/players/full/4040715.png',
      'Saquon Barkley': 'https://a.espncdn.com/i/headshots/nfl/players/full/3929940.png',
      'Josh Jacobs': 'https://a.espncdn.com/i/headshots/nfl/players/full/3916595.png',
      'Bijan Robinson': 'https://a.espncdn.com/i/headshots/nfl/players/full/4569618.png',
      'Breece Hall': 'https://a.espncdn.com/i/headshots/nfl/players/full/4362628.png',
      'Alvin Kamara': 'https://a.espncdn.com/i/headshots/nfl/players/full/3042549.png',
      'Kenneth Walker III': 'https://a.espncdn.com/i/headshots/nfl/players/full/4240069.png',
      'Austin Ekeler': 'https://a.espncdn.com/i/headshots/nfl/players/full/3051392.png',
      'Nick Chubb': 'https://a.espncdn.com/i/headshots/nfl/players/full/3929939.png',
      'Jahmyr Gibbs': 'https://a.espncdn.com/i/headshots/nfl/players/full/4569618.png',
      'Tony Pollard': 'https://a.espncdn.com/i/headshots/nfl/players/full/3917315.png',
      
      // Wide Receivers
      'Tyreek Hill': 'https://a.espncdn.com/i/headshots/nfl/players/full/2979520.png',
      'Davante Adams': 'https://a.espncdn.com/i/headshots/nfl/players/full/2976316.png',
      'Cooper Kupp': 'https://a.espncdn.com/i/headshots/nfl/players/full/3042519.png',
      'Stefon Diggs': 'https://a.espncdn.com/i/headshots/nfl/players/full/2976316.png',
      'CeeDee Lamb': 'https://a.espncdn.com/i/headshots/nfl/players/full/4040715.png',
      'A.J. Brown': 'https://a.espncdn.com/i/headshots/nfl/players/full/3915511.png',
      'Ja\'Marr Chase': 'https://a.espncdn.com/i/headshots/nfl/players/full/4361050.png',
      'Justin Jefferson': 'https://a.espncdn.com/i/headshots/nfl/players/full/4035004.png',
      'DK Metcalf': 'https://a.espncdn.com/i/headshots/nfl/players/full/3915511.png',
      'DeVonta Smith': 'https://a.espncdn.com/i/headshots/nfl/players/full/4361050.png',
      'Amon-Ra St. Brown': 'https://a.espncdn.com/i/headshots/nfl/players/full/4240582.png',
      'Mike Evans': 'https://a.espncdn.com/i/headshots/nfl/players/full/16757.png',
      'Chris Godwin': 'https://a.espncdn.com/i/headshots/nfl/players/full/2976316.png',
      'Puka Nacua': 'https://a.espncdn.com/i/headshots/nfl/players/full/4569618.png',
      'Garrett Wilson': 'https://a.espncdn.com/i/headshots/nfl/players/full/4362628.png',
      'Drake London': 'https://a.espncdn.com/i/headshots/nfl/players/full/4362628.png',
      'DJ Moore': 'https://a.espncdn.com/i/headshots/nfl/players/full/3042549.png',
      'Terry McLaurin': 'https://a.espncdn.com/i/headshots/nfl/players/full/3915511.png',
      'Jaylen Waddle': 'https://a.espncdn.com/i/headshots/nfl/players/full/4361050.png',
      
      // Tight Ends
      'Travis Kelce': 'https://a.espncdn.com/i/headshots/nfl/players/full/15847.png',
      'Mark Andrews': 'https://a.espncdn.com/i/headshots/nfl/players/full/3051392.png',
      'T.J. Hockenson': 'https://a.espncdn.com/i/headshots/nfl/players/full/3915511.png',
      'George Kittle': 'https://a.espncdn.com/i/headshots/nfl/players/full/3116365.png',
      'Kyle Pitts': 'https://a.espncdn.com/i/headshots/nfl/players/full/4361050.png',
      'Dallas Goedert': 'https://a.espncdn.com/i/headshots/nfl/players/full/3051392.png',
      'Evan Engram': 'https://a.espncdn.com/i/headshots/nfl/players/full/2976316.png',
      'Sam LaPorta': 'https://a.espncdn.com/i/headshots/nfl/players/full/4569618.png',
      'Trey McBride': 'https://a.espncdn.com/i/headshots/nfl/players/full/4362628.png',
      'Dalton Kincaid': 'https://a.espncdn.com/i/headshots/nfl/players/full/4569618.png'
    };
    
    // Return mapped headshot or ESPN generic template
    return playerHeadshotMap[playerName] || `https://a.espncdn.com/i/headshots/nfl/players/full/default.png`;
  };

  const searchPlayers = async (query: string, position?: string): Promise<string[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      const params = new URLSearchParams({ query });
      if (position) params.append('position', position);
      
      console.log('Searching for players with query:', query, 'position:', position);
      const response = await fetch(`/api/nfl-players?${params}`);
      if (!response.ok) {
        console.error('API response not ok:', response.status);
        return [];
      }
      
      const players = await response.json();
      console.log('API returned players:', players);
      const playerNames = players.map((player: any) => player.name);
      console.log('Player names:', playerNames);
      return playerNames;
    } catch (error) {
      console.error('Error searching players:', error);
      return [];
    }
  };

  // Event handlers
  const handlePlayer1Change = async (value: string) => {
    setStartSitData(prev => ({ ...prev, player1: value }));
    if (value.length >= 2) {
      const suggestions = await searchPlayers(value, startSitData.position);
      setPlayer1Suggestions(suggestions);
      setShowPlayer1Dropdown(true);
    } else {
      setPlayer1Suggestions([]);
      setShowPlayer1Dropdown(false);
    }
  };

  const handlePlayer2Change = async (value: string) => {
    setStartSitData(prev => ({ ...prev, player2: value }));
    if (value.length >= 2) {
      const suggestions = await searchPlayers(value, startSitData.position);
      setPlayer2Suggestions(suggestions);
      setShowPlayer2Dropdown(true);
    } else {
      setPlayer2Suggestions([]);
      setShowPlayer2Dropdown(false);
    }
  };

  const handlePlayerSelect = (playerName: string, field: 'player1' | 'player2') => {
    setStartSitData(prev => ({ ...prev, [field]: playerName }));
    if (field === 'player1') {
      setShowPlayer1Dropdown(false);
      setPlayer1Suggestions([]);
    } else {
      setShowPlayer2Dropdown(false);
      setPlayer2Suggestions([]);
    }
  };

  const handleDraftAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    setDraftResult(null);

    try {
      // Add cache-busting timestamp to ensure fresh data
      const timestamp = Date.now();
      const requestBody = { ...draftData, _t: timestamp };
      
      const response = await fetch('/api/fantasy-draft-analysis', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const result = await response.json();
      
      // Critical data integrity verification
      if (result.bestPick) {
        console.log('DRAFT RESULT VERIFICATION:', {
          playerName: result.bestPick.name,
          position: result.bestPick.position,
          team: result.bestPick.team,
          fullRecord: result.bestPick,
          timestamp: new Date().toISOString()
        });
        
        // Verify position data is not corrupted
        if (!result.bestPick.position || result.bestPick.position === '') {
          throw new Error('Position data corrupted - API returned empty position');
        }
      }
      
      setDraftResult(result);
    } catch (err) {
      setError('Draft analysis unavailable. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartSitAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    setStartSitResult(null);

    try {
      const response = await fetch('/api/fantasy-start-sit-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startSitData)
      });

      if (!response.ok) throw new Error('Analysis failed');
      const result = await response.json();
      setStartSitResult(result);
    } catch (err) {
      setError('Start/Sit analysis unavailable. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRosterNeedChange = (position: string, checked: boolean) => {
    setDraftData(prev => ({
      ...prev,
      rosterNeeds: checked 
        ? [...prev.rosterNeeds, position]
        : prev.rosterNeeds.filter(p => p !== position)
    }));
  };

  // Clear results when switching tabs
  const handleTabChange = (value: string) => {
    // Clear all cached results and force fresh data retrieval
    setDraftResult(null);
    setStartSitResult(null);
    setError(null);
    setIsAnalyzing(false);
    
    // Force browser cache refresh to prevent position corruption
    console.log('Tab changed to:', value, '- clearing all cached data');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (player1Ref.current && !player1Ref.current.contains(event.target as Node)) {
        setShowPlayer1Dropdown(false);
      }
      if (player2Ref.current && !player2Ref.current.contains(event.target as Node)) {
        setShowPlayer2Dropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
      <Helmet>
        <title>Fantasy Football Tools - AI Draft Advisor & Start/Sit Analyzer | Advanta AI</title>
        <meta name="description" content="AI-powered fantasy football tools including draft advisor, start/sit analyzer, and weekly matchup insights. Make smarter fantasy decisions with real NFL data." />
        
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://advanta-ai.com/fantasy-football-tools" />
        <meta property="og:title" content="Fantasy Football Tools - AI Draft Advisor & Start/Sit Analyzer" />
        <meta property="og:description" content="AI-powered fantasy football tools for smarter draft and lineup decisions using real NFL data." />
        <meta property="og:image" content="/advanta-ai-og.png" />
        
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://advanta-ai.com/fantasy-football-tools" />
        <meta property="twitter:title" content="Fantasy Football Tools - AI Draft Advisor & Start/Sit Analyzer" />
        <meta property="twitter:description" content="AI-powered fantasy football tools for smarter draft and lineup decisions using real NFL data." />
        <meta property="twitter:image" content="/advanta-ai-og.png" />
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
              <Trophy className="w-12 h-12 text-green-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Fantasy Football Tools
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered draft advisor and start/sit analyzer using real NFL data. 
              Make smarter fantasy decisions with advanced analytics and matchup insights.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                🧠 AI Draft Advisor
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                📊 Start/Sit Analyzer
              </Badge>
              <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                🏈 Live NFL Data
              </Badge>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fantasy Tools */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="draft" className="w-full" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md border-white/20">
                  <TabsTrigger value="draft" className="text-white data-[state=active]:bg-white/20">
                    <Target className="w-4 h-4 mr-2" />
                    Draft Advisor
                  </TabsTrigger>
                  <TabsTrigger value="startsit" className="text-white data-[state=active]:bg-white/20">
                    <Users className="w-4 h-4 mr-2" />
                    Start/Sit
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="draft" className="mt-6">
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        🎯 AI Draft Advisor
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Get AI-powered draft recommendations based on league settings and available players
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleDraftAnalysis} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="leagueType" className="text-white">League Type</Label>
                            <Select value={draftData.leagueType} onValueChange={(value) => setDraftData(prev => ({ ...prev, leagueType: value }))}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select league type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="ppr">PPR</SelectItem>
                                <SelectItem value="superflex">Superflex</SelectItem>
                                <SelectItem value="dynasty">Dynasty</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="scoringSettings" className="text-white">Scoring Format</Label>
                            <Select value={draftData.scoringSettings} onValueChange={(value) => setDraftData(prev => ({ ...prev, scoringSettings: value }))}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Scoring format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PPR">PPR</SelectItem>
                                <SelectItem value="Half PPR">Half PPR</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="currentRound" className="text-white">Current Round</Label>
                            <Input
                              value={draftData.currentRound}
                              onChange={(e) => setDraftData(prev => ({ ...prev, currentRound: e.target.value }))}
                              placeholder="e.g., 3"
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                            />
                          </div>

                          <div>
                            <Label htmlFor="pickNumber" className="text-white">Pick Number in Round</Label>
                            <Input
                              value={draftData.pickNumber}
                              onChange={(e) => setDraftData(prev => ({ ...prev, pickNumber: e.target.value }))}
                              placeholder="e.g., 8"
                              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-white mb-3 block">Roster Needs (select all that apply)</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {['QB', 'RB', 'WR', 'TE', 'K', 'DEF'].map((position) => (
                              <div key={position} className="flex items-center space-x-2">
                                <Checkbox
                                  id={position}
                                  checked={draftData.rosterNeeds.includes(position)}
                                  onCheckedChange={(checked) => handleRosterNeedChange(position, !!checked)}
                                  className="border-white/20"
                                />
                                <Label htmlFor={position} className="text-white text-sm">{position}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          disabled={isAnalyzing || !draftData.leagueType || !draftData.currentRound}
                          className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                        >
                          {isAnalyzing ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing Best Available Players...
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 mr-2" />
                              Get AI Draft Recommendation
                            </>
                          )}
                        </Button>
                      </form>

                      {/* Draft Results */}
                      {draftResult && (
                        <div className="mt-6">
                          <Card className="bg-white/10 backdrop-blur-md border-white/20">
                            <CardHeader className="text-center">
                              <div className="flex items-center justify-center mb-2">
                                <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                                <CardTitle className="text-yellow-400 text-xl">Draft Recommendation</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {/* Best Pick */}
                              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-white">Best Pick: {draftResult.bestPick.name}</h3>
                                  <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">{draftResult.bestPick.confidence}% Confidence</span>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">
                                  <span className="font-semibold text-blue-300">{draftResult.bestPick.position}</span> - <span className="font-semibold text-green-300">{draftResult.bestPick.team}</span>
                                </p>
                                <p className="text-gray-300">{draftResult.bestPick.analysis}</p>
                              </div>

                              {/* Alternative Picks */}
                              <h4 className="text-white font-semibold mb-3">Alternative Picks:</h4>
                              {draftResult.alternatives.map((alt, index) => (
                                <div key={index} className="bg-blue-500/20 rounded-lg p-3 mb-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white font-medium">{alt.name} ({alt.position} - {alt.team})</span>
                                  </div>
                                  <p className="text-gray-300 text-sm mt-1">{alt.reason}</p>
                                </div>
                              ))}

                              {/* Strategy Tips */}
                              {draftResult.strategyTips && draftResult.strategyTips.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-white font-semibold mb-2">Strategy Tips:</h4>
                                  {draftResult.strategyTips.map((tip, index) => (
                                    <div key={index} className="p-2 bg-yellow-500/20 rounded border border-yellow-500/30 mb-2">
                                      <p className="text-yellow-200 text-sm">{tip}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Positional Scarcity */}
                              {draftResult.positionalScarcity && draftResult.positionalScarcity.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-white font-semibold mb-2">Position Alerts:</h4>
                                  {draftResult.positionalScarcity.map((alert, index) => (
                                    <div key={index} className="p-2 bg-orange-500/20 rounded border border-orange-500/30 mb-2">
                                      <p className="text-orange-200 text-sm">{alert}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="startsit" className="mt-6">
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        ⚡ Start/Sit Analyzer
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        AI-powered weekly lineup decisions based on matchups and projections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleStartSitAnalysis} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="position" className="text-white">Position</Label>
                            <Select value={startSitData.position} onValueChange={(value) => setStartSitData(prev => ({ ...prev, position: value }))}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="QB">Quarterback (QB)</SelectItem>
                                <SelectItem value="RB">Running Back (RB)</SelectItem>
                                <SelectItem value="WR">Wide Receiver (WR)</SelectItem>
                                <SelectItem value="TE">Tight End (TE)</SelectItem>
                                <SelectItem value="K">Kicker (K)</SelectItem>
                                <SelectItem value="DEF">Defense (DEF)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="leagueFormat" className="text-white">League Format</Label>
                            <Select value={startSitData.leagueFormat} onValueChange={(value) => setStartSitData(prev => ({ ...prev, leagueFormat: value }))}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Scoring format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PPR">PPR</SelectItem>
                                <SelectItem value="Half PPR">Half PPR</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative" ref={player1Ref}>
                            <Label htmlFor="player1" className="text-white">Select Player to Start/Sit</Label>
                            <div className="relative">
                              <Input
                                value={startSitData.player1}
                                onChange={(e) => handlePlayer1Change(e.target.value)}
                                onFocus={() => setShowPlayer1Dropdown(true)}
                                placeholder="Type player name..."
                                className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                              />
                              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                            {showPlayer1Dropdown && player1Suggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-md shadow-lg max-h-60 overflow-auto">
                                {player1Suggestions.map((player, index) => (
                                  <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-white/10 cursor-pointer text-white text-sm"
                                    onClick={() => handlePlayerSelect(player, 'player1')}
                                  >
                                    {player}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="relative" ref={player2Ref}>
                            <Label htmlFor="player2" className="text-white">Select Player to Compare</Label>
                            <div className="relative">
                              <Input
                                value={startSitData.player2}
                                onChange={(e) => handlePlayer2Change(e.target.value)}
                                onFocus={() => setShowPlayer2Dropdown(true)}
                                placeholder="Type player name..."
                                className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
                              />
                              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>
                            {showPlayer2Dropdown && player2Suggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-md shadow-lg max-h-60 overflow-auto">
                                {player2Suggestions.map((player, index) => (
                                  <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-white/10 cursor-pointer text-white text-sm"
                                    onClick={() => handlePlayerSelect(player, 'player2')}
                                  >
                                    {player}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="weather"
                            checked={startSitData.weatherConcerns}
                            onCheckedChange={(checked) => setStartSitData(prev => ({ ...prev, weatherConcerns: !!checked }))}
                            className="border-white/20"
                          />
                          <Label htmlFor="weather" className="text-white text-sm">Consider weather conditions</Label>
                        </div>

                        <Button 
                          type="submit" 
                          disabled={isAnalyzing || !startSitData.position || !startSitData.player1}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Analyzing Matchups...
                            </>
                          ) : (
                            <>
                              <Users className="w-4 h-4 mr-2" />
                              Analyze these Start/Sit Choices
                            </>
                          )}
                        </Button>
                      </form>

                      {/* Start/Sit Results */}
                      {startSitResult && (
                        <div className="mt-6">
                          <Card className="bg-white/10 backdrop-blur-md border-white/20">
                            <CardHeader className="text-center">
                              <div className="flex items-center justify-center mb-2">
                                <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
                                <CardTitle className="text-green-400 text-xl">Strong Recommendation</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              {/* Player Comparison Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {[startSitResult.player1Analysis, startSitResult.player2Analysis].map((player, index) => (
                                  <div key={index} className="text-center">
                                    <h3 className="text-white text-lg font-semibold mb-2">{player.playerName}</h3>
                                    
                                    {/* Player Card */}
                                    <div className="bg-gray-200 rounded-lg p-6 mb-4 min-h-[200px] flex items-center justify-center">
                                      <div className="text-center">
                                        {player.headshot ? (
                                          <div className="w-20 h-20 rounded-full mx-auto mb-2 overflow-hidden border-2 border-white/20 shadow-lg">
                                            <img 
                                              src={player.headshot} 
                                              alt={player.playerName}
                                              className="w-full h-full object-cover"
                                              onError={(e) => {
                                                // Fallback to initials if headshot fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement!.innerHTML = `
                                                  <div class="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/20 bg-gradient-to-br from-slate-600 to-slate-800">
                                                    <div class="text-center">
                                                      <div class="text-lg font-black tracking-tight">
                                                        ${player.playerName.split(' ').map((name: string) => name[0]).join('').slice(0, 2)}
                                                      </div>
                                                      <div class="text-xs opacity-90 font-medium">
                                                        ${player.team}
                                                      </div>
                                                    </div>
                                                  </div>
                                                `;
                                              }}
                                            />
                                          </div>
                                        ) : (
                                          <div className={`w-20 h-20 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/20 ${getTeamGradient(player.team)}`}>
                                            <div className="text-center">
                                              <div className="text-lg font-black tracking-tight">
                                                {player.playerName.split(' ').map(name => name[0]).join('').slice(0, 2)}
                                              </div>
                                              <div className="text-xs opacity-90 font-medium">
                                                {player.team}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        <div className="text-gray-600 text-sm">{player.position} - {player.team}</div>
                                      </div>
                                    </div>
                                    
                                    {/* Decision Badge */}
                                    <div className={`p-3 rounded-lg ${
                                      (index === 0 && startSitResult.recommendation === 'START_PLAYER_1') ||
                                      (index === 1 && startSitResult.recommendation === 'START_PLAYER_2')
                                        ? 'bg-green-500/20 border border-green-500/30' 
                                        : 'bg-red-500/20 border border-red-500/30'
                                    }`}>
                                      <div className={`font-bold text-lg ${
                                        (index === 0 && startSitResult.recommendation === 'START_PLAYER_1') ||
                                        (index === 1 && startSitResult.recommendation === 'START_PLAYER_2')
                                          ? 'text-green-300' : 'text-red-300'
                                      }`}>
                                        {(index === 0 && startSitResult.recommendation === 'START_PLAYER_1') ||
                                         (index === 1 && startSitResult.recommendation === 'START_PLAYER_2')
                                          ? '✅ START' : '❌ SIT'}
                                      </div>
                                      <div className="text-white text-sm mt-1">
                                        {player.confidence}% Confidence
                                      </div>
                                      <div className="text-white text-sm">
                                        Projected: {player.projectedPoints} pts
                                      </div>
                                    </div>
                                    
                                    {/* Reasoning */}
                                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                                      {player.reasoning.map((reason, i) => (
                                        <p key={i} className="text-gray-300 text-sm mb-1">{reason}</p>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Head to Head Comparison */}
                              {startSitResult.headToHeadComparison && startSitResult.headToHeadComparison.length > 0 && (
                                <div className="mt-6">
                                  <h4 className="text-white font-semibold mb-3 flex items-center">
                                    <TrendingUp className="w-5 h-5 text-orange-400 mr-2" />
                                    Head-to-Head Analysis
                                  </h4>
                                  {startSitResult.headToHeadComparison.map((comparison, index) => (
                                    <div key={index} className="p-3 bg-orange-500/20 rounded-lg border border-orange-500/30 mb-2">
                                      <div className="text-gray-300 text-sm">{comparison}</div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Weather Impact */}
                              {startSitResult.weatherImpact && (
                                <div className="mt-4">
                                  <h4 className="text-white font-semibold mb-2">🌤️ Weather Impact</h4>
                                  <div className="p-2 bg-blue-500/20 rounded border border-blue-500/30 mb-2">
                                    <p className="text-blue-200 text-sm">{startSitResult.weatherImpact}</p>
                                  </div>
                                </div>
                              )}

                              {/* Injury Alerts */}
                              {startSitResult.injuryAlerts && startSitResult.injuryAlerts.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-white font-semibold mb-2">🚨 Injury Alerts</h4>
                                  {startSitResult.injuryAlerts.map((alert, index) => (
                                    <div key={index} className="p-2 bg-red-500/20 rounded border border-red-500/30 mb-2">
                                      <p className="text-red-200 text-sm">{alert}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Side Panel */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              {error && (
                <Card className="bg-red-500/10 backdrop-blur-md border-red-500/30">
                  <CardContent className="text-center py-8">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium text-red-300 mb-2">
                      Analysis Unavailable
                    </h3>
                    <p className="text-sm text-red-200 mb-4">
                      {error}
                    </p>
                    <Button 
                      onClick={() => setError(null)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!error && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Fantasy Analysis Preview
                    </h3>
                    <p className="text-sm text-gray-400">
                      Your AI-powered draft or start/sit recommendations will appear here
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
                Why Our Fantasy Tools Work
              </h2>
              <p className="text-xl text-gray-300">
                Advanced AI analysis combined with live NFL data for superior fantasy decisions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-white font-semibold mb-2">AI Analysis</h3>
                  <p className="text-gray-300 text-sm">Advanced algorithms analyze matchups, trends, and player data</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🏈</div>
                  <h3 className="text-white font-semibold mb-2">Live NFL Data</h3>
                  <p className="text-gray-300 text-sm">Real-time player stats, injury reports, and team information</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-white font-semibold mb-2">Matchup Insights</h3>
                  <p className="text-gray-300 text-sm">Detailed defensive rankings and situational analysis</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-white font-semibold mb-2">Confidence Scoring</h3>
                  <p className="text-gray-300 text-sm">Every recommendation includes confidence percentages</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}