import React, { useState } from 'react';
import { UserInput } from '../types';
import { Sparkles, Image as ImageIcon, Palette, Type } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const NICHES = ['Gaming', 'Vlog', 'Tech/Education', 'Finance', 'Make Money Online', 'Beauty/Lifestyle', 'Reaction', 'Documentary'];
const MOODS = ['Excited/Hype', 'Serious/Warning', 'Happy/Positive', 'Mysterious', 'Sad/Emotional', 'Professional'];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    videoTitle: '',
    niche: NICHES[0],
    mood: MOODS[0],
    colors: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Create Viral Thumbnails</h2>
        <p className="text-slate-400">AI-powered concepts optimized for click-through rate.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-300">
            <Type className="w-4 h-4 mr-2 text-brand-500" />
            Video Title
          </label>
          <input
            type="text"
            required
            maxLength={100}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
            placeholder="e.g. I Survived 100 Days in Minecraft..."
            value={formData.videoTitle}
            onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Niche Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Niche / Category</label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              >
                {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>

          {/* Mood Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Desired Vibe</label>
            <div className="relative">
              <select
                className="w-full appearance-none bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
              >
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">▼</div>
            </div>
          </div>
        </div>

        {/* Optional Colors */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-300">
            <Palette className="w-4 h-4 mr-2 text-brand-500" />
            Preferred Colors (Optional)
          </label>
          <input
            type="text"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-500 outline-none"
            placeholder="e.g. Neon Green, Dark Purple"
            value={formData.colors}
            onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full group relative flex items-center justify-center py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all 
            ${isLoading 
              ? 'bg-slate-700 cursor-not-allowed opacity-75' 
              : 'bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 hover:scale-[1.01] hover:shadow-brand-500/25'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyzing Video...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
              Generate Concepts
            </span>
          )}
        </button>
      </form>
    </div>
  );
};