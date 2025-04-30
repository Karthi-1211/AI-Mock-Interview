import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, Clock, FileText, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import InterviewHistoryItem from "@/components/dashboard/InterviewHistoryItem";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: interviews, isLoading: isLoadingInterviews } = useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('interviews')
          .select('*')
          .eq('user_id', session.user.id)
          .order('date', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error('Error fetching interviews:', error);
          throw error;
        }
        
        return data || [];
      }
      
      // For anonymous users, check local storage
      const localInterviews = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('interview_result_')) {
          const interview = JSON.parse(localStorage.getItem(key) || '{}');
          localInterviews.push({
            id: key.replace('interview_result_', ''),
            title: interview.title || 'Untitled Interview',
            date: interview.date || new Date().toISOString(),
            duration: interview.duration || 30,
            score: interview.score || 0,
            type: interview.type || 'Technical',
            isAnonymous: true
          });
        }
      }
      
      return localInterviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    enabled: true,
  });

  // Calculate stats
  const totalInterviews = interviews?.length || 0;
  
  let totalTime = 0;
  let totalScore = 0;
  
  if (interviews && interviews.length > 0) {
    totalTime = interviews.reduce((acc, interview) => acc + (interview.duration || 0), 0);
    totalScore = interviews.reduce((acc, interview) => acc + (interview.score || 0), 0);
  }
  
  const averageScore = totalInterviews > 0 ? Math.round(totalScore / totalInterviews) : 0;
  
  // Generate chart data
  const chartData = interviews?.slice(0, 5).map(interview => ({
    date: new Date(interview.date).toLocaleDateString(),
    score: interview.score || 0
  })).reverse() || [];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome{session?.user ? `, ${session.user.email}` : ''}! Track your interview progress.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Interviews" 
            value={totalInterviews.toString()} 
            description={totalInterviews === 0 ? "Get started with your first interview" : "Interviews completed"}
            icon={<User className="h-4 w-4" />}
          />
          <StatCard 
            title="Practice Time" 
            value={`${Math.round(totalTime / 60)} hrs`} 
            description="Total interview practice time"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard 
            title="Average Score" 
            value={averageScore > 0 ? `${averageScore}%` : "--"} 
            description={averageScore > 0 ? "Your overall performance" : "Complete interviews to see your score"}
            icon={<FileText className="h-4 w-4" />}
          />
          <StatCard 
            title="Next Steps" 
            value={totalInterviews > 0 ? "Practice More" : "Start Now"} 
            description={totalInterviews > 0 ? "Keep improving your skills" : "Begin your first interview"}
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Performance Progress</CardTitle>
                <CardDescription>
                  {chartData.length > 0 
                    ? "Your interview score trends" 
                    : "Your interview score trends will appear here"}
                </CardDescription>
              </div>
              <Tabs defaultValue="1m">
                <TabsList>
                  <TabsTrigger value="1w">1w</TabsTrigger>
                  <TabsTrigger value="1m">1m</TabsTrigger>
                  <TabsTrigger value="3m">3m</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0">
              {chartData.length > 0 ? (
                <div className="h-[300px] w-full p-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3730A3" 
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] w-full p-6 flex flex-col items-center justify-center">
                  <div className="text-center p-6 max-w-md">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Interview Data Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete your first interview to start tracking your progress over time.
                    </p>
                    <Link to="/home">
                      <Button className="bg-interview-primary hover:bg-interview-secondary">
                        Start an Interview
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-full lg:col-span-3">
            <CardHeader>
              <CardTitle>Skills Breakdown</CardTitle>
              <CardDescription>
                Your performance across different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {totalInterviews > 0 ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Technical Knowledge</span>
                      <span className="font-medium">{Math.round(averageScore * 1.05)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-interview-primary rounded-full"
                        style={{ width: `${Math.round(averageScore * 1.05)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Communication</span>
                      <span className="font-medium">{Math.round(averageScore * 0.95)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-interview-primary rounded-full"
                        style={{ width: `${Math.round(averageScore * 0.95)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Problem Solving</span>
                      <span className="font-medium">{Math.round(averageScore * 1.02)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-interview-primary rounded-full"
                        style={{ width: `${Math.round(averageScore * 1.02)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Industry Knowledge</span>
                      <span className="font-medium">{Math.round(averageScore * 0.98)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-interview-primary rounded-full"
                        style={{ width: `${Math.round(averageScore * 0.98)}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <User className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Skills Data Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete at least one interview to see your skills breakdown.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Interviews</h2>
            <Link to="/home">
              <Button variant="outline" size="sm" className="text-sm">
                Browse Templates <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {isLoadingInterviews ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-interview-primary" />
            </div>
          ) : interviews && interviews.length > 0 ? (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <InterviewHistoryItem 
                  key={interview.id}
                  id={interview.id}
                  title={interview.title}
                  date={interview.date}
                  duration={interview.duration}
                  score={interview.score || 0}
                  type={interview.type}
                />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Interview History</h3>
              <p className="text-muted-foreground mb-4">
                Your completed interviews will appear here. Start practicing to build your history.
              </p>
              <Link to="/home">
                <Button className="bg-interview-primary hover:bg-interview-secondary">
                  Start Your First Interview
                </Button>
              </Link>
            </Card>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recommended for You</h2>
            <Link to="/home">
              <Button variant="outline" size="sm" className="text-sm">
                Browse All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Create Custom Interview</CardTitle>
                  <div className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                    New
                  </div>
                </div>
                <CardDescription>Customize Your Practice</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">Create a personalized interview based on your target role, experience level, and difficulty preference.</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to="/create-interview">
                  <Button className="w-full bg-interview-primary hover:bg-interview-secondary">Create Interview</Button>
                </Link>
              </div>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Frontend Developer Interview</CardTitle>
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full">
                    Medium
                  </div>
                </div>
                <CardDescription>Technical Interview</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">Practice common frontend development questions focusing on JavaScript, React, and web performance.</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to="/interview/1">
                  <Button className="w-full bg-interview-primary hover:bg-interview-secondary">Start Interview</Button>
                </Link>
              </div>
            </Card>
            

            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Behavioral Interview</CardTitle>
                  <div className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                    Easy
                  </div>
                </div>
                <CardDescription>Behavioral Interview</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">Practice answering common behavioral questions using the STAR method.</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Link to="/interview/3">
                  <Button className="w-full bg-interview-primary hover:bg-interview-secondary">Start Interview</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;