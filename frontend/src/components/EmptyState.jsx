import React from 'react';
import { RefreshCw, SearchX, ExternalLink } from 'lucide-react';

export default function EmptyState({ onReset }) {
  return (
    <div className="glass-panel border border-brand-dark-border rounded-2xl p-8 max-w-xl mx-auto text-center shadow-glass animate-fade-in my-8">
      <div className="bg-red-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-brand-saffron border border-red-500/20">
        <SearchX className="w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-200 mb-3">No Scholarships Found</h2>
      
      <p className="text-sm text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
        We couldn't find any direct matches in our curated database for your specific profile combination. 
        Try adjusting your income certificate parameters, category selection, or review guidelines.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        
        {/* Search Again */}
        <button
          onClick={onReset}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-dark-card hover:bg-brand-dark-border border border-brand-dark-border text-white px-5 py-3 rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Adjust Inputs</span>
        </button>

        {/* Go to NSP */}
        <a
          href="https://scholarships.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-saffron to-brand-saffron-dark hover:brightness-110 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md"
        >
          <span>Search NSP Directly</span>
          <ExternalLink className="w-4 h-4" />
        </a>

      </div>
    </div>
  );
}
