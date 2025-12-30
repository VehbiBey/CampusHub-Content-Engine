
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { AspectRatio, ImageSize } from '../types';

const VisualTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gen' | 'edit' | 'video'>('gen');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState(AspectRatio.SQUARE);
  const [size, setSize] = useState(ImageSize.ONE_K);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Progress states
  const [isReading, setIsReading] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkKey = async () => {
    // @ts-ignore
    if (typeof window.aistudio !== 'undefined' && !(await window.aistudio.hasSelectedApiKey())) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      setIsReading(true);
      setReadProgress(0);

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setReadProgress(progress);
        }
      };

      reader.onload = () => {
        setReadProgress(100);
        setTimeout(() => {
          setIsReading(false);
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        }, 300);
      };

      reader.onerror = () => {
        setIsReading(false);
        reject(new Error("Dosya okunamadı."));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleAction = async () => {
    if (!prompt) return;
    setLoading(true);
    setResult(null);
    try {
      if (activeTab === 'gen') {
        await checkKey();
        const url = await GeminiService.generateImage(prompt, size, ratio);
        setResult(url);
      } else if (activeTab === 'edit' && selectedFile) {
        const base64 = await readFileAsBase64(selectedFile);
        const url = await GeminiService.editImage(base64, prompt, selectedFile.type);
        setResult(url);
      } else if (activeTab === 'video') {
        await checkKey();
        let base64Image;
        if (selectedFile) {
          base64Image = await readFileAsBase64(selectedFile);
        }
        const url = await GeminiService.generateVideo(prompt, ratio, base64Image);
        setResult(url);
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Tabs */}
      <div className="flex bg-slate-50 border-b border-slate-100">
        {[
          { id: 'gen', label: 'Görsel Oluştur' },
          { id: 'edit', label: 'Görseli Düzenle' },
          { id: 'video', label: 'Video (Veo)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { 
              setActiveTab(tab.id as any); 
              setResult(null); 
              setSelectedFile(null);
              setIsReading(false);
              setReadProgress(0);
            }}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === tab.id ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Açıklama / Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={activeTab === 'edit' ? "Görselde neyi değiştirmek istersiniz? (Örn: Arka planı sil)" : "Hayalinizdeki sahneyi tarif edin..."}
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
            rows={2}
          />
        </div>

        {/* Dynamic Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">En-Boy Oranı</label>
            <select 
              value={ratio} 
              onChange={(e) => setRatio(e.target.value as AspectRatio)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            >
              {Object.values(AspectRatio).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {activeTab === 'gen' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Çözünürlük</label>
              <select 
                value={size} 
                onChange={(e) => setSize(e.target.value as ImageSize)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
              >
                {Object.values(ImageSize).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {(activeTab === 'edit' || activeTab === 'video') && (
            <div className="space-y-2 col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kaynak Görsel {activeTab === 'edit' ? '(Zorunlu)' : '(Opsiyonel)'}</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center gap-2 ${selectedFile ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                
                {selectedFile ? (
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className="p-1 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    <p className="text-xs text-slate-400 group-hover:text-slate-600 font-medium">Dosya seçmek için tıklayın</p>
                  </>
                )}

                {/* Local Reading Progress Overlay */}
                {isReading && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-2xl z-10 animate-in fade-in duration-300">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-300 ease-out" 
                        style={{ width: `${readProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Dosya Okunuyor %{readProgress}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleAction}
          disabled={loading || isReading || (activeTab === 'edit' && !selectedFile)}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="animate-pulse">{activeTab === 'video' ? 'Video Hazırlanıyor (Bu işlem birkaç dakika sürebilir)...' : 'İşleniyor...'}</span>
            </div>
          ) : (
            'Oluştur'
          )}
        </button>

        {/* Result Preview */}
        {result && (
          <div className="mt-6 rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 aspect-video flex items-center justify-center group/preview relative shadow-inner">
            {activeTab === 'video' ? (
              <video 
                src={result} 
                controls 
                className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover/preview:scale-105" 
              />
            ) : (
              <img 
                src={result} 
                alt="AI Result" 
                className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover/preview:scale-105" 
              />
            )}
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400">
          <p>* Veo ve Pro Image modelleri ücretli Google Cloud faturalandırması gerektirebilir. 
             <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-500 hover:underline ml-1">Detaylı bilgi</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualTools;
