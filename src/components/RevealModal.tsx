import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Share2, Check, MessageCircle, Send, Sparkles, Volume2, Camera, Smile } from 'lucide-react';
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
  const [imageError, setImageError] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('prankster_custom_photo') || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sounds.playLaugh();

    // Confetti cannon
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#06b6d4', '#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#f43f5e'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setUserPhoto(result);
          setImageError(false);
          try {
            localStorage.setItem('prankster_custom_photo', result);
          } catch {
            // storage quota
          }
          sounds.playLaugh();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image source priority: custom uploaded photo -> Q6ztd.jpg
  const imgSrc = userPhoto || 'Q6ztd.jpg';

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-lg rounded-3xl p-5 sm:p-7 text-center shadow-2xl relative overflow-hidden my-auto max-h-[95vh] flex flex-col justify-between">
        {/* Glow ambient background rings */}
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="overflow-y-auto pr-1">
          {/* Prankster Photo Hero Frame */}
          <div className="relative mx-auto w-44 h-44 sm:w-52 sm:h-52 mb-4 group">
            {/* Ambient neon pulse behind photo */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>

            <div
              onClick={() => sounds.playLaugh()}
              className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl cursor-pointer bg-slate-950 flex items-center justify-center"
              title="সাউন্ড শুনতে ক্লিক করুন!"
            >
              {!imageError ? (
                <img
                  src={imgSrc}
                  alt="Prankster laughing face"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-amber-950/60 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-4xl mb-2 animate-bounce">
                    🤔
                  </div>
                  <p className="text-xs font-bold text-amber-300">Gotcha!</p>
                  <p className="text-[10px] text-slate-400 mt-1">প্র্যাংক কেমন লাগলো?</p>
                </div>
              )}

              {/* Floating Gotcha Tag */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                <Smile className="w-3 h-3 text-amber-400" />
                <span>GOTCHA! 😂</span>
              </div>

              {/* Laugh audio indicator on photo */}
              <div className="absolute bottom-2 left-2 bg-pink-500/80 hover:bg-pink-500 text-white p-1.5 rounded-full backdrop-blur-md shadow-lg transition">
                <Volume2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Optional Change/Add Photo button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="নিজের ছবি দিয়ে প্র্যাংক বানান"
              className="absolute -bottom-2 -right-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 p-2 rounded-xl shadow-lg transition text-xs flex items-center gap-1 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2.5 tracking-tight flex items-center justify-center gap-2">
            <span>{t.prankTitle}</span>
          </h3>

          <div className="bg-slate-950/75 border border-slate-800 rounded-2xl p-4 mb-4 text-left">
            <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
              {t.prankSummary}
            </p>
            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.prankExplanation}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={() => {
                sounds.playBlip();
                onReset();
              }}
              className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl transition text-sm sm:text-base shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetButton}</span>
            </button>

            <button
              onClick={() => {
                sounds.playBlip();
                onOpenCustomLink();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 font-semibold py-2.5 px-6 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{t.createPrankLink}</span>
            </button>
          </div>

          {/* Social Sharing section */}
          <div className="mt-4 pt-3.5 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider">
              {t.sharePrankTitle}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white py-2 px-2.5 rounded-lg text-xs transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="truncate">{copied ? t.copied : t.copyLink}</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 py-2 px-2.5 rounded-lg text-xs transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleTelegram}
                className="flex items-center justify-center gap-1.5 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-sky-300 hover:text-sky-200 py-2 px-2.5 rounded-lg text-xs transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
