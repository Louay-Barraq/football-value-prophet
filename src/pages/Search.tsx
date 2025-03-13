
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { PlayerCard } from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp,
  Users,
  Loader2
} from "lucide-react";

// Sample player data
const samplePlayers = [
  {
    id: "player1",
    name: "Erling Haaland",
    position: "Striker",
    club: "Manchester City",
    clubLogo: "https://resources.premierleague.com/premierleague/badges/t43.png",
    nationality: "Norway",
    nationalityFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Norway.svg/23px-Flag_of_Norway.svg.png",
    marketValue: 180000000,
    estimatedValue: 195000000,
    imageUrl: "https://img.a.transfermarkt.technology/portrait/header/418560-1673351093.jpg",
    age: 23
  },
  {
    id: "player2",
    name: "Kylian Mbappé",
    position: "Striker",
    club: "Real Madrid",
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
    nationality: "France",
    nationalityFlag: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/23px-Flag_of_France.svg.png",
    marketValue: 180000000,
    estimatedValue: 175000000,
    imageUrl: "https://img.a.transfermarkt.technology/portrait/header/342229-1682683695.jpg",
    age: 25
  },
  {
    id: "player3",
    name: "Jude Bellingham",
    position: "Midfielder",
    club: "Real Madrid",
    clubLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
    nationality: "England",
    nationalityFlag: "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/23px-Flag_of_England.svg.png",
    marketValue: 150000000,
    estimatedValue: 160000000,
    imageUrl: "https://img.a.transfermarkt.technology/portrait/header/581678-1629143502.jpg",
    age: 21
  },
  {
    id: "player4",
    name: "Phil Foden",
    position: "Midfielder",
    club: "Manchester City",
    clubLogo: "https://resources.premierleague.com/premierleague/badges/t43.png",
    nationality: "England",
    nationalityFlag: "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/23px-Flag_of_England.svg.png",
    marketValue: 150000000,
    estimatedValue: 145000000,
    imageUrl: "https://img.a.transfermarkt.technology/portrait/header/406635-1671435885.jpg",
    age: 24
  },
  {
    id: "player5",
    name: "Rodri",
    position: "Midfielder",
    club: "Manchester City",
    clubLogo: "https://resources.premierleague.com/premierleague/badges/t43.png",
    nationality: "Spain",
    nationalityFlag: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Flag_of_Spain.svg/23px-Flag_of_Spain.svg.png",
    marketValue: 130000000,
    estimatedValue: 140000000,
    imageUrl: "https://img.a.transfermarkt.technology/portrait/header/357565-1696085307.jpg",
    age: 28
  },
  {
    id: "player6",
    name: "Bukayo Saka",
    position: "Winger",
    club: "Arsenal",
    clubLogo: "https://resources.premierleague.com/premierleague/badges/t3.png",
    nationality: "England",
    nationalityFlag: "https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/23px-Flag_of_England.svg.png",
    marketValue: 130000000,
    estimatedValue: 135000000,
    imageUrl: "https://img.a.transfermarkt.technology/portrait/header/433177-1692626553.jpg",
    age: 23
  }
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState(samplePlayers);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  // Filter logic would go here in a real app
  const handleSearch = (query: string) => {
    setIsLoading(true);
    setTimeout(() => {
      if (query.trim() === "") {
        setPlayers(samplePlayers);
      } else {
        const filtered = samplePlayers.filter(player => 
          player.name.toLowerCase().includes(query.toLowerCase()) ||
          player.club.toLowerCase().includes(query.toLowerCase()) ||
          player.position.toLowerCase().includes(query.toLowerCase())
        );
        setPlayers(filtered);
      }
      setSearchQuery(query);
      setIsLoading(false);
    }, 500); // Simulating API delay
  };

  const handlePlayerClick = (playerId: string) => {
    navigate(`/player/${playerId}`);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Player Search</h1>
          <p className="text-muted-foreground">
            Search for players to view their market value and statistics
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <SearchBar 
              placeholder="Search for players..."
              onSearch={handleSearch}
              fullWidth
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:ml-auto w-full md:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Filter Panel (simplified) */}
          {showFilters && (
            <div className="glass-panel rounded-lg p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Position</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Striker</Button>
                  <Button variant="outline" size="sm">Midfielder</Button>
                  <Button variant="outline" size="sm">Defender</Button>
                  <Button variant="outline" size="sm">Goalkeeper</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Club</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Top 5 Leagues</Button>
                  <Button variant="outline" size="sm">Champions League</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Market Value</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Under €50M</Button>
                  <Button variant="outline" size="sm">€50M-€100M</Button>
                  <Button variant="outline" size="sm">Over €100M</Button>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-3 flex justify-end">
                <Button variant="secondary" size="sm" className="mr-2">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Search Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : players.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-lg font-medium">
                  {players.length} {players.length === 1 ? 'Player' : 'Players'} 
                  {searchQuery ? ` for "${searchQuery}"` : ''}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player) => (
                <PlayerCard 
                  key={player.id}
                  id={player.id}
                  name={player.name}
                  position={player.position}
                  club={player.club}
                  clubLogo={player.clubLogo}
                  nationality={player.nationality}
                  nationalityFlag={player.nationalityFlag}
                  marketValue={player.marketValue}
                  estimatedValue={player.estimatedValue}
                  imageUrl={player.imageUrl}
                  age={player.age}
                  onClick={() => handlePlayerClick(player.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">No players found</h3>
            <p className="text-muted-foreground mb-4">
              Try searching with different terms or adjusting your filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Search;
