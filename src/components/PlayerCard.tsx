
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

interface PlayerCardProps {
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
  onClick?: () => void;
}

export function PlayerCard({
  id,
  name,
  position,
  club,
  clubLogo,
  nationality,
  nationalityFlag,
  marketValue,
  estimatedValue,
  imageUrl,
  age,
  onClick
}: PlayerCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Calculate value difference and format
  const valueDiff = estimatedValue - marketValue;
  const valueDiffPercent = Math.round((valueDiff / marketValue) * 100);
  const diffDirection = valueDiff > 0 ? "up" : valueDiff < 0 ? "down" : "neutral";
  
  // Format currency (in millions/thousands)
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };

  return (
    <Card 
      className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-secondary/50">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary text-6xl font-bold text-secondary-foreground/30">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={name} 
              className={`w-full h-full object-cover object-top transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          
          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
              {age} y.o.
            </div>
            <div className="bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium flex items-center">
              {position}
            </div>
          </div>
          
          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold text-lg mb-1 truncate">{name}</h3>
            <div className="flex items-center">
              {clubLogo && (
                <img src={clubLogo} alt={club} className="w-4 h-4 mr-1.5 object-contain" />
              )}
              <span className="text-white/90 text-sm">{club}</span>
              
              <div className="ml-auto flex items-center">
                {nationalityFlag && (
                  <img src={nationalityFlag} alt={nationality} className="w-4 h-3 mr-1.5 object-contain" />
                )}
                <span className="text-white/90 text-sm">{nationality}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Market Value</div>
            <div className="text-lg font-bold">{formatValue(marketValue)}</div>
          </div>
          
          <div>
            <div className="text-xs text-muted-foreground mb-1">Our Estimate</div>
            <div className="flex items-center">
              <div className={`text-lg font-bold ${
                diffDirection === "up" ? "text-green-600" : 
                diffDirection === "down" ? "text-red-600" : ""
              }`}>
                {formatValue(estimatedValue)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-secondary/10 border-t border-border">
        <div className="flex items-center w-full">
          <span className="text-sm">Value difference:</span>
          <div className="ml-auto flex items-center">
            {diffDirection === "up" ? (
              <TrendingUp className="text-green-600 h-4 w-4 mr-1" />
            ) : diffDirection === "down" ? (
              <TrendingDown className="text-red-600 h-4 w-4 mr-1" />
            ) : (
              <Minus className="text-gray-500 h-4 w-4 mr-1" />
            )}
            
            <span className={`text-sm font-medium ${
              diffDirection === "up" ? "text-green-600" : 
              diffDirection === "down" ? "text-red-600" : "text-gray-500"
            }`}>
              {Math.abs(valueDiffPercent)}%
            </span>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 text-muted-foreground hover:text-foreground">
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">
                    {diffDirection === "up" 
                      ? "Our AI estimates this player is undervalued"
                      : diffDirection === "down"
                      ? "Our AI estimates this player is overvalued"
                      : "Our AI estimate matches the market value"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
