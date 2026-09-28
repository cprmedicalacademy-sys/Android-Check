import React, { useEffect, useRef, useState } from 'react';
import { Camera, MapPin, FolderSync, AlertTriangle, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { DeviceModel, Language, LogMessage } from '../types';
import { translations } from '../utils/translations';
import { sounds } from '../utils/audio';

interface TerminalDashboardProps {
  name: string;
  device: DeviceModel;
  lang: Language;
  onReveal: () => void;
}

export const TerminalDashboard: React.FC<TerminalDashboardProps> = ({
  name,
  device,
  lang,
  onReveal,
}) => {
  const t = translations[lang];
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [fileCount, setFileCount] = useState(1280);
  const [sessionId] = useState(() => Math.floor(Math.random() * 89999 + 10000));
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  // Format current timestamp
  const getTimestamp = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
  };

  useEffect(() => {
    const rawLogs = t.logs(name, device);

    // Initial log
    setLogs([
      {
        id: 'init-0',
        time: getTimestamp(),
        text: t.terminalInit,
        type: 'info',
      },
      {
        id: 'init-1',
        time: getTimestamp(),
        text: t.terminalHandshake(name),
        type: 'info',
      },
    ]);
    sounds.playBlip();

    let step = 0;
    const interval = setInterval(() => {
      if (step < rawLogs.length) {
        const item = rawLogs[step];
        const newLog: LogMessage = {
          id: `log-${step}-${Date.now()}`,
          time: getTimestamp(),
          text: item.text,
          type: item.type as LogMessage['type'],
        };

        setLogs((prev) => [...prev, newLog]);

        if (item.type === 'danger') {
          sounds.playWarning();
        } else {
          sounds.playBlip();
        }

        step++;
      } else {
        clearInterval(interval);
        // Automatically pop up reveal after a brief suspense pause if not already triggered
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setTimeout(() => {
            onReveal();
          }, 2600);
        }
      }
    }, 1150);

    // Increment fake file counter
    const fileInterval = setInterval(() => {
      setFileCount((prev) => Math.min(prev + Math.floor(Math.random() * 95 + 45), 8940));
    }, 150);

    return () => {
      clearInterval(interval);
      clearInterval(fileInterval);
    };
  }, [name, device, t, onReveal]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="max-w-4xl w-full mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Top Banner & Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-5 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 className="text-base sm:text-lg font-bold text-red-400 font-mono tracking-wide flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
              {t.establishedTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {t.targetUserPrefix} <span className="text-cyan-300 font-semibold">{name}</span> ({device}) |{' '}
            {t.sessionIdPrefix} <span className="text-emerald-400">#{sessionId}</span>
          </p>
        </div>

        {/* Active Telemetry Status Badge */}
        <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 px-3.5 py-1.5 rounded-xl font-mono text-xs text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>LIVE TELEMETRY STREAM</span>
        </div>
      </div>

      {/* Live Streaming Simulation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
        {/* Camera Feed Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center relative overflow-hidden h-44 shadow-inner">
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]"></div>
          {/* Scanline */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-scanline pointer-events-none"></div>

          <div className="w-full flex justify-between items-center text-[10px] font-mono z-10">
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              {t.camTitle}
            </span>
            <span className="text-slate-500">ISO: 400</span>
          </div>

          {/* Camera Visualizer Target */}
          <div className="relative my-auto flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-dashed border-red-500/40 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}></div>
            <Camera className="w-7 h-7 text-red-400 absolute animate-pulse" />
            {/* Viewfinder crosshairs */}
            <div className="absolute -inset-2 border-t border-l border-red-500/30 w-3 h-3"></div>
            <div className="absolute -inset-2 top-auto left-auto border-b border-r border-red-500/30 w-3 h-3"></div>
          </div>

          <div className="z-10">
            <p className="text-xs font-mono text-slate-200">{t.camLabel}</p>
            <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{t.camStatus}</p>
          </div>
        </div>

        {/* GPS Location Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center relative overflow-hidden h-44 shadow-inner">
          {/* Radar circle sweep overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-28 h-28 rounded-full border border-cyan-500/30 relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-cyan-500/20"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full animate-radar origin-center"></div>
            </div>
          </div>

          <div className="w-full flex justify-between items-center text-[10px] font-mono z-10">
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              {t.gpsTitle}
            </span>
            <span className="text-slate-500">GLONASS/GPS</span>
          </div>

          <div className="my-auto z-10 flex flex-col items-center">
            <div className="relative">
              <MapPin className="w-7 h-7 text-cyan-400 animate-bounce" />
              <div className="w-4 h-1 bg-cyan-400/40 rounded-full blur-[1px] mx-auto mt-0.5"></div>
            </div>
            <p className="text-xs font-mono text-slate-200 mt-1">Lat: 23.8103° N, Lon: 90.4125° E</p>
          </div>

          <div className="z-10">
            <p className="text-[10px] text-cyan-400 font-mono">{t.gpsAccuracy}</p>
          </div>
        </div>

        {/* Database / Vault Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center relative overflow-hidden h-44 shadow-inner">
          <div className="w-full flex justify-between items-center text-[10px] font-mono z-10">
            <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              {t.dataTitle}
            </span>
            <span className="text-slate-500">ENCRYPTED DUMP</span>
          </div>

          <div className="my-auto z-10 flex flex-col items-center w-full px-2">
            <FolderSync className="w-7 h-7 text-purple-400 animate-pulse mb-1" />
            <p className="text-xs font-mono text-slate-200">{t.dataLabel}</p>
            <p className="text-sm text-purple-400 font-mono font-bold mt-1">
              {fileCount.toLocaleString()} {t.filesTransferred}
            </p>

            {/* Mini Progress bars */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-200"
                style={{ width: `${Math.min(100, Math.floor((fileCount / 8940) * 100))}%` }}
              ></div>
            </div>
          </div>

          <div className="z-10 text-[10px] text-slate-400 font-mono flex items-center justify-between w-full">
            <span>WhatsApp / Media</span>
            <span className="text-purple-300">STREAMING</span>
          </div>
        </div>
      </div>

      {/* Terminal Live Logs Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-inner">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>SESSION_TERMINAL_VTY_0</span>
          </div>
          <span className="text-emerald-400 animate-pulse text-[11px]">● ACTIVE STREAM</span>
        </div>

        <div className="h-56 sm:h-64 overflow-y-auto font-mono-code text-xs sm:text-[13px] space-y-2 pr-1 select-text">
          {logs.map((log) => {
            let color = 'text-green-400';
            if (log.type === 'danger') {
              color = 'text-red-400 font-bold text-sm bg-red-950/30 p-2 rounded border border-red-500/30 animate-pulse';
            } else if (log.type === 'warning') {
              color = 'text-amber-300';
            } else if (log.type === 'success') {
              color = 'text-emerald-300 font-semibold';
            }

            return (
              <div key={log.id} className="leading-relaxed flex items-start gap-2">
                <span className="text-slate-600 select-none text-[11px] mt-0.5">[{log.time}]</span>
                <span className={color}>&gt; {log.text}</span>
              </div>
            );
          })}
          <div ref={terminalBottomRef} />
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-[11px] text-slate-500 font-mono">
          {t.emergencyNotice}
        </p>
      </div>
    </div>
  );
};
