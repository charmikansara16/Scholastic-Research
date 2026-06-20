import React from 'react';

export default function Loader() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-pulse px-4">
      {/* Search status header shimmer */}
      <div className="h-6 bg-brand-dark-card rounded-lg w-1/3 border border-brand-dark-border"></div>
      
      {/* 3 card shimmers */}
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-glass">
          
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 flex flex-col gap-2">
              {/* Badge Shimmer */}
              <div className="h-5 bg-brand-dark-border rounded w-20"></div>
              {/* Title Shimmer */}
              <div className="h-6 bg-brand-dark-card rounded w-3/4"></div>
              {/* Authority Shimmer */}
              <div className="h-4 bg-brand-dark-card rounded w-1/2"></div>
            </div>
            
            {/* Amount Shimmer */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div className="h-5 bg-brand-dark-border rounded w-20"></div>
              <div className="h-4 bg-brand-dark-card rounded w-16"></div>
            </div>
          </div>
          
          <hr className="border-brand-dark-border" />
          
          {/* Reason Shimmer */}
          <div className="space-y-2">
            <div className="h-4 bg-brand-dark-card rounded w-full"></div>
            <div className="h-4 bg-brand-dark-card rounded w-5/6"></div>
          </div>

          <hr className="border-brand-dark-border" />
          
          {/* CTA Shimmer */}
          <div className="flex justify-between items-center mt-2">
            <div className="h-4 bg-brand-dark-card rounded w-24"></div>
            <div className="h-10 bg-brand-dark-border rounded-lg w-28"></div>
          </div>

        </div>
      ))}
    </div>
  );
}
