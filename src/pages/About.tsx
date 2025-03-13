
import React from "react";
import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  Database, 
  LucideIcon, 
  ShieldCheck, 
  Sparkles, 
  Brain, 
  Medal,
  TrendingUp,
  Users,
  LayoutGrid,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About Our Platform</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Learn how our AI-powered football player market value prediction system works
            and the technology behind it.
          </p>
          
          <Separator className="my-8" />
          
          {/* Introduction Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <p className="text-lg mb-6">
              Our platform uses advanced machine learning algorithms to analyze over 200 statistical 
              attributes of football players to predict their market value with high accuracy. 
              This gives clubs, agents, and fans valuable insights for transfers, contract negotiations, 
              and player development tracking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <FeatureCard 
                icon={Database} 
                title="Data Collection" 
                description="We gather comprehensive statistics from multiple sources including matches, training sessions, and historical transfer data."
              />
              <FeatureCard 
                icon={Brain} 
                title="AI Processing" 
                description="Our deep learning models analyze performance metrics, potential, age, position, and market conditions."
              />
              <FeatureCard 
                icon={TrendingUp} 
                title="Value Prediction" 
                description="The system generates market value predictions with detailed confidence intervals and rationales."
              />
            </div>
          </section>
          
          {/* Key Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard 
                icon={BarChart3} 
                title="Comprehensive Analysis" 
                description="Evaluate players based on over 200 statistical attributes, from basic metrics to advanced performance indicators."
              />
              <FeatureCard 
                icon={Users} 
                title="Player Comparisons" 
                description="Compare multiple players side-by-side with detailed statistical breakdowns and value projections."
              />
              <FeatureCard 
                icon={ShieldCheck} 
                title="Secure & Private" 
                description="Your data and predictions are secured with enterprise-grade encryption and privacy protection."
              />
              <FeatureCard 
                icon={Sparkles} 
                title="Custom Predictions" 
                description="Input your own statistical data to generate custom predictions for any player scenario."
              />
            </div>
          </section>
          
          {/* Model Accuracy Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Model Accuracy</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary mb-2">93%</p>
                    <p className="text-lg text-muted-foreground">Prediction Accuracy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary mb-2">±8%</p>
                    <p className="text-lg text-muted-foreground">Average Margin of Error</p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary mb-2">24k+</p>
                    <p className="text-lg text-muted-foreground">Players Analyzed</p>
                  </div>
                </div>
                
                <p className="text-center mt-8 text-muted-foreground">
                  Our model is continuously trained on the latest transfer data and player performances,
                  ensuring that predictions remain accurate as market conditions evolve.
                </p>
              </CardContent>
            </Card>
          </section>
          
          {/* Technology Stack */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
            <p className="text-lg mb-8">
              Built with cutting-edge technologies to deliver fast, accurate, and reliable predictions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TechCard 
                icon={Brain} 
                title="Machine Learning" 
                description="TensorFlow and PyTorch models with deep neural networks for complex pattern recognition."
              />
              <TechCard 
                icon={LayoutGrid} 
                title="Modern Frontend" 
                description="React with TypeScript for a responsive, type-safe, and interactive user experience."
              />
              <TechCard 
                icon={Database} 
                title="Data Pipeline" 
                description="Scalable data processing pipeline handling millions of statistical data points daily."
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <Icon className="h-10 w-10 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

// Technology Card Component
const TechCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <Icon className="h-8 w-8 text-primary mb-3" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default About;
