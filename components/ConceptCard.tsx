import React from 'react';
import { ThumbnailConcept } from '../types';
import { Wand2, Download, RefreshCw, LayoutTemplate, Tag } from 'lucide-react';

interface ConceptCardProps {
  concept: ThumbnailConcept;
  onGenerateImage: (id: string) => void;
  isGeneratingImage: boolean;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ concept, onGenerateImage, isGeneratingImage }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg flex flex-col h-full transition-all hover:border-slate-600">
      
      {/* Image Preview Area */}
      <div className="relative aspect-video bg-slate-900 group">
        {concept.generatedImageUrl ? (
          <img 
            src={concept.generatedImageUrl} 
            alt={concept.conceptName} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center border-b border-slate-700/50">
            <LayoutTemplate className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">AI Image not generated yet.</p>
            <p className="text-xs text-slate-600 mt-2 line-clamp-3 italic">"{concept.imagePrompt}"</p>
          </div>
        )}
        
        {/* Overlay Text Visualization (Mockup) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
           {/* Simple logic to place text based on note - simplified for UI demo to be centered or specific */}
           <h3 
              className="text-4xl md:text-5xl font-black text-white text-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] uppercase leading-tight transform -rotate-2"
              style={{ 
                textShadow: '0 0 20px rgba(0,0,0,0.5)', 
                color: concept.colorPalette[0] === '#ffffff' ? 'white' : concept.colorPalette[0] 
              }}
           >
             {concept.textOverlay}
           </h3>
        </div>

        {/* Loading Overlay */}
        {concept.isLoadingImage && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <RefreshCw className="w-8 h-8 text-brand-500 animate-spin mb-2" />
              <span className="text-sm font-medium text-brand-200">Rendering Pixels...</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-brand-900/50 text-brand-300 border border-brand-700/50 mb-1">
              {concept.conceptName}
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {concept.tags.map(tag => (
                 <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">
                   {tag}
                 </span>
              ))}
            </div>
          </div>
          <div className="flex items-center bg-green-900/30 px-2 py-1 rounded border border-green-800/50">
            <span className="text-xs font-bold text-green-400">CTR {concept.predictedCTRScore}%</span>
          </div>
        </div>

        <div className="space-y-3 mb-6 flex-1">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Overlay Text</p>
            <p className="text-lg font-bold text-white font-sans">{concept.textOverlay}</p>
          </div>
          
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Composition</p>
            <p className="text-sm text-slate-300 leading-relaxed">{concept.compositionNote}</p>
          </div>

          <div>
             <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Color Palette</p>
             <div className="flex gap-2">
                {concept.colorPalette.map((color, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-full border border-slate-600 shadow-sm" style={{ backgroundColor: color }} title={color} />
                ))}
             </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          {!concept.generatedImageUrl ? (
            <button 
              onClick={() => onGenerateImage(concept.id)}
              disabled={concept.isLoadingImage || isGeneratingImage}
              className="col-span-2 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              Generate AI Image
            </button>
          ) : (
            <>
              <button 
                onClick={() => onGenerateImage(concept.id)}
                disabled={concept.isLoadingImage || isGeneratingImage}
                className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
              <a 
                href={concept.generatedImageUrl} 
                download={`thumbnail-${concept.id}.png`}
                className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
