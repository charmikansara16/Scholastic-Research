import React from 'react';
import ScholarshipCard from './ScholarshipCard';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

export default function ResultsList({ results, profile, onReset }) {
  return (
    <div className="max-w-2xl mx-auto px-4 flex flex-col gap-6 animate-fade-in my-6">
      
      {/* Back CTA / Summary Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-brand-dark-card/30 border border-brand-dark-border p-4 rounded-xl">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-brand-saffron hover:text-brand-saffron-light transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Adjust Filters</span>
        </button>

        {/* Profile badges */}
        <div className="flex flex-wrap gap-1.5 text-[10px] text-gray-400">
          <span className="bg-brand-dark-base px-2 py-1 rounded border border-brand-dark-border">{profile.category}</span>
          <span className="bg-brand-dark-base px-2 py-1 rounded border border-brand-dark-border">{profile.state}</span>
          <span className="bg-brand-dark-base px-2 py-1 rounded border border-brand-dark-border">{profile.edu_level}</span>
          <span className="bg-brand-dark-base px-2 py-1 rounded border border-brand-dark-border">{profile.score_percentage}% Score</span>
        </div>
      </div>

      {/* Title Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
          <span>Matched {results.length} Opportunity{results.length > 1 ? 'ies' : ''}</span>
        </h2>
        <span className="text-xs text-gray-500">Sorted by Value (INR)</span>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-6">
        {results.map(scholarship => (
          <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>

      {/* Fallback NSP suggestion banner */}
      <div className="glass-panel border border-brand-green/20 bg-brand-green/5 p-5 rounded-2xl text-center shadow-glass flex flex-col items-center gap-3">
        <div className="bg-brand-green/10 p-2 rounded-full text-brand-green-light">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-bold text-gray-200 text-sm">Need More Opportunities?</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
            You might also qualify for additional local department level schemes. You can search the government National Scholarship Portal directly.
          </p>
        </div>
        <a
          href="https://scholarships.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-green/20 hover:bg-brand-green/30 border border-brand-green/40 text-brand-green-light px-4 py-2 rounded-lg text-xs font-bold transition-all mt-1"
        >
          Explore NSP Website
        </a>
      </div>

    </div>
  );
}
