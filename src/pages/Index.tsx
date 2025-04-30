
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, User, Calendar, FileText, Star } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import Logo from "@/components/common/Logo";

const Index = () => {
  const features = [
    {
      title: "AI-Powered Questions",
      description: "Tailored questions based on the role you're applying for, adjusting to your experience level and industry.",
      icon: <CheckCircle className="h-5 w-5 text-interview-primary" />,
    },
    {
      title: "Real-time Feedback",
      description: "Get instant evaluation on your answers with detailed suggestions for improvement.",
      icon: <CheckCircle className="h-5 w-5 text-interview-primary" />,
    },
    {
      title: "Extensive Library",
      description: "Practice with thousands of real interview questions from top companies.",
      icon: <CheckCircle className="h-5 w-5 text-interview-primary" />,
    },
    {
      title: "Personalized Reports",
      description: "Detailed performance metrics and improvement recommendations after each session.",
      icon: <CheckCircle className="h-5 w-5 text-interview-primary" />,
    },
  ];

  const testimonials = [
    {
      content: "AI Mock Interview helped me land my dream job at a FAANG company. The AI feedback was spot-on and helped me identify my weak points.",
      author: "Balu",
      role: "Software Engineer",
    },
    {
      content: "The realistic interview scenarios really prepared me for tough questions. I felt so much more confident during my actual interviews.",
      author: "Michael",
      role: "Product Manager",
    },
    {
      content: "After just two weeks of practicing with AI Mock Interview, I received three job offers. This platform is a game-changer!",
      author: "Karthik",
      role: "Data Scientist",
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-pattern py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Ace Your Next Interview with <span className="gradient-text">AI-Powered Practice</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Prepare for job interviews with realistic AI-generated questions, receive instant feedback, and track your progress with detailed analytics.
              </p>
              <div className="mt-8 space-x-4">
                <Link to="/home">
                  <Button size="lg" className="bg-interview-primary hover:bg-interview-secondary">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/home">
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center border-2 border-white"
                    >
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                  ))}
                </div>
                <span className="ml-2">Join 10,000+ professionals mastering interviews</span>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-interview-light rounded-lg transform rotate-3 scale-105 opacity-30"></div>
                <div className="relative bg-white rounded-lg shadow-xl overflow-hidden border">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Logo className="h-6 w-6" />
                        <span className="font-semibold text-interview-primary">Mock Interview</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Live Session</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Software Engineering - React</h3>
                    <div className="space-y-4 mt-4">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Interview Question:</p>
                        <p className="text-sm">Can you explain the concept of React hooks and give an example of when you would use useState and useEffect?</p>
                      </div>
                      <div className="bg-interview-background p-4 rounded-lg">
                        <p className="text-sm font-medium mb-2">Your Answer:</p>
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-slate-600" />
                          </div>
                          <p className="text-sm text-gray-700">React hooks are functions that let you use state and lifecycle features in functional components...</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button size="sm" className="bg-interview-primary hover:bg-interview-secondary">Next Question</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="floating-animation hidden md:block absolute -right-8 -bottom-8 bg-white shadow-lg rounded-lg p-4 z-10">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Great answer!</p>
                    <p className="text-xs text-muted-foreground">Your explanation was clear and concise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Master Every Interview with StellarMock</h2>
            <p className="mt-4 text-muted-foreground">
              Our AI-powered platform provides everything you need to prepare for your next job interview.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features && features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border hover:border-interview-light hover:shadow-md transition-all">
                <div className="mb-4">{feature?.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature?.title}</h3>
                <p className="text-sm text-muted-foreground">{feature?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">How StellarMock Works</h2>
            <p className="mt-4 text-muted-foreground">
              Our structured approach ensures you get the most effective interview preparation.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="w-12 h-12 rounded-full bg-interview-background flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-interview-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about your career goals, experience level, and the roles you're targeting.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="w-12 h-12 rounded-full bg-interview-background flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-interview-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Practice Interviews</h3>
              <p className="text-sm text-muted-foreground">
                Schedule mock interviews using our AI interviewer that adapts to your responses.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center">
              <div className="w-12 h-12 rounded-full bg-interview-background flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-interview-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Detailed Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Receive comprehensive reports with personalized improvement suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of professionals who have improved their interview skills with StellarMock.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials && testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border">
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm mb-4">{testimonial?.content}</p>
                <div>
                  <p className="font-medium">{testimonial?.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial?.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 gradient-bg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of professionals who have transformed their interview skills with StellarMock.
          </p>
          <Link to="/home">
            <Button size="lg" variant="secondary" className="bg-white text-interview-primary hover:bg-gray-100">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
