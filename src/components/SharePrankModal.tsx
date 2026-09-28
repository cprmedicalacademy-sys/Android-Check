import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Sparkles, UserCheck } from 'lucide-react';
import { DeviceModel, Language } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface SharePrankModalProps {
  lang: Language;
  onClose: () => void;
}

export const SharePrankModal: React.FC<SharePrankModalProps> = ({ lang, onClose }) => {
  const t = translations[lang];
  const [friendName, setFriendName] = useState('');
  const [friendDevice, setFriendDevice] = useState<DeviceModel>('Smartphone (Android / iOS)');
  const [autoStart, setAutoStart] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate personalized URL
  const generateUrl = () => {
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (friendName.trim()) {
      params.set('name', friendName.trim());
    }
    if (friendDevice) {
      params.set('device', friendDevice);
    }
    if (autoStart && friendName.trim()) {
      params.set('autostart', '1');
    }
    const query = params.toString();
    return query ? `${base}?${query}` : base;
  };

  const prankUrl = generateUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(prankUrl);
    setCopied(true);
    sounds.playBlip();
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = lang === 'bn'
    ? `${friendName ? friendName + ' ভাই/দোস্ত, ' : ''}তোর ফোনের র‍্যাম আর ব্যাটারি হেলথ চেক করলি? এই লিংকে গিয়ে দেখ তোর ফোন সেফ আছে কিনা! ⚡`
    : `${friendName ? 'Hey ' + friendName + ', ' : ''}did you test your device RAM and battery security? Check this link to run a fast diagnostic! ⚡`;

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + prankUrl)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(prankUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-cyan-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-lg font-bold text-white">{t.customPrankPrompt}</h3>
        </div>

        <div className="space-y-3.5 mb-5">
          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">
              {lang === 'bn' ? 'বন্ধুর নাম / ডাকনাম:' : "Friend's Name / Nickname:"}
            </label>
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder={t.friendNamePlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">
              {lang === 'bn' ? 'বন্ধুর ফোন মডেল:' : "Friend's Device Model:"}
            </label>
            <select
              value={friendDevice}
              onChange={(e) => setFriendDevice(e.target.value as DeviceModel)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500"
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

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
            <span>
              {lang === 'bn'
                ? 'লিংক খোলার সাথে সাথে অটো স্ক্যান শুরু হবে (তীব্র চমক!)'
                : 'Start auto-scan immediately upon link open (instant shock!)'}
            </span>
          </label>
        </div>

        {/* Generated Link Display */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-4">
          <p className="text-[11px] text-slate-400 font-mono mb-1">Generated Link:</p>
          <p className="text-xs text-cyan-300 font-mono break-all line-clamp-2 select-all">
            {prankUrl}
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleCopy}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.copied : t.copyLink}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleTelegram}
              className="flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
