
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      className={cn("w-8 h-8", className)} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2L4 6V18L12 22L20 18V6L12 2Z" 
        fill="url(#paint0_linear)" 
        stroke="#3730A3" 
        strokeWidth="1.5" 
      />
      <path 
        d="M12 8L8 10V14L12 16L16 14V10L12 8Z" 
        fill="white" 
        stroke="#3730A3" 
        strokeWidth="1.5" 
      />
      <defs>
        <linearGradient 
          id="paint0_linear" 
          x1="4" 
          y1="2" 
          x2="20" 
          y2="22" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3730A3" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
