
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
  className?: string;
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
  className,
}: PlayerCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate value difference
  const valueDifference = estimatedValue - marketValue;
  const differencePercent = Math.round((valueDifference / marketValue) * 100);
  
  // Format market value in millions
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };
  
  const valueDirection = valueDifference > 0 ? "up" : valueDifference < 0 ? "down" : "same";
  
  // Generate placeholder for image loading
  const placeholderName = name.split(' ').map(part => part[0]).join('');

  return (
    <Link to={`/player/${id}`} className={cn("block", className)}>
      <div className="glass-panel rounded-xl overflow-hidden transition-all duration-300 hover-lift">
        {/* Player Image Section */}
        <div className="aspect-[3/4] relative bg-secondary/50 overflow-hidden">
          {/* Status Badge */}
          <div className={cn(
            "absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full text-xs font-medium",
            valueDirection === "up" ? "bg-green-100 text-green-800" : 
            valueDirection === "down" ? "bg-red-100 text-red-800" : 
            "bg-gray-100 text-gray-800"
          )}>
            <div className="flex items-center space-x-1">
              {valueDirection === "up" ? <TrendingUp className="h-3 w-3" /> : 
               valueDirection === "down" ? <TrendingDown className="h-3 w-3" /> : 
               <Minus className="h-3 w-3" />}
              <span>{differencePercent > 0 ? "+" : ""}{differencePercent}%</span>
            </div>
          </div>
          
          {/* Player Image or Placeholder */}
          {imageUrl ? (
            <>
              <div className={cn(
                "absolute inset-0 bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400 transition-opacity duration-300",
                isLoading ? "opacity-100" : "opacity-0"
              )}>
                {placeholderName}
              </div>
              <img 
                src={imageUrl} 
                alt={name} 
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-500",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setIsLoading(false)}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
              {placeholderName}
            </div>
          )}
        </div>
        
        {/* Player Info Section */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
              <div className="flex items-center space-x-2 text-sm text-foreground/70">
                <span>{position}</span>
                <span className="text-foreground/30">•</span>
                <span>{age} yrs</span>
              </div>
            </div>
          </div>
          
          {/* Club and Nationality */}
          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="flex items-center space-x-1.5">
              {clubLogo && (
                <img src={clubLogo} alt={club} className="w-4 h-4 object-contain" />
              )}
              <span className="text-foreground/80">{club}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              {nationalityFlag && (
                <img src={nationalityFlag} alt={nationality} className="w-4 h-4 object-contain" />
              )}
              <span className="text-foreground/80">{nationality}</span>
            </div>
          </div>
          
          {/* Value Section */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between items-baseline">
              <div>
                <div className="text-xs text-foreground/60 mb-1">Market Value</div>
                <div className="font-semibold">{formatValue(marketValue)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-foreground/60 mb-1">Our Estimate</div>
                <div className={cn(
                  "font-semibold",
                  valueDirection === "up" ? "text-green-600" : 
                  valueDirection === "down" ? "text-red-600" : ""
                )}>
                  {formatValue(estimatedValue)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
