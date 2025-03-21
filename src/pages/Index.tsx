
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { PlayerCard } from "@/components/PlayerCard";
import { StatisticsChart } from "@/components/StatisticsChart";
import { AuthModal } from "@/components/AuthModal";
import { ArrowRight, Brain, BarChart3, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({
    featured: false,
    stats: false,
    howItWorks: false
  });

  // Function to handle Auth Modal
  useEffect(() => {
    const handleOpenAuthModal = () => setIsAuthModalOpen(true);
    window.addEventListener("open-auth-modal", handleOpenAuthModal);
    return () => window.removeEventListener("open-auth-modal", handleOpenAuthModal);
  }, []);

  // Function to handle Get Started click
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Enhanced scroll listener for animations with IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Set up IntersectionObserver for each section
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };
    
    const featuredSection = document.getElementById('featured-section');
    const statsSection = document.getElementById('stats-section');
    const howItWorksSection = document.getElementById('how-it-works-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId === 'featured-section') {
            setIsVisible(prev => ({ ...prev, featured: true }));
          } else if (sectionId === 'stats-section') {
            setIsVisible(prev => ({ ...prev, stats: true }));
          } else if (sectionId === 'how-it-works-section') {
            setIsVisible(prev => ({ ...prev, howItWorks: true }));
          }
        }
      });
    }, observerOptions);
    
    if (featuredSection) sectionObserver.observe(featuredSection);
    if (statsSection) sectionObserver.observe(statsSection);
    if (howItWorksSection) sectionObserver.observe(howItWorksSection);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
    };
  }, []);

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

  const handlePlayerSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

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
            <SearchBar className="mx-auto" fullWidth onSearch={handlePlayerSearch} />
          </div>
        </div>
      </section>
      
      {/* Featured Players Section */}
      <section 
        id="featured-section"
        className={`py-16 transition-all duration-700 ${
          isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Users className="mr-1.5 h-3.5 w-3.5" />
                Featured Players
              </div>
              <h2 className="text-3xl font-bold">Trending Valuations</h2>
            </div>
            <Button variant="ghost" className="mt-4 md:mt-0" size="sm" onClick={() => navigate('/search')}>
              View All Players
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPlayers.map((player, index) => (
              <div key={player.id} 
                className={`transition-all duration-700 delay-${index * 100} ${
                  isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <PlayerCard 
                  {...player} 
                  onClick={() => navigate(`/player/${player.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section 
        id="stats-section"
        className={`py-16 bg-gradient-to-b from-white to-secondary/30 transition-all duration-700 ${
          isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
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
      <section 
        id="how-it-works-section"
        className={`py-16 transition-all duration-700 ${
          isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
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
            <Button size="lg" onClick={handleGetStarted}>
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required. Start with 5 free predictions.
            </p>
          </div>
        </div>
      </section>
      
      {/* Simplified Footer */}
      <footer className="py-12 bg-secondary/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="text-center">
              <div className="font-bold text-2xl tracking-tight text-foreground mb-2">
                <span className="text-primary">Value</span>Prophet
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                AI-powered football player valuation
              </p>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex justify-center">
            <div className="text-sm text-muted-foreground">
              © 2023 ValueProphet. All rights reserved.
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
