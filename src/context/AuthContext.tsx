
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the admin email for access control
export const ADMIN_EMAIL = 'contact@aayanbothra.space'; // Change this to your actual admin email

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider initializing...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth state changed: ${event}`, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.email === ADMIN_EMAIL);
        
        // Show toast on sign out
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          });
        }
        
        // Show toast on sign in
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in",
            description: "You have been successfully signed in.",
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === ADMIN_EMAIL);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signOut = async () => {
    console.log("Signing out...");
    await supabase.auth.signOut();
  };

  const contextValue = {
    session,
    user,
    isAdmin,
    signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
