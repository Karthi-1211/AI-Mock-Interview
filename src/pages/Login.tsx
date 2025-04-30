
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/common/Logo";
import MainLayout from "@/components/layouts/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Check for email verification success
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // There's a hash in the URL which might be from email verification
      console.log("Found access token in URL, attempting to apply session");
      
      const handleHashChange = async () => {
        try {
          // This will set the session with the access token in the URL
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            console.error("Error processing auth hash:", error);
          } else if (data?.user) {
            console.log("User authenticated from URL hash:", data.user);
            // Navigate to dashboard after successful auth from hash
            toast({
              title: "Email verified successfully",
              description: "You are now logged in.",
            });
            navigate("/dashboard", { replace: true });
          }
        } catch (err) {
          console.error("Exception during hash processing:", err);
        }
      };
      
      handleHashChange();
    }
  }, [navigate, toast]);

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    
    try {
      console.log("Attempting login with:", values.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        console.error("Login error:", error);
        
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and confirm your account before logging in.",
            variant: "destructive",
          });
        } else if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message || "An error occurred during login. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }
      
      console.log("Login successful:", data);
      toast({
        title: "Login successful!",
        description: "Redirecting to your dashboard...",
      });
      
      // Navigate to the page they were trying to access, or dashboard
      navigate(from, { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Unexpected login error:", error.message);
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } else {
        console.error("Unexpected login error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout showNav={false}>
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="hidden md:block md:w-1/2">
          <div className="h-full flex items-center justify-center p-12 bg-interview-primary bg-opacity-10 backdrop-blur-sm">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-interview-primary to-interview-accent">Welcome Back!</h2>
              <p className="mt-4 text-slate-700">
                Continue your journey to mastering interviews with our AI-powered platform.
              </p>
              <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-100 shadow-lg shadow-indigo-100/20">
                <div className="text-xl font-medium text-interview-primary mb-4">Why our users love StellarMock</div>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-interview-light p-1 mt-0.5">
                      <svg className="h-3 w-3 text-interview-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 text-sm">Personalized feedback that helps identify strengths and weaknesses</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-interview-light p-1 mt-0.5">
                      <svg className="h-3 w-3 text-interview-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 text-sm">Industry-specific questions tailored to your experience level</span>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 rounded-full bg-interview-light p-1 mt-0.5">
                      <svg className="h-3 w-3 text-interview-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 text-sm">Detailed analytics to track your improvement over time</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <Logo className="h-12 w-auto mx-auto" />
              </Link>
              <h2 className="mt-6 text-3xl font-bold text-slate-800">Log in to your account</h2>
              <p className="mt-2 text-sm text-slate-600">
                Continue your interview preparation journey
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john@example.com" 
                          type="email" 
                          {...field} 
                          className="border-slate-200 focus:border-interview-primary focus:ring-interview-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-slate-700">Password</FormLabel>
                        <Link to="/forgot-password" className="text-sm text-interview-primary hover:text-interview-secondary">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="••••••••" 
                            type={showPassword ? "text" : "password"} 
                            {...field}
                            className="border-slate-200 focus:border-interview-primary focus:ring-interview-primary/20 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-interview-primary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-slate-700">Remember me</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-interview-primary hover:bg-interview-secondary transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-interview-primary hover:text-interview-secondary">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
