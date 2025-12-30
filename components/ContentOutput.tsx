
import React from 'react';
import { HubAIResult } from '../types';

interface Props {
  result: HubAIResult;
}

const ContentOutput: React.FC<Props> = ({ result }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Kopyalandı!');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Slogan Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white text-center shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">ETKİNLİK SLOGANI</h3>
        <p className="text-3xl md:text-4xl font-black italic">"{result.slogan}"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instagram / Twitter */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">IG</span>
              Instagram / Twitter
            </h4>
            <button onClick={() => copyToClipboard(`${result.instagram_twitter.hook}\n\n${result.instagram_twitter.body}\n\n${result.instagram_twitter.cta}\n\n${result.instagram_twitter.hashtags.join(' ')}`)} className="text-slate-400 hover:text-indigo-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            </button>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="font-bold text-indigo-600 text-base">{result.instagram_twitter.hook}</p>
            <p>{result.instagram_twitter.body}</p>
            <p className="font-semibold text-slate-800">{result.instagram_twitter.cta}</p>
            <div className="flex flex-wrap gap-1">
              {result.instagram_twitter.hashtags.map(h => <span key={h} className="text-blue-500">{h}</span>)}
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">WA</span>
              WhatsApp Grubu
            </h4>
            <button onClick={() => copyToClipboard(result.whatsapp)} className="text-slate-400 hover:text-indigo-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            </button>
          </div>
          <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{result.whatsapp}</p>
        </div>

        {/* LinkedIn / Email */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md lg:col-span-2">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">LN</span>
                LinkedIn & E-posta Duyurusu
              </h4>
              <p className="text-xs text-slate-400 mt-1"><span className="font-bold">Konu:</span> {result.linkedin_email.subject}</p>
            </div>
            <button onClick={() => copyToClipboard(`${result.linkedin_email.subject}\n\n${result.linkedin_email.body}\n\n${result.linkedin_email.bullet_points.join('\n')}`)} className="text-slate-400 hover:text-indigo-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            </button>
          </div>
          <div className="space-y-4 text-sm text-slate-600">
            <p className="whitespace-pre-wrap">{result.linkedin_email.body}</p>
            <ul className="space-y-2 list-none">
              {result.linkedin_email.bullet_points.map((p, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 text-indigo-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentOutput;
