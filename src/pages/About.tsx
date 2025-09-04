import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, BookOpen, Heart, Trophy, Users, Zap } from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Balu Karthik",
      role: "Founder & CEO, BK Technologix",
      bio: "AI enthusiast with a passion for transforming interview preparation.",
      image: "BK Pic.jpg",
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section with Parallax */}
      <div className="relative bg-interview-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-interview-primary via-interview-secondary to-interview-accent opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1770&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Transforming Interview Preparation 
              <span className="block">with AI Innovation</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
              We're on a mission to help professionals excel in their careers by mastering the interview process.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Join VirtuHire Now
                </Button>
              </Link>
              <Link to="/home">
                <Button size="lg" variant="outline" className="font-semibold">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,53.3C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="text-sm font-semibold text-interview-secondary tracking-wider mb-2">OUR STORY</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              From Idea to Innovation
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              VirtuHire was founded in 2025 by a team of tech professionals who had experienced firsthand the challenges of interview preparation. After spending years coaching friends and colleagues through job interviews, we realized there was a significant gap in the market for personalized, AI-driven interview practice.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              We built VirtuHire to democratize access to high-quality interview preparation. Our platform leverages cutting-edge AI technology to provide realistic, industry-specific mock interviews that adapt to each user's skill level and career goals.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-interview-primary">25k+</div>
                <div className="text-gray-500">Users</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-interview-primary">90%</div>
                <div className="text-gray-500">Success Rate</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-interview-primary">50+</div>
                <div className="text-gray-500">Industries</div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-24 w-24 bg-interview-light rounded-full z-0"></div>
              <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-interview-secondary/20 rounded-full z-0"></div>
              <div className="relative z-10 overflow-hidden rounded-lg shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1770&auto=format&fit=crop" 
                  alt="Team collaboration" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Vision - Full Width Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8ajt text-center">
          <div className="inline-block p-2 bg-interview-light text-interview-primary rounded-full mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 mb-12 leading-relaxed">
            "We envision a world where every job seeker has access to personalized interview coaching that helps them showcase their true potential."
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-interview-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-interview-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We're committed to providing the most effective and realistic interview preparation tools on the market.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-interview-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-interview-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inclusion</h3>
              <p className="text-gray-600">
                We believe everyone deserves access to quality interview preparation regardless of background or resources.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-interview-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-interview-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously advance our AI technology to provide the most cutting-edge interview preparation experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-block p-2 bg-interview-light text-interview-primary rounded-full mb-4">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Values</h2>
          <p className="text-xl max-w-3xl mx-auto text-gray-600">
            These core principles guide everything we do at VirtuHire.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-interview-light flex items-center justify-center rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-interview-primary">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
            <p className="text-gray-600">
              We continuously push the boundaries of what's possible with AI-driven interview preparation, staying ahead of industry trends to provide cutting-edge solutions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-interview-light flex items-center justify-center rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-interview-primary">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
            <p className="text-gray-600">
              We're committed to making professional development accessible to everyone, creating a platform that serves diverse industries, backgrounds, and skill levels.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-interview-light flex items-center justify-center rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-interview-primary">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Trust</h3>
            <p className="text-gray-600">
              We prioritize user privacy and data security in everything we do, ensuring that our platform is a safe space for professional development and growth.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-interview-light flex items-center justify-center rounded-full mb-6">
              <Award className="h-6 w-6 text-interview-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in all aspects of our service, from the accuracy of our AI to the quality of our user experience and customer support.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-interview-light flex items-center justify-center rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-interview-primary">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Adaptability</h3>
            <p className="text-gray-600">
              We embrace change and continuously evolve our platform to meet the ever-changing landscape of job interviews and hiring practices.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-interview-light flex items-center justify-center rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-interview-primary">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Impact</h3>
            <p className="text-gray-600">
              We measure our success by the positive impact we have on our users' careers, constantly seeking ways to enhance their professional journey.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block p-2 bg-interview-light text-interview-primary rounded-full mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-600">
              The passionate experts behind VirtuHire working to transform interview preparation
            </p>
          </div>

          <div className="flex justify-center">
            {team.map((member, index) => (
              <div key={index} className="text-center max-w-xs">
                <div className="relative mb-6 mx-auto">
                  <div className="w-40 h-40 overflow-hidden rounded-full border-4 border-white shadow-md mx-auto">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-1/3 bg-interview-primary text-white p-2 rounded-full shadow-lg">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-interview-secondary font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-interview-primary via-interview-secondary to-interview-accent opacity-90 rounded-none"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1784&auto=format&fit=crop')] bg-cover bg-center opacity-20 rounded-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Master Your Next Interview?</h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their interview skills with VirtuHire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="font-semibold">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/home">
              <Button size="lg" variant="outline" className="font-semibold">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;