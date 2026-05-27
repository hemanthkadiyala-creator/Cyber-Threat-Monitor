import { useEffect, useRef, useState } from 'react';
import { Globe, Activity, Shield, AlertTriangle, Crosshair } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import { SectionHeader, SeverityBadge } from '../ui/SeverityBadge';
import { ATTACK_MAP_DATA, LOCATIONS } from '../../lib/data';

const ATTACK_TYPES: Record<string, { color: string; label: string }> = {
  ddos: { color: '#ef4444', label: 'DDoS' },
  phishing: { color: '#f97316', label: 'Phishing' },
  malware: { color: '#a855f7', label: 'Malware' },
  brute_force: { color: '#eab308', label: 'Brute Force' },
  ransomware: { color: '#dc2626', label: 'Ransomware' },
  sql_injection: { color: '#3b82f6', label: 'SQL Injection' },
  xss: { color: '#06b6d4', label: 'XSS' },
};

function AttackMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const attacksRef = useRef(ATTACK_MAP_DATA.map((a) => ({
    ...a,
    progress: Math.random(),
    speed: 0.002 + Math.random() * 0.003,
  })));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    const worldMapW = canvas.offsetWidth;
    const worldMapH = canvas.offsetHeight;

    function latLngToXY(lat: number, lng: number) {
      const x = ((lng + 180) / 360) * worldMapW;
      const y = ((90 - lat) / 180) * worldMapH;
      return { x, y };
    }

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, worldMapW, worldMapH);

      // Background gradient
      const bgGrad = ctx.createRadialGradient(worldMapW / 2, worldMapH / 2, 0, worldMapW / 2, worldMapH / 2, worldMapW / 2);
      bgGrad.addColorStop(0, '#0a1628');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, worldMapW, worldMapH);

      // Grid
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < worldMapW; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, worldMapH);
        ctx.stroke();
      }
      for (let i = 0; i < worldMapH; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(worldMapW, i);
        ctx.stroke();
      }

      // Location dots
      LOCATIONS.forEach((loc) => {
        const { x, y } = latLngToXY(loc.lat, loc.lng);
        const pulse = Math.sin(time * 0.02 + loc.lat) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(x, y, 3 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${0.5 + pulse * 0.3})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 8 + pulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 + pulse * 0.1})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Attack lines
      attacksRef.current.forEach((attack) => {
        const from = latLngToXY(attack.from.lat, attack.from.lng);
        const to = latLngToXY(attack.to.lat, attack.to.lng);
        const colorConfig = ATTACK_TYPES[attack.type] || ATTACK_TYPES.ddos;

        attack.progress += attack.speed;
        if (attack.progress > 1) {
          attack.progress = 0;
          attack.speed = 0.002 + Math.random() * 0.003;
        }

        const cx = (from.x + to.x) / 2;
        const cy = Math.min(from.y, to.y) - 30 - Math.abs(from.x - to.x) * 0.15;

        // Trail
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo(cx, cy, to.x, to.y);
        ctx.strokeStyle = `${colorConfig.color}33`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Moving dot
        const t = attack.progress;
        const px = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cx + t * t * to.x;
        const py = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cy + t * t * to.y;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = colorConfig.color;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = `${colorConfig.color}44`;
        ctx.fill();
      });

      time++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[400px] sm:h-[500px] rounded-xl border border-dark-700/30"
    />
  );
}

export default function AttackMapPage() {
  const [liveAttacks, setLiveAttacks] = useState(ATTACK_MAP_DATA.slice(0, 5));

  useEffect(() => {
    const interval = setInterval(() => {
      const randomAttack = ATTACK_MAP_DATA[Math.floor(Math.random() * ATTACK_MAP_DATA.length)];
      const randomFrom = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const randomTo = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      setLiveAttacks((prev) => [
        {
          ...randomAttack,
          from: { lat: randomFrom.lat, lng: randomFrom.lng },
          to: { lat: randomTo.lat, lng: randomTo.lng },
        },
        ...prev.slice(0, 9),
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-20 pb-16">
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            <SectionHeader
              title="Cyber Attack Map"
              subtitle="Real-time visualization of global cyber threat activity and attack patterns."
            />
          </AnimatedSection>

          {/* Map */}
          <AnimatedSection>
            <AttackMapCanvas />
          </AnimatedSection>

          {/* Stats Row */}
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                { icon: Activity, label: 'Active Attacks', value: '2,847', color: 'text-neon-red' },
                { icon: Globe, label: 'Countries Affected', value: '142', color: 'text-neon-blue' },
                { icon: Shield, label: 'Threats Blocked', value: '15.2K', color: 'text-neon-green' },
                { icon: AlertTriangle, label: 'Critical Alerts', value: '23', color: 'text-neon-yellow' },
              ].map((stat) => (
                <div key={stat.label} className="cyber-card p-4 text-center">
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-white font-bold font-mono">{stat.value}</div>
                  <div className="text-dark-400 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Attack Types & Live Feed */}
          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            {/* Attack Types */}
            <AnimatedSection delay={200}>
              <div className="cyber-card p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-neon-red" />
                  Attack Types
                </h3>
                <div className="space-y-3">
                  {Object.entries(ATTACK_TYPES).map(([key, config]) => (
                    <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-dark-800/30">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                        <span className="text-dark-300 text-sm">{config.label}</span>
                      </div>
                      <span className="text-dark-500 text-xs font-mono">
                        {Math.floor(Math.random() * 500 + 100)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Live Feed */}
            <AnimatedSection delay={300}>
              <div className="cyber-card p-6 lg:col-span-2">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-neon-green animate-pulse" />
                  Live Attack Feed
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {liveAttacks.map((attack, i) => {
                    const fromLoc = LOCATIONS.find((l) => l.lat === attack.from.lat && l.lng === attack.from.lng);
                    const toLoc = LOCATIONS.find((l) => l.lat === attack.to.lat && l.lng === attack.to.lng);
                    const typeConfig = ATTACK_TYPES[attack.type] || ATTACK_TYPES.ddos;

                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg bg-dark-800/20 border border-dark-700/20 transition-all ${
                          i === 0 ? 'border-l-2' : ''
                        }`}
                        style={{ borderLeftColor: i === 0 ? typeConfig.color : undefined }}
                      >
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: typeConfig.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm">
                            <span style={{ color: typeConfig.color }}>{typeConfig.label}</span>
                            {' from '}{fromLoc?.name || 'Unknown'}{' -> '}{toLoc?.name || 'Unknown'}
                          </div>
                          <div className="text-dark-500 text-xs font-mono">
                            {new Date(Date.now() - i * 3000).toLocaleTimeString()}
                          </div>
                        </div>
                        <SeverityBadge severity={attack.severity as 'critical' | 'high' | 'medium' | 'low'} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
