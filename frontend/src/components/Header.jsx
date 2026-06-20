import React, { useEffect, useState } from 'react';
import { GraduationCap, Database, Activity } from 'lucide-react';
import { checkApiHealth } from '../services/api';

export default function Header() {
  const [dbCount, setDbCount] = useState(52); // Fallback to 52 pre-seeded
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    async function getHealth() {
      const health = await checkApiHealth();
      if (health.status === 'healthy') {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    }
    getHealth();
  }, []);

  return (
    <header className="glass-panel border-b border-brand-dark-border sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-brand-saffron to-brand-green p-2 rounded-xl shadow-glass">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-saffron via-white to-brand-green bg-clip-text text-transparent">
                ScholarAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-ashoka text-white border border-blue-500/30">
                MVP
              </span>
            </div>
            <p className="text-xs text-gray-400">India Scholarship Discovery Platform</p>
          </div>
        </div>

        {/* Dynamic Badges */}
        <div className="flex items-center gap-3">
          {/* DB scheme count */}
          <div className="flex items-center gap-2 bg-brand-dark-card border border-brand-dark-border rounded-lg px-3 py-1.5 text-xs text-gray-300">
            <Database className="w-4 h-4 text-brand-saffron-light" />
            <span><strong className="text-white">{dbCount}</strong> Active Schemes</span>
          </div>

          {/* API Health Status */}
          <div className="flex items-center gap-2 bg-brand-dark-card border border-brand-dark-border rounded-lg px-3 py-1.5 text-xs text-gray-300">
            <Activity className="w-4 h-4 text-brand-green-light animate-pulse" />
            <span className="capitalize">
              System: {' '}
              <span className={apiStatus === 'online' ? 'text-brand-green font-semibold' : apiStatus === 'offline' ? 'text-red-500 font-semibold' : 'text-yellow-500'}>
                {apiStatus}
              </span>
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
