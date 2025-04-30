import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import InterviewCard, { InterviewCardProps } from "@/components/home/InterviewCard";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Mock data for interview templates
const mockInterviews: InterviewCardProps[] = [
  {
    id: "1",
    title: "Frontend Developer Interview",
    description: "Practice for frontend developer positions with questions on React, JavaScript, CSS and web performance.",
    duration: 30,
    difficulty: "medium",
    type: "Technical",
    questions: 10,
    isCustom: false
  },
  {
    id: "2",
    title: "System Design Interview",
    description: "Prepare for system design questions with focus on scalability, database design, and architecture.",
    duration: 45,
    difficulty: "hard",
    type: "Technical",
    questions: 5,
    isCustom: false
  },
  {
    id: "3",
    title: "Behavioral Interview",
    description: "Practice common behavioral questions to showcase your soft skills and past experiences.",
    duration: 25,
    difficulty: "easy",
    type: "Behavioral",
    questions: 12,
    isCustom: false
  },
  {
    id: "4",
    title: "Data Structures & Algorithms",
    description: "Prepare for coding interviews with questions on data structures, algorithms and problem-solving.",
    duration: 60,
    difficulty: "hard",
    type: "Technical",
    questions: 8,
    isCustom: false
  },
  {
    id: "5",
    title: "Product Manager Interview",
    description: "Practice product sense, analytical and strategic thinking questions for PM roles.",
    duration: 40,
    difficulty: "medium",
    type: "Mixed",
    questions: 15,
    isCustom: false
  },
  {
    id: "6",
    title: "Leadership & Management",
    description: "Prepare for leadership questions focused on team management, conflict resolution and decision making.",
    duration: 35,
    difficulty: "medium",
    type: "Behavioral",
    questions: 10,
    isCustom: false
  },
  {
    id: "7",
    title: "UI/UX Designer Interview",
    description: "Practice design thinking, portfolio discussions and user-centered design principles.",
    duration: 30,
    difficulty: "medium",
    type: "Technical",
    questions: 12,
    isCustom: false
  },
  {
    id: "8",
    title: "Data Science Interview",
    description: "Prepare for data science questions on statistics, machine learning and practical applications.",
    duration: 45,
    difficulty: "hard",
    type: "Technical",
    questions: 14,
    isCustom: false
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [customInterviews, setCustomInterviews] = useState<InterviewCardProps[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Fetch custom templates if user is logged in
  const { data: userTemplates = [], isLoading } = useQuery({
    queryKey: ['userTemplates'],
    queryFn: async () => {
      if (!session?.user) return [];
      
      const { data, error } = await supabase
        .from('interview_templates')
        .select('*, template_questions(*)')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }
      
      return data.map(template => ({
        id: template.id,
        title: template.role,
        description: template.description || `Custom interview for ${template.role} position.`,
        duration: template.difficulty === 'easy' ? 15 : template.difficulty === 'medium' ? 30 : 45,
        difficulty: template.difficulty as "easy" | "medium" | "hard",
        type: "Custom",
        questions: template.template_questions ? template.template_questions.length : 0,
        isCustom: true
      }));
    },
    enabled: !!session?.user,
  });

  // All interviews combined
  const allInterviews = [
    // Add "Create Custom Interview" card
    {
      id: "create-custom",
      title: "Create Custom Interview",
      description: "Generate a personalized interview based on your target role and experience level.",
      duration: 30,
      difficulty: "medium" as const,
      type: "Custom",
      questions: 10,
      isCustom: true
    },
    ...(mockInterviews || []),
    ...(userTemplates || [])
  ];

  // Filter interviews based on search query and selected tab
  const filteredInterviews = allInterviews.filter((interview) => {
    if (!interview) return false;
    
    const matchesSearch = 
      interview.title?.toLowerCase().includes(searchQuery?.toLowerCase() || "") || 
      interview.description?.toLowerCase().includes(searchQuery?.toLowerCase() || "");
    
    if (currentTab === "all") return matchesSearch;
    if (currentTab === "technical") return matchesSearch && interview.type === "Technical";
    if (currentTab === "behavioral") return matchesSearch && interview.type === "Behavioral";
    if (currentTab === "mixed") return matchesSearch && interview.type === "Mixed";
    if (currentTab === "custom") return matchesSearch && (interview.type === "Custom" || !!interview.isCustom);
    
    return matchesSearch;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare form data for Web3Forms
      const formData = new FormData();
      formData.append("access_key", "764ec9a4-f4f7-4da3-8eb6-2cb0f0e6a61d");
      formData.append("subject", "AI Mock Interview");
      formData.append("sub_subject", "Contact Us Form");
      formData.append("name", name);
      formData.append("email", email);
      formData.append("message", `Sub Subject: Contact Us Form\n\n${message}`);
      formData.append("botcheck", "");

      // Submit to Web3Forms API
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (response.status === 200 && json.success) {
        toast({
          title: "Message sent!",
          description: "Your message has been sent successfully. We'll get back to you soon!",
        });
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(json.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `There was a problem submitting your message: ${errorMessage}. Please try again or contact support.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Hero section */}
        <div className="bg-interview-background py-12 px-6 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Practice Makes Perfect</h1>
            <p className="text-lg mb-6">
              Choose from our library of interview templates or create your own custom interview experience.
              Get real-time feedback and improve your interview skills today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-interview">
                <Button size="lg" className="bg-interview-primary hover:bg-interview-secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom Interview
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('interview-templates')?.scrollIntoView({ behavior: 'smooth' })}>
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
        
        {/* Interview Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Interview Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Technical Interviews</h3>
              <p className="mb-4 text-muted-foreground">
                Practice coding challenges, system design questions, and technical knowledge assessments.
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setCurrentTab("technical");
                  document.getElementById('interview-templates')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Technical Interviews
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Behavioral Interviews</h3>
              <p className="mb-4 text-muted-foreground">
                Prepare for questions about your experience, work style, and how you handle various situations.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setCurrentTab("behavioral");
                  document.getElementById('interview-templates')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Behavioral Interviews
              </Button>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Custom Interviews</h3>
              <p className="mb-4 text-muted-foreground">
                Create personalized interviews tailored to specific roles, companies, or industries.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setCurrentTab("custom");
                  document.getElementById('interview-templates')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Custom Interviews
              </Button>
            </div>
          </div>
        </div>
        
        {/* Interview Templates Section */}
        <div id="interview-templates">
          <h2 className="text-2xl font-bold mb-6">Interview Templates</h2>
          
          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search templates..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Link to="/create-interview" className="md:w-auto">
              <Button className="w-full md:w-auto bg-interview-primary hover:bg-interview-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Interview
              </Button>
            </Link>
          </div>
          
          {/* Interview template categories */}
          <Tabs defaultValue="all" onValueChange={setCurrentTab} value={currentTab}>
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
              <TabsTrigger value="mixed">Mixed</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {filteredInterviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredInterviews.map((interview) => (
                    <InterviewCard key={interview.id} {...interview} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No interviews found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Technical tab content */}
            <TabsContent value="technical" className="mt-6">
              {filteredInterviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredInterviews.map((interview) => (
                    <InterviewCard key={interview.id} {...interview} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No technical interviews found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Behavioral tab content */}
            <TabsContent value="behavioral" className="mt-6">
              {filteredInterviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredInterviews.map((interview) => (
                    <InterviewCard key={interview.id} {...interview} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No behavioral interviews found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Mixed tab content */}
            <TabsContent value="mixed" className="mt-6">
              {filteredInterviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredInterviews.map((interview) => (
                    <InterviewCard key={interview.id} {...interview} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No mixed interviews found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            {/* Custom tab content */}
            <TabsContent value="custom" className="mt-6">
              {filteredInterviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredInterviews.map((interview) => (
                    <InterviewCard key={interview.id} {...interview} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No custom interviews found. Create your first custom interview!</p>
                  <Link to="/create-interview" className="mt-4 inline-block">
                    <Button className="bg-interview-primary hover:bg-interview-secondary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Custom Interview
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Contact Form */}
        <div className="bg-white rounded-lg border shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
              <p className="mb-4 text-muted-foreground">
                Have questions about our platform or need assistance? 
                Fill out the form and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-interview-light flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-interview-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">balukarthik1308@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-interview-light flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-interview-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+91 9515607788</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-interview-light flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-interview-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">Visakhpatnam</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input 
                    id="name" 
                    placeholder="Your name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Your email address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="How can we help you?" 
                    className="min-h-[120px]" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-interview-primary hover:bg-interview-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;