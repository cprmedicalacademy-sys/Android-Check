import React, { useState } from 'react';
import { ShieldCheck, Cpu, HardDrive, Wifi, Smartphone, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { DeviceModel, Language, ScanType } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface DiagnosticFormProps {
  lang: Language;
  initialName?: string;
  initialDevice?: DeviceModel;
  onSubmit: (name: string, device: DeviceModel, scanType: ScanType) => void;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({
  lang,
  initialName = '',
  initialDevice = 'Smartphone (Android / iOS)',
  onSubmit,
}) => {
  const t = translations[lang];
  const [name, setName] = useState(initialName);
  const [device, setDevice] = useState<DeviceModel>(initialDevice);
  const [scanType, setScanType] = useState<ScanType>('deep');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    sounds.playBlip();

    // Short realistic handshake delay before transitioning to terminal
    setTimeout(() => {
      onSubmit(name.trim(), device, scanType);
    }, 600);
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background glow effects */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center mb-6 relative z-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 text-cyan-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-cyan-500/30 shadow-inner">
          <ShieldCheck className="w-9 h-9 text-cyan-400" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
          {t.formTitle}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-sm mx-auto">
          {t.formSubtitle}
        </p>

        {/* Diagnostic Status Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Core Guard
          </span>
          <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            <HardDrive className="w-3.5 h-3.5 text-emerald-400" /> Flash NAND
          </span>
          <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            <Wifi className="w-3.5 h-3.5 text-purple-400" /> Socket SSL
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>{t.nameLabel}</span>
            <span className="text-[10px] text-cyan-400 font-mono">REQ_FIELD</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
            <span>{t.deviceLabel}</span>
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          </label>
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value as DeviceModel)}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition cursor-pointer"
          >
            <option value="Smartphone (Android / iOS)">Smartphone (Android / iOS)</option>
            <option value="Apple iPhone 15 Pro Max">Apple iPhone 15 Pro Max</option>
            <option value="Samsung Galaxy S24 Ultra">Samsung Galaxy S24 Ultra</option>
            <option value="Xiaomi 14 Ultra">Xiaomi 14 Ultra</option>
            <option value="OnePlus 12">OnePlus 12</option>
            <option value="Windows 11 PC / Laptop">Windows 11 PC / Laptop</option>
            <option value="Apple MacBook Pro M3">Apple MacBook Pro M3</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {t.scanTypeLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'quick', title: t.scanQuick, icon: Zap },
              { id: 'deep', title: t.scanDeep, icon: ShieldCheck },
              { id: 'hardware', title: t.scanHardware, icon: Cpu },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = scanType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    sounds.playBlip();
                    setScanType(option.id as ScanType);
                  }}
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                  </div>
                  <span className="font-medium text-[11px] leading-tight">{option.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-cyan-500/25 text-sm mt-3 flex items-center justify-center space-x-2 cursor-pointer group disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Connecting node handshake...</span>
            </span>
          ) : (
            <>
              <span>{t.submitButton}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t.encryptedProtocol}</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">SHA-256 TLS 1.3</span>
      </div>
    </div>
  );
};
