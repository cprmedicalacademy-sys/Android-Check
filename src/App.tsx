/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { DeviceModel, Language, ScanType } from './types';
import { translations } from './utils/translations';
import { sounds } from './utils/audio';
import { Header } from './components/Header';
import { DiagnosticForm } from './components/DiagnosticForm';
import { TerminalDashboard } from './components/TerminalDashboard';
import { RevealModal } from './components/RevealModal';
import { SharePrankModal } from './components/SharePrankModal';

export default function App() {
  const [lang, setLang] = useState<Language>('bn');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mode, setMode] = useState<'entry' | 'terminal'>('entry');
  const [targetName, setTargetName] = useState('');
  const [targetDevice, setTargetDevice] = useState<DeviceModel>('Smartphone (Android / iOS)');
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Parse URL query parameters on initial mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('name');
      const urlDevice = params.get('device') as DeviceModel | null;
      const autostart = params.get('autostart');
      const urlLang = params.get('lang');

      if (urlLang === 'en' || urlLang === 'bn') {
        setLang(urlLang);
      }

      if (urlName) {
        setTargetName(urlName);
      }

      if (urlDevice) {
        setTargetDevice(urlDevice);
      }

      // If autostart is requested and a name is present, trigger diagnostic immediately!
      if (autostart === '1' && urlName) {
        setMode('terminal');
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const handleStartScan = (name: string, device: DeviceModel, _scanType: ScanType) => {
    setTargetName(name);
    setTargetDevice(device);
    setMode('terminal');
    setIsRevealed(false);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sounds.enabled = next;
      return next;
    });
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const handleReset = () => {
    setIsRevealed(false);
    setMode('entry');
    setTargetName('');
    // Remove query params from address bar smoothly
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white relative overflow-x-hidden">
      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenCustomLinkModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-3.5 sm:p-6 md:p-8 relative">
        {mode === 'entry' && (
          <DiagnosticForm
            lang={lang}
            initialName={targetName}
            initialDevice={targetDevice}
            onSubmit={handleStartScan}
          />
        )}

        {mode === 'terminal' && (
          <TerminalDashboard
            name={targetName || (lang === 'bn' ? 'টার্গেট ডিভাইস' : 'Target User')}
            device={targetDevice}
            lang={lang}
            onReveal={() => setIsRevealed(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 px-4 text-xs text-slate-500 border-t border-slate-900 bg-slate-950/80">
        <p>{t.footerText}</p>
      </footer>

      {/* Prank Reveal Modal */}
      {isRevealed && (
        <RevealModal
          lang={lang}
          onReset={handleReset}
          onOpenCustomLink={() => setIsShareModalOpen(true)}
        />
      )}

      {/* Share / Custom Prank Link Modal */}
      {isShareModalOpen && (
        <SharePrankModal
          lang={lang}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
