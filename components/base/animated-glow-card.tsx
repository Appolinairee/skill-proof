import React from 'react';
import { cn } from "@/utils/utils";

interface CardCanvasProps {
  children: React.ReactNode;
  className?: string;
}

const CardCanvas: React.FC<CardCanvasProps> = ({ children, className = "" }) => {
  return (
    <div className={cn("card-canvas", className)}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
          <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0"></feColorMatrix>
        </filter>
      </svg>
      <div className="card-backdrop"></div>
      {children}
    </div>
  );
};

export { CardCanvas};
