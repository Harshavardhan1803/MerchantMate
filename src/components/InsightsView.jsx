import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Calculator,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/calculations.js';

export default function InsightsView({
  analytics,
  comparison,
  onAskQuestion
}) {
  const [expandedMath, setExpandedMath] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const toggleMath = (id) => {
    setExpandedMath(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyInsight = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const {
    totalRevenue,
    totalOrders,
    totalUnits,
    averageOrderValue,
    bestSellerByRevenue,
    bestSellerByUnits,
    lowestPerformer,
    top3Products,
    peakDay,
    slowestDay,
    dailyTrend
  } = analytics;

  const top1 = top3Products[0];
  const top2 = top3Products[1];
  const top2Revenue = (top1?.revenue || 0) + (top2?.revenue || 0);
  const top2Share = totalRevenue > 0 ? Math.round((top2Revenue / totalRevenue) * 100) : 0;

  // Weekday vs Weekend math
  const saturdayData = dailyTrend.find(d => d.dayName === 'Saturday') || peakDay;
  const avgWeekdayRev = dailyTrend.length > 0 
    ? dailyTrend.filter(d => d.dayName !== 'Saturday' && d.dayName !== 'Sunday').reduce((sum, d) => sum + d.revenue, 0) / 5
    : 1;
  const weekendSurgePercent = avgWeekdayRev > 0 
    ? Math.round(((saturdayData?.revenue - avgWeekdayRev) / avgWeekdayRev) * 100)
    : 0;

  // Free shipping / gift threshold target
  const suggestedThreshold = Math.ceil((averageOrderValue + 12) / 5) * 5;

  const insights = [
    {
      id: "revenue_concentration",
      tag: "Revenue Concentration",
      title: "Top 2 Products Drive Over Half of Shop Revenue",
      tagColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      icon: TrendingUp,
      evidence: `${top1?.name} and ${top2?.name} generated a combined ${formatCurrency(top2Revenue)}, accounting for ${top2Share}% of all sales.`,
      recommendation: `Protect supply chains and maintain safety stock buffer for these two core items. A stockout on ${top1?.name} would immediately endanger up to ${top1?.revenueSharePercent}% of your weekly cash flow.`,
      promptForAssistant: "Which products should I focus on?",
      mathProof: {
        formula: "Top 2 Products Revenue ÷ Total Shop Revenue × 100",
        breakdown: [
          `${top1?.name}: ${formatCurrency(top1?.revenue)} (${top1?.revenueSharePercent}%)`,
          `${top2?.name}: ${formatCurrency(top2?.revenue)} (${top2?.revenueSharePercent}%)`,
          `Combined Revenue: ${formatCurrency(top2Revenue)}`,
          `Total Store Revenue: ${formatCurrency(totalRevenue)}`,
          `Result: (${top2Revenue.toFixed(2)} / ${totalRevenue.toFixed(2)}) × 100 = ${top2Share}%`
        ]
      }
    },
    {
      id: "inventory_velocity",
      tag: "Inventory Optimization",
      title: `Low Velocity on High-Margin Item (${lowestPerformer?.name})`,
      tagColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      icon: AlertTriangle,
      evidence: `${lowestPerformer?.name} sold only ${lowestPerformer?.unitsSold} units over 7 days (${lowestPerformer?.revenueSharePercent}% revenue share), despite boasting a healthy ${lowestPerformer?.marginPercent}% profit margin.`,
      recommendation: `Create an "Artisan Care Bundle" pairing this item with your volume leader (${bestSellerByUnits?.name}) at a slight combined bundle incentive to accelerate inventory turnover and free working capital.`,
      promptForAssistant: "Which product sells the least?",
      mathProof: {
        formula: "Product Units Sold ÷ Total Catalog Average Units",
        breakdown: [
          `Catalog average units per product: ${(totalUnits / 8).toFixed(1)} units`,
          `${lowestPerformer?.name}: ${lowestPerformer?.unitsSold} units sold`,
          `Performance: ${Math.round((lowestPerformer?.unitsSold / (totalUnits / 8)) * 100)}% of catalog average`,
          `Current profit margin: ${lowestPerformer?.marginPercent}% ($${lowestPerformer?.profit.toFixed(2)} profit on ${formatCurrency(lowestPerformer?.price)} retail)`
        ]
      }
    },
    {
      id: "weekly_pattern",
      tag: "Weekly Sales Rhythm",
      title: "Weekend Demand Spikes +35% Over Mid-Week Baseline",
      tagColor: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
      icon: Calendar,
      evidence: `${saturdayData?.displayDate || "Saturday"} produced ${formatCurrency(saturdayData?.revenue)} across ${saturdayData?.orders} orders—a ${weekendSurgePercent}% surge over average weekday sales (${formatCurrency(avgWeekdayRev)}).`,
      recommendation: `Schedule senior staff on Fridays and Saturdays between 10am and 4pm. Simultaneously, introduce a 'Wednesday Refill Perk' or digital newsletter discount to level out mid-week troughs.`,
      promptForAssistant: "When was my peak sales day?",
      mathProof: {
        formula: "(Peak Day Revenue - Average Weekday Revenue) ÷ Average Weekday Revenue × 100",
        breakdown: [
          `Saturday Revenue: ${formatCurrency(saturdayData?.revenue)}`,
          `Average Weekday Revenue (Mon-Fri): ${formatCurrency(avgWeekdayRev)}`,
          `Difference: ${formatCurrency(saturdayData?.revenue - avgWeekdayRev)}`,
          `Surge: ((${saturdayData?.revenue.toFixed(2)} - ${avgWeekdayRev.toFixed(2)}) / ${avgWeekdayRev.toFixed(2)}) × 100 = +${weekendSurgePercent}%`
        ]
      }
    },
    {
      id: "aov_expansion",
      tag: "Basket Size Expansion",
      title: "Average Order Value Opportunity ($32.89 Average)",
      tagColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      icon: ShoppingBag,
      evidence: `Customers currently spend an average of ${formatCurrency(averageOrderValue)} purchasing ${(totalOrders > 0 ? (totalUnits / totalOrders).toFixed(1) : 0)} items per transaction.`,
      recommendation: `Establish an incentive perk or complimentary gift sample at the ${formatCurrency(suggestedThreshold)} spending threshold. Encouraging customers to add an impulse item (e.g. $9.50 Soap or $16 Scoop) will expand overall gross margin.`,
      promptForAssistant: "What is my average order value?",
      mathProof: {
        formula: "Total Gross Revenue ÷ Total Completed Orders",
        breakdown: [
          `Total Revenue: ${formatCurrency(totalRevenue)}`,
          `Total Orders: ${formatNumber(totalOrders)}`,
          `AOV: ${formatCurrency(totalRevenue)} ÷ ${totalOrders} = ${formatCurrency(averageOrderValue)}`,
          `Recommended Spend Threshold: ${formatCurrency(suggestedThreshold)} (~${formatCurrency(suggestedThreshold - averageOrderValue)} above current baseline)`
        ]
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Data-Driven Sales Insights
          </h1>
          <span className="text-xs text-indigo-300 font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
            Automated Calculations
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Transparent, deterministic business recommendations generated directly from your underlying transaction records.
        </p>
      </div>

      {/* Insight Cards Grid */}
      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = insight.icon;
          const isMathOpen = Boolean(expandedMath[insight.id]);

          return (
            <div
              key={insight.id}
              className="liquid-glass-card rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Main Content */}
                <div className="space-y-3 flex-1">
                  
                  {/* Category Pill + Title */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${insight.tagColor}`}>
                        {insight.tag}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Icon className="w-5 h-5 text-indigo-400 shrink-0" />
                      <span>{insight.title}</span>
                    </h3>
                  </div>

                  {/* Evidence Block */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-white block mb-0.5">
                      Empirical Data Finding:
                    </span>
                    {insight.evidence}
                  </div>

                  {/* Recommendation Block */}
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-indigo-300">
                      Merchant Action:{" "}
                    </span>
                    {insight.recommendation}
                  </div>

                  {/* Mathematical Calculation Drawer */}
                  {isMathOpen && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono-numbers space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-indigo-300 font-sans font-bold text-[11px] uppercase tracking-wider">
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Calculation Proof & Formula</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Formula: <span className="text-white font-mono">{insight.mathProof.formula}</span>
                      </div>
                      <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                        {insight.mathProof.breakdown.map((item, idx) => (
                          <li key={idx} className="text-slate-300">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>

                {/* Right Action Column */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/10">
                  
                  {/* Toggle Math Proof */}
                  <button
                    onClick={() => toggleMath(insight.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{isMathOpen ? 'Hide Math' : 'Verify Math'}</span>
                    {isMathOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Ask MerchantMate Link */}
                  <button
                    onClick={() => onAskQuestion(insight.promptForAssistant)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask Assistant</span>
                  </button>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
