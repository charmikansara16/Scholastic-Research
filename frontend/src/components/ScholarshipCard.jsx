import React, { useState } from 'react';
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, FileText, Landmark, Link2, Sparkles, Globe } from 'lucide-react';

export default function ScholarshipCard({ scholarship }) {
  const [expanded, setExpanded] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDoc = (doc) => {
    setCheckedDocs(prev => ({
      ...prev,
      [doc]: !prev[doc]
    }));
  };

  const getHostname = (urlStr) => {
    try {
      return new URL(urlStr).hostname.replace('www.', '');
    } catch (e) {
      return 'Official Portal';
    }
  };

  const getSourceBadgeClass = (source) => {
    switch (source.toLowerCase()) {
      case 'central government':
        return 'badge-central';
      case 'state government':
        return 'badge-state';
      case 'csr':
        return 'badge-csr';
      case 'ngo':
        return 'badge-ngo';
      default:
        return 'bg-gray-800 text-gray-300 border border-gray-700';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 md:p-6 border border-white/5 shadow-glass animate-fade-in flex flex-col gap-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 flex flex-col gap-2">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${getSourceBadgeClass(scholarship.source_type)}`}>
              {scholarship.source_type}
            </span>
            {scholarship.rank === 1 && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-ashoka text-white border border-blue-500/20 flex items-center gap-1">
                ⭐ Best Match
              </span>
            )}
          </div>
          {/* Name */}
          <h3 className="text-lg md:text-xl font-bold text-gray-100 hover:text-brand-saffron transition-colors leading-snug">
            {scholarship.name}
          </h3>
          {/* Authority & Source */}
          <div className="flex flex-col gap-1.5 mt-0.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Landmark className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>{scholarship.authority}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Globe className="w-3.5 h-3.5 text-brand-saffron/70 shrink-0" />
              <span>
                Source:{' '}
                <a
                  href={scholarship.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-saffron-light underline hover:text-brand-saffron transition-colors font-medium"
                >
                  {getHostname(scholarship.apply_url)}
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Amount Section */}
        <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0 bg-brand-dark-base/50 p-3 rounded-xl border border-brand-dark-border sm:bg-transparent sm:border-0 sm:p-0">
          <span className="text-xs text-gray-500">Scholarship Amount</span>
          <span className="text-xl md:text-2xl font-extrabold text-brand-green-light">
            {scholarship.amount_display}
          </span>
        </div>
      </div>

      <hr className="border-brand-dark-border" />

      {/* AI Reason */}
      <div className="flex items-start gap-2.5 bg-gradient-to-r from-brand-saffron/10 to-brand-green/5 p-4 rounded-xl border border-brand-saffron/10 text-sm leading-relaxed text-gray-300">
        <Sparkles className="w-4 h-4 text-brand-saffron shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="font-semibold text-brand-saffron-light">Eligibility Reason:</span>{' '}
          {scholarship.eligibility_reason}
        </div>
      </div>

      {/* Expandable Section */}
      {expanded ? (
        <div className="flex flex-col gap-4 mt-2 animate-fade-in">
          {/* Required Documents Checklist */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-2 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-brand-saffron" />
              <span>Required Documents Checklist</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-brand-dark-base/50 p-4 rounded-xl border border-brand-dark-border">
              {scholarship.documents_required.map((doc, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleDoc(doc)}
                  className="flex items-center gap-3 cursor-pointer group hover:text-white transition-colors py-1"
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 transition-colors ${checkedDocs[doc] ? 'text-brand-green fill-brand-green/20' : 'text-gray-600 group-hover:text-gray-400'}`} />
                  <span className={`text-xs ${checkedDocs[doc] ? 'line-through text-gray-500' : 'text-gray-300'}`}>{doc}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5 px-1">Check off the documents you have prepared to track your application readiness.</p>
          </div>

          <hr className="border-brand-dark-border" />
        </div>
      ) : null}

      {/* Actions / Deadline Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
        {/* Deadline Indicator */}
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">
            Deadline:{' '}
            <span className={`font-semibold ${scholarship.deadline_urgent ? 'text-red-400 animate-pulse bg-red-950/20 px-2 py-0.5 rounded border border-red-500/20' : 'text-gray-300'}`}>
              {scholarship.deadline_display}
            </span>
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Toggle details */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs text-gray-300 hover:text-white bg-brand-dark-card border border-brand-dark-border hover:border-gray-700 px-4 py-2.5 rounded-lg transition-all"
          >
            <span>{expanded ? 'Hide Checklist' : 'Required Docs'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Apply Now */}
          <a
            href={scholarship.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-brand-saffron hover:bg-brand-saffron-dark active:scale-[0.98] px-5 py-2.5 rounded-lg transition-all shadow-md shrink-0"
          >
            <span>Apply Now</span>
            <Link2 className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
