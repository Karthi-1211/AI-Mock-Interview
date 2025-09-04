import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MainLayout from "@/components/layouts/MainLayout";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Check,
  Loader2,
  Mail,
  PenLine,
  MessageCircle,
} from "lucide-react";

// Define the schema for form validation
const FeedbackSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
  feedbackType: z.string(),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
  satisfaction: z.enum(["very-dissatisfied", "dissatisfied", "neutral", "satisfied", "very-satisfied"], {
    required_error: "Please select your satisfaction level",
  }),
  wouldRecommend: z.enum(["yes", "maybe", "no"], {
    required_error: "Please indicate if you would recommend us",
  }),
  hearAboutUs: z.string().optional(),
});

type FeedbackType = z.infer<typeof FeedbackSchema>;

const Feedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FeedbackType>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      feedbackType: "general",
      feedback: "",
      satisfaction: "neutral",
      wouldRecommend: "maybe",
      hearAboutUs: "",
    },
  });

  const onSubmit = async (data: FeedbackType) => {
    setIsSubmitting(true);

    try {
      // Prepare form data for Web3Forms
      const formData = new FormData();
      formData.append("access_key", "764ec9a4-f4f7-4da3-8eb6-2cb0f0e6a61d");
      formData.append("subject", "VirtuHire Feedback Form Submission");
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("company", data.company || "Not provided");
      formData.append("feedback_type", data.feedbackType);
      formData.append("feedback", data.feedback);
      formData.append("satisfaction", data.satisfaction);
      formData.append("would_recommend", data.wouldRecommend);
      formData.append("hear_about_us", data.hearAboutUs || "Not provided");
      formData.append("botcheck", "");

      // Submit to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (response.status === 200 && json.success) {
        toast({
          title: "Feedback submitted successfully!",
          description: "Thank you for your feedback! We appreciate your input.",
        });
        form.reset();
        setActiveTab("general");
        setIsSubmitted(true);
      } else {
        throw new Error(json.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error submitting feedback",
        description: `There was a problem submitting your feedback: ${errorMessage}. Please try again or contact support.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { value: "general", label: "General Feedback", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { value: "bug", label: "Report a Bug", icon: <MessageCircle className="h-4 w-4 mr-2" /> },
    { value: "feature", label: "Feature Request", icon: <PenLine className="h-4 w-4 mr-2" /> },
    { value: "question", label: "Question", icon: <Mail className="h-4 w-4 mr-2" /> },
    { value: "other", label: "Other", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ];

  return (
    <MainLayout>
      <div className="w-full bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">We Value Your Feedback</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your insights help us improve VirtuHire. Share your thoughts, suggestions, or report issues to help us serve you better.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-16">
        <Card className="border shadow-lg">
          <CardContent className="p-0">
            {isSubmitted ? (
              <div className="p-6 text-center">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Form Submitted</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Thank you for your feedback! We've received your submission and will review it soon.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                  className="bg-interview-primary hover:bg-interview-secondary"
                >
                  Submit Another Feedback
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b">
                  <div className="px-6 pt-6">
                    <TabsList className="grid grid-cols-5 w-full bg-slate-100">
                      <TabsTrigger value="general" className="data-[state=active]:bg-interview-primary data-[state=active]:text-white">
                        General
                      </TabsTrigger>
                      <TabsTrigger value="bug" className="data-[state=active]:bg-interview-primary data-[state=active]:text-white">
                        Bug Report
                      </TabsTrigger>
                      <TabsTrigger value="feature" className="data-[state=active]:bg-interview-primary data-[state=active]:text-white">
                        Feature Request
                      </TabsTrigger>
                      <TabsTrigger value="question" className="data-[state=active]:bg-interview-primary data-[state=active]:text-white">
                        Question
                      </TabsTrigger>
                      <TabsTrigger value="other" className="data-[state=active]:bg-interview-primary data-[state=active]:text-white">
                        Other
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <div className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Your company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="feedbackType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feedback Type</FormLabel>
                              <Select 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setActiveTab(value);
                                }} 
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select feedback type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {feedbackTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center">
                                        {type.icon}
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <TabsContent value="general" className="mt-0 p-0">
                        <FormField
                          control={form.control}
                          name="feedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Feedback</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please share your thoughts, suggestions, or general feedback..." 
                                  className="min-h-[150px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="bug" className="mt-0 p-0">
                        <FormField
                          control={form.control}
                          name="feedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bug Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please describe the bug in detail. Include steps to reproduce, expected behavior, and actual behavior..." 
                                  className="min-h-[150px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="feature" className="mt-0 p-0">
                        <FormField
                          control={form.control}
                          name="feedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Feature Request</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please describe the feature you'd like to see added. What problem would it solve? How would it benefit users?" 
                                  className="min-h-[150px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="question" className="mt-0 p-0">
                        <FormField
                          control={form.control}
                          name="feedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Question</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please describe your question in detail. What specific information or clarification are you seeking?" 
                                  className="min-h-[150px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="other" className="mt-0 p-0">
                        <FormField
                          control={form.control}
                          name="feedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Other Feedback</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please share any other feedback or comments..." 
                                  className="min-h-[150px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="satisfaction"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>How satisfied are you with VirtuHire?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="very-dissatisfied" id="very-dissatisfied" />
                                    <FormLabel htmlFor="very-dissatisfied" className="font-normal">
                                      Very Dissatisfied
                                    </FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="dissatisfied" id="dissatisfied" />
                                    <FormLabel htmlFor="dissatisfied" className="font-normal">
                                      Dissatisfied
                                    </FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="neutral" id="neutral" />
                                    <FormLabel htmlFor="neutral" className="font-normal">
                                      Neutral
                                    </FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="satisfied" id="satisfied" />
                                    <FormLabel htmlFor="satisfied" className="font-normal">
                                      Satisfied
                                    </FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="very-satisfied" id="very-satisfied" />
                                    <FormLabel htmlFor="very-satisfied" className="font-normal">
                                      Very Satisfied
                                    </FormLabel>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="wouldRecommend"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Would you recommend VirtuHire to others?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="yes" id="yes" />
                                    <FormLabel htmlFor="yes" className="font-normal">Yes, definitely</FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="maybe" id="maybe" />
                                    <FormLabel htmlFor="maybe" className="font-normal">Maybe</FormLabel>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="no" id="no" />
                                    <FormLabel htmlFor="no" className="font-normal">No</FormLabel>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="hearAboutUs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>How did you hear about us?</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || ""}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an option" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="search">Search Engine</SelectItem>
                                  <SelectItem value="social">Social Media</SelectItem>
                                  <SelectItem value="friend">Friend or Colleague</SelectItem>
                                  <SelectItem value="ad">Advertisement</SelectItem>
                                  <SelectItem value="blog">Blog or Article</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="feedback"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Comments</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any other feedback you'd like to share?" 
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-interview-primary hover:bg-interview-secondary px-8"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" /> 
                              Submit Feedback
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 text-center">
            <Mail className="h-10 w-10 text-interview-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Email Support</h3>
            <p className="text-slate-600 mb-4">Need direct assistance? Our support team is always ready to help.</p>
            <a href="mailto:support@stellarmock.com" className="text-interview-primary hover:text-interview-secondary font-medium">
              balukarthik1308@gmail.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 text-center">
            <MessageSquare className="h-10 w-10 text-interview-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Live Chat</h3>
            <p className="text-slate-600 mb-4">Get immediate answers during business hours through our live chat support.</p>
            <Button variant="outline" className="border-interview-primary text-interview-primary hover:bg-interview-primary hover:text-white">
              Start Chat
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100 text-center">
            <MessageCircle className="h-10 w-10 text-interview-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Knowledge Base</h3>
            <p className="text-slate-600 mb-4">Browse our comprehensive documentation and frequently asked questions.</p>
            <Link to="/help" className="text-interview-primary hover:text-interview-secondary font-medium">
              Visit Knowledge Base
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Feedback;