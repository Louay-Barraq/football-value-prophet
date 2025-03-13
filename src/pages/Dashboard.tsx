
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/Header";
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip as RechartsTooltip } from "recharts";
import { BarChart3, ListFilter, Search, TrendingUp, UserRound } from "lucide-react";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Sample data for the charts
  const predictionData = [
    { name: "Accurate", value: 18, color: "#10B981" },
    { name: "Moderate", value: 7, color: "#F59E0B" },
    { name: "Inaccurate", value: 2, color: "#EF4444" },
  ];

  const playerPositions = [
    { name: "Forward", value: 12, color: "#3B82F6" },
    { name: "Midfielder", value: 8, color: "#8B5CF6" },
    { name: "Defender", value: 5, color: "#EC4899" },
    { name: "Goalkeeper", value: 2, color: "#6366F1" },
  ];

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}!
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="mt-4 md:mt-0">
            <UserRound className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="py-2">Overview</TabsTrigger>
            <TabsTrigger value="predictions" className="py-2">Predictions</TabsTrigger>
            <TabsTrigger value="favorites" className="py-2">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <StatsCard 
                title="Predictions Made" 
                value="27" 
                description="5 in the last 7 days"
                icon={<BarChart3 className="h-5 w-5 text-primary" />}
              />
              <StatsCard 
                title="Saved Players" 
                value="14" 
                description="3 new this month"
                icon={<UserRound className="h-5 w-5 text-primary" />}
              />
              <StatsCard 
                title="Accuracy Rate" 
                value="87%" 
                description="Improved by 2% this month"
                icon={<TrendingUp className="h-5 w-5 text-primary" />}
              />
            </div>
            
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Accuracy</CardTitle>
                  <CardDescription>
                    Performance of your recent player valuations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={predictionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {predictionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Player Distribution</CardTitle>
                  <CardDescription>
                    Breakdown by player positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={playerPositions}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="value"
                          label={({name, value}) => `${name}: ${value}`}
                        >
                          {playerPositions.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Find Players
                </Button>
                <Button className="w-full justify-start">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  New Prediction
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ListFilter className="mr-2 h-4 w-4" />
                  View All Reports
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
                <CardDescription>
                  Your latest player valuations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You haven't made any predictions yet. Get started by searching for a player and creating your first valuation.
                </p>
                <Button className="mt-4">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  New Prediction
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Players</CardTitle>
                <CardDescription>
                  Players you're tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You haven't added any players to your favorites yet. Search for players and add them to your favorites for quick access.
                </p>
                <Button className="mt-4">
                  <Search className="mr-2 h-4 w-4" />
                  Find Players
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
