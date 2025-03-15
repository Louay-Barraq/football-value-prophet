import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  
  // Track scroll position to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignIn = () => {
    window.dispatchEvent(new CustomEvent("open-auth-modal"));
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/");
      window.dispatchEvent(new CustomEvent("open-auth-modal"));
    }
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-subtle" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="font-bold text-2xl tracking-tight text-foreground">
            <span className="text-primary">Value</span>Prophet
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" />
          <NavLink to="/search" label="Players" />
          <NavLink to="/predictions" label="Predictions" />
          <NavLink to="/about" label="About" />
        </nav>
        
        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Search" onClick={handleSearchClick}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={handleSignIn}>Sign In</Button>
          <Button onClick={handleGetStarted}>Get Started</Button>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background animate-fade-in">
          <div className="container mx-auto p-6 flex flex-col space-y-6">
            <nav className="flex flex-col space-y-6 py-8">
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/search" label="Players" />
              <MobileNavLink to="/predictions" label="Predictions" />
              <MobileNavLink to="/about" label="About" />
            </nav>
            <div className="flex flex-col space-y-4 pt-4 border-t border-border">
              <Button variant="outline" className="w-full justify-start" onClick={handleSignIn}>
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button className="w-full" onClick={handleGetStarted}>Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Desktop Navigation Link
function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-foreground/80"
      )}
    >
      {label}
    </Link>
  );
}

// Mobile Navigation Link
function MobileNavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "text-lg font-medium transition-colors",
        isActive ? "text-primary" : "text-foreground/80"
      )}
    >
      {label}
    </Link>
  );
}
