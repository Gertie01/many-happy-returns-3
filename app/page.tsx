"use client";

import React, { useState, useEffect } from 'react';
import VideoGenerator from '../components/VideoGenerator';
import Library from '../components/Library';
import { VideoIcon, LibraryIcon, Sparkles } from 'lucide-react';

export default function Home() {
  const [view, setView] = useState<'generate' | 'library'>('generate');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sora2_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const addToHistory = (video: any) => {
    const newHistory = [video, ...history];
    setHistory(newHistory);
    localStorage.setItem('sora2_history', JSON.stringify(newHistory));
  };

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">SORA 2 <span className="text-blue-500 font-light">PRO</span></h1>
        </div>
        
        <nav className="flex bg-zinc-900 p-1 rounded-full border border-zinc-800">
          <button 
            onClick={() => setView('generate')} 
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${view === 'generate' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-400'}`}
          >
            <VideoIcon size={18} /> Generate
          </button>
          <button 
            onClick={() => setView('library')} 
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${view === 'library' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-400'}`}
          >
            <LibraryIcon size={18} /> Library ({history.length})
          </button>
        </nav>
      </header>

      <div className="w-full transition-all duration-300">
        {view === 'generate' ? (
          <VideoGenerator onComplete={addToHistory} />
        ) : (
          <Library items={history} />
        )}
      </div>

      <footer className="mt-20 border-t border-zinc-900 pt-8 text-center text-zinc-500 text-sm">
        <p>© 2024 Sora 2 AI. Model provided by CloudPrice.net. No usage limits.</p>
      </footer>
    </main>
  );
}
