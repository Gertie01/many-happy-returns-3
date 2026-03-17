"use client";

import React, { useState } from 'react';
import { Wand2, Loader2, Plus, Trash2, UserCircle2 } from 'lucide-react';

export default function VideoGenerator({ onComplete }: { onComplete: (video: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [characters, setCharacters] = useState(['', '', '', '', '']);

  const updateCharacter = (index: number, val: string) => {
    const newChars = [...characters];
    newChars[index] = val;
    setCharacters(newChars);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          modelId: "sora-2",
          aspectRatio,
          length: "15s",
          characters: characters.filter(c => c !== "")
        })
      });

      const data = await response.json();
      if (data.url) {
        onComplete(data);
        setPrompt('');
      } else {
        alert("Generation failed. Check console for details.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-xl">
          <label className="block text-sm font-medium mb-3 text-zinc-400">Prompt</label>
          <textarea 
            rows={5} 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your cinematic scene... (e.g. A cyberpunk city at night with neon lights reflecting on wet pavement)"
            className="w-full bg-zinc-950 border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 transition-all text-lg"
          />
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2 text-zinc-500 uppercase tracking-widest">Aspect Ratio</label>
              <select 
                value={aspectRatio} 
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-zinc-950 border-zinc-800"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="9:16">9:16 (Vertical)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 text-zinc-500 uppercase tracking-widest">Duration</label>
              <div className="w-full bg-zinc-800/50 border border-zinc-700 p-2.5 rounded-lg text-center text-zinc-400 font-mono">
                15 Seconds
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            {loading ? 'Generating 15s Video...' : 'Generate with Sora 2'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-6">
            <UserCircle2 className="text-blue-500" />
            <h3 className="font-bold">Character Consistency</h3>
          </div>
          <div className="space-y-3">
            {characters.map((char, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-zinc-600 font-mono">#{i+1}</span>
                <input 
                  placeholder={`Character description...`}
                  value={char}
                  onChange={(e) => updateCharacter(i, e.target.value)}
                  className="text-sm py-2"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-4 italic">
            * Sora 2 maintains consistency for these characters across the video timeline.
          </p>
        </div>
      </div>
    </div>
  );
}