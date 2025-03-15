
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function CsvImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setUploadStatus('idle');
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid CSV file",
        variant: "destructive",
      });
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // First, upload the file to Supabase Storage for processing
      const filename = `player_import_${Date.now()}.csv`;
      const { error: uploadError } = await supabase.storage
        .from('csv-imports')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      // Then call our function to process the CSV
      const { data, error: functionError } = await supabase.functions.invoke('process-csv-import', {
        body: { 
          filename, 
          userId: user.id 
        },
      });

      if (functionError) throw functionError;

      setUploadStatus('success');
      setStatusMessage(`Successfully processed ${data?.processedCount || 0} players`);
      
      toast({
        title: "Upload successful",
        description: `Your CSV file has been uploaded and is being processed.`,
      });
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadStatus('error');
      setStatusMessage(error.message || "Failed to upload CSV file");
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload CSV file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 mt-4">Import Player Data</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>CSV Import</CardTitle>
          <CardDescription>
            Upload a CSV file containing player data to import into the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label 
              htmlFor="csv-upload" 
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-lg font-medium mb-1">
                {file ? file.name : "Drop CSV file here or click to browse"}
              </span>
              <span className="text-sm text-gray-500">
                Only CSV files are supported
              </span>
            </label>
          </div>
          
          {uploadStatus === 'success' && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}
          
          {uploadStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Expected columns in CSV file:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>name - Player's full name</li>
              <li>age - Player's age</li>
              <li>position - Player's position</li>
              <li>club - Player's club</li>
              <li>nationality - Player's nationality</li>
              <li>market_value - Player's market value in euros</li>
              <li>goals - Total goals</li>
              <li>assists - Total assists</li>
              <li>appearances - Number of appearances</li>
              <li>etc...</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload & Process"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
