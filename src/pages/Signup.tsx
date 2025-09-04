import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Loader2, Eye, EyeOff, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const signupSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    return Math.min(100, strength);
  };

  const getPasswordStrengthText = (strength: number): { text: string; icon: JSX.Element } => {
    if (strength === 0) return { text: "Enter password", icon: <Shield className="h-4 w-4" /> };
    if (strength < 40) return { text: "Weak", icon: <ShieldX className="h-4 w-4 text-destructive" /> };
    if (strength < 70) return { text: "Medium", icon: <Shield className="h-4 w-4 text-yellow-500" /> };
    return { text: "Strong", icon: <ShieldCheck className="h-4 w-4 text-green-500" /> };
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength === 0) return "bg-slate-200";
    if (strength < 40) return "bg-destructive";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue("password", value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  async function onSubmit(values: SignupFormValues) {
    setIsSubmitting(true);
    
    try {
      console.log("Attempting signup with:", values.email);
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            agree_terms: values.agreeTerms,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) {
        console.error("Signup error:", error);
        if (error.message.includes("User already registered")) {
          toast({
            title: "Email already registered",
            description: "This email is already in use. Please log in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "There was a problem with your signup. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }
      
      console.log("Signup response:", data);
      
      if (!data.session) {
        // No session means new user, redirect to login
        const toastKey = 'toast-signup-success-shown';
        if (!sessionStorage.getItem(toastKey)) {
          toast({
            title: "Signup successful!",
            description: "Please log in to continue.",
          });
          sessionStorage.setItem(toastKey, '1');
        }
        navigate("/login");
      } else {
        // Unexpected case where session exists (shouldn't happen with email confirmation disabled)
        toast({
          title: "Unexpected error",
          description: "Please try logging in.",
          variant: "destructive",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected signup error:", error);
      toast({
        title: "Error",
        description: "There was an unexpected problem with your signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <MainLayout showNav={false}>
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <Logo className="h-12 w-auto mx-auto" />
              </Link>
              <h2 className="mt-6 text-3xl font-bold text-slate-800">Create your account</h2>
              <p className="mt-2 text-sm text-slate-600">
                Start your journey to interview success with AI Mock Interview
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
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
                      <FormLabel className="text-slate-700">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="••••••••" 
                            type={showPassword ? "text" : "password"}
                            onChange={handlePasswordChange}
                            value={field.value}
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
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            {getPasswordStrengthText(passwordStrength).icon}
                            {getPasswordStrengthText(passwordStrength).text}
                          </span>
                          <span className="text-xs text-slate-500">
                            {passwordStrength}%
                          </span>
                        </div>
                        <Progress 
                          value={passwordStrength} 
                          className="h-1 bg-slate-100"
                          style={{
                            "--progress-background": getPasswordStrengthColor(passwordStrength)
                          } as React.CSSProperties}
                        />
                      </div>
                      <FormDescription className="text-xs text-slate-500 mt-2">
                        Strong passwords include uppercase, lowercase, numbers, and special characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="••••••••" 
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                            className="border-slate-200 focus:border-interview-primary focus:ring-interview-primary/20 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-interview-primary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-slate-700">
                          I agree to the{" "}
                          <Link to="/terms" className="text-interview-primary hover:text-interview-secondary">
                            terms and conditions
                          </Link>
                        </FormLabel>
                        <FormMessage />
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
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-interview-primary hover:text-interview-secondary">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:block md:w-1/2 bg-interview-primary bg-opacity-10 backdrop-blur-sm">
          <div className="h-full flex items-center justify-center p-12">
            <div className="max-w-md text-center">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-interview-primary to-interview-accent">Practice Makes Perfect</h2>
              <p className="mt-4 text-slate-700">
                Join thousands of professionals who have improved their interview skills with AI Mock Interview's AI-powered mock interviews.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl backdrop-blur shadow-xl">
                  <div className="text-3xl font-bold text-interview-primary">95%</div>
                  <p className="text-sm text-slate-600">of users report increased confidence</p>
                </div>
                <div className="p-4 bg-white rounded-xl backdrop-blur shadow-xl">
                  <div className="text-3xl font-bold text-interview-primary">10K+</div>
                  <p className="text-sm text-slate-600">interview questions available</p>
                </div>
                <div className="p-4 bg-white rounded-xl backdrop-blur shadow-xl">
                  <div className="text-3xl font-bold text-interview-primary">4.9/5</div>
                  <p className="text-sm text-slate-600">average user rating</p>
                </div>
                <div className="p-4 bg-white rounded-xl backdrop-blur shadow-xl">
                  <div className="text-3xl font-bold text-interview-primary">82%</div>
                  <p className="text-sm text-slate-600">higher offer success rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;