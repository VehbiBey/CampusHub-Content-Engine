
import React, { useState } from 'react';
import { EventData } from '../types';

interface Props {
  onSubmit: (data: EventData) => void;
  isLoading: boolean;
}

const EventForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<EventData>({
    etkinlik_adi: '',
    konu: '',
    hedef_kitle: '',
    tarih_yer: '',
    ozel_notlar: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600 ml-1">Etkinlik Adı</label>
        <input
          required
          name="etkinlik_adi"
          value={formData.etkinlik_adi}
          onChange={handleChange}
          placeholder="Örn: Yapay Zeka Zirvesi"
          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 ml-1">Hedef Kitle</label>
          <input
            name="hedef_kitle"
            value={formData.hedef_kitle}
            onChange={handleChange}
            placeholder="Örn: Tüm öğrenciler"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-600 ml-1">Tarih ve Yer</label>
          <input
            name="tarih_yer"
            value={formData.tarih_yer}
            onChange={handleChange}
            placeholder="Örn: 20 Mayıs, Amfi 1"
            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600 ml-1">Konu ve Detaylar</label>
        <textarea
          required
          name="konu"
          rows={3}
          value={formData.konu}
          onChange={handleChange}
          placeholder="Etkinliğin amacını kısaca anlatın..."
          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-600 ml-1">Özel Notlar (Sertifika, Konuşmacı vb.)</label>
        <input
          name="ozel_notlar"
          value={formData.ozel_notlar}
          onChange={handleChange}
          placeholder="Örn: Pizza ikramı var!"
          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            İçerikleri Oluştur
          </>
        )}
      </button>
    </form>
  );
};

export default EventForm;
