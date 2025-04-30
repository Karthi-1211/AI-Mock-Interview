
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Award, Star, Zap } from "lucide-react";

export interface InterviewCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  type: string;
  questions: number;
  isCustom?: boolean;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  id,
  title,
  description,
  duration,
  difficulty,
  type,
  questions,
  isCustom = false,
}) => {
  const difficultyColor = {
    easy: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
    hard: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  };
  
  const difficultyIcon = {
    easy: <Star className="w-3.5 h-3.5 mr-1" />,
    medium: <Award className="w-3.5 h-3.5 mr-1" />,
    hard: <Zap className="w-3.5 h-3.5 mr-1" />,
  };
  
  const typeIcon = {
    "Technical": <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                   <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"></path><path d="M16 3h1a2 2 0 0 1 2 2v5c0 1.1.9 2 2 2a2 2 0 0 1-2 2v5a2 2 0 0 1-2 2h-1"></path></svg>
                 </div>,
    "Behavioral": <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>,
    "System Design": <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                       <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-purple-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                     </div>,
    "Custom": <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </div>
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-card hover:translate-y-[-2px] transition-all duration-300 border-slate-100 overflow-hidden rounded-xl">
      <CardHeader className="pb-2 bg-slate-50/50">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            {typeIcon[type as keyof typeof typeIcon] || typeIcon["Custom"]}
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">{title}</CardTitle>
              <CardDescription className="text-sm text-slate-500">{type}</CardDescription>
            </div>
          </div>
          {isCustom ? (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
              Custom
            </Badge>
          ) : (
            <Badge variant="outline" className={difficultyColor[difficulty]}>
              <div className="flex items-center">
                {difficultyIcon[difficulty]}
                <span>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
              </div>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        <p className="text-slate-600 text-sm">{description}</p>
        <div className="flex items-center mt-4 text-sm text-slate-500 bg-slate-50 py-1.5 px-2.5 rounded-md">
          <Clock className="w-4 h-4 mr-1 text-interview-primary" />
          <span>{duration} min</span>
          <span className="mx-2">•</span>
          <span>{questions} questions</span>
        </div>
      </CardContent>
      <CardFooter className="pt-1 pb-4">
        <Link to={isCustom ? `/create-interview` : `/interview/${id}`} className="w-full">
          <Button className="w-full bg-interview-primary hover:bg-interview-secondary group">
            {isCustom ? "Create Interview" : "Start Interview"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1.5 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.66663 4L12.6666 8L8.66663 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default InterviewCard;
