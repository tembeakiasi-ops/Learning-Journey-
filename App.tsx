import React, { useState, useEffect } from 'react';
import { Layers, Palette, Settings, Youtube, Menu, X, AlertCircle } from 'lucide-react';
import { InputForm } from './components/InputForm';
import { ConceptCard } from './components/ConceptCard';
import { BrandKitModal } from './components/BrandKit';
import { generateThumbnailConcepts, generateThumbnailImage } from './services/geminiService';
import { BrandKit, ThumbnailConcept, UserInput } from './types';

const App: React.FC = () => {
  // State
  const [currentView, setCurrentView] = useState<'input' | 'results'>('input');
  const [concepts, setConcepts] = useState<ThumbnailConcept[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Brand Kit State
  const [brandKit, setBrandKit] = useState<BrandKit | undefined>();
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load Brand Kit from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('thumbmaster_brandkit');
    if (saved) {
      try {
        setBrandKit(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse brand kit", e);
      }
    }
  }, []);

  const handleSaveBrandKit = (kit: BrandKit) => {
    setBrandKit(kit);
    localStorage.setItem('thumbmaster_brandkit', JSON.stringify(kit));
    setIsBrandModalOpen(false);
  };

  const handleGenerateConcepts = async (input: UserInput) => {
    setIsProcessing(true);
    setError(null);
    try {
      const results = await generateThumbnailConcepts(input, brandKit);
      setConcepts(results);
      setCurrentView('results');
    } catch (err: any) {
      setError(err.message || "Something went wrong generating concepts.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateImage = async (conceptId: string) => {
    // Find concept
    const conceptIndex = concepts.findIndex(c => c.id === conceptId);
    if (conceptIndex === -1) return;

    // Update loading state
    const newConcepts = [...concepts];
    newConcepts[conceptIndex].isLoadingImage = true;
    setConcepts(newConcepts);

    try {
      const base64Image = await generateThumbnailImage(newConcepts[conceptIndex]);
      
      setConcepts(prev => prev.map(c => 
        c.id === conceptId 
          ? { ...c, generatedImageUrl: base64Image, isLoadingImage: false }
          : c
      ));
    } catch (err: any) {
      setConcepts(prev => prev.map(c => 
        c.id === conceptId ? { ...c, isLoadingImage: false } : c
      ));
      alert("Failed to generate image. Ensure you have access to Gemini 2.5/3 Vision models.");
    }
  };

  const resetApp = () => {
    setCurrentView('input');
    setConcepts([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed md:relative z-40 w-64 bg-slate-950 border-r border-slate-800 h-full flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-gradient-to-br from-brand-500 to-accent-600 p-2 rounded-lg">
            <Youtube className="text-white w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">ThumbMaster</h1>
          <button className="md:hidden ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={resetApp}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentView === 'input' ? 'bg-brand-900/30 text-brand-400 border border-brand-800/50' : 'hover:bg-slate-900 text-slate-400 hover:text-white'}`}
          >
            <Layers className="w-5 h-5" />
            <span className="font-medium">Generator</span>
          </button>

          <button 
             onClick={() => { setIsBrandModalOpen(true); setIsMobileMenuOpen(false); }}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-white transition-all"
          >
            <Palette className="w-5 h-5" />
            <span className="font-medium">Brand Kit</span>
          </button>

           <div className="mt-8 px-4">
             <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Current Brand</p>
                {brandKit ? (
                   <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                         {brandKit.colors.slice(0,3).map((c, i) => (
                           <div key={i} className="w-4 h-4 rounded-full border border-slate-900" style={{backgroundColor: c}} />
                         ))}
                      </div>
                      <span className="text-sm truncate">{brandKit.name}</span>
                   </div>
                ) : (
                  <span className="text-sm text-slate-600 italic">No kit selected</span>
                )}
             </div>
           </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 text-slate-500 px-4">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950">
           <div className="flex items-center gap-2">
             <div className="bg-brand-600 w-8 h-8 rounded-lg flex items-center justify-center">
               <Youtube className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold">ThumbMaster</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(true)}>
             <Menu className="w-6 h-6 text-slate-300" />
           </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          
          {/* Background Decorative Gradients */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[100px]" />
             <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-accent-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
                <button onClick={() => setError(null)} className="ml-auto hover:text-white"><X className="w-4 h-4" /></button>
              </div>
            )}

            {currentView === 'input' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <InputForm onSubmit={handleGenerateConcepts} isLoading={isProcessing} />
              </div>
            )}

            {currentView === 'results' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Generated Concepts</h2>
                    <p className="text-slate-400">Select a concept to visualize it with AI.</p>
                  </div>
                  <button 
                    onClick={resetApp}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700"
                  >
                    Start New Project
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 pb-20">
                  {concepts.map((concept) => (
                    <ConceptCard 
                      key={concept.id} 
                      concept={concept} 
                      onGenerateImage={handleGenerateImage}
                      isGeneratingImage={concepts.some(c => c.isLoadingImage)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <BrandKitModal 
        isOpen={isBrandModalOpen} 
        onClose={() => setIsBrandModalOpen(false)} 
        currentKit={brandKit}
        onSave={handleSaveBrandKit}
      />

    </div>
  );
};

export default App;