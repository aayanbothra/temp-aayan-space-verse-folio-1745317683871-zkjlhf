
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { usePageTracking } from "./hooks/usePageTracking";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import AdminSetup from "./pages/AdminSetup";
import { seedResumeEntries } from "./data/resumeEntries";
import { seedSkills } from "./data/skillsData";

// Create a client
const queryClient = new QueryClient();

const AppContent = () => {
  usePageTracking();
  
  // Run seed function once on app initialization
  useEffect(() => {
    // Check if we need to seed the database
    const checkAndSeedDatabase = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Check if resume entries exist
      const { data: existingEntries, error: resumeError } = await supabase
        .from('resume')
        .select('id')
        .limit(1);
      
      if (resumeError) {
        console.error('Error checking resume entries:', resumeError);
      } else if (existingEntries.length === 0) {
        console.log('No resume entries found, seeding database...');
        await seedResumeEntries();
      }
      
      // Check if skills exist
      const { data: existingSkills, error: skillsError } = await supabase
        .from('skills')
        .select('id')
        .limit(1);
      
      if (skillsError) {
        console.error('Error checking skills:', skillsError);
      } else if (existingSkills.length === 0) {
        console.log('No skills found, seeding database...');
        await seedSkills();
      }
    };
    
    checkAndSeedDatabase();
  }, []);
  
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AppContent />
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
