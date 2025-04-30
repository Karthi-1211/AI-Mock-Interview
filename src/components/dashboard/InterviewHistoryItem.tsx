
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { File, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InterviewHistoryItemProps {
  id: string;
  title: string;
  date: string;
  duration: number;
  score: number;
  type: string;
}

const InterviewHistoryItem: React.FC<InterviewHistoryItemProps> = ({
  id,
  title,
  date,
  duration,
  score,
  type,
}) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Score color based on performance
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg bg-white mb-4">
      <div className="flex items-center space-x-4 mb-3 md:mb-0">
        <div className="bg-interview-background p-2 rounded-md">
          <File className="h-5 w-5 text-interview-primary" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <div className="flex flex-wrap items-center space-x-2 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{duration} min</span>
            <span>•</span>
            <Badge variant="outline" className="h-5 px-1.5 font-normal">
              {type}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className={`font-medium text-lg ${getScoreColor(score)}`}>{score}%</p>
        </div>
        
        <Link to={`/results/${id}`}>
          <Button variant="outline" size="sm" className="flex items-center space-x-1">
            <span>View</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewHistoryItem;
