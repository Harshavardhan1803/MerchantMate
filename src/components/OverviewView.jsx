import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Receipt, 
  Award, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import MetricCard from './MetricCard.jsx';
import SalesChart from './SalesChart.jsx';
import DateRangeSelector from './DateRangeSelector.jsx';
import { formatCurrency, formatNumber } from '../utils/calculations.js';

export default function OverviewView({
  analytics,
  comparison,
  selectedRange,
  setSelectedRange,
  onSelectProduct,
  onNavigateTab
}) {
  const {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    bestSellerByRevenue,
    dailyTrend,
    peakDay,
    totalUnits,
    productPerformance
  } = analytics;

  // Compute top category
  const categoryTotals = {};
  productPerformance.forEach(p => {
    categoryTotals[p.category] = (categoryTotals[p.category] || 0) + p.revenue;
  });
  const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ["Beverages", 0];
  const topCategoryShare = totalRevenue > 0 ? Math.round((topCategoryEntry[1] / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Overview
            </h1>
            <span className="text-xs text-slate-400 font-mono-numbers px-2 py-0.5 rounded-md bg-white/5 border border-white/10 hidden sm:inline-block">
              8 Products Active
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time visual sales telemetry and calculated performance metrics.
          </p>
        </div>

        {/* Date Filter */}
        <DateRangeSelector
          selectedRange={selectedRange}
          onSelectRange={setSelectedRange}
        />
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          trend={comparison ? comparison.revenue : null}
          trendLabel="vs prior period"
          sublabel="Gross sales from all orders"
          icon={DollarSign}
        />

        {/* Card 2: Total Orders */}
        <MetricCard
          title="Total Orders"
          value={formatNumber(totalOrders)}
          trend={comparison ? comparison.orders : null}
          trendLabel="vs prior period"
          sublabel="Completed customer transactions"
          icon={ShoppingBag}
        />

        {/* Card 3: Average Order Value */}
        <MetricCard
          title="Average Order Value"
          value={formatCurrency(averageOrderValue)}
          trend={comparison ? comparison.aov : null}
          trendLabel="vs prior period"
          sublabel="Gross revenue ÷ Total orders"
          icon={Receipt}
        />

        {/* Card 4: Best-Selling Product */}
        <MetricCard
          title="Best-Selling Product"
          value={bestSellerByRevenue ? bestSellerByRevenue.name.split(' (')[0] : "None"}
          sublabel={
            bestSellerByRevenue
              ? `${formatCurrency(bestSellerByRevenue.revenue)} (${bestSellerByRevenue.unitsSold} units)`
              : "No sales recorded"
          }
          icon={Award}
          onClick={bestSellerByRevenue ? () => onSelectProduct(bestSellerByRevenue) : null}
        />
      </div>

      {/* Sales Trend Chart */}
      <SalesChart dailyData={dailyTrend} />

      {/* Business Pulse Strip (3 key quantitative indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Pulse 1: Peak Sales Day */}
        <div className="liquid-glass-card rounded-2xl p-5 border border-white/5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Peak Traffic Day
            </div>
            <div className="text-base font-bold text-white mt-1">
              {peakDay ? peakDay.displayDate : "Saturday"}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Generated <span className="font-semibold text-emerald-400 font-mono-numbers">{formatCurrency(peakDay?.revenue)}</span> across {peakDay?.orders} orders.
            </div>
          </div>
        </div>

        {/* Pulse 2: Category Concentration */}
        <div className="liquid-glass-card rounded-2xl p-5 border border-white/5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Top Category
            </div>
            <div className="text-base font-bold text-white mt-1">
              {topCategoryEntry[0]} ({topCategoryShare}% of revenue)
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Led by Artisan Roasts and Cold Brew Concentrates.
            </div>
          </div>
        </div>

        {/* Pulse 3: Basket Density */}
        <div className="liquid-glass-card rounded-2xl p-5 border border-white/5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Basket Density
            </div>
            <div className="text-base font-bold text-white mt-1">
              {(totalOrders > 0 ? (totalUnits / totalOrders).toFixed(1) : 0)} items / order
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Healthy multi-item attach rate with cross-category bundles.
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer Callout */}
      <div className="liquid-glass rounded-2xl p-6 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Have a question about your revenue or product performance?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Ask MerchantMate's rule engine for instant clarity with transparent math calculations.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('assistant')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-md shadow-indigo-600/30 whitespace-nowrap shrink-0"
        >
          <span>Ask Question</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
