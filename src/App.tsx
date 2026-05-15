import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Settings, Sparkles, User, Settings2, Wand2, Zap, Gamepad2, Baby, Smile, Cuboid, ChevronDown, MoreVertical, Download, Trash2, ArrowRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { SettingsModal } from './components/SettingsModal';
import { ImageInput } from './components/ImageInput';
import { GenerationResult } from './components/GenerationResult';
import { generateAvatar, ApiProvider } from './lib/api';
import { cn } from './lib/utils';

// Using crisp Lucide icons now
const STYLES = [
  { id: '3d-cartoon', label: '3D Cartoon', icon: Cuboid },
  { id: 'pixar', label: 'Pixar Style', icon: Wand2 },
  { id: 'anime', label: 'Anime Style', icon: Zap },
  { id: 'gaming', label: 'Gaming Avatar', icon: Gamepad2 },
  { id: 'cute-chibi', label: 'Cute Chibi', icon: Baby },
  { id: 'meme', label: 'Meme Style', icon: Smile },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'how-it-works'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [provider, setProvider] = useState<ApiProvider>('fal');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('avatar_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = (url: string) => {
    setHistory((prev) => {
      const updated = [url, ...prev].slice(0, 10); // Keep last 10
      localStorage.setItem('avatar_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleGenerate = async () => {
    if (!inputImage) {
      toast.error('Please upload or take a photo first!');
      return;
    }

    setIsGenerating(true);
    setResultImage(null);

    try {
      const resultUrl = await generateAvatar({
        image: inputImage,
        style: selectedStyle,
        provider,
        backgroundColor,
      });
      setResultImage(resultUrl);
      saveToHistory(resultUrl);
      toast.success('Avatar generated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate avatar.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadHistoryImage = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `bighead-avatar-${index}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      document.body.removeChild(a);
      setActiveDropdown(null);
    } catch (error) {
      const a = document.createElement('a');
      a.href = url;
      a.target = "_blank";
      a.download = `bighead-avatar-${index}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setActiveDropdown(null);
    }
  };

  const deleteHistoryImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setHistory(prev => prev.filter((_, i) => i !== index));
    setActiveDropdown(null);
  };

  return (
    <div className="bg-[#F3F4F6] text-black min-h-screen flex flex-col font-sans selection:bg-lime-400/30">
      <div className="bg-atmosphere" />
      <Toaster theme="light" position="bottom-right" className="!bg-white !border-black/5 !backdrop-blur-xl" />

      {/* Navbar (Floating Pill) */}
      <div className="fixed top-0 left-0 right-0 w-full pt-4 sm:pt-6 px-4 sm:px-6 z-50 pointer-events-none">
        <div className="max-w-[1400px] mx-auto w-full">
          <nav className="h-16 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 flex items-center justify-between px-6 pointer-events-auto">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-md shadow-black/20">
              <Sparkles className="w-4 h-4 text-lime-400 fill-lime-400/20" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-black hidden sm:block">
              BigHead AI
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('how-it-works')}
              className={cn("text-xs font-bold transition-colors", currentPage === 'how-it-works' ? "text-black" : "text-gray-400 hover:text-black")}
            >
              How it works
            </button>
            <div className="w-px h-4 bg-gray-200"></div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 rounded-full bg-[#FAFAFA] border border-black/5 px-4 py-2 text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-100 transition-all active:scale-95"
            >
              <Settings2 size={16} />
              <span className="hidden sm:inline">API Setup</span>
            </button>
          </div>
        </nav>
        </div>
      </div>

      {currentPage === 'how-it-works' ? (
        <main className="p-4 sm:p-6 pt-24 sm:pt-28 max-w-4xl w-full mx-auto pb-20 flex-1 flex flex-col items-center justify-center">
          <div className="bg-white rounded-[2rem] p-10 w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden">
            <div className="w-[5.5rem] h-[5.5rem] mx-auto mb-8 rounded-[1.75rem] border border-gray-100 flex items-center justify-center bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:scale-105">
              <Sparkles className="w-8 h-8 text-black fill-black/10" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-extrabold text-black mb-6 tracking-tight">How BigHead AI Works</h1>
            <p className="text-lg text-gray-500 mx-auto max-w-2xl mb-10 leading-relaxed font-medium">
              We process your selfies through state-of-the-art vision models. Because image generation requires heavy computation, you must provide your own API keys.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
              <div className="bg-[#FAFAFA] rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">1. Fal.ai</h3>
                <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
                  Best for high-speed generation. You can get an API key at <a href="https://fal.ai" target="_blank" rel="noopener noreferrer" className="text-lime-600 underline underline-offset-4 decoration-lime-400/50 hover:decoration-lime-400 font-bold">fal.ai</a>.
                </p>
              </div>
              <div className="bg-[#FAFAFA] rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">2. OpenAI</h3>
                <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
                  Powered by DALL-E 3 for great prompt adherence. Get your keys at the <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-lime-600 underline underline-offset-4 decoration-lime-400/50 hover:decoration-lime-400 font-bold">OpenAI Dashboard</a>.
                </p>
              </div>
              <div className="bg-[#FAFAFA] rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">3. Replicate</h3>
                <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
                  Access community finetunes and open models. Find your API token at <a href="https://replicate.com" target="_blank" rel="noopener noreferrer" className="text-lime-600 underline underline-offset-4 decoration-lime-400/50 hover:decoration-lime-400 font-bold">replicate.com</a>.
                </p>
              </div>
            </div>
            
            <button
               onClick={() => setCurrentPage('home')}
               className="mt-12 bg-black hover:bg-gray-900 text-lime-400 font-extrabold py-4 px-8 rounded-full shadow-lg shadow-black/10 transition-transform active:scale-95 inline-flex items-center gap-2 group"
            >
              Start Generating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="mt-8 mb-4 items-center justify-center flex flex-col">
            <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-1">DEVELOPED BY</p>
            <p className="text-lg font-extrabold tracking-tight text-black">
              <a href="https://abdullahkhalidmirza.com" target="_blank" rel="noopener noreferrer" className="hover:text-lime-500 transition-colors">
                Abdullah Khalid Mirza
              </a>
            </p>
          </div>
        </main>
      ) : (
      <>
      {/* Main Content Area */}
      <main className="p-4 sm:p-6 pt-24 sm:pt-28 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 max-w-[1400px] w-full mx-auto pb-20">
        
        {/* Left Column - Styles & Settings */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white border border-transparent rounded-[2rem] p-6 flex flex-col flex-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col gap-4 mb-6">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Choose Your Vibe</h3>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsProviderDropdownOpen(false), 200)}
                  className="w-full flex justify-between items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 px-4 py-3 outline-none hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lime-400"></span>
                    {provider === 'fal' ? 'Fal.ai Engine' : provider === 'openai' ? 'OpenAI DALL-E' : 'Replicate API'}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isProviderDropdownOpen ? "rotate-180" : "")} />
                </button>
                
                {isProviderDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-50 p-1.5 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col gap-0.5">
                      <button onClick={() => { setProvider('fal'); setIsProviderDropdownOpen(false); }} className={cn("text-xs font-bold px-3 py-2.5 text-left rounded-lg transition-colors flex items-center gap-2", provider === 'fal' ? "text-black bg-gray-50" : "text-gray-500 hover:text-black hover:bg-gray-50")}>
                         {provider === 'fal' && <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>}
                         Fal.ai Engine
                      </button>
                      <button onClick={() => { setProvider('openai'); setIsProviderDropdownOpen(false); }} className={cn("text-xs font-bold px-3 py-2.5 text-left rounded-lg transition-colors flex items-center gap-2", provider === 'openai' ? "text-black bg-gray-50" : "text-gray-500 hover:text-black hover:bg-gray-50")}>
                         {provider === 'openai' && <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>}
                         OpenAI DALL-E
                      </button>
                      <button onClick={() => { setProvider('replicate'); setIsProviderDropdownOpen(false); }} className={cn("text-xs font-bold px-3 py-2.5 text-left rounded-lg transition-colors flex items-center gap-2", provider === 'replicate' ? "text-black bg-gray-50" : "text-gray-500 hover:text-black hover:bg-gray-50")}>
                         {provider === 'replicate' && <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>}
                         Replicate API
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {STYLES.map((style, idx) => {
                const Icon = style.icon;
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "aspect-square rounded-3xl p-4 flex flex-col justify-between transition-all cursor-pointer border relative overflow-hidden group",
                      selectedStyle === style.id
                        ? "bg-black border-black shadow-lg"
                        : "bg-[#FAFAFA] border-black/5 hover:bg-white hover:border-black/20"
                    )}
                  >
                    {selectedStyle === style.id && (
                       <div className="absolute inset-0 bg-lime-400/5 pointer-events-none" />
                    )}
                    <Icon className={cn(
                      "w-7 h-7 transition-colors mb-2",
                      selectedStyle === style.id ? "text-lime-400" : "text-gray-400 group-hover:text-black"
                    )} />
                    <div>
                      <span className={cn(
                        "text-[10px] font-bold block mb-1 uppercase tracking-widest",
                        selectedStyle === style.id ? "text-gray-500" : "text-gray-400"
                      )}>0{idx + 1}</span>
                      <span className={cn("text-[13px] font-extrabold tracking-tight", selectedStyle === style.id ? "text-white" : "text-black")}>{style.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-auto pt-4">
              <div className="bg-[#FAFAFA] border border-black/5 rounded-3xl p-5">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1 mb-4">Choose Background</p>
                <div className="flex flex-wrap gap-3 px-1">
                  {[
                    { id: 'transparent', class: 'bg-white bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPjxyZWN0IHdpZHRoPSc1JyBoZWlnaHQ9JzUnIGZpbGw9JyNlNWU3ZWInLz48cmVjdCB4PSc1JyB5PSc1JyB3aWR0aD0nNScgaGVpZ2h0PSc1JyBmaWxsPScjZTVlN2ViJy8+PC9zdmc+")]' },
                    { id: '#FFFFFF', class: 'bg-white border-gray-200' },
                    { id: '#000000', class: 'bg-black border-black' },
                    { id: '#F3F4F6', class: 'bg-gray-100 border-gray-200' },
                    { id: '#FEF3C7', class: 'bg-yellow-100 border-yellow-200' },
                    { id: '#E0E7FF', class: 'bg-indigo-100 border-indigo-200' },
                    { id: '#FCE7F3', class: 'bg-pink-100 border-pink-200' },
                  ].map((color) => (
                    <button 
                      key={color.id}
                      onClick={() => setBackgroundColor(color.id)}
                      className={cn("w-8 h-8 rounded-full border transition-all duration-200 focus:outline-none", color.class, backgroundColor === color.id ? "ring-2 ring-offset-2 ring-black scale-110 shadow-sm" : "border-gray-200 hover:scale-110")}
                      aria-label={`Select ${color.id} background`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Main Action */}
        <div className="col-span-1 lg:col-span-6 flex flex-col min-h-[600px] h-full gap-6">
           <div className="flex-1">
             {!resultImage && !isGenerating ? (
               <div className="h-full w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-transparent rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
                 <div className="w-[5.5rem] h-[5.5rem] mx-auto mb-8 rounded-[1.75rem] border border-gray-100 flex items-center justify-center bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:scale-105">
                   <Sparkles className="w-8 h-8 text-black fill-black/10" strokeWidth={2} />
                 </div>
                 <h2 className="text-4xl font-extrabold text-black mb-4 tracking-tight">Ready to BigHead?</h2>
                 <p className="text-gray-500 text-[15px] font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                   Upload your selfie or use the camera to start the AI transformation. Drop an image below to begin.
                 </p>
                 <div className="w-full max-w-[400px]">
                   <ImageInput image={inputImage} setImage={setInputImage} />
                 </div>
               </div>
             ) : (
                <GenerationResult image={resultImage} isGenerating={isGenerating} />
             )}
           </div>

           {/* Generate Button Wrapper */}
           <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-transparent flex flex-col sm:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-[1.25rem] bg-[#FAFAFA] border border-gray-100 flex items-center justify-center shadow-sm">
                 <Wand2 className="w-6 h-6 text-black" />
               </div>
               <div>
                 <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Processing Engine</p>
                 <p className="text-[15px] font-extrabold text-black tracking-tight">BigHead-v2-Turbo</p>
               </div>
             </div>
             
             <div className="flex items-center gap-3 w-full sm:w-auto">
               {(resultImage || isGenerating || inputImage) && (
                 <button
                   onClick={() => {
                     setResultImage(null);
                     setInputImage(null);
                   }}
                   className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-black font-bold py-3.5 px-6 rounded-full transition-all active:scale-95 flex justify-center items-center text-sm"
                 >
                   Start Over
                 </button>
               )}
               
               <button
                 onClick={handleGenerate}
                 disabled={!inputImage || isGenerating}
                 className="flex-1 sm:flex-none bg-black hover:bg-black/90 text-lime-400 py-3.5 px-10 rounded-full shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2.5 transition-[background-color,transform] transform hover:-translate-y-px active:translate-y-0 ease-out duration-200"
               >
                 {isGenerating ? (
                   <>
                     <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
                     <span className="font-extrabold text-sm tracking-wide">Generating...</span>
                   </>
                 ) : (
                   <>
                     <span className="font-extrabold text-sm text-lime-400 tracking-wide">Generate Avatar</span>
                     <Sparkles className="w-4 h-4 text-lime-400 fill-lime-400/20" strokeWidth={2.5} />
                   </>
                 )}
               </button>
             </div>
           </div>
        </div>

        {/* Right Column - History & Config */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-transparent rounded-[2rem] p-6 flex flex-col flex-1 lg:h-[400px]">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">Recent Creations</h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar lg:min-h-0">
              {history.length > 0 ? (
                history.slice(0, 4).map((url, idx) => (
                  <div key={idx} className="group flex items-center gap-4 bg-white hover:bg-gray-50 border border-gray-100 p-2.5 rounded-2xl transition-all cursor-pointer shadow-sm shadow-black/[0.02]" onClick={() => setResultImage(url)}>
                    <div className="w-14 h-14 rounded-[0.9rem] border border-black/5 shrink-0 relative overflow-hidden bg-white shadow-sm">
                      <img src={url} alt={`History ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-extrabold text-black truncate">Generation {history.length - idx}</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-1">Ready to download</p>
                    </div>
                    
                    <div className="relative pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                      <button 
                         onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                         className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-200/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-lime-400/50"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {activeDropdown === idx && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-left py-1 animate-in fade-in zoom-in-95 origin-top-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); downloadHistoryImage(url, idx); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteHistoryImage(e, idx); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-4 items-center p-3 rounded-2xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-transparent shrink-0 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-extrabold text-gray-400">No History</p>
                    <p className="text-[11px] font-medium text-gray-300 mt-0.5">Generate an avatar</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-5 mt-6 shrink-0">
              <p className="text-[11px] text-gray-600 font-bold leading-relaxed mb-0">PRO TIP: Clear lighting makes the features pop more dramatically.</p>
            </div>
          </div>

          <div className="mt-8 mb-4 items-center justify-center flex flex-col">
            <p className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-1">DEVELOPED BY</p>
            <p className="text-lg font-extrabold tracking-tight text-black">
              <a href="https://abdullahkhalidmirza.com" target="_blank" rel="noopener noreferrer" className="hover:text-lime-500 transition-colors">
                Abdullah Khalid Mirza
              </a>
            </p>
          </div>
        </div>
      </main>
      </>
      )}

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
