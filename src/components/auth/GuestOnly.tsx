
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GuestOnly = () => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });
  
  useEffect(() => {
    // Check for email verification in URL hash
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // Set verifying state to prevent flashing redirects
      setIsVerifying(true);
      
      // Handle the hash part for email verification
      const handleEmailVerification = async () => {
        try {
          console.log("Processing email verification with hash:", hash);
          
          // Get session directly from the URL - this is more reliable than getUser
          const { data, error } = await supabase.auth.getSessionFromUrl();
          
          if (error) {
            console.error("Error verifying email:", error);
            toast({
              title: "Verification failed",
              description: error.message || "There was a problem verifying your email. Please try again.",
              variant: "destructive",
            });
            setIsVerifying(false);
            return;
          }
          
          if (data?.session) {
            console.log("Email verification successful, session created:", data.session.user.email);
            
            // Set the session in supabase client
            const { data: userData } = await supabase.auth.setSession(data.session);
            
            // Force session refresh to ensure we have the latest session
            const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
            
            if (sessionError) {
              console.error("Error getting session after verification:", sessionError);
              toast({
                title: "Session error",
                description: "Your email was verified, but we couldn't log you in automatically. Please try logging in.",
                variant: "destructive",
              });
              setIsVerifying(false);
              return;
            } 
            
            if (sessionData?.session) {
              console.log("Session obtained after verification:", sessionData.session.user.email);
              
              // Invalidate the session query to refresh the auth state
              queryClient.invalidateQueries({ queryKey: ['session'] });
              
              toast({
                title: "Email verified successfully",
                description: "Your email has been verified. You are now logged in.",
              });
              
              // Clear the hash from URL without reloading the page
              window.history.replaceState(null, document.title, window.location.pathname);
              
              // When verified successfully, force navigation to dashboard
              console.log("Redirecting to dashboard after successful verification");
              window.location.replace("/dashboard");
              return;
            }
          }
        } catch (error) {
          console.error("Exception during email verification:", error);
          toast({
            title: "Verification error",
            description: "An unexpected error occurred during verification.",
            variant: "destructive",
          });
          setIsVerifying(false);
        }
      };
      
      handleEmailVerification();
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        console.log("Auth event in GuestOnly:", event);
        
        if (event === 'SIGNED_IN') {
          console.log("User signed in, redirecting to dashboard");
          // Navigate to dashboard page after sign in
          window.location.replace("/dashboard");
        } else if (event === 'USER_UPDATED') {
          console.log("User updated, refreshing session data");
          // Invalidate the session query
          queryClient.invalidateQueries({ queryKey: ['session'] });
        }
        
        // Invalidate the session query for any auth state change
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }
    );
    
    return () => subscription.unsubscribe();
  }, [queryClient]);
  
  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
    }
  }, [isLoading]);

  if (isChecking || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-interview-primary mb-4" />
        <p className="text-muted-foreground">
          {isVerifying ? "Verifying your email..." : "Checking authentication..."}
        </p>
      </div>
    );
  }
  
  if (session) {
    // If user is already authenticated, redirect to dashboard or the page they were trying to access
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default GuestOnly;
