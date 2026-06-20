import React from 'react';
import { Award, Zap, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <div className="text-center py-10 md:py-16 px-4 max-w-4xl mx-auto animate-fade-in">
      {/* Slogan */}
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
        Find Every Scholarship <br />
        <span className="bg-gradient-to-r from-brand-saffron via-brand-saffron-light to-brand-green bg-clip-text text-transparent">
          You Deserve
        </span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
        Enter 5 basic details. Our intelligent engine matches you with eligible Central, State, and private NGO scholarships in seconds.
      </p>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3 text-left border border-white/5">
          <div className="bg-brand-saffron/10 p-2.5 rounded-lg text-brand-saffron">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 text-sm">Under 60 Seconds</h3>
            <p className="text-xs text-gray-400">Immediate ranked results</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-3 text-left border border-white/5">
          <div className="bg-brand-green/10 p-2.5 rounded-lg text-brand-green">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 text-sm">Strict Match Only</h3>
            <p className="text-xs text-gray-400">Zero false positives</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl flex items-center gap-3 text-left border border-white/5">
          <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-200 text-sm">Zero Friction</h3>
            <p className="text-xs text-gray-400">No login, registration or PII</p>
          </div>
        </div>

      </div>
    </div>
  );
}
