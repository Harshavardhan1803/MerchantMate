import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function DateRangeSelector({ selectedRange, onSelectRange }) {
  const options = [
    { id: 'current_7', label: 'Last 7 Days', sub: 'Oct 22 - Oct 28' },
    { id: 'previous_7', label: 'Prior 7 Days', sub: 'Oct 15 - Oct 21' },
    { id: 'all_14', label: 'Full 14 Days', sub: 'Oct 15 - Oct 28' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1 hidden sm:flex">
        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
        <span>Date Range:</span>
      </div>

      <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
        {options.map((opt) => {
          const isActive = selectedRange === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelectRange(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span>{opt.label}</span>
              <span className={`ml-1.5 text-[10px] hidden md:inline ${
                isActive ? 'text-indigo-200' : 'text-slate-500'
              }`}>
                ({opt.sub})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
