
import { ChevronRight, TrendingUp, Database, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle button clicks
  const handleTryPrediction = () => {
    if (isAuthenticated) {
      navigate('/predictions');
    } else {
      // Dispatch custom event to open auth modal
      window.dispatchEvent(new Event('open-auth-modal'));
    }
  };

  const handleExplorePlayers = () => {
    navigate('/search');
  };

  return (
    <section className="relative pt-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow text */}
          <div 
            className={`inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100" : "opacity-0 transform translate-y-4"
            }`}
          >
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            AI-Powered Player Valuation
          </div>

          {/* Headline */}
          <h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100" : "opacity-0 transform translate-y-4"
            }`}
          >
            Predict Football Player Market Values with Precision
          </h1>

          {/* Subheadline */}
          <p 
            className={`text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 text-balance transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100" : "opacity-0 transform translate-y-4"
            }`}
          >
            Leverage advanced AI to accurately predict player values based on over 200 performance metrics, statistics, and market trends.
          </p>

          {/* CTA buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100" : "opacity-0 transform translate-y-4"
            }`}
          >
            <Button size="lg" className="w-full sm:w-auto" onClick={handleTryPrediction}>
              Try Free Prediction
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleExplorePlayers}>
              Explore Players
            </Button>
          </div>

          {/* Features */}
          <div 
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100" : "opacity-0 transform translate-y-4"
            }`}
          >
            <FeatureCard 
              icon={<Database className="h-5 w-5" />}
              title="Comprehensive Data"
              description="Access detailed statistics for thousands of players across major leagues worldwide."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-5 w-5" />}
              title="AI Predictions"
              description="State-of-the-art machine learning models trained on historical transfer data."
            />
            <FeatureCard 
              icon={<Award className="h-5 w-5" />}
              title="Proven Accuracy"
              description="Predictions with up to 85% accuracy compared to actual market values."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="glass-panel rounded-xl p-6 hover-lift">
      <div className="bg-primary/10 text-primary p-2.5 rounded-lg inline-flex mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-foreground/70">{description}</p>
    </div>
  );
}
