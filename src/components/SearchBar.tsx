
import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  fullWidth?: boolean;
}

export function SearchBar({ 
  placeholder = "Search for players...", 
  className,
  onSearch,
  fullWidth = false
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Example search suggestions with IDs
  const suggestions = [
    { id: "player1", name: "Lionel Messi" },
    { id: "player2", name: "Cristiano Ronaldo" },
    { id: "player3", name: "Kylian Mbappé" },
    { id: "player4", name: "Erling Haaland" },
    { id: "player5", name: "Kevin De Bruyne" }
  ].filter(player => player.name.toLowerCase().includes(query.toLowerCase()));
  
  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
      setIsSearching(false);
      setIsFocused(false);
    }, 500);
  };

  const handlePlayerSelect = (playerId: string, playerName: string) => {
    setQuery(playerName);
    // Ensure navigation happens after state updates
    setTimeout(() => {
      navigate(`/player/${playerId}`);
      setIsFocused(false);
    }, 0);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };
  
  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn(
      "relative",
      fullWidth ? "w-full" : "max-w-md",
      className
    )}>
      <div className={cn(
        "flex items-center rounded-full bg-white border border-input transition-all duration-200 px-4 py-2",
        isFocused ? "ring-2 ring-primary/20 border-primary" : "hover:border-input/90",
        fullWidth ? "w-full" : "w-full max-w-md"
      )}>
        <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent p-0 text-sm focus:outline-none focus:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
        />
        {isSearching ? (
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin flex-shrink-0" />
        ) : query && (
          <button 
            onClick={() => setQuery("")}
            className="h-4 w-4 text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Search suggestions dropdown */}
      {isFocused && query && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white rounded-lg shadow-float border border-border z-10 animate-scale-in origin-top">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            Suggestions
          </div>
          <ul>
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <button
                  className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors"
                  onClick={() => handlePlayerSelect(suggestion.id, suggestion.name)}
                >
                  {suggestion.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
