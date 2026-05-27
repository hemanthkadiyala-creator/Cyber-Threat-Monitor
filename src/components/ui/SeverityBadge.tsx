import { AlertTriangle, AlertCircle, Info, Shield } from 'lucide-react';
import type { ReactNode } from 'react';

interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  size?: 'sm' | 'md';
}

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  const config = {
    critical: { color: 'severity-critical', icon: AlertTriangle, label: 'CRITICAL' },
    high: { color: 'severity-high', icon: AlertCircle, label: 'HIGH' },
    medium: { color: 'severity-medium', icon: Info, label: 'MEDIUM' },
    low: { color: 'severity-low', icon: Shield, label: 'LOW' },
  };

  const c = config[severity];
  const Icon = c.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-mono font-semibold ${c.color} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {c.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, { color: string; dot: string }> = {
    new: { color: 'text-neon-blue bg-neon-blue/10 border-neon-blue/30', dot: 'bg-neon-blue' },
    investigating: { color: 'text-neon-yellow bg-neon-yellow/10 border-neon-yellow/30', dot: 'bg-neon-yellow' },
    resolved: { color: 'text-neon-green bg-neon-green/10 border-neon-green/30', dot: 'bg-neon-green' },
    false_positive: { color: 'text-dark-400 bg-dark-600/20 border-dark-500/30', dot: 'bg-dark-400' },
    completed: { color: 'text-neon-green bg-neon-green/10 border-neon-green/30', dot: 'bg-neon-green' },
    pending: { color: 'text-neon-yellow bg-neon-yellow/10 border-neon-yellow/30', dot: 'bg-neon-yellow' },
  };

  const c = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-mono ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, subtitle, children }: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold mb-3">
        <span className="text-gradient-cyber">{title}</span>
      </h2>
      {subtitle && (
        <p className="text-dark-400 max-w-2xl mx-auto text-sm sm:text-base">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeMap[size]} border-2 border-dark-700 border-t-neon-blue rounded-full animate-spin`} />
    </div>
  );
}
