"use client";

import React from 'react';
import { Download, Share2, Film } from 'lucide-react';

export default function Library({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-600 border-2 border-dashed border-zinc-900 rounded-3xl">
        <Film size={48} className="mb-4 opacity-20" />
        <p>No videos generated yet. Start creating!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div key={item.id || idx} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all group">
          <div className="aspect-video bg-black flex items-center justify-center relative">
            <video 
              src={item.url} 
              className="w-full h-full object-cover"
              controls
            />
          </div>
          <div className="p-4">
            <p className="text-sm line-clamp-2 text-zinc-300 mb-4 h-10">{item.prompt}</p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-500 uppercase tracking-tighter">
                {item.metadata.aspectRatio} • {item.metadata.length}
              </span>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <Download size={16} />
                </button>
                <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}