
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import CreateInterview from "./pages/CreateInterview";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import AuthRequired from "./components/auth/AuthRequired";
import GuestOnly from "./components/auth/GuestOnly";
import { useEffect } from "react";
import ResultsHistory from "./pages/ResultsHistory";
import { supabase } from "./integrations/supabase/client";
import { toast } from "./hooks/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

const App = () => {
  // Handle email verification redirects
  useEffect(() => {
    const handleHashChange = async () => {
      const hash = window.location.hash;
      // Check for auth-related hash parameters more comprehensively
      if (hash && (hash.includes('type=recovery') || hash.includes('type=signup') || hash.includes('access_token'))) {
        console.log("Processing auth redirect with hash:", hash);
        
        // This handles auth redirects on any route
        if (hash.includes('access_token')) {
          try {
            // Set session from the hash
            const { data: hashData, error: hashError } = await supabase.auth.getSessionFromUrl();
            if (hashError) {
              console.error("Error getting session from URL:", hashError);
              toast({
                title: "Authentication Error",
                description: "There was a problem verifying your email. Please try again.",
                variant: "destructive",
              });
              return;
            }
            
            if (hashData?.session) {
              console.log("Successfully authenticated from URL hash");
              
              // Force session refresh to ensure we have the latest session
              const { data: sessionData } = await supabase.auth.refreshSession();
              
              if (sessionData?.session) {
                console.log("Session refreshed successfully, redirecting to dashboard");
                
                // Show success toast
                toast({
                  title: "Email verified",
                  description: "You have been successfully authenticated.",
                });
                
                // Clear the hash and redirect to dashboard
                window.location.replace('/dashboard');
              }
            }
          } catch (error) {
            console.error("Error in App auth processing:", error);
            toast({
              title: "Authentication Error",
              description: "An unexpected error occurred during verification.",
              variant: "destructive",
            });
          }
        }
      }
    };
    
    // Process hash on initial load
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - accessible to everyone */}
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/feedback" element={<Feedback />} />
            
            {/* Guest-only routes - only accessible when NOT logged in */}
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            
            {/* Protected routes - require authentication */}
            <Route element={<AuthRequired />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interview/:id" element={<Interview />} />
              <Route path="/results/:id" element={<Results />} />
              <Route path="/results" element={<ResultsHistory />} />
              <Route path="/create-interview" element={<CreateInterview />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
