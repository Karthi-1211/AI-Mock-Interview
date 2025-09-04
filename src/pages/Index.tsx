
import React, { useEffect } from "react";
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

  useEffect(() => {
    // Reveal-on-scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-section");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => observer.observe(el));
    
    // Parallax on scroll for colorful layers
    const handleScroll = () => {
      const y = window.scrollY;
      document.querySelectorAll<HTMLElement>(".parallax").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.2");
        el.style.transform = `translateY(${y * speed}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <MainLayout>
      {/* Hero Section with colorful layered parallax */}
      <section className="relative py-24 md:py-36 px-6 overflow-hidden">
        {/* Colorful gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-fuchsia-100 to-amber-100 pointer-events-none z-0" />
        {/* Parallax color layers */}
        <div className="parallax absolute -top-32 -left-16 w-[28rem] h-[28rem] bg-gradient-to-tr from-fuchsia-400/30 to-pink-400/30 rounded-full blur-3xl pointer-events-none z-0" data-speed="-0.08" />
        <div className="parallax absolute top-24 -right-24 w-[26rem] h-[26rem] bg-gradient-to-tr from-amber-400/30 to-yellow-300/30 rounded-full blur-3xl pointer-events-none z-0" data-speed="0.06" />
        <div className="parallax absolute -bottom-24 left-1/3 w-[22rem] h-[22rem] bg-gradient-to-tr from-cyan-400/25 to-sky-400/25 rounded-full blur-3xl pointer-events-none z-0" data-speed="-0.04" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-[fadeInUp_0.7s_ease-out_forwards] opacity-0">
                <span className="shimmer-text">Ace Your Next Interview</span> with <span className="gradient-text shimmer-gradient">AI-Powered Practice</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground animate-[fadeInUp_0.8s_ease-out_0.1s_forwards] opacity-0">
                Prepare for job interviews with realistic AI-generated questions, receive instant feedback, and track your progress with detailed analytics.
              </p>
              <div className="mt-8 space-x-4 animate-[fadeInUp_0.9s_ease-out_0.2s_forwards] opacity-0">
                <Link to="/home">
                  <Button size="lg" className="bg-interview-primary hover:bg-interview-secondary pulse-cta">
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
              <div className="mt-8 flex items-center text-sm text-muted-foreground animate-[fadeInUp_1s_ease-out_0.3s_forwards] opacity-0">
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
                <div className="parallax relative bg-white rounded-lg shadow-xl overflow-hidden border animate-[fadeIn_0.8s_ease-out_forwards] opacity-0" data-speed="0.04">
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
              <div className="parallax floating-animation hidden md:block absolute -right-8 -bottom-8 bg-white shadow-lg rounded-lg p-4 z-10 animate-[fadeIn_0.8s_ease-out_0.1s_forwards] opacity-0" data-speed="-0.03">
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
        {/* Sparkles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full animate-[sparkle_3s_linear_infinite]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
          @keyframes sparkle { 0% { transform: translateY(0); opacity: .6 } 50% { opacity: 1 } 100% { transform: translateY(10px); opacity: .2 } }
          .reveal { opacity: 0; transform: translateY(10px); transition: opacity .6s ease, transform .6s ease }
          .animate-section { opacity: 1 !important; transform: translateY(0) !important }
          .shimmer-text { background: linear-gradient(90deg, #111827, #6b7280, #111827); -webkit-background-clip: text; background-clip: text; color: transparent; background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite }
          .shimmer-gradient { background-size: 200% 100%; animation: shimmer 4s ease-in-out infinite }
          @keyframes shimmer { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
          .pulse-cta { box-shadow: 0 0 0 0 rgba(55, 48, 163, .5); animation: pulseShadow 2.4s ease-out infinite }
          @keyframes pulseShadow { 0% { box-shadow: 0 0 0 0 rgba(55, 48, 163, .5) } 70% { box-shadow: 0 0 0 18px rgba(55, 48, 163, 0) } 100% { box-shadow: 0 0 0 0 rgba(55, 48, 163, 0) } }
        `}</style>
      </section>

      {/* Trusted by marquee */}
      <section className="relative py-10 px-6 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-white pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center text-slate-600 text-sm mb-4">Trusted by learners and professionals from</div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-10 animate-[marquee_18s_linear_infinite] opacity-80 hover:opacity-100">
              {['Google','Amazon','Microsoft','Meta','Netflix','Uber','Stripe','Airbnb'].map((name) => (
                <div key={name} className="text-slate-400 text-lg font-semibold tracking-wide">
                  {name}
                </div>
              ))}
              {['Google','Amazon','Microsoft','Meta','Netflix','Uber','Stripe','Airbnb'].map((name) => (
                <div key={name+2} className="text-slate-400 text-lg font-semibold tracking-wide">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
      </section>

      {/* Features Section with hover animations */}
      <section className="relative py-20 px-6 reveal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50 to-white pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Master Every Interview with VirtuHire</h2>
            <p className="mt-4 text-muted-foreground">
              Our AI-powered platform provides everything you need to prepare for your next job interview.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features && features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border hover:border-interview-light hover:shadow-md transition-all transform hover:-translate-y-1">
                <div className="mb-4">{feature?.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature?.title}</h3>
                <p className="text-sm text-muted-foreground">{feature?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-6 reveal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-fuchsia-50 to-indigo-50 pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">How VirtuHire Works</h2>
            <p className="mt-4 text-muted-foreground">
              Our structured approach ensures you get the most effective interview preparation.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border text-center transition-transform hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-interview-background flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-interview-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about your career goals, experience level, and the roles you're targeting.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center transition-transform hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-interview-background flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-interview-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Practice Interviews</h3>
              <p className="text-sm text-muted-foreground">
                Schedule mock interviews using our AI interviewer that adapts to your responses.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border text-center transition-transform hover:shadow-lg hover:-translate-y-1">
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
      <section className="relative py-20 px-6 reveal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-50 to-rose-50 pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of professionals who have improved their interview skills with VirtuHire.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials && testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border transition-transform hover:-translate-y-1 hover:shadow-lg">
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
      <section className="relative py-16 px-6 gradient-bg reveal overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.1),transparent_40%)] z-0" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of professionals who have transformed their interview skills with VirtuHire.
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
