
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { PlayerCard } from "@/components/PlayerCard";
import { StatisticsChart } from "@/components/StatisticsChart";
import { AuthModal } from "@/components/AuthModal";
import { ArrowRight, Brain, BarChart3, Users } from "lucide-react";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sample statistics data for the chart
  const statData = [
    { name: "Goals", value: 42, maxValue: 50, color: "#3B82F6" },
    { name: "Assists", value: 35, maxValue: 50, color: "#10B981" },
    { name: "Pass Accuracy", value: 89, maxValue: 100, color: "#6366F1" },
    { name: "Minutes", value: 3240, maxValue: 3600, color: "#F59E0B" },
    { name: "Tackles", value: 75, maxValue: 100, color: "#EC4899" },
  ];

  // Sample featured players data
  const featuredPlayers = [
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
      age: 23,
    },
    {
      id: "player2",
      name: "Kylian Mbappé",
      position: "Forward",
      club: "Real Madrid",
      clubLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png",
      nationality: "France",
      nationalityFlag: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/23px-Flag_of_France.svg.png",
      marketValue: 180000000,
      estimatedValue: 172000000,
      imageUrl: "https://img.a.transfermarkt.technology/portrait/header/342229-1682683695.jpg",
      age: 24,
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
      estimatedValue: 165000000,
      imageUrl: "https://img.a.transfermarkt.technology/portrait/header/581678-1671193471.jpg",
      age: 20,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Search Section */}
      <section className="py-16 bg-gradient-to-b from-white to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Any Player</h2>
            <p className="text-muted-foreground mb-8">
              Search from our database of thousands of professional football players.
            </p>
            <SearchBar className="mx-auto" fullWidth />
          </div>
        </div>
      </section>
      
      {/* Featured Players Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Users className="mr-1.5 h-3.5 w-3.5" />
                Featured Players
              </div>
              <h2 className="text-3xl font-bold">Trending Valuations</h2>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" size="sm">
              View All Players
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlayers.map(player => (
              <PlayerCard key={player.id} {...player} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-b from-white to-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
              Data-Driven
            </div>
            <h2 className="text-3xl font-bold mb-4">Comprehensive Statistics</h2>
            <p className="text-muted-foreground">
              Our AI models analyze over 200 statistics to provide accurate market valuations.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <StatisticsChart 
              data={statData} 
              title="Key Performance Indicators" 
              description="Sample player statistics that influence market value predictions"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Brain className="mr-1.5 h-3.5 w-3.5" />
              AI Technology
            </div>
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Our advanced machine learning model has been trained on historical transfer data 
              to provide accurate predictions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-panel rounded-xl p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
              <p className="text-muted-foreground">
                We gather comprehensive stats from multiple sources, ensuring data accuracy 
                and relevance.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p className="text-muted-foreground">
                Our machine learning algorithms analyze performance metrics, market trends, 
                and historical valuations.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-6 hover-lift">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accurate Prediction</h3>
              <p className="text-muted-foreground">
                Get precise market value predictions with detailed reasoning and 
                confidence scores.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => setIsAuthModalOpen(true)}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Start with 5 free predictions.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-secondary/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <div className="font-bold text-2xl tracking-tight text-foreground mb-2">
                <span className="text-primary">Value</span>Prophet
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered football player valuation
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex flex-col space-y-2">
                <div className="font-medium mb-1">Product</div>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</a>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="font-medium mb-1">Resources</div>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="font-medium mb-1">Company</div>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2023 ValueProphet. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
