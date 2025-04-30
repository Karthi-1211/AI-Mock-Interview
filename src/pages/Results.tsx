import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Download,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  FileText,
  Brain,
  Target,
  ThumbsUp,
  Zap,
  Search
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/layouts/MainLayout";
import { generateResultsPDF } from "@/utils/pdfGenerator";

const Results = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  interface ResultsType {
    overallScore: number;
    feedback: string;
    skillBreakdown: Record<string, number>;
    strengths: string[];
    improvements: string[];
    answerFeedback: {
      question: string;
      answer: string;
      score: number;
      feedback: string;
      strengths: string[];
      improvements: string[];
    }[];
    performanceTrend: {
      question: string;
      score: number;
    }[];
  }

  const [results, setResults] = useState<ResultsType | null>(null);
  
  // Get user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Extract data from location state or use database/local storage
  const stateAnswers = location.state?.answers;
  const stateQuestions = location.state?.questions;
  const stateTitle = location.state?.title;
  const stateType = location.state?.type;
  const stateScore = location.state?.score;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        
        // Removed unused variable 'interviewData'
        let answers = [];
        let questions = [];
        let title = "";
        let type = "";
        let score = 0;
        
        // First, try to use location state data
        if (stateAnswers && stateQuestions) {
          answers = stateAnswers;
          questions = stateQuestions;
          title = stateTitle || "Interview";
          type = stateType || "Technical";
          
          // Calculate a more accurate score based on answer quality
          const hasAnswers = answers.filter((a: string) => a && a.trim().length > 10).length;
          const totalQuestions = questions.length;
          
          if (hasAnswers === 0) {
            score = 0;
          } else {
            const answerRatio = hasAnswers / totalQuestions;
            score = Math.round(answerRatio * 100);
            score = Math.max(0, Math.min(100, score + (Math.floor(Math.random() * 20) - 10)));
          }

          // Save to Supabase if user is logged in
          if (session?.user) {
            const { data: interview, error: interviewError } = await supabase
              .from('interviews')
              .insert({
                user_id: session.user.id,
                title,
                type,
                score,
                date: new Date().toISOString(),
                duration: 30, // You might want to pass actual duration
                status: 'completed'
              })
              .select()
              .single();

            if (interviewError) {
              console.error('Error saving interview:', interviewError);
              throw interviewError;
            }

            // Save answers
            const answersToInsert = questions.map((question: string, index: number) => ({
              interview_id: interview.id,
              question_text: question,
              answer_text: answers[index] || "",
              score: Math.round(score * (Math.random() * 0.2 + 0.8)) // Randomize slightly per answer
            }));

            const { error: answersError } = await supabase
              .from('interview_answers')
              .insert(answersToInsert);

            if (answersError) {
              console.error('Error saving answers:', answersError);
              throw answersError;
            }

            // Invalidate queries to update dashboard and results history
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            queryClient.invalidateQueries({ queryKey: ['results'] });
          } else {
            // Save to local storage for anonymous users
            localStorage.setItem(`interview_result_${id}`, JSON.stringify({
              title,
              type,
              score,
              answers,
              questions,
              date: new Date().toISOString()
            }));
          }
        } 
        // Check database for existing results
        else if (session?.user && id) {
          const { data: interview, error: interviewError } = await supabase
            .from('interviews')
            .select('*, interview_templates(*)')
            .eq('id', id)
            .single();
            
          if (interviewError) {
            console.error('Error fetching interview:', interviewError);
            throw interviewError;
          }
          
          if (!interview) {
            throw new Error('Interview not found');
          }
          
          const { data: answersData, error: answersError } = await supabase
            .from('interview_answers')
            .select('*')
            .eq('interview_id', id);
            
          if (answersError) {
            console.error('Error fetching answers:', answersError);
            throw answersError;
          }
          
          title = interview.title;
          type = interview.type;
          score = interview.score;
          answers = answersData.map((a: { answer_text: string }) => a.answer_text);
          questions = answersData.map((a: { question_text: string }) => a.question_text);
        } 
        // Check local storage for anonymous users
        else if (id) {
          const storedResult = localStorage.getItem(`interview_result_${id}`);
          
          if (!storedResult) {
            throw new Error('Interview results not found');
          }
          
          const parsedResult = JSON.parse(storedResult);
          
          title = parsedResult.title;
          type = parsedResult.type;
          score = parsedResult.score;
          answers = parsedResult.answers;
          questions = parsedResult.questions;
        } else {
          throw new Error('No interview results found');
        }
        
        // Generate personalized feedback based on score
        let feedback;
        let strengths = [];
        let improvements = [];
        
        if (score >= 85) {
          feedback = "Excellent! You demonstrated strong technical knowledge and clear communication skills.";
          strengths = [
            "Exceptional depth of technical knowledge",
            "Clear and concise explanations",
            "Strong problem-solving approach",
            "Excellent communication"
          ];
          improvements = [
            "Add more real-world examples",
            "Elaborate on alternative approaches",
            "Include specific metrics",
            "Prepare concise summaries"
          ];
        } else if (score >= 70) {
          feedback = "Good job! You have a solid understanding but could provide more specific examples.";
          strengths = [
            "Good grasp of concepts",
            "Structured thinking",
            "Effective communication",
            "Clear explanations"
          ];
          improvements = [
            "Provide specific code examples",
            "Add depth to explanations",
            "Include specific details",
            "Practice concise responses"
          ];
        } else if (score >= 40) {
          feedback = "Satisfactory performance. Focus on improving technical depth and structuring answers.";
          strengths = [
            "Basic understanding",
            "Ability to communicate",
            "Attempted challenging questions",
            "Good practical examples"
          ];
          improvements = [
            "Deepen technical knowledge",
            "Structure answers clearly",
            "Provide concrete examples",
            "Explain complex concepts"
          ];
        } else {
          feedback = "Significant improvement needed. Focus on technical knowledge and structured responses.";
          strengths = [
            "Willingness to engage",
            "Basic familiarity",
            "Potential for growth",
            "Identified improvement areas"
          ];
          improvements = [
            "Build technical knowledge",
            "Practice STAR method",
            "Prepare examples",
            "Communicate clearly"
          ];
        }
        
        const baseScore = score;
        const generateSkillScore = (variance: number) => {
          return Math.min(100, Math.max(0, baseScore + (Math.random() * variance * 2) - variance));
        };
        
        const skillBreakdown = {
          technicalKnowledge: Math.round(generateSkillScore(10)),
          communication: Math.round(generateSkillScore(15)),
          problemSolving: Math.round(generateSkillScore(12)),
          domainExpertise: Math.round(generateSkillScore(8)),
          articulation: Math.round(generateSkillScore(10)),
          confidenceLevel: Math.round(generateSkillScore(15))
        };
        
        const answerFeedback = questions.map((question: string, index: number) => {
          const answer = answers[index] || "";
          const hasContent = answer && answer.trim().length > 0;
          const hasSubstance = answer && answer.trim().length > 50;
          const hasDepth = answer && answer.trim().length > 200;
          
          let answerScore;
          let feedback;
          let strengths = [];
          let improvements = [];
          
          if (!hasContent) {
            answerScore = 0;
            feedback = "No answer provided.";
            strengths = [];
            improvements = [
              "Provide an answer",
              "Practice question type",
              "Prepare frameworks",
              "Review concepts"
            ];
          } else if (!hasSubstance) {
            answerScore = Math.round(baseScore * 0.5);
            feedback = "Answer too brief. Expand with details.";
            strengths = ["Attempted question"];
            improvements = [
              "Add specific details",
              "Expand with examples",
              "Structure answer",
              "Include technical specifics"
            ];
          } else if (!hasDepth) {
            answerScore = Math.round(baseScore * 0.8);
            feedback = "Good start, needs more depth.";
            strengths = [
              "Understands concept",
              "Logical approach"
            ];
            improvements = [
              "Add technical depth",
              "Include examples",
              "Address follow-ups"
            ];
          } else {
            answerScore = Math.min(100, Math.round(baseScore + (Math.random() * 10)));
            feedback = "Excellent detailed answer.";
            strengths = [
              "Comprehensive explanation",
              "Well-structured",
              "Technical expertise"
            ];
            improvements = [
              "Add alternative approaches",
              "Mention performance considerations"
            ];
          }
          
          return {
            question,
            answer: answer || "No answer provided",
            score: answerScore,
            feedback,
            strengths,
            improvements
          };
        });
        
        const performanceTrend = answerFeedback.map((item, index) => ({
          question: `Q${index + 1}`,
          score: item.score
        }));
        
        const mockResults = {
          overallScore: Math.round(score),
          feedback,
          skillBreakdown,
          strengths,
          improvements,
          answerFeedback,
          performanceTrend
        };
        
        setResults(mockResults);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast({
          title: "Error loading results",
          description: "Could not load interview results.",
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [id, navigate, stateAnswers, stateQuestions, stateTitle, stateType, stateScore, session, queryClient]);

  const handleDownloadPDF = () => {
    try {
      generateResultsPDF(results, stateTitle || "Interview");
      toast({
        title: "PDF Downloaded",
        description: "Your interview results have been saved."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 40) return "text-orange-500";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <Check className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    if (score >= 40) return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    return <X className="h-5 w-5 text-red-600" />;
  };
  
  const getScoreDescription = (score: number) => {
    if (score >= 85) return "Exceptional";
    if (score >= 70) return "Good";
    if (score >= 40) return "Needs improvement";
    return "Significant work needed";
  };
  
  const radarData = results?.skillBreakdown ? Object.entries(results.skillBreakdown).map(([key, value]) => ({
    subject: key.replace(/([A-Z])/g, ' $1').trim(),
    value: value,
    fullMark: 100,
  })) : [];
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-white">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
            <div className="absolute inset-2 rounded-full border-t-4 border-interview-primary animate-spin"></div>
            <Loader2 className="absolute inset-0 m-auto h-10 w-10 text-interview-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-800">Analyzing Your Responses</h2>
          <p className="text-slate-600 mb-4">Our AI is evaluating your interview answers...</p>
          <div className="max-w-md w-full bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-slate-600">Processing responses</span>
              <span className="text-sm text-slate-600">70%</span>
            </div>
            <Progress value={70} className="h-2 bg-indigo-100" indicatorClassName="bg-interview-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-white py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-indigo-50">
            <div className="animate-slide-up">
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Interview Results</h1>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">{stateTitle || "Interview"}</span>
                <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">{stateType || "Technical"}</Badge>
                <span className="text-slate-500 text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className="flex gap-3 animate-slide-down">
              <Button 
                variant="outline" 
                onClick={handleDownloadPDF}
                className="border-indigo-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
              >
                <Download className="h-4 w-4 mr-2 text-indigo-500" />
                Download PDF
              </Button>
              <Link to="/home">
                <Button className="bg-interview-primary hover:bg-interview-secondary transition-all">
                  New Interview
                </Button>
              </Link>
            </div>
          </div>
          
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1">
              <div className="bg-white rounded-t-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left animate-slide-up">
                      <h2 className="text-2xl font-bold mb-2 text-slate-800">Overall Performance</h2>
                      <div className="flex items-center md:hidden mb-4">
                        <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                          {results.overallScore}%
                        </div>
                        <div className="ml-3 px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                          {getScoreDescription(results.overallScore)}
                        </div>
                      </div>
                      <p className="text-slate-600 max-w-2xl">{results.feedback}</p>
                    </div>
                    
                    <div className="relative w-52 h-52 flex-shrink-0 animate-fade-in">
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className={`text-4xl font-bold ${getScoreColor(results.overallScore)}`}>
                          {results.overallScore}%
                        </div>
                        <div className="mt-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                          {getScoreDescription(results.overallScore)}
                        </div>
                      </div>
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="#E5DEFF" 
                          strokeWidth="10" 
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="45" 
                          fill="none" 
                          stroke="#6366F1" 
                          strokeWidth="10" 
                          strokeDasharray={`${results.overallScore * 2.83} 283`} 
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="flex items-center text-slate-800">
                  <Brain className="h-5 w-5 mr-2 text-interview-primary" />
                  Skills Assessment
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Breakdown of your performance across different skill areas
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pt-6 bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid stroke="#E5DEFF" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b' }} />
                    <PolarRadiusAxis domain={[0, 100]} axisLine={false} tick={{ fill: '#94a3b8' }} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <RechartsTooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="flex items-center text-slate-800">
                  <Target className="h-5 w-5 mr-2 text-interview-primary" />
                  Performance Trend
                </CardTitle>
                <CardDescription className="text-slate-500">
                  How you performed across different questions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pt-6 bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={results.performanceTrend}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="question" tick={{ fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#64748b' }} />
                    <RechartsTooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#6366F1"
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      strokeWidth={2}
                      dot={{ r: 6, fill: '#6366F1', strokeWidth: 2, stroke: '#ffffff' }}
                      activeDot={{ r: 8, fill: '#4F46E5', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b border-slate-100 bg-green-50/50">
                <CardTitle className="flex items-center text-slate-800">
                  <ThumbsUp className="h-5 w-5 mr-2 text-green-600" />
                  Your Strengths
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Areas where you performed particularly well
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <ul className="space-y-3">
                  {results.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b border-slate-100 bg-amber-50/50">
                <CardTitle className="flex items-center text-slate-800">
                  <Zap className="h-5 w-5 mr-2 text-amber-600" />
                  Areas for Improvement
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Suggestions to enhance your interview performance
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 bg-white">
                <ul className="space-y-3">
                  {results.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-slate-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1">
              <div className="bg-white rounded-t-sm">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="flex items-center text-slate-800">
                    <Search className="h-5 w-5 mr-2 text-interview-primary" />
                    Question Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-500">Detailed feedback on each of your answers</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-4 bg-slate-100">
                      <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-interview-primary">All Questions</TabsTrigger>
                      <TabsTrigger value="strengths" className="data-[state=active]:bg-white data-[state=active]:text-green-600">Strengths</TabsTrigger>
                      <TabsTrigger value="improvements" className="data-[state=active]:bg-white data-[state=active]:text-amber-600">Needs Improvement</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-6">
                      {results.answerFeedback.map((item: { question: string; answer: string; score: number; feedback: string; strengths: string[]; improvements: string[] }, index: number) => (
                        <div key={index} className="border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                          <div className="flex justify-between bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-indigo-700">{index + 1}</span>
                              </div>
                              <h3 className="font-medium text-slate-800">{item.question}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              {getScoreIcon(item.score)}
                              <span className={`font-medium ${getScoreColor(item.score)}`}>
                                {item.score}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4 border-t">
                            <div className="mb-4 bg-slate-50 p-3 rounded-md border border-slate-100">
                              <h4 className="text-sm font-medium text-slate-500 mb-2">Your Answer:</h4>
                              <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.answer || "No answer provided"}</p>
                            </div>
                            
                            <h4 className="text-sm font-medium text-slate-600 mb-2">Feedback:</h4>
                            <p className="text-sm mb-4 text-slate-700">{item.feedback}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {item.strengths.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-green-600 mb-2">Strengths:</h4>
                                  <ul className="text-sm space-y-1">
                                    {item.strengths.map((strength: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                        <span className="text-slate-700">{strength}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {item.improvements.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-amber-600 mb-2">Areas to Improve:</h4>
                                  <ul className="text-sm space-y-1">
                                    {item.improvements.map((improvement: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                        <span className="text-slate-700">{improvement}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="strengths" className="space-y-6">
                      {results.answerFeedback
                        .filter((item: { question: string; answer: string; score: number; feedback: string; strengths: string[]; improvements: string[] }) => item.score >= 80)
                        .map((item: { question: string; answer: string; score: number; feedback: string; strengths: string[]; improvements: string[] }, index: number) => (
                          <div key={index} className="border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md border-green-100">
                            <div className="flex justify-between bg-green-50 p-4">
                              <h3 className="font-medium text-slate-800">{item.question}</h3>
                              <div className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-green-600" />
                                <span className="font-medium text-green-600">
                                  {item.score}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-4 border-t border-green-100">
                              <p className="text-sm mb-4 text-slate-700">{item.feedback}</p>
                              
                              <h4 className="text-sm font-medium text-green-600 mb-2">Your Strengths:</h4>
                              <ul className="text-sm space-y-1">
                                {item.strengths.map((strength: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 p-2 bg-green-50 rounded-md">
                                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                    <span className="text-slate-700">{strength}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                    
                    <TabsContent value="improvements" className="space-y-6">
                      {results.answerFeedback
                        .filter((item: { question: string; answer: string; score: number; feedback: string; strengths: string[]; improvements: string[] }) => item.score < 80)
                        .map((item: { question: string; answer: string; score: number; feedback: string; strengths: string[]; improvements: string[] }, index: number) => (
                          <div key={index} className="border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md border-amber-100">
                            <div className="flex justify-between bg-amber-50 p-4">
                              <h3 className="font-medium text-slate-800">{item.question}</h3>
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                <span className="font-medium text-amber-600">
                                  {item.score}%
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-4 border-t border-amber-100">
                              <p className="text-sm mb-4 text-slate-700">{item.feedback}</p>
                              
                              <h4 className="text-sm font-medium text-amber-600 mb-2">Areas to Improve:</h4>
                              <ul className="text-sm space-y-1">
                                {item.improvements.map((improvement: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 p-2 bg-amber-50 rounded-md">
                                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                                    <span className="text-slate-700">{improvement}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </div>
            </div>
          </Card>
          
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Ready for your next challenge?</h2>
                <p className="text-slate-600">Continue practicing to improve your interview skills.</p>
              </div>
              <div className="flex gap-3">
                <Link to="/dashboard">
                  <Button variant="outline" className="border-indigo-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">
                    View Dashboard
                  </Button>
                </Link>
                <Link to="/home">
                  <Button className="bg-interview-primary hover:bg-interview-secondary transition-all">
                    New Interview
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Results;