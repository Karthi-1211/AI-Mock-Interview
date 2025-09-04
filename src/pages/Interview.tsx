
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { 
  AlertCircle, 
  Clock, 
  X, 
  Loader2, 
  Mic, 
  MicOff,
  ThumbsUp,
  User,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Mock interview data - will be used as a fallback
const mockInterviewData = {
  "1": {
    title: "Frontend Developer Interview",
    type: "Technical",
    duration: 30,
    difficulty: "medium" as const,
    questions: [
      "Can you explain the difference between 'let', 'const', and 'var' in JavaScript?",
      "What are React hooks? Explain useState and useEffect.",
      "Describe the CSS Box Model and its components.",
      "How would you optimize a website's performance?",
      "Explain the concept of closures in JavaScript.",
      "What is the virtual DOM in React and why is it used?",
      "How do you handle API requests in React?",
      "Explain the difference between controlled and uncontrolled components in React.",
      "What are some ways to manage state in a React application?",
      "How would you implement authentication in a React application?"
    ]
  },
  "2": {
    title: "System Design Interview",
    type: "Technical",
    duration: 45,
    difficulty: "hard" as const,
    questions: [
      "How would you design a URL shortener service like Bitly?",
      "Design a distributed cache system.",
      "How would you design Twitter's timeline feature?",
      "Design a real-time chat application like Slack.",
      "How would you design a system that can handle millions of concurrent users?"
    ]
  },
  "3": {
    title: "Behavioral Interview",
    type: "Behavioral",
    duration: 20,
    difficulty: "easy" as const,
    questions: [
      "Tell me about yourself and your background.",
      "Describe a challenging project you worked on and how you handled it.",
      "How do you handle disagreements with team members?",
      "Tell me about a time you failed and what you learned from it.",
      "How do you prioritize tasks when you have multiple deadlines?",
      "Describe your ideal work environment.",
      "How do you stay updated with the latest developments in your field?",
      "What's your greatest professional achievement?",
      "How do you handle criticism?",
      "Where do you see yourself professionally in five years?"
    ]
  }
};
// Add additional predefined templates to match Home templates
(mockInterviewData as any)["4"] = {
  title: "Data Structures & Algorithms",
  type: "Technical",
  duration: 60,
  difficulty: "hard" as const,
  questions: [
    "Explain the difference between an array and a linked list.",
    "How would you detect a cycle in a linked list?",
    "Describe quicksort and its average/worst-case complexities.",
    "What is a hash table and how do you handle collisions?",
    "Explain BFS vs DFS and when to use each.",
  ],
};
(mockInterviewData as any)["5"] = {
  title: "Product Manager Interview",
  type: "Mixed",
  duration: 40,
  difficulty: "medium" as const,
  questions: [
    "How do you define and measure product success?",
    "Describe your roadmap prioritization framework.",
    "Tell me about a time you handled conflicting stakeholder requests.",
    "How do you validate a product hypothesis before building?",
    "Explain how you would improve a product you use often.",
  ],
};
(mockInterviewData as any)["6"] = {
  title: "Leadership & Management",
  type: "Behavioral",
  duration: 35,
  difficulty: "medium" as const,
  questions: [
    "Describe your leadership style and why.",
    "Tell me about resolving a conflict within your team.",
    "How do you coach low-performing team members?",
    "Explain a tough decision you made as a manager.",
    "How do you balance delivery speed and quality?",
  ],
};
(mockInterviewData as any)["7"] = {
  title: "UI/UX Designer Interview",
  type: "Technical",
  duration: 30,
  difficulty: "medium" as const,
  questions: [
    "Walk through your design process from brief to delivery.",
    "How do you measure the success of a design?",
    "Tell me about a time user research changed your approach.",
    "How do you hand off designs to engineering effectively?",
    "What are key heuristics you consider in UI design?",
  ],
};
(mockInterviewData as any)["8"] = {
  title: "Data Science Interview",
  type: "Technical",
  duration: 45,
  difficulty: "hard" as const,
  questions: [
    "Explain bias-variance tradeoff.",
    "How do you handle imbalanced datasets?",
    "Describe feature selection techniques.",
    "What is cross-validation and why use it?",
    "Explain precision, recall, F1, and when to use each.",
  ],
};

const Interview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [interview, setInterview] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  
  // Video ref for webcam
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  // Speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecognitionSupportedRef = useRef<boolean>(false);

  // Get user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports speech recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      isRecognitionSupportedRef.current = true;
      
      // Initialize speech recognition
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        
        // Configure speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
          
          // Set up event handlers
          recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
              } else {
                interimTranscript += transcript;
              }
            }
            
            setTranscript((prev) => {
              const updatedTranscript = prev + finalTranscript;
              
              // Update answers array
              const updatedAnswers = [...answers];
              updatedAnswers[currentQuestion] = updatedTranscript;
              setAnswers(updatedAnswers);
              
              return updatedTranscript;
            });
          };
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
              toast({
                title: "Microphone access denied",
                description: "Please enable microphone access to use voice recording feature.",
                variant: "destructive",
              });
              setIsRecording(false);
            }
          };
        }
      } else {
        console.warn('Speech recognition API not found');
      }
    } else {
      console.warn('Speech recognition not supported by this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Load interview data
  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        setIsLoading(true);
        
        let fetchedData = null;
        let questions: string[] = [];
        const supa = supabase;
        
        // First, check if this is a built-in mock interview
        if (id && mockInterviewData[id as keyof typeof mockInterviewData]) {
          const template = mockInterviewData[id as keyof typeof mockInterviewData] as any;
          fetchedData = template;
          // Try AI question generation based on template title/type/difficulty
          try {
            const role = template.title || "Interview";
            const difficulty = template.difficulty || "medium";
            // Read recent asked questions for this role from localStorage to avoid repeats
            const historyKey = `question_history_${role.toLowerCase()}`;
            const history: string[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
            const { data, error } = await supa.functions.invoke("generate-interview", {
              body: {
                role,
                description: template.description,
                experience: undefined,
                difficulty,
                excludeQuestions: history.slice(-200),
              },
            });
            if (error) throw error;
            questions = (data?.questions as string[]) || template.questions || [];
            // Store back into history
            try {
              const updated = Array.from(new Set([...(history || []), ...questions])).slice(-500);
              localStorage.setItem(historyKey, JSON.stringify(updated));
            } catch {}
          } catch (e) {
            console.warn("AI generation failed for predefined template; using defaults", e);
            questions = template.questions || [];
          }
        } 
        // Next, check if it's a custom interview from local storage (for anonymous users)
        else if (id && localStorage.getItem(`interview_template_${id}`)) {
          const template = JSON.parse(localStorage.getItem(`interview_template_${id}`) || '{}');
          
          fetchedData = {
            title: `${template.role || 'Custom'} Interview`,
            type: template.type || "Technical",
            duration: template.difficulty === 'easy' ? 15 : template.difficulty === 'medium' ? 30 : 45,
            difficulty: template.difficulty || 'medium',
            isAnonymous: true,
            questions: template.questions || []
          };
          
          questions = template.questions || [];
        }
        // Finally, check the database for authenticated users
        else if (id && session?.user) {
          // Try to fetch from database
          const { data: interviewData, error: interviewError } = await supabase
            .from('interviews')
            .select('*, interview_templates(*)')
            .eq('id', id)
            .single();
          
          if (interviewError) throw interviewError;
          
          if (!interviewData) {
            toast({
              title: "Interview not found",
              description: "The requested interview could not be found.",
              variant: "destructive",
            });
            navigate("/home");
            return;
          }
          
          // Try AI generation from template metadata
          try {
            const role = interviewData?.interview_templates?.role || "Interview";
            const difficulty = interviewData?.interview_templates?.difficulty || "medium";
            const description = interviewData?.interview_templates?.description || undefined;
            const historyKey = `question_history_${role.toLowerCase()}`;
            const history: string[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
            const { data: aiData, error: aiError } = await supa.functions.invoke("generate-interview", {
              body: {
                role,
                description,
                experience: interviewData?.interview_templates?.experience || undefined,
                difficulty,
                excludeQuestions: history.slice(-200),
              },
            });
            if (aiError) throw aiError;
            questions = (aiData?.questions as string[]) || [];
            try {
              const updated = Array.from(new Set([...(history || []), ...questions])).slice(-500);
              localStorage.setItem(historyKey, JSON.stringify(updated));
            } catch {}
          } catch (e) {
            console.warn("AI generation failed for DB template; falling back to stored questions", e);
            // Fetch questions for this template from DB as fallback
            const { data: questionsData, error: questionsError } = await supabase
              .from('template_questions')
              .select('question_text')
              .eq('template_id', interviewData.template_id);
            if (questionsError) throw questionsError;
            questions = questionsData?.map(q => q.question_text) || [];
          }
          
          fetchedData = {
            ...interviewData,
            questions: questions
          };
        } else {
          // Handle case where no valid interview data is found
          toast({
            title: "Interview not found",
            description: "The requested interview could not be found.",
            variant: "destructive",
          });
          navigate("/home");
          return;
        }
        
        if (!fetchedData || !questions || questions.length === 0) {
          // Graceful fallback: provide generic questions instead of failing
          const fallbackQuestions = [
            "Tell me about yourself.",
            "Describe a challenging problem you solved recently.",
            "What are your strengths and weaknesses?",
            "Explain a project you are proud of and why.",
            "How do you handle feedback and deadlines?",
          ];
          const fallback = {
            title: fetchedData?.title || "Interview",
            type: fetchedData?.type || "General",
            duration: fetchedData?.duration || 30,
            difficulty: fetchedData?.difficulty || 'medium',
            questions: fallbackQuestions,
          };
          fetchedData = fallback;
          questions = fallbackQuestions;
        }
        
        setInterview(fetchedData);
        setTimeLeft((fetchedData.duration || 30) * 60); // Convert minutes to seconds
        setAnswers(new Array(questions.length).fill(""));
        
        // Start webcam
        startWebcam();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching interview data:', error);
        toast({
          title: "Error loading interview",
          description: "There was a problem loading the interview. Please try again.",
          variant: "destructive",
        });
        navigate("/home");
      }
    };
    
    fetchInterviewData();
    
    return () => {
      stopWebcam();
    };
  }, [id, navigate, session]);

  // Start webcam function
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      toast({
        title: "Webcam access denied",
        description: "Please enable webcam access for a better interview experience.",
        variant: "destructive",
      });
    }
  };

  // Stop webcam function
  const stopWebcam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      mediaStreamRef.current = null;
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!isLoading && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            handleEndInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [isLoading, timeLeft]);

  // Update answers when transcript changes
  useEffect(() => {
    if (transcript && currentQuestion !== undefined) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = transcript;
      setAnswers(updatedAnswers);
    }
  }, [transcript]);

  const handleNextQuestion = () => {
    // Check if interview or questions exist
    if (!interview || !interview.questions || interview.questions.length === 0) {
      toast({
        title: "Error",
        description: "No interview questions found.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if this is the last question
    if (currentQuestion === interview.questions.length - 1) {
      setShowEndDialog(true);
    } else {
      // Move to next question
      setCurrentQuestion((prev) => prev + 1);
      // Stop recording if it's active
      if (isRecording) {
        toggleRecording();
      }
      // Reset transcript for the next question
      const nextQuestionIndex = currentQuestion + 1;
      if (nextQuestionIndex < answers.length) {
        setTranscript(answers[nextQuestionIndex] || "");
      } else {
        setTranscript("");
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      // Go to previous question
      setCurrentQuestion((prev) => prev - 1);
      // Stop recording if it's active
      if (isRecording) {
        toggleRecording();
      }
      // Load previous answer
      setTranscript(answers[currentQuestion - 1] || "");
    }
  };

  const handleEndInterview = async () => {
    // Stop recording and webcam
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    stopWebcam();
    
    try {
      // Calculate a mock score - in a real app, this would be computed by an AI model
      const score = Math.floor(Math.random() * 21) + 70; // Random score between 70-90
      
      // If user is logged in, save the interview answers to the database
      if (session?.user && interview) {
        // Update interview with score
        await supabase
          .from('interviews')
          .update({ score })
          .eq('id', id);
        
        // Ensure we have valid questions and answers before saving
        if (interview.questions && Array.isArray(interview.questions) && answers) {
          // Save the individual answers
          const answersToInsert = interview.questions.map((question: string, index: number) => ({
            interview_id: id,
            question_text: question,
            answer_text: answers[index] || "No answer provided",
            score: Math.floor(Math.random() * 21) + 70,
            feedback: "Your answer was comprehensive and showed good understanding."
          }));
          
          if (answersToInsert.length > 0) {
            await supabase
              .from('interview_answers')
              .insert(answersToInsert);
          }
        }
      } else if (interview) {
        // For anonymous users, save results to localStorage
        localStorage.setItem(`interview_result_${id}`, JSON.stringify({
          id,
          title: interview.title || "Interview",
          date: new Date().toISOString(),
          duration: interview.duration || 30,
          score,
          type: interview.type || "General",
          questions: interview.questions || [],
          answers,
          isAnonymous: true
        }));
      }
      
      // Navigate to results page
      navigate(`/results/${id}`, { 
        state: { 
          answers,
          questions: interview?.questions || [],
          title: interview?.title || "Interview",
          type: interview?.type || "General",
          score
        } 
      });
    } catch (error) {
      console.error('Error ending interview:', error);
      toast({
        title: "Error saving results",
        description: "There was a problem saving your interview results.",
        variant: "destructive",
      });
      
      // Still navigate to results page with state
      navigate(`/results/${id}`, { 
        state: { 
          answers,
          questions: interview?.questions || [],
          title: interview?.title || "Interview",
          type: interview?.type || "General"
        } 
      });
    }
  };

  const handleExitInterview = () => {
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    stopWebcam();
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    toast({
      title: "Interview exited",
      description: "You've exited the interview. Your progress was not saved.",
    });
    navigate("/home");
  };

  const toggleRecording = () => {
    if (!isRecognitionSupportedRef.current) {
      toast({
        title: "Voice recording not supported",
        description: "Your browser doesn't support voice recording. Please try a different browser like Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      
      toast({
        title: "Voice recording stopped",
        description: "Your answer has been recorded.",
      });
    } else {
      // Start recording
      try {
        if (recognitionRef.current) {
          // Clear previous transcript if starting a new recording
          if (!transcript) {
            setTranscript("");
          }
          recognitionRef.current.start();
          setIsRecording(true);
          
          toast({
            title: "Voice recording started",
            description: "Speak clearly into your microphone.",
          });
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Couldn't start recording",
          description: "There was a problem starting the voice recording.",
          variant: "destructive",
        });
      }
    }
  };

  const resetRecording = () => {
    // Stop current recording if active
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    
    // Clear transcript for current question
    setTranscript("");
    
    // Update answers
    if (answers && currentQuestion !== undefined) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = "";
      setAnswers(updatedAnswers);
    }
    
    toast({
      title: "Recording reset",
      description: "Your answer has been cleared. You can start again.",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercentage = (interview?.questions && interview.questions.length > 0) 
    ? ((currentQuestion + 1) / interview.questions.length) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-interview-primary mb-4" />
        <p className="text-lg font-medium">Loading your interview...</p>
        <p className="text-sm text-muted-foreground mt-2">Preparing questions and resources</p>
      </div>
    );
  }

  // Safety check before rendering
  if (!interview || !interview.questions || !Array.isArray(interview.questions) || interview.questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-lg font-medium">Interview data error</p>
        <p className="text-sm text-muted-foreground mt-2">Could not load interview questions</p>
        <Button 
          onClick={() => navigate("/home")}
          className="mt-4"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  // Safe access of current question
  const currentQuestionText = interview.questions && Array.isArray(interview.questions) && 
    currentQuestion >= 0 && currentQuestion < interview.questions.length 
      ? interview.questions[currentQuestion] 
      : "No question available";

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">{interview?.title || "Interview"}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">{interview?.type || "General"}</Badge>
                <Badge variant="outline" className={
                  interview?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  interview?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {interview?.difficulty ? (interview.difficulty.charAt(0).toUpperCase() + interview.difficulty.slice(1)) : "Medium"}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {interview?.duration || 30} minutes
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-xl font-bold text-interview-primary">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {interview?.questions?.length || 0}
              </div>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="mt-4" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left side: Video feed */}
          <div className="md:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>You</CardTitle>
                <CardDescription>
                  Live webcam feed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded-md overflow-hidden aspect-video">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleExitInterview}
                >
                  <X className="h-4 w-4 mr-2" />
                  Exit Interview
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right side: Question and controls */}
          <div className="md:col-span-3 space-y-6">
            {/* Question Card */}
            <Card className="border-2 border-interview-light">
              <CardHeader>
                <CardTitle>Question {currentQuestion + 1}</CardTitle>
                <CardDescription>
                  Answer this question as you would in a real interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{currentQuestionText}</p>
              </CardContent>
            </Card>
            
            {/* Voice Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Answer</CardTitle>
                <CardDescription>
                  Use voice input to record your answer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-6">
                  <Button 
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className={`rounded-full p-8 ${isRecording ? "animate-pulse" : ""}`}
                    onClick={toggleRecording}
                  >
                    {isRecording ? 
                      <MicOff className="h-8 w-8" /> : 
                      <Mic className="h-8 w-8" />
                    }
                  </Button>
                </div>
                {isRecording && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">Recording in progress...</p>
                    <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 animate-[pulse_1.5s_ease-in-out_infinite] w-full"></div>
                    </div>
                  </div>
                )}
                
                {transcript && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Your Answer:</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={resetRecording} 
                        className="h-8 px-2"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    </div>
                    <p className="text-sm">{transcript}</p>
                  </div>
                )}
                
                {!isRecording && !transcript && answers && currentQuestion !== undefined && 
                 (!answers[currentQuestion] || answers[currentQuestion] === "") && (
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Click the microphone button to start recording your answer...
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNextQuestion} 
                  className="bg-interview-primary hover:bg-interview-secondary"
                >
                  {interview && interview.questions && currentQuestion === (interview.questions.length - 1) ? "Finish" : "Next"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* End Interview Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Interview?</DialogTitle>
            <DialogDescription>
              Are you sure you want to end this interview? You won't be able to change your answers afterward.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-lg">
            <ThumbsUp className="h-5 w-5 text-interview-primary" />
            <div className="text-sm">
              You've completed {currentQuestion + 1} out of {interview?.questions?.length || 0} questions.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)}>
              Continue Interview
            </Button>
            <Button 
              onClick={handleEndInterview}
              className="bg-interview-primary hover:bg-interview-secondary"
            >
              End & View Results
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit Interview Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exit Interview?</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit this interview? All your progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Continue Interview
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmExit}
            >
              Exit Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Interview;
