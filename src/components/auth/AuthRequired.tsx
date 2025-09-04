
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AuthRequired = () => {
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
    // Check for successful email verification or recovery
    const handleHashParams = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        // Set verifying state to prevent flashing redirects
        setIsVerifying(true);
        
        console.log("Processing auth redirect with hash:", hash);
        
        try {
          // Process the authentication hash to complete the verification
          // Use exchangeCodeForSession for handling magic link/email verification
          const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.hash);

          if (error) {
            console.error("Error verifying email:", error);
            toast({
              title: "Verification failed",
              description: error.message,
              variant: "destructive",
            });
            setIsVerifying(false);
            return;
          }

          if (data?.session) {
            // Successfully verified email
            console.log("Email verification successful in AuthRequired:", data.session.user.email);

            toast({
              title: "Email verified successfully",
              description: "Your email has been verified. You are now logged in.",
            });

            // Clear the hash from the URL without reloading the page
            window.history.replaceState(null, document.title, window.location.pathname);

            // Invalidate the session query to refresh the auth state
            queryClient.invalidateQueries({ queryKey: ['session'] });

            // Continue displaying the current page (which should be dashboard if redirected correctly)
            setIsVerifying(false);
          } else {
            setIsVerifying(false);
          }
        } catch (error) {
          console.error("Exception during auth verification in AuthRequired:", error);
          toast({
            title: "Verification error",
            description: "An unexpected error occurred during verification.",
            variant: "destructive",
          });
          setIsVerifying(false);
        }
      }
    };
    
    // Process hash on initial load
    handleHashParams();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out successfully",
            description: "You have been signed out.",
          });
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password reset",
            description: "Your password has been reset successfully.",
          });
        }
        
        // Invalidate the session query to refresh the auth state
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }
    );
    
    // Listen for hash changes (in case the user navigates back/forward)
    window.addEventListener('hashchange', handleHashParams);
    
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHashParams);
    };
  }, [queryClient]);
  
  useEffect(() => {
    if (!isLoading && !isVerifying) {
      setIsChecking(false);
    }
  }, [isLoading, isVerifying]);

  if (isChecking || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-interview-primary mb-4" />
        <p className="text-muted-foreground">
          {isVerifying ? "Processing verification..." : "Checking authentication..."}
        </p>
      </div>
    );
  }
  
  if (!session) {
    // Redirect to login if not authenticated, but save where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthRequired;
