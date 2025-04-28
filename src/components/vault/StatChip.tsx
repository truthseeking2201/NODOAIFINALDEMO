
import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatChipProps {
  label: string;
  value: string;
  delta?: { value: number; timeframe?: string };
  compact?: boolean;
}

export function StatChip({ label, value, delta, compact = false }: StatChipProps) {
  return (
    <div className="flex flex-col gap-0.5 relative">
      <span className={`font-medium text-[#9CA3AF] ${compact ? 'text-[10px]' : 'text-xs'} tracking-wide`}>
        {label}
      </span>
      <div className="flex items-start gap-1 relative group">
        <span className={`font-mono font-bold text-white tabular-nums ${compact ? 'text-lg' : 'text-xl'} group-hover:text-nova/90 transition-colors duration-300`}>
          {value}
        </span>
        {delta && (
          <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full transition-all duration-300 ${
            delta.value >= 0
              ? 'bg-emerald/10 text-emerald hover:bg-emerald/20'
              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
          } ${compact ? 'mt-0.5 text-[10px]' : 'mt-0.5 text-xs'}`}>
            {delta.value >= 0 ?
              <ArrowUp size={compact ? 10 : 12} className="text-emerald" /> :
              <ArrowDown size={compact ? 10 : 12} className="text-red-500" />
            }
            <span className="text-[10px] font-medium">
              {delta.value.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Subtle glow effect on hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-nova/0 via-nova/5 to-nova/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm"></div>
      </div>
    </div>
  );
}
