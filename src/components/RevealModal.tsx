import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { PartyPopper, RotateCcw, Share2, Check, MessageCircle, Send, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface RevealModalProps {
  lang: Language;
  onReset: () => void;
  onOpenCustomLink: () => void;
}

export const RevealModal: React.FC<RevealModalProps> = ({
  lang,
  onReset,
  onOpenCustomLink,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    sounds.playFanfare();

    // Confetti cannon
    const end = Date.now() + 2 * 1000;
    const colors = ['#06b6d4', '#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + window.location.pathname);
    setCopied(true);
    sounds.playBlip();
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = lang === 'bn' 
    ? 'এই লিংকটা চেক করে দেখ তো, তোর ডিভাইসের সিকিউরিটি ঠিক আছে কিনা! ⚡' 
    : 'Check your remote phone diagnostic and security status with this tool! ⚡';

  const shareUrl = window.location.origin + window.location.pathname;

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden my-auto">
        {/* Decorative colorful glow behind modal */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Celebration Icon */}
        <div className="w-20 h-20 bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-pink-400 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 border border-pink-500/30 shadow-lg relative">
          <PartyPopper className="w-10 h-10 text-pink-400 animate-bounce" />
          <span className="absolute -top-1 -right-1 text-2xl">😂</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
          {t.prankTitle}
        </h3>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 mb-5 text-left">
          <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
            {t.prankSummary}
          </p>
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t.prankExplanation}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              sounds.playBlip();
              onReset();
            }}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold py-3.5 px-6 rounded-xl transition text-sm sm:text-base shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetButton}</span>
          </button>

          <button
            onClick={() => {
              sounds.playBlip();
              onOpenCustomLink();
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 font-semibold py-3 px-6 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{t.createPrankLink}</span>
          </button>
        </div>

        {/* Social Sharing section */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {t.sharePrankTitle}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white py-2 px-3 rounded-lg text-xs transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? t.copied : t.copyLink}</span>
            </button>

            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 py-2 px-3 rounded-lg text-xs transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleTelegram}
              className="flex items-center justify-center gap-1.5 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-sky-300 hover:text-sky-200 py-2 px-3 rounded-lg text-xs transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
