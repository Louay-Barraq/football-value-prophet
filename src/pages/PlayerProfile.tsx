
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Home, TrendingUp, TrendingDown, ExternalLink, Calendar, Bookmark, Share2, Star, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatisticsChart } from "@/components/StatisticsChart";
import { Header } from "@/components/Header";

interface PlayerData {
  id: string;
  name: string;
  position: string;
  club: string;
  clubLogo?: string;
  nationality: string;
  nationalityFlag?: string;
  marketValue: number;
  estimatedValue: number;
  imageUrl?: string;
  age: number;
  height: string;
  weight: string;
  foot: string;
  jerseyNumber: number;
  contractUntil: string;
  stats: {
    name: string;
    value: number;
    maxValue?: number;
    color?: string;
  }[];
}

const PlayerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate API call to fetch player data
    const fetchPlayer = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample player data
      const samplePlayer: PlayerData = {
        id: id || "player1",
        name: "Erling Haaland",
        position: "Striker",
        club: "Manchester City",
        clubLogo: "https://resources.premierleague.com/premierleague/badges/t43.png",
        nationality: "Norway",
        nationalityFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/23px-Flag_of_Norway.svg.png",
        marketValue: 180000000,
        estimatedValue: 195000000,
        imageUrl: "https://img.a.transfermarkt.technology/portrait/header/418560-1673351093.jpg",
        age: 23,
        height: "194 cm",
        weight: "88 kg",
        foot: "Left",
        jerseyNumber: 9,
        contractUntil: "2027-06-30",
        stats: [
          { name: "Goals", value: 36, maxValue: 50, color: "#3B82F6" },
          { name: "Assists", value: 8, maxValue: 25, color: "#10B981" },
          { name: "Games", value: 35, maxValue: 50, color: "#6366F1" },
          { name: "Minutes", value: 3026, maxValue: 4500, color: "#F59E0B" },
          { name: "Shot Accuracy", value: 64, maxValue: 100, color: "#EC4899" },
          { name: "Conversion Rate", value: 27, maxValue: 100, color: "#8B5CF6" },
          { name: "Aerial Duels Won", value: 52, maxValue: 100, color: "#14B8A6" },
          { name: "Pass Completion", value: 72, maxValue: 100, color: "#F97316" },
        ],
      };
      
      setPlayer(samplePlayer);
      setIsLoading(false);
    };
    
    fetchPlayer();
  }, [id]);
  
  // Format currency (in millions/thousands)
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };
  
  // Calculate value difference
  const getValueDifference = () => {
    if (!player) return { value: 0, percent: 0, direction: "same" as const };
    
    const difference = player.estimatedValue - player.marketValue;
    const percentDiff = Math.round((difference / player.marketValue) * 100);
    const direction = difference > 0 ? "up" as const : difference < 0 ? "down" as const : "same" as const;
    
    return {
      value: Math.abs(difference),
      percent: Math.abs(percentDiff),
      direction,
    };
  };
  
  const valueDiff = getValueDifference();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!player) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Player Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The player you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/search" className="hover:text-foreground transition-colors">
              Players
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{player.name}</span>
          </div>
        </div>
        
        {/* Player Header */}
        <section className="bg-gradient-to-b from-secondary/30 to-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Player Image */}
              <div className="w-48 h-48 rounded-xl overflow-hidden bg-secondary flex-shrink-0 relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary text-4xl font-bold text-secondary-foreground/30">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                {player.imageUrl && (
                  <img 
                    src={player.imageUrl} 
                    alt={player.name} 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
              </div>
              
              {/* Player Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold">{player.name}</h1>
                  <div className="flex items-center">
                    {player.clubLogo && (
                      <img src={player.clubLogo} alt={player.club} className="w-6 h-6 object-contain mr-2" />
                    )}
                    <span className="text-lg">{player.club}</span>
                  </div>
                </div>
                
                {/* Player Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="glass-panel rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Position</div>
                    <div className="font-medium">{player.position}</div>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Age</div>
                    <div className="font-medium">{player.age} years</div>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Nationality</div>
                    <div className="font-medium flex items-center">
                      {player.nationalityFlag && (
                        <img src={player.nationalityFlag} alt={player.nationality} className="w-4 h-4 object-contain mr-2" />
                      )}
                      {player.nationality}
                    </div>
                  </div>
                  <div className="glass-panel rounded-lg p-3">
                    <div className="text-xs text-muted-foreground mb-1">Jersey</div>
                    <div className="font-medium">#{player.jerseyNumber}</div>
                  </div>
                </div>
                
                {/* Market Value Section */}
                <div className="glass-panel rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Market Value</div>
                      <div className="text-2xl font-bold">{formatValue(player.marketValue)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Our Estimation</div>
                      <div className={`text-2xl font-bold ${
                        valueDiff.direction === "up" ? "text-green-600" : 
                        valueDiff.direction === "down" ? "text-red-600" : ""
                      }`}>
                        {formatValue(player.estimatedValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Difference</div>
                      <div className="flex items-center">
                        {valueDiff.direction === "up" ? (
                          <TrendingUp className="text-green-600 mr-1 h-5 w-5" />
                        ) : valueDiff.direction === "down" ? (
                          <TrendingDown className="text-red-600 mr-1 h-5 w-5" />
                        ) : (
                          <Minus className="text-gray-600 mr-1 h-5 w-5" />
                        )}
                        <span className={`text-2xl font-bold ${
                          valueDiff.direction === "up" ? "text-green-600" : 
                          valueDiff.direction === "down" ? "text-red-600" : ""
                        }`}>
                          {valueDiff.percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Custom Prediction
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="ghost">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    External Sources
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tabs for Different Data Sections */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="history">Valuation History</TabsTrigger>
                <TabsTrigger value="similar">Similar Players</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Personal Info */}
                  <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Full Name</span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date of Birth</span>
                        <span className="font-medium">July 21, 2000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Height</span>
                        <span className="font-medium">{player.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">{player.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preferred Foot</span>
                        <span className="font-medium">{player.foot}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contract Info */}
                  <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Contract Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Club</span>
                        <span className="font-medium flex items-center">
                          {player.clubLogo && (
                            <img src={player.clubLogo} alt={player.club} className="w-4 h-4 object-contain mr-2" />
                          )}
                          {player.club}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-medium">July 1, 2022</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contract Until</span>
                        <span className="font-medium">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {new Date(player.contractUntil).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Jersey Number</span>
                        <span className="font-medium">#{player.jerseyNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Stats */}
                  <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-xl font-semibold mb-4">Season Highlights</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Goals</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-3">36</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '72%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Assists</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-3">8</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '32%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Games</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-3">35</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Minutes</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-3">3026</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '67%' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">G/90 min</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-3">1.07</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Performance Factors */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-6">Performance Factors</h3>
                  <StatisticsChart 
                    data={player.stats} 
                    title="Key Statistics"
                    description="Statistics that influence our market value prediction"
                  />
                </div>
              </TabsContent>
              
              {/* Statistics Tab */}
              <TabsContent value="statistics" className="animate-fade-in">
                <div className="glass-panel rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Detailed Statistics</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete statistical analysis will be available in the full version.
                  </p>
                  <Button>Unlock Premium Statistics</Button>
                </div>
              </TabsContent>
              
              {/* History Tab */}
              <TabsContent value="history" className="animate-fade-in">
                <div className="glass-panel rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Valuation History</h3>
                  <p className="text-muted-foreground mb-6">
                    Historical valuation data will be available in the full version.
                  </p>
                  <Button>Unlock Historical Data</Button>
                </div>
              </TabsContent>
              
              {/* Similar Players Tab */}
              <TabsContent value="similar" className="animate-fade-in">
                <div className="glass-panel rounded-xl p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Similar Players</h3>
                  <p className="text-muted-foreground mb-6">
                    AI-matched similar players will be available in the full version.
                  </p>
                  <Button>Unlock Similar Players</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PlayerProfile;
