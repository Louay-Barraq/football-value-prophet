
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserProfile } from "@/services/profileService";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for active Supabase session on mount
    const checkSession = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session && !error) {
        const { user: authUser } = data.session;
        await updateUserState(authUser);
      }
      
      setIsLoading(false);
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await updateUserState(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to update user state with profile information
  const updateUserState = async (authUser) => {
    try {
      // Get additional profile information
      const profile = await getCurrentUserProfile();
      
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
        role: authUser.user_metadata?.role || 'user',
        avatarUrl: profile?.avatar_url || '',
      });
    } catch (error) {
      console.error("Error updating user state:", error);
      // Fall back to basic user info if profile fetch fails
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
        role: authUser.user_metadata?.role || 'user',
      });
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email,
        password,
        options: {
          // Set session duration based on rememberMe flag
          // 3600 = 1 hour (default), 86400 * 30 = 30 days
          expiresIn: rememberMe ? 86400 * 30 : 3600
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: `Welcome back${data.user?.user_metadata?.name ? ', ' + data.user.user_metadata.name : ''}!`,
        variant: "default",
      });
    } catch (error: any) {
      console.error("Login failed", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Signup failed", error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create your account. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Logout failed", error);
      toast({
        title: "Logout failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
