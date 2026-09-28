import React from 'react';
import { Shield, Volume2, VolumeX, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCustomLinkModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  soundEnabled,
  onToggleSound,
  onOpenCustomLinkModal,
}) => {
  const t = translations[lang];

  return (
    <header className="w-full py-3.5 px-4 md:px-10 flex flex-wrap justify-between items-center border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 gap-3">
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-100 flex items-center">
            {t.appTitle}
            <span className="text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded ml-2 font-mono">
              {t.versionBadge}
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3 text-xs">
        {/* Node status */}
        <div className="hidden lg:flex items-center space-x-2 text-slate-400 font-mono bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>{t.nodeStatus}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
          <span className="text-emerald-400 font-semibold">{t.secureConnection}</span>
        </div>

        {/* Custom Prank link generator button */}
        <button
          onClick={onOpenCustomLinkModal}
          className="flex items-center gap-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg transition font-medium text-xs cursor-pointer shadow-sm"
          title="Create custom prank link for a friend"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden sm:inline">{t.createPrankLink}</span>
          <span className="sm:hidden">🔗 Link</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            sounds.playBlip();
            onToggleSound();
          }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer ${
            soundEnabled
              ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700'
              : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
          }`}
          title={soundEnabled ? t.soundOn : t.soundOff}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Language switch */}
        <button
          onClick={() => {
            sounds.playBlip();
            onToggleLang();
          }}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg transition font-mono text-xs cursor-pointer"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
};
