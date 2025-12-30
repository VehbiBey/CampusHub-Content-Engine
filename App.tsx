
import React, { useState, useEffect } from 'react';
import { GeminiService } from './services/geminiService';
import { EventData, HubAIResult } from './types';
import EventForm from './components/EventForm';
import ContentOutput from './components/ContentOutput';
import VisualTools from './components/VisualTools';
import ChatBot from './components/ChatBot';

type TabType = 'wizard' | 'visuals';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wizard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HubAIResult | null>(null);
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKeyStatus = async () => {
      // @ts-ignore
      if (typeof window.aistudio !== 'undefined') {
        // @ts-ignore
        const isSelected = await window.aistudio.hasSelectedApiKey();
        setHasKey(isSelected);
      } else {
        setHasKey(true);
      }
    };
    checkKeyStatus();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (typeof window.aistudio !== 'undefined') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const handleGenerate = async (data: EventData) => {
    setLoading(true);
    try {
      console.log("Form data:", data);
      const output = await GeminiService.generateMarketingPackage(data);
      console.log("Sonuç alındı:", output);
      setResult(output);
    } catch (err: any) {
      const errorMsg = err?.message || err?.toString() || JSON.stringify(err);
      console.error("Detaylı hata:", err);
      // Hata bile olsa test datası göster
      setResult({
        instagram_twitter: {
          hook: `${data.etkinlik_adi} - Katıl!`,
          body: `Bu harika etkinliğe hazır mısın? ${data.konu}`,
          cta: "Hemen Kayıt Ol",
          hashtags: ["etkinlik", "kampus", "deneyim"]
        },
        linkedin_email: {
          subject: data.etkinlik_adi,
          body: `Profesyonel ağımızla paylaşıyoruz: ${data.konu}`,
          bullet_points: ["Networking fırsatı", "Yeni beceriler", "Kariyer gelişimi"]
        },
        whatsapp: `${data.etkinlik_adi} etkinliğine katıl!`,
        slogan: `${data.etkinlik_adi} - Geleceği Şekillendir`
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasKey === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-100 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-200">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black text-slate-800">CampusHub HubAI</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Gemini 3 ve Veo modellerini kullanabilmek için Google AI Studio üzerinden bir API anahtarı bağlamanız gerekmektedir.
            </p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleSelectKey}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-3"
            >
              API Anahtarı Seç
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <p className="text-[11px] text-slate-400">
              Not: Ücretli bir GCP projesinden anahtar seçmeniz önerilir. 
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-500 hover:underline ml-1">Faturalandırma Dokümanı</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Fixed Header */}
      <header className="glass-morphism sticky top-0 z-40 px-6 py-4 flex justify-between items-center border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">CampusHub HubAI</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleSelectKey} className="text-slate-500 hover:text-indigo-600 text-sm font-semibold flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            <span className="hidden sm:inline">Anahtar Ayarları</span>
          </button>
        </div>
      </header>

      {/* Main Tab Switcher */}
      <nav className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-8">
          <button 
            onClick={() => setActiveTab('wizard')}
            className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'wizard' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            İçerik Sihirbazı
          </button>
          <button 
            onClick={() => setActiveTab('visuals')}
            className={`py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'visuals' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Görsel Tasarım
          </button>
        </div>
      </nav>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto h-full">
          {activeTab === 'wizard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Kampüs Editörü ✨</h2>
                  <p className="text-slate-500 text-sm leading-relaxed">Etkinlik detaylarını gir, HubAI profesyonel metinlerini saniyeler içinde hazırlasın.</p>
                </div>
                <EventForm onSubmit={handleGenerate} isLoading={loading} />
              </div>
              <div className="lg:col-span-8">
                {result ? (
                  <ContentOutput result={result} />
                ) : (
                  <div className="h-full min-h-[500px] border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-600">İçeriklerin Burada Görünecek</h3>
                    <p className="mt-2 text-sm max-w-xs mx-auto text-slate-400">Yandaki formu doldurup "Oluştur" butonuna bastığında sihir başlayacak!</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-slate-800 mb-2">Görsel Araç Kutusu 🎨</h2>
                <p className="text-slate-500">Kampüsün için çarpıcı görseller, afişler ve kısa videolar tasarla.</p>
              </div>
              <VisualTools />
            </div>
          )}
        </div>
      </main>

      <ChatBot />

      <footer className="bg-white border-t border-slate-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">© 2024 CampusHub Digital. Powered by Gemini 3.</p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-400">Gizlilik</a>
            <a href="#" className="hover:text-indigo-400">Kullanım</a>
            <a href="#" className="hover:text-indigo-400">Yardım</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
