
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, CalendarIcon, TrendingUp, Pencil, Clock, Medal } from "lucide-react";
import StatisticsChart from "@/components/StatisticsChart";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { usePlayer } from "@/hooks/usePlayer";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { createPrediction } from "@/services/predictionsService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthModal } from "@/components/AuthModal";

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictedValue, setPredictedValue] = useState("");
  const [confidenceScore, setConfidenceScore] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch player data using our custom hook
  const { player, statistics, userPredictions, isLoading, error } = usePlayer(id || "");

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleMakePrediction = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setIsPredicting(true);
    }
  };

  const handleSubmitPrediction = async () => {
    if (!player) return;
    
    setIsSubmitting(true);
    
    try {
      // Convert inputs to numbers
      const valueNumber = parseInt(predictedValue.replace(/[^0-9]/g, ""), 10);
      const confidenceNumber = confidenceScore ? parseFloat(confidenceScore) : undefined;
      
      await createPrediction(
        player.id,
        valueNumber,
        confidenceNumber,
        notes || undefined
      );
      
      toast({
        title: "Prediction saved",
        description: "Your prediction has been saved successfully.",
      });
      
      setIsPredicting(false);
      setPredictedValue("");
      setConfidenceScore("");
      setNotes("");
      
    } catch (err) {
      console.error("Error saving prediction:", err);
      toast({
        title: "Error saving prediction",
        description: "There was an error saving your prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelPrediction = () => {
    setIsPredicting(false);
    setPredictedValue("");
    setConfidenceScore("");
    setNotes("");
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4"></div>
          <div className="h-10 w-3/4 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 h-96 bg-muted rounded"></div>
            <div className="col-span-2 h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBackClick} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Player not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleBackClick} className="mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Player Info Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex justify-between items-center">
              Player Information
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" /> Last updated: {new Date(player.updated_at).toLocaleDateString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              {player.image_url ? (
                <img 
                  src={player.image_url} 
                  alt={player.name} 
                  className="h-40 w-40 object-cover rounded-full border-2 border-primary"
                />
              ) : (
                <div className="h-40 w-40 rounded-full bg-muted flex items-center justify-center text-4xl font-bold">
                  {player.name.charAt(0)}
                </div>
              )}
              <h2 className="text-2xl font-bold mt-4">{player.name}</h2>
              <div className="flex items-center mt-1">
                {player.nationality_flag && (
                  <img 
                    src={player.nationality_flag} 
                    alt={player.nationality} 
                    className="h-4 w-6 mr-2"
                  />
                )}
                <span>{player.nationality}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Club</span>
                <span className="font-medium flex items-center">
                  {player.club_logo && (
                    <img 
                      src={player.club_logo} 
                      alt={player.club} 
                      className="h-5 w-5 mr-2"
                    />
                  )}
                  {player.club}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Position</span>
                <span className="font-medium">{player.position}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">{player.age}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Market Value</span>
                <span className="font-medium text-primary">
                  {formatCurrency(player.market_value)}
                </span>
              </div>
              
              {player.estimated_value && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">Estimated Value</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(player.estimated_value)}
                  </span>
                </div>
              )}
            </div>
            
            {/* Prediction Button */}
            {isPredicting ? (
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Make Your Prediction</h3>
                
                <div>
                  <label className="text-sm text-muted-foreground">
                    Predicted Value
                  </label>
                  <Input
                    value={predictedValue}
                    onChange={(e) => setPredictedValue(e.target.value)}
                    placeholder="£50,000,000"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">
                    Confidence (1-100)
                  </label>
                  <Input
                    value={confidenceScore}
                    onChange={(e) => setConfidenceScore(e.target.value)}
                    placeholder="90"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground">
                    Notes (Optional)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Your reasoning..."
                    className="mt-1"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmitPrediction}
                    disabled={!predictedValue || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Prediction
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelPrediction}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="w-full mt-6"
                onClick={handleMakePrediction}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                {userPredictions.length > 0 ? "Update Prediction" : "Make Prediction"}
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Statistics Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Performance Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stats">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="chart">Performance Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="space-y-4">
                {statistics.length > 0 ? (
                  <div className="space-y-6 mt-4">
                    {statistics.map((season) => (
                      <div key={season.id} className="space-y-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="text-lg font-semibold">{season.season}</h3>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{season.goals}</div>
                                <div className="text-sm text-muted-foreground">Goals</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{season.assists}</div>
                                <div className="text-sm text-muted-foreground">Assists</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{season.appearances}</div>
                                <div className="text-sm text-muted-foreground">Appearances</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{season.minutes_played}</div>
                                <div className="text-sm text-muted-foreground">Minutes</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {season.pass_accuracy && (
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-center">
                                  <div className="text-2xl font-bold">{season.pass_accuracy}%</div>
                                  <div className="text-sm text-muted-foreground">Pass Accuracy</div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{season.tackles}</div>
                                <div className="text-sm text-muted-foreground">Tackles</div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <div className="text-2xl font-bold">{season.interceptions}</div>
                                <div className="text-sm text-muted-foreground">Interceptions</div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    No statistics available for this player.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="chart">
                <div className="h-[400px]">
                  {statistics.length > 0 ? (
                    <StatisticsChart data={statistics.map(stat => ({
                      season: stat.season,
                      goals: stat.goals,
                      assists: stat.assists,
                      appearances: stat.appearances
                    }))} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No chart data available for this player.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* User predictions card (only show if authenticated and has predictions) */}
      {isAuthenticated && userPredictions.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Medal className="h-5 w-5 mr-2 text-primary" />
              Your Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Predicted Value</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPredictions.map((prediction) => (
                    <TableRow key={prediction.id}>
                      <TableCell>
                        {new Date(prediction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(prediction.predicted_value)}
                      </TableCell>
                      <TableCell>
                        {prediction.confidence_score ? `${prediction.confidence_score}%` : "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {prediction.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab="signin"
      />
    </div>
  );
}
