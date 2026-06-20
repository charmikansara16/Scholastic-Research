import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-dark-border bg-brand-dark-base/80 backdrop-blur-sm py-10 px-4 text-sm text-gray-400">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
        
        {/* Government Disclaimer */}
        <div className="flex items-start gap-3 bg-brand-dark-card/50 border border-brand-dark-border p-4 rounded-xl max-w-2xl text-left">
          <ShieldAlert className="w-5 h-5 text-brand-saffron shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-200 mb-1">Official Disclaimer & Affiliation Notice</h4>
            <p className="text-xs leading-relaxed text-gray-400">
              ScholarAI is an independent, non-governmental discovery platform created for educational and hackathon demonstration purposes. 
              We are <strong>not affiliated</strong> with the Government of India, the National Scholarship Portal (NSP), or any state scholarship authorities. 
              Always verify eligibility criteria, deadlines, and official application requirements directly on the official government or provider portals before applying.
            </p>
          </div>
        </div>

        {/* Links and DB Freshness */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-gray-300">
            <RefreshCw className="w-3.5 h-3.5 text-brand-green" />
            <span>Database Status: <strong>Last updated on 20-Jun-2026</strong></span>
          </div>
          <span className="hidden sm:inline text-gray-600">|</span>
          <div className="flex gap-4">
            <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-brand-saffron transition-colors underline">
              Official National Scholarship Portal
            </a>
            <a href="https://www.buddy4study.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-saffron transition-colors underline">
              Buddy4Study Resources
            </a>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-600 mt-2">
          &copy; {new Date().getFullYear()} ScholarAI Platform. Designed for Indian Students.
        </p>

      </div>
    </footer>
  );
}
