import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProfileForm from './components/ProfileForm';
import ResultsList from './components/ResultsList';
import EmptyState from './components/EmptyState';
import Loader from './components/Loader';
import { findScholarships } from './services/api';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('form'); // 'form' | 'loading' | 'results' | 'empty'
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setView('loading');
    setError(null);
    try {
      const response = await findScholarships(formData);
      if (response.status === 'success' && response.scholarships.length > 0) {
        setResults(response.scholarships);
        setProfile(response.student_profile);
        setView('results');
      } else {
        setView('empty');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch scholarships. Please try again.');
      setView('form');
    }
  };

  const handleReset = () => {
    setResults([]);
    setProfile(null);
    setError(null);
    setView('form');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow py-8 max-w-6xl mx-auto w-full">
        {/* Error Alert Banner */}
        {error && (
          <div className="mx-4 mb-6 max-w-lg mx-auto flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm animate-fade-in shadow-md">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
            <div>
              <h4 className="font-bold">Search Failed</h4>
              <p className="text-xs text-red-300 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* View Routing */}
        {view === 'form' && (
          <>
            <Hero />
            <ProfileForm onSubmit={handleFormSubmit} loading={false} />
          </>
        )}

        {view === 'loading' && (
          <div className="py-12">
            <Loader />
          </div>
        )}

        {view === 'results' && (
          <ResultsList
            results={results}
            profile={profile}
            onReset={handleReset}
          />
        )}

        {view === 'empty' && (
          <EmptyState onReset={handleReset} />
        )}
      </main>

      <Footer />
    </div>
  );
}
