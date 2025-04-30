
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  LogOut,
  Plus,
  User,
  Calendar,
  Trophy,
  Award,
  MenuIcon,
  X,
  BarChart2
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const MainNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get user session
  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!session?.user?.email) return "U";
    return session.user.email.substring(0, 1).toUpperCase();
  };
  
  // Check if we're on a landing page (typically /)
  const isLandingPage = location.pathname === "/";
  
  // Force white text on landing page for better visibility with a background color for contrast
  const navLinkClass = isLandingPage 
    ? "bg-white/80 px-3 py-1 rounded-md text-interview-primary hover:bg-white hover:text-interview-secondary transition-colors"
    : "text-slate-700 hover:text-interview-primary transition-colors";

  return (
    <header 
      className={`w-full py-4 px-6 fixed top-0 z-50 transition-all duration-300 ${
        isScrolled || !isLandingPage 
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : isLandingPage ? "bg-white/30 bg-opacity-90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-8 w-auto" />
          <span className={`font-bold text-xl ${
            isLandingPage && !isScrolled ? "text-interview-primary" : "text-interview-primary"
          }`}>AI Mock Interview</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/home" className={navLinkClass}>
            Home
          </Link>
          <Link to="/about" className={navLinkClass}>
            Features
          </Link>
          <Link to="/home" className={navLinkClass}>
            Pricing
          </Link>
          <Link to="/about" className={navLinkClass}>
            About
          </Link>
          <Link to="/feedback" className={navLinkClass}>
            Feedback
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={isLandingPage && !isScrolled ? "text-interview-primary bg-white/80 rounded-full" : "text-slate-700"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-interview-primary hover:border-interview-secondary transition-colors p-0">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={session.user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-interview-primary text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-interview-primary text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{session.user.user_metadata?.full_name || 'User'}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer flex w-full items-center">
                    <BarChart2 className="mr-2 h-4 w-4 text-interview-primary" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/results" className="cursor-pointer flex w-full items-center">
                    <Trophy className="mr-2 h-4 w-4 text-interview-primary" />
                    <span>Results</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/create-interview" className="cursor-pointer flex w-full items-center">
                    <Plus className="mr-2 h-4 w-4 text-interview-primary" />
                    <span>New Interview</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/home" className="cursor-pointer flex w-full items-center">
                    <Award className="mr-2 h-4 w-4 text-interview-primary" />
                    <span>Interview Templates</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 hover:bg-red-50" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="border-interview-primary text-interview-primary hover:bg-interview-primary hover:text-white">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-interview-primary text-white hover:bg-interview-secondary transition-colors">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white pt-20">
          <div className="flex flex-col p-6 space-y-4">
            <Link 
              to="/" 
              className="text-slate-800 hover:text-interview-primary py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="text-slate-800 hover:text-interview-primary py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-slate-800 hover:text-interview-primary py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/about" 
              className="text-slate-800 hover:text-interview-primary py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/feedback" 
              className="text-slate-800 hover:text-interview-primary py-2 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Feedback
            </Link>

            <div className="border-t pt-4 mt-4">
              {session?.user ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-interview-primary text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{session.user.user_metadata?.full_name || 'User'}</p>
                      <p className="text-sm text-slate-500 truncate max-w-[200px]">{session.user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 text-slate-700 hover:text-interview-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <BarChart2 className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      to="/results" 
                      className="flex items-center gap-2 text-slate-700 hover:text-interview-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Trophy className="h-5 w-5" />
                      <span>Results</span>
                    </Link>
                    <Link 
                      to="/create-interview" 
                      className="flex items-center gap-2 text-slate-700 hover:text-interview-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus className="h-5 w-5" />
                      <span>New Interview</span>
                    </Link>
                    <Link 
                      to="/home" 
                      className="flex items-center gap-2 text-slate-700 hover:text-interview-primary py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Award className="h-5 w-5" />
                      <span>Interview Templates</span>
                    </Link>
                    <button
                      className="flex w-full items-center gap-2 text-red-600 hover:text-red-700 py-2"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="block w-full py-2.5 px-3 text-center rounded-md border border-interview-primary text-interview-primary font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block w-full py-2.5 px-3 text-center rounded-md bg-interview-primary text-white font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;
