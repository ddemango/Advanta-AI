import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Target, Users, TrendingUp, Star, Clock, CheckCircle, Trophy, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } }
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
  recommendations: Array<{
    player: string;
    position: string;
    decision: 'start' | 'sit';
    reasoning: string;
    projection: number;
    confidence: number;
  }>;
  boomWatch: Array<{
    player: string;
    ceiling: number;
    reason: string;
  }>;
  matchupAlerts: string[];
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

  // Fetch players from API
  const fetchPlayers = async (query: string, position?: string) => {
    if (!query || query.length < 2) return [];
    
    try {
      const params = new URLSearchParams();
      params.append('query', query);
      if (position) params.append('position', position);
      
      const response = await fetch(`/api/nfl-players?${params.toString()}`);
      if (!response.ok) return [];
      
      const players = await response.json();
      return players;
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  };

  const handlePlayer1Change = async (value: string) => {
    setStartSitData(prev => ({ ...prev, player1: value }));
    if (value.length >= 2) {
      const suggestions = await fetchPlayers(value, startSitData.position);
      setPlayer1Suggestions(suggestions.map((p: any) => `${p.name} (${p.position} - ${p.team})`));
      setShowPlayer1Dropdown(suggestions.length > 0);
    } else {
      setShowPlayer1Dropdown(false);
    }
  };

  const handlePlayer2Change = async (value: string) => {
    setStartSitData(prev => ({ ...prev, player2: value }));
    if (value.length >= 2) {
      const suggestions = await fetchPlayers(value, startSitData.position);
      setPlayer2Suggestions(suggestions.map((p: any) => `${p.name} (${p.position} - ${p.team})`));
      setShowPlayer2Dropdown(suggestions.length > 0);
    } else {
      setShowPlayer2Dropdown(false);
    }
  };

  const selectPlayer1 = (player: string) => {
    setStartSitData(prev => ({ ...prev, player1: player }));
    setShowPlayer1Dropdown(false);
    if (player1Ref.current) {
      player1Ref.current.blur();
    }
  };

  const selectPlayer2 = (player: string) => {
    setStartSitData(prev => ({ ...prev, player2: player }));
    setShowPlayer2Dropdown(false);
    if (player2Ref.current) {
      player2Ref.current.blur();
    }
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

  // Fetch NFL teams for data
  const { data: nflTeams } = useQuery({
    queryKey: ['/api/nfl-teams'],
    queryFn: async () => {
      const response = await fetch('/api/nfl-teams');
      if (!response.ok) throw new Error('Failed to fetch NFL teams');
      return response.json();
    }
  });

  const handleDraftAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);
    setDraftResult(null);
    
    try {
      const response = await fetch('/api/fantasy-draft-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis service temporarily unavailable');
      }
      
      const result = await response.json();
      setDraftResult(result);
    } catch (error) {
      console.error('Draft analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis service temporarily unavailable. Please try again later.');
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis service temporarily unavailable');
      }
      
      const result = await response.json();
      setStartSitResult(result);
    } catch (error) {
      console.error('Start/Sit analysis error:', error);
      setError(error instanceof Error ? error.message : 'Analysis service temporarily unavailable. Please try again later.');
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
              <Tabs defaultValue="draft" className="w-full">
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
                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                <SelectValue placeholder="Select league type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ppr">PPR (Point Per Reception)</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="superflex">Superflex</SelectItem>
                                <SelectItem value="dynasty">Dynasty</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="scoringSettings" className="text-white">Scoring Format</Label>
                            <Select value={draftData.scoringSettings} onValueChange={(value) => setDraftData(prev => ({ ...prev, scoringSettings: value }))}>
                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                <SelectValue placeholder="Scoring settings" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard Scoring</SelectItem>
                                <SelectItem value="half-ppr">Half PPR</SelectItem>
                                <SelectItem value="full-ppr">Full PPR</SelectItem>
                                <SelectItem value="6pt-pass-td">6pt Pass TD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="currentRound" className="text-white">Current Round</Label>
                            <Input
                              id="currentRound"
                              placeholder="e.g., 3"
                              value={draftData.currentRound}
                              onChange={(e) => setDraftData(prev => ({ ...prev, currentRound: e.target.value }))}
                              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pickNumber" className="text-white">Pick Number</Label>
                            <Input
                              id="pickNumber"
                              placeholder="e.g., 7"
                              value={draftData.pickNumber}
                              onChange={(e) => setDraftData(prev => ({ ...prev, pickNumber: e.target.value }))}
                              className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-white mb-3 block">Roster Needs</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['QB', 'RB', 'WR', 'TE', 'FLEX', 'DEF', 'K'].map((position) => (
                              <div key={position} className="flex items-center space-x-2">
                                <Checkbox
                                  id={position}
                                  checked={draftData.rosterNeeds.includes(position)}
                                  onCheckedChange={(checked) => handleRosterNeedChange(position, !!checked)}
                                />
                                <Label htmlFor={position} className="text-white text-sm">{position}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing Draft...
                            </>
                          ) : (
                            <>
                              <Target className="w-4 h-4 mr-2" />
                              Get Draft Recommendation
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="startsit" className="mt-6">
                  <Card className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        📊 Start/Sit Analyzer
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
                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="qb">Quarterback (QB)</SelectItem>
                                <SelectItem value="rb">Running Back (RB)</SelectItem>
                                <SelectItem value="wr">Wide Receiver (WR)</SelectItem>
                                <SelectItem value="te">Tight End (TE)</SelectItem>
                                <SelectItem value="flex">FLEX</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="leagueFormat" className="text-white">League Format</Label>
                            <Select value={startSitData.leagueFormat} onValueChange={(value) => setStartSitData(prev => ({ ...prev, leagueFormat: value }))}>
                              <SelectTrigger className="bg-white/10 border-white/30 text-white">
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ppr">PPR</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="half-ppr">Half PPR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative" ref={player1Ref}>
                            <Label htmlFor="player1" className="text-white">Select Player to Start/Sit</Label>
                            <div className="relative">
                              <Input
                                id="player1"
                                placeholder="Type to Select Player"
                                value={startSitData.player1}
                                onChange={(e) => handlePlayer1Change(e.target.value)}
                                onFocus={() => {
                                  if (startSitData.player1.length >= 2) {
                                    setShowPlayer1Dropdown(true);
                                  }
                                }}
                                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 pr-10"
                                autoComplete="off"
                              />
                              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            {showPlayer1Dropdown && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {player1Suggestions.map((player, index) => (
                                  <button
                                    key={index}
                                    onClick={() => selectPlayer1(player)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-100 last:border-b-0"
                                  >
                                    {player}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="relative" ref={player2Ref}>
                            <Label htmlFor="player2" className="text-white">Select Player to Compare</Label>
                            <div className="relative">
                              <Input
                                id="player2"
                                placeholder="Type to Select Player"
                                value={startSitData.player2}
                                onChange={(e) => handlePlayer2Change(e.target.value)}
                                onFocus={() => {
                                  if (startSitData.player2.length >= 2) {
                                    setShowPlayer2Dropdown(true);
                                  }
                                }}
                                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 pr-10"
                                autoComplete="off"
                              />
                              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                            {showPlayer2Dropdown && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {player2Suggestions.map((player, index) => (
                                  <button
                                    key={index}
                                    onClick={() => selectPlayer2(player)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-100 last:border-b-0"
                                  >
                                    {player}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="opponent" className="text-white">Opponent Defense</Label>
                          <Input
                            id="opponent"
                            placeholder="e.g., Dallas Cowboys"
                            value={startSitData.opponent}
                            onChange={(e) => setStartSitData(prev => ({ ...prev, opponent: e.target.value }))}
                            className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="weatherConcerns"
                            checked={startSitData.weatherConcerns}
                            onCheckedChange={(checked) => setStartSitData(prev => ({ ...prev, weatherConcerns: !!checked }))}
                          />
                          <Label htmlFor="weatherConcerns" className="text-white">Consider weather conditions</Label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={isAnalyzing || !startSitData.player1 || !startSitData.position}
                        >
                          {isAnalyzing ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing these Start/Sit Choices...
                            </>
                          ) : (
                            <>
                              <Users className="w-4 h-4 mr-2" />
                              Analyze these Start/Sit Choices
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Results */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.4 }}
            >
              {draftResult && (
                <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      🏆 Draft Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-green-300 text-lg">
                          Best Pick: {draftResult.bestPick.name}
                        </h3>
                        <Badge className="bg-green-600 text-white">
                          {draftResult.bestPick.confidence}% Confidence
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {draftResult.bestPick.position} - {draftResult.bestPick.team}
                      </p>
                      <p className="text-gray-200">{draftResult.bestPick.analysis}</p>
                    </div>

                    {draftResult.alternatives.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Alternative Picks:</h4>
                        {draftResult.alternatives.map((alt, index) => (
                          <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 mb-2">
                            <div className="font-medium text-white">
                              {alt.name} ({alt.position} - {alt.team})
                            </div>
                            <div className="text-gray-300 text-sm">{alt.reason}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {draftResult.strategyTips.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Strategy Tips:</h4>
                        {draftResult.strategyTips.map((tip, index) => (
                          <div key={index} className="flex items-start space-x-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {startSitResult && (
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
                          <button className="text-gray-400 text-sm mb-4 hover:text-white transition-colors">
                            ⚙️ Change Player
                          </button>
                          
                          {/* Player Card */}
                          <div className="bg-gray-200 rounded-lg p-6 mb-4 min-h-[200px] flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2"></div>
                              <div className="text-gray-600 text-sm">{player.position} - {player.team}</div>
                            </div>
                          </div>
                          
                          {/* Star Rating */}
                          <div className="bg-purple-600 text-white py-2 px-4 rounded-lg mb-4">
                            <div className="text-sm mb-1">Projected: {player.projectedPoints} pts</div>
                            <div className="flex justify-center space-x-1">
                              {Array.from({ length: Math.floor(player.confidence / 20) }, (_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          
                          {/* Stats */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-gray-300">
                              <span className="font-medium">Matchup</span>
                              <span className="font-bold">{player.matchupRating}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-300">
                              <span className="font-medium">Potential</span>
                              <span>{player.boomBustPotential}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="font-medium">PROJ</span>
                              <span>{player.projectedPoints}</span>
                            </div>
                          </div>
                          
                          {/* Decision Badge */}
                          <div className={`mt-4 p-3 rounded-lg ${
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
              )}

              {error && (
                <Card className="bg-red-500/10 backdrop-blur-md border-red-500/30">
                  <CardContent className="text-center py-8">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg font-medium text-red-300 mb-2">
                      Analysis Unavailable
                    </h3>
                    <p className="text-sm text-red-200 mb-4">
                      AI analysis service is currently unavailable. Please contact support to enable fantasy football analysis.
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

              {!draftResult && !startSitResult && !error && (
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
      <Footer />
    </div>
  );
}