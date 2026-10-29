import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  sublabel,
  icon: Icon,
  trend = null,
  trendLabel = "vs prior period",
  accentColor = "indigo",
  onClick = null
}) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`liquid-glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between ${
        isClickable ? 'cursor-pointer hover:border-indigo-500/40' : ''
      }`}
    >
      {/* Top row: Label + Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-300 shadow-inner">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono-numbers">
          {value}
        </div>
      </div>

      {/* Bottom row: Trend indicator + Explanatory note */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
        {trend ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`flex items-center font-mono-numbers font-semibold ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {trend.formatted}
            </span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              {trendLabel}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px]">
            {sublabel}
          </span>
        )}

        {isClickable && (
          <span className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">
            View details
          </span>
        )}
      </div>
    </div>
  );
}
