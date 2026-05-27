import { useState, useEffect } from 'react';

const terminalLines = [
  { text: '$ nmap -sV -sC target.local', delay: 0 },
  { text: 'Starting Nmap 7.94 ( https://nmap.org )', delay: 800 },
  { text: 'Discovered open port 22/tcp on 192.168.1.1', delay: 1500 },
  { text: 'Discovered open port 80/tcp on 192.168.1.1', delay: 2000 },
  { text: 'Discovered open port 443/tcp on 192.168.1.1', delay: 2500 },
  { text: 'PORT    STATE  SERVICE  VERSION', delay: 3200 },
  { text: '22/tcp  open   ssh      OpenSSH 8.9', delay: 3700 },
  { text: '80/tcp  open   http     Apache 2.4.54', delay: 4200 },
  { text: '443/tcp open   https    nginx 1.25.3', delay: 4700 },
  { text: '$ scan complete. 3 open ports found.', delay: 5500 },
];

interface TerminalAnimationProps {
  className?: string;
  lines?: { text: string; delay: number }[];
}

export default function TerminalAnimation({ className = '', lines = terminalLines }: TerminalAnimationProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    lines.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [lines]);

  return (
    <div className={`bg-dark-950 border border-dark-700/50 rounded-lg overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-4 py-2 bg-dark-900/80 border-b border-dark-700/30">
        <div className="w-3 h-3 rounded-full bg-neon-red/80" />
        <div className="w-3 h-3 rounded-full bg-neon-yellow/80" />
        <div className="w-3 h-3 rounded-full bg-neon-green/80" />
        <span className="ml-2 text-xs text-dark-400 font-mono">cybershield@kali:~</span>
      </div>
      <div className="p-4 font-mono text-sm space-y-1 max-h-64 overflow-y-auto">
        {lines.slice(0, visibleLines).map((line, index) => (
          <div
            key={index}
            className={`${
              line.text.startsWith('$')
                ? 'text-neon-green'
                : line.text.includes('open')
                ? 'text-neon-blue'
                : line.text.includes('complete')
                ? 'text-neon-green font-semibold'
                : 'text-dark-300'
            }`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines < lines.length && (
          <span className="inline-block w-2 h-4 bg-neon-green animate-pulse ml-1" />
        )}
        {visibleLines >= lines.length && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-neon-green">$</span>
            <span className="inline-block w-2 h-4 bg-neon-green animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
