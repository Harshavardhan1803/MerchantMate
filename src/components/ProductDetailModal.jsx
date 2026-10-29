import React, { useEffect } from 'react';
import { X, Package, DollarSign, Layers, Tag, Percent, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/calculations.js';

export default function ProductDetailModal({
  product,
  dailyData = [],
  onClose
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Extract daily breakdown for this specific product
  const productDailySales = dailyData.map(day => {
    const units = (day.salesByProduct && day.salesByProduct[product.id]) || 0;
    const rev = units * product.price;
    return {
      date: day.date,
      dayName: day.dayName,
      shortDay: day.shortDay,
      units,
      revenue: rev
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="liquid-glass border border-white/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-start justify-between gap-4 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-400">
                  {product.category}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs font-mono text-slate-400">
                  {product.sku}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {product.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
              {product.description}
            </p>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Unit Price
              </span>
              <div className="text-base font-bold text-white font-mono-numbers mt-1">
                {formatCurrency(product.price)}
              </div>
              <span className="text-[10px] text-slate-500">
                Cost: {formatCurrency(product.cost)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Units Sold
              </span>
              <div className="text-base font-bold text-white font-mono-numbers mt-1">
                {formatNumber(product.unitsSold)}
              </div>
              <span className="text-[10px] text-slate-500">
                In Stock: {product.stock}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Gross Revenue
              </span>
              <div className="text-base font-bold text-emerald-400 font-mono-numbers mt-1">
                {formatCurrency(product.revenue)}
              </div>
              <span className="text-[10px] text-indigo-300 font-mono-numbers">
                {product.revenueSharePercent}% share
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Profit Margin
              </span>
              <div className="text-base font-bold text-indigo-300 font-mono-numbers mt-1">
                {product.marginPercent}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono-numbers">
                +{formatCurrency(product.profit)} profit
              </span>
            </div>

          </div>

          {/* Daily Sales Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Daily Sales Velocity (This Period)
            </h4>

            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs font-mono-numbers">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-slate-400 font-sans uppercase text-[10px]">
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3 text-right">Units Sold</th>
                    <th className="py-2.5 px-3 text-right">Day Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {productDailySales.map((day, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="py-2 px-3 font-sans text-slate-200">
                        {day.dayName} ({day.shortDay})
                      </td>
                      <td className="py-2 px-3 text-right text-white font-semibold">
                        {day.units} units
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-400 font-bold">
                        {formatCurrency(day.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
