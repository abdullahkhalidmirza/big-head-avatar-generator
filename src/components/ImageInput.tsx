import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, Upload, X, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageInputProps {
  image: string | null;
  setImage: (image: string | null) => void;
}

export function ImageInput({ image, setImage }: ImageInputProps) {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const webcamRef = useRef<Webcam>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
  });

  const captureCamera = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [setImage]);

  if (image) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden bg-white shadow-sm border border-black/5 group"
      >
        <img src={image} alt="Selfie" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button
            onClick={() => setImage(null)}
            className="rounded-full bg-black hover:bg-gray-800 p-5 text-lime-400 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-black/20 font-bold"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden bg-white shadow-sm border border-black/5 flex flex-col relative">
      <div className="flex border-b border-black/5 relative z-10 bg-[#FAFAFA]">
        <button
          onClick={() => setMode('upload')}
          className={cn(
            "flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-colors relative",
            mode === 'upload' ? "text-black" : "text-gray-400 hover:text-black"
          )}
        >
          <Upload size={18} />
          Upload Image
          {mode === 'upload' && (
            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-lime-400" />
          )}
        </button>
        <button
          onClick={() => setMode('camera')}
          className={cn(
            "flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-colors relative",
            mode === 'camera' ? "text-black" : "text-gray-400 hover:text-black"
          )}
        >
          <Camera size={18} />
          Take Photo
          {mode === 'camera' && (
            <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-lime-400" />
          )}
        </button>
      </div>

      <div className="flex-1 relative bg-white">
        <AnimatePresence mode="wait">
          {mode === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 p-6"
            >
              <div
                {...getRootProps()}
                className={cn(
                  "w-full h-full rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 cursor-pointer",
                  isDragActive ? "border-lime-400 bg-lime-400/5" : "border-gray-200 hover:border-black hover:bg-gray-50"
                )}
              >
                <input {...getInputProps()} />
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-colors",
                  isDragActive ? "bg-lime-400 text-black" : "bg-gray-100 text-gray-400"
                )}>
                  <ImageIcon size={32} />
                </div>
                <div className="text-center">
                  <p className="text-black font-bold mb-1">
                    {isDragActive ? "Drop it!" : "Drag & drop your photo"}
                  </p>
                  <p className="text-gray-400 text-sm font-medium">Or click to browse files</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 bg-black"
            >
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{
                  facingMode: "user"
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 flex justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <button
                  onClick={captureCamera}
                  className="w-16 h-16 rounded-full bg-lime-400 text-black flex items-center justify-center hover:bg-lime-300 hover:scale-105 active:scale-95 transition-all outline outline-4 outline-black/20"
                >
                  <Camera size={24} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
