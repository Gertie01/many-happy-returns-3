"use client";

import React, { useState } from 'react';
import { Wand2, Loader2, Plus, Trash2, UserCircle2, X } from 'lucide-react';

export default function VideoGenerator({ onComplete }: { onComplete: (video: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [characters, setCharacters] = useState(['']);
  const [useCharacters, setUseCharacters] = useState(false);
  const [characterImages, setCharacterImages] = useState<(File | null)[]>([null]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const updateCharacter = (index: number, val: string) => {
    const newChars = [...characters];
    newChars[index] = val;
    setCharacters(newChars);
  };

  const addCharacter = () => {
    setCharacters([...characters, '']);
    setCharacterImages([...characterImages, null]);
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
    setCharacterImages(characterImages.filter((_, i) => i !== index));
  };

  const handleImageDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(null);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const newImages = [...characterImages];
      newImages[index] = files[0];
      setCharacterImages(newImages);
    }
  };

  const handleImageSelect = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImages = [...characterImages];
      newImages[index] = e.target.files[0];
      setCharacterImages(newImages);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...characterImages];
    newImages[index] = null;
    setCharacterImages(newImages);
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
          characters: useCharacters ? characters.filter(c => c !== "") : [],
          characterImages: useCharacters ? characterImages.map(img => img ? img.name : null) : []
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
    <div className="space-y-8">
      {/* Prompt Section */}
      <div>
        <label className="block text-sm font-semibold mb-3">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your cinematic scene... (e.g. A cyberpunk city at night with neon lights reflecting on wet pavement)"
          className="w-full bg-zinc-950 border-zinc-800 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 transition-all text-lg"
        />
      </div>

      {/* Aspect Ratio Section */}
      <div>
        <label className="block text-sm font-semibold mb-3">Aspect Ratio</label>
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          className="w-full bg-zinc-950 border-zinc-800 rounded-lg p-3"
        >
          <option>16:9 (Widescreen)</option>
          <option>9:16 (Vertical)</option>
          <option>1:1 (Square)</option>
        </select>
      </div>

      {/* Duration Section */}
      <div>
        <label className="block text-sm font-semibold mb-3">Duration</label>
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">15 Seconds</div>
      </div>

      {/* Character Consistency Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="useCharacters"
          checked={useCharacters}
          onChange={(e) => setUseCharacters(e.target.checked)}
          className="w-4 h-4 cursor-pointer"
        />
        <label htmlFor="useCharacters" className="font-semibold cursor-pointer">
          Add Character Consistency (Optional)
        </label>
      </div>

      {/* Character Section - Only show if enabled */}
      {useCharacters && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-4">Characters</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Sora 2 maintains consistency for these characters across the video timeline.
            </p>

            <div className="space-y-4">
              {characters.map((char, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Character #{i + 1}</label>
                    {characters.length > 1 && (
                      <button
                        onClick={() => removeCharacter(i)}
                        className="p-1 hover:bg-zinc-800 rounded"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    )}
                  </div>

                  {/* Text Description */}
                  <input
                    type="text"
                    value={char}
                    onChange={(e) => updateCharacter(i, e.target.value)}
                    placeholder="e.g., A tall woman with red hair wearing a blue jacket"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm"
                  />

                  {/* Image Drag and Drop */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(i);
                    }}
                    onDragLeave={() => setDragOverIndex(null)}
                    onDrop={(e) => handleImageDrop(i, e)}
                    className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
                      dragOverIndex === i
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-zinc-700 bg-zinc-950/50 hover:border-zinc-600'
                    }`}
                  >
                    {characterImages[i] ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCircle2 size={20} className="text-zinc-400" />
                          <span className="text-sm text-zinc-300">{characterImages[i]?.name}</span>
                        </div>
                        <button
                          onClick={() => removeImage(i)}
                          className="p-1 hover:bg-zinc-700 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer gap-2">
                        <UserCircle2 size={24} className="text-zinc-500" />
                        <span className="text-sm text-zinc-400">
                          Drag image here or click to select
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(i, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addCharacter}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
            >
              <Plus size={16} />
              Add Character
            </button>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
        {loading ? 'Generating 15s Video...' : 'Generate with Sora 2'}
      </button>
    </div>
  );
}
