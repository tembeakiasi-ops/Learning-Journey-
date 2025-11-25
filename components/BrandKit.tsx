import React, { useState, useEffect } from 'react';
import { BrandKit } from '../types';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKit?: BrandKit;
  onSave: (kit: BrandKit) => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({ isOpen, onClose, currentKit, onSave }) => {
  const [kit, setKit] = useState<BrandKit>({
    name: 'My Channel Brand',
    colors: ['#EF4444', '#FFFFFF', '#000000'],
    fontPairing: 'Sans Serif Bold',
    stylePreferences: 'High Contrast, Energetic',
  });

  useEffect(() => {
    if (currentKit) setKit(currentKit);
  }, [currentKit]);

  if (!isOpen) return null;

  const handleColorChange = (index: number, val: string) => {
    const newColors = [...kit.colors];
    newColors[index] = val;
    setKit({ ...kit, colors: newColors });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Brand Kit Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Brand Colors</label>
            <div className="flex flex-wrap gap-3">
              {kit.colors.map((color, idx) => (
                <div key={idx} className="relative group">
                   <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="w-12 h-12 rounded-full cursor-pointer border-none p-0 overflow-hidden"
                  />
                  <button 
                    onClick={() => {
                        const newColors = kit.colors.filter((_, i) => i !== idx);
                        setKit({...kit, colors: newColors});
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setKit({...kit, colors: [...kit.colors, '#ffffff']})}
                className="w-12 h-12 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2">Style Preference</label>
             <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-brand-500"
                value={kit.stylePreferences}
                onChange={(e) => setKit({...kit, stylePreferences: e.target.value})}
             >
                <option>High Contrast, Energetic</option>
                <option>Minimalist, Clean</option>
                <option>Dark, Moody</option>
                <option>Colorful, Playful</option>
             </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-400 mb-2">Font Style</label>
             <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-brand-500"
                value={kit.fontPairing}
                onChange={(e) => setKit({...kit, fontPairing: e.target.value})}
             >
                <option>Sans Serif Bold (Modern)</option>
                <option>Serif (Traditional)</option>
                <option>Display / Grunge (Gaming)</option>
                <option>Handwritten (Vlog)</option>
             </select>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button 
            onClick={() => onSave(kit)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Brand Kit
          </button>
        </div>
      </div>
    </div>
  );
};
