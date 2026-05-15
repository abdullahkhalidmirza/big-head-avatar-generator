import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, Check } from 'lucide-react';
import { ApiKeys, getStoredKeys, saveKeys } from '../lib/api';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [keys, setKeys] = useState<ApiKeys>({ openai: '', fal: '', replicate: '' });

  useEffect(() => {
    if (isOpen) {
      setKeys(getStoredKeys());
    }
  }, [isOpen]);

  const handleSave = () => {
    saveKeys(keys);
    toast.success('API Keys saved successfully!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-[420px] max-h-[85vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white border border-black/5 p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lime-100 text-lime-600">
                  <Key size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-black">API Setup</h2>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-1">Bring your own key</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">OpenAI API Key</label>
                <input
                  type="password"
                  value={keys.openai}
                  onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                  placeholder="sk-..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black font-medium focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fal.ai API Key</label>
                <input
                  type="password"
                  value={keys.fal}
                  onChange={(e) => setKeys({ ...keys, fal: e.target.value })}
                  placeholder="fal-..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black font-medium focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Replicate API Token</label>
                <input
                  type="password"
                  value={keys.replicate}
                  onChange={(e) => setKeys({ ...keys, replicate: e.target.value })}
                  placeholder="r8_..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black font-medium focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-500 mt-2 font-medium">
                  Leave empty to try the demo mode. API keys are securely stored locally.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-black/5">
              <button
                onClick={onClose}
                className="px-5 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-bold text-lime-400 hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
              >
                <Check size={16} className="text-lime-400" />
                Save Integration
              </button>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}
