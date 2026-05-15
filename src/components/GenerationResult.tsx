import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Share2, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface GenerationResultProps {
  image: string | null;
  isGenerating: boolean;
}

export function GenerationResult({ image, isGenerating }: GenerationResultProps) {
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'webp'>('png');

  const downloadImage = async () => {
    if (!image) return;

    try {
      // Create an image element to draw onto canvas for format conversion
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => { 
        img.onload = resolve; 
        img.onerror = reject;
        img.src = image; 
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      let mimeType = 'image/png';
      if (downloadFormat === 'jpg') mimeType = 'image/jpeg';
      else if (downloadFormat === 'webp') mimeType = 'image/webp';

      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `big-head-avatar.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Avatar downloaded as ${downloadFormat.toUpperCase()}`);
    } catch (err) {
      // Fallback for CORS issues
      const link = document.createElement('a');
      link.href = image;
      link.target = "_blank";
      link.download = `big-head-avatar.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isGenerating) {
    return (
      <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white shadow-sm border border-black/5 flex flex-col items-center justify-center p-8 relative min-h-[300px]">
        <div className="absolute inset-0 bg-gray-50/50 pointer-events-none" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative w-20 h-20 mb-6"
        >
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-black opacity-80" />
          <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-r-lime-400 opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center text-black">
            <Sparkles size={24} className="animate-pulse" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold text-black mb-2">Generating Avatar</h3>
        <p className="text-gray-400 text-center max-w-xs text-sm font-medium">
          Applying AI magic, enhancing features, and blowing up that head size!
        </p>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden bg-[#FAFAFA] border-2 border-gray-100 border-dashed flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-6 text-gray-300">
          <Wand2 size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-400">No Avatar Yet</h3>
        <p className="text-gray-400 text-sm font-medium text-center mt-2 max-w-xs">
          Upload a photo or take a selfie, select a style, and hit generate!
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-[2rem] overflow-hidden bg-white shadow-sm border border-black/5 flex flex-col"
    >
      <div className="relative aspect-square md:aspect-[4/3] w-full bg-[#FAFAFA] group flex-col">
        <img src={image} alt="Generated Avatar" className="w-full h-full object-contain" />
      </div>

      <div className="p-6 bg-white border-t border-black/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#FAFAFA] rounded-full p-1 w-full sm:w-auto border border-black/5">
          {(['png', 'jpg', 'webp'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setDownloadFormat(fmt)}
              className={`flex-1 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                downloadFormat === fmt ? 'bg-black text-lime-400 shadow-sm' : 'text-gray-400 hover:text-black'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
        
        <button
          onClick={downloadImage}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-lime-400 px-6 py-2.5 text-sm font-bold text-black hover:bg-lime-500 transition-all active:scale-95 shadow-md shadow-lime-400/20"
        >
          <Download size={16} />
          Download
        </button>
      </div>
    </motion.div>
  );
}
