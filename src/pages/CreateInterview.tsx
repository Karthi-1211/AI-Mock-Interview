
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

const CreateInterview = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    description: "",
    experience: "entry",
    difficulty: "easy",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast({
        title: "Role is required",
        description: "Please enter the job role for this interview",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Generate interview questions
      const { data, error } = await supabase.functions.invoke("generate-interview", {
        body: formData
      });
      
      if (error) throw error;
      
      // Get user info
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        // Anonymous user flow
        // Store template in local storage instead of database
        const templateId = crypto.randomUUID();
        const interview = {
          id: templateId,
          role: formData.role,
          description: formData.description,
          experience: formData.experience,
          difficulty: formData.difficulty,
          questions: data.questions,
          isAnonymous: true
        };
        
        // Store in local storage
        localStorage.setItem(`interview_template_${templateId}`, JSON.stringify(interview));
        
        // Navigate to interview
        navigate(`/interview/${templateId}`);
        return;
      }
      
      // Step 2: Save template to database
      const { data: template, error: templateError } = await supabase
        .from('interview_templates')
        .insert({
          user_id: userId,
          role: formData.role,
          description: formData.description,
          experience: formData.experience,
          difficulty: formData.difficulty
        })
        .select()
        .single();
      
      if (templateError) throw templateError;
      
      // Step 3: Save questions to database
      const questionsToInsert = data.questions.map((question: string) => ({
        template_id: template.id,
        question_text: question
      }));
      
      const { error: questionsError } = await supabase
        .from('template_questions')
        .insert(questionsToInsert);
      
      if (questionsError) throw questionsError;
      
      // Step 4: Create a new interview
      const { data: interview, error: interviewError } = await supabase
        .from('interviews')
        .insert({
          user_id: userId,
          template_id: template.id,
          title: `${formData.role} Interview`,
          type: "Technical",
          duration: formData.difficulty === 'easy' ? 15 : formData.difficulty === 'medium' ? 30 : 45
        })
        .select()
        .single();
      
      if (interviewError) throw interviewError;
      
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      
      toast({
        title: "Interview created!",
        description: "Your custom interview is ready to start.",
      });
      
      // Navigate to the interview
      navigate(`/interview/${interview.id}`);
      
    } catch (error) {
      console.error("Error creating interview:", error);
      toast({
        title: "Failed to create interview",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Custom Interview</h1>
          <p className="text-muted-foreground mt-1">
            Generate a personalized interview for your target role
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Enter information about the position you're applying for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Job Title/Role *</Label>
                  <Input
                    id="role"
                    name="role"
                    placeholder="e.g. Frontend Developer, Product Manager"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Specify the exact job title
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Paste the job description or key responsibilities here..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) =>
                        handleSelectChange("experience", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (5+ years)</SelectItem>
                        <SelectItem value="lead">Lead/Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Interview Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) =>
                        handleSelectChange("difficulty", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy (5 questions)</SelectItem>
                        <SelectItem value="medium">Medium (8 questions)</SelectItem>
                        <SelectItem value="hard">Hard (10 questions)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-interview-primary hover:bg-interview-secondary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Interview...
                  </>
                ) : (
                  "Create Interview"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateInterview;
