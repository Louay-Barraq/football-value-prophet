
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload,
  FileJson,
  Download,
  Brain,
  SlidersHorizontal,
  History,
  RefreshCw,
  HelpCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { StatisticsChart } from "@/components/StatisticsChart";

interface PredictionResult {
  marketValue: number;
  confidenceInterval: [number, number];
  keyFactors: {
    name: string;
    value: number;
    maxValue: number;
    impact: 'positive' | 'negative' | 'neutral';
    color: string;
  }[];
  formattedValue: string;
}

const Predictions = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [jsonData, setJsonData] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm({
    defaultValues: {
      age: "",
      position: "",
      minutes: "",
      goals: "",
      assists: "",
      passes: "",
      passAccuracy: "",
      shotsOnTarget: "",
      tacklesWon: "",
      interceptions: "",
      duelsWon: "",
      additionalStats: ""
    },
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Handle JSON file upload
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = event.target?.result as string;
        // Validate JSON format
        JSON.parse(jsonContent);
        setJsonData(jsonContent);
        toast.success("JSON file uploaded successfully");
      } catch (error) {
        toast.error("Invalid JSON format");
        setJsonData("");
      }
    };
    reader.readAsText(file);
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleManualPrediction = (values: any) => {
    setIsPredicting(true);
    
    // Simulate API call for prediction
    setTimeout(() => {
      const mockResult: PredictionResult = {
        marketValue: 75000000,
        confidenceInterval: [65000000, 85000000],
        keyFactors: [
          { name: "Goals", value: parseFloat(values.goals) || 15, maxValue: 40, impact: 'positive', color: "#3B82F6" },
          { name: "Age", value: parseFloat(values.age) || 24, maxValue: 40, impact: 'neutral', color: "#F59E0B" },
          { name: "Minutes", value: parseFloat(values.minutes) || 2500, maxValue: 4500, impact: 'positive', color: "#10B981" },
          { name: "Pass Accuracy", value: parseFloat(values.passAccuracy) || 85, maxValue: 100, impact: 'positive', color: "#8B5CF6" },
          { name: "Tackles Won", value: parseFloat(values.tacklesWon) || 45, maxValue: 100, impact: 'negative', color: "#EC4899" },
        ],
        formattedValue: "€75M"
      };
      
      setPredictionResult(mockResult);
      setIsPredicting(false);
      toast.success("Prediction completed successfully");
    }, 2000);
  };
  
  const handleJsonPrediction = () => {
    if (!jsonData) {
      toast.error("Please upload a JSON file first");
      return;
    }
    
    setIsPredicting(true);
    
    // Simulate API call for prediction from JSON data
    setTimeout(() => {
      try {
        const parsedData = JSON.parse(jsonData);
        const mockResult: PredictionResult = {
          marketValue: 92000000,
          confidenceInterval: [85000000, 98000000],
          keyFactors: [
            { name: "Goals", value: parsedData.goals || 22, maxValue: 40, impact: 'positive', color: "#3B82F6" },
            { name: "Age", value: parsedData.age || 21, maxValue: 40, impact: 'positive', color: "#F59E0B" },
            { name: "Minutes", value: parsedData.minutes || 3100, maxValue: 4500, impact: 'positive', color: "#10B981" },
            { name: "Pass Accuracy", value: parsedData.passAccuracy || 88, maxValue: 100, impact: 'positive', color: "#8B5CF6" },
            { name: "Tackles Won", value: parsedData.tacklesWon || 62, maxValue: 100, impact: 'neutral', color: "#EC4899" },
          ],
          formattedValue: "€92M"
        };
        
        setPredictionResult(mockResult);
        toast.success("Prediction completed successfully");
      } catch (error) {
        toast.error("Error processing JSON data");
      } finally {
        setIsPredicting(false);
      }
    }, 2000);
  };
  
  const resetForm = () => {
    form.reset();
    setPredictionResult(null);
    setJsonData("");
    toast.info("Form has been reset");
  };
  
  const downloadResult = () => {
    if (!predictionResult) return;
    
    const jsonStr = JSON.stringify(predictionResult, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(jsonStr)}`;
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `player_prediction_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Prediction results downloaded");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Player Value Predictions</h1>
          <p className="text-muted-foreground">
            Input player statistics to predict their market value using our AI model
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Player Statistics Input</CardTitle>
                <CardDescription>
                  Enter player statistics manually or upload JSON data to generate a prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="manual">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Manual Entry
                    </TabsTrigger>
                    <TabsTrigger value="json">
                      <FileJson className="mr-2 h-4 w-4" />
                      JSON Upload
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Manual Entry Tab */}
                  <TabsContent value="manual">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleManualPrediction)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Basic Info */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Basic Information</h3>
                            
                            <FormField
                              control={form.control}
                              name="age"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Age</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 25" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="position"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Position</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Striker" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="minutes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Minutes Played</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 2500" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Offensive Stats */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Offensive Statistics</h3>
                            
                            <FormField
                              control={form.control}
                              name="goals"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Goals</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 15" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="assists"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Assists</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 7" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="shotsOnTarget"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Shots on Target</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 45" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Possession Stats */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Possession Statistics</h3>
                            
                            <FormField
                              control={form.control}
                              name="passes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Passes</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 1200" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="passAccuracy"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pass Accuracy (%)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 85" type="number" max={100} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          {/* Defensive Stats */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Defensive Statistics</h3>
                            
                            <FormField
                              control={form.control}
                              name="tacklesWon"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tackles Won</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 45" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="interceptions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Interceptions</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 30" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="duelsWon"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duels Won</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. 120" type="number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="additionalStats"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Statistics (JSON format)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder='{"xG": 14.2, "distanceCovered": 320.5}'
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Add any additional statistics in JSON format that may help with prediction accuracy
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={resetForm}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset
                          </Button>
                          <Button type="submit" disabled={isPredicting}>
                            {isPredicting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Brain className="mr-2 h-4 w-4" />
                                Generate Prediction
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  {/* JSON Upload Tab */}
                  <TabsContent value="json">
                    <div className="space-y-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".json"
                          onChange={handleFileUpload}
                        />
                        
                        <Button 
                          variant="outline" 
                          onClick={triggerFileUpload}
                          className="mb-4"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload JSON
                        </Button>
                        
                        <p className="text-sm text-muted-foreground">
                          Upload a JSON file containing player statistics
                        </p>
                      </div>
                      
                      {jsonData && (
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-md">
                            <Label className="text-sm mb-2 block">JSON Content Preview</Label>
                            <pre className="text-xs overflow-auto max-h-[200px]">
                              {jsonData}
                            </pre>
                          </div>
                          
                          <div className="flex justify-end gap-4">
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setJsonData("");
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Clear
                            </Button>
                            <Button onClick={handleJsonPrediction} disabled={isPredicting}>
                              {isPredicting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Brain className="mr-2 h-4 w-4" />
                                  Generate Prediction
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-amber-800">JSON Format Guidelines</h4>
                            <p className="text-xs text-amber-700 mt-1">
                              For accurate predictions, your JSON should include: age, position, minutes, goals, assists, passes, tackles, etc.
                            </p>
                            <p className="text-xs text-amber-700 mt-2">
                              Example format:
                            </p>
                            <pre className="text-xs bg-amber-100 p-2 rounded mt-1 overflow-auto">
{`{
  "age": 23,
  "position": "Striker",
  "minutes": 2500,
  "goals": 18,
  "assists": 7,
  "passes": 1200,
  "passAccuracy": 85,
  "tacklesWon": 45
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Prediction Result</CardTitle>
                <CardDescription>
                  Estimated market value based on provided statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPredicting ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Processing your data...</p>
                  </div>
                ) : predictionResult ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {predictionResult.formattedValue}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Confidence Interval: 
                        {` €${(predictionResult.confidenceInterval[0] / 1000000).toFixed(1)}M - €${(predictionResult.confidenceInterval[1] / 1000000).toFixed(1)}M`}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Key Influencing Factors</h4>
                      
                      <div className="space-y-3">
                        {predictionResult.keyFactors.map((factor, index) => (
                          <div key={index} className="grid grid-cols-5 items-center gap-2">
                            <div className="col-span-2 text-sm">{factor.name}</div>
                            <div className="col-span-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${(factor.value / factor.maxValue) * 100}%`,
                                  backgroundColor: factor.color
                                }}
                              ></div>
                            </div>
                            <div className="col-span-1 text-right text-sm font-medium">
                              {factor.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Brain className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No prediction generated yet</p>
                    <p className="text-xs text-muted-foreground">
                      Fill in the player statistics and click "Generate Prediction"
                    </p>
                  </div>
                )}
              </CardContent>
              {predictionResult && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Prediction
                  </Button>
                  <Button size="sm" onClick={downloadResult}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Predictions;
