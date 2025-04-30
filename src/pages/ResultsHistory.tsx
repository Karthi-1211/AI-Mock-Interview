import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Award, FileText, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface InterviewResult {
  id: string;
  title: string;
  date: string;
  score: number;
  type: string;
  duration: number;
  status: string;
  answers: {
    id: string;
    question_text: string;
    answer_text: string;
    score: number;
    feedback: string;
  }[];
}

const ResultsHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['results'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to view interview results.",
          variant: "destructive",
        });
        return [];
      }

      const { data: interviews, error: interviewsError } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user.user.id)
        .order("date", { ascending: false });

      if (interviewsError) {
        throw interviewsError;
      }

      const resultsWithAnswers = await Promise.all(
        interviews.map(async (interview) => {
          const { data: answers, error: answersError } = await supabase
            .from("interview_answers")
            .select("*")
            .eq("interview_id", interview.id);

          if (answersError) {
            console.error("Error fetching answers:", answersError);
            return {
              ...interview,
              answers: [],
            };
          }

          return {
            ...interview,
            answers: answers || [],
          };
        })
      );

      return resultsWithAnswers;
    },
  });

  // Filter results based on search query
  const filteredResults = searchQuery
    ? results.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : results;

  // Function to get score color class
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Function to get score bg color class
  const getScoreBgClass = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Interview Results</h1>
            <p className="text-slate-600 mt-1">
              Review your past interview performance and track your progress
            </p>
          </div>
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search results..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/create-interview">
              <Button className="whitespace-nowrap">New Interview</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-interview-primary mb-4" />
            <p className="text-slate-600">Loading your interview results...</p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-200">
            <Award className="h-16 w-16 mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No interview results yet</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Complete your first mock interview to see your performance results and areas for improvement.
            </p>
            <Link to="/create-interview">
              <Button>Start a Mock Interview</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow border border-slate-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant={result.status === "completed" ? "default" : "outline"} className="mb-2">
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </Badge>
                    <div className={`text-lg font-bold ${getScoreColorClass(result.score || 0)}`}>
                      {result.score !== null ? `${result.score}%` : "N/A"}
                    </div>
                  </div>
                  <CardTitle className="text-xl truncate" title={result.title}>
                    {result.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(result.date), "MMM dd, yyyy • h:mm a")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Interview Type:</span>
                        <span className="font-medium">{result.type}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Questions:</span>
                        <span className="font-medium">{result.answers.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Duration:</span>
                        <span className="font-medium">{result.duration} mins</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Performance:</span>
                      </div>
                      <Progress 
                        value={result.score || 0} 
                        className="h-2" 
                        indicatorClassName={`${getScoreBgClass(result.score || 0)}`} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Link to={`/results/${result.id}`} className="w-full">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      View Detailed Results
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResultsHistory;