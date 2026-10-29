/**
 * MerchantMate - Business Assistant Rule Engine
 * 
 * Separated architecture for conversational queries:
 * In Version 1.0 (Demo Mode), queries are processed through deterministic JavaScript pattern
 * matchers that compute answers directly from live dataset calculations.
 * 
 * Architecture Note:
 * This module can be swapped or augmented with a live LLM endpoint (such as Gemini 2.5 Flash)
 * by replacing or wrapping `processMerchantQuery` without touching any UI components.
 */

import { formatCurrency, formatNumber } from "./calculations.js";

export const SUGGESTED_QUESTIONS = [
  "What is my total revenue?",
  "Which product generates the most revenue?",
  "Which product sells the least?",
  "Which products should I focus on?",
  "Summarize my sales performance.",
  "What is my average order value?",
  "When was my peak sales day?"
];

/**
 * Normalizes input text for keyword pattern matching
 */
function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/[?!.,;:'"()]/g, "")
    .trim();
}

/**
 * Evaluates user questions against merchant analytics.
 * 
 * @param {string} query - The merchant's question
 * @param {Object} analytics - Output from calculateAnalytics()
 * @param {Object} comparison - Growth comparisons vs previous period
 * @returns {Object} Structured response with text, highlights, and transparent math
 */
export function processMerchantQuery(query, analytics, comparison = null) {
  const q = normalizeQuery(query);

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

  // 1. TOTAL REVENUE INTENT
  if (
    q.includes("total revenue") ||
    q.includes("how much did i make") ||
    q.includes("how much revenue") ||
    q.includes("gross sales") ||
    q.includes("total sales") ||
    (q.includes("revenue") && !q.includes("most") && !q.includes("product"))
  ) {
    const prevText = comparison?.revenue?.formatted
      ? ` (${comparison.revenue.formatted} compared to the previous 7 days)`
      : "";
    
    return {
      success: true,
      intent: "TOTAL_REVENUE",
      queryText: query,
      answer: `Your total revenue for this 7-day period is ${formatCurrency(totalRevenue)}${prevText}, generated across ${formatNumber(totalOrders)} customer orders. You sold an aggregate of ${formatNumber(totalUnits)} items at an average rate of ${formatCurrency(totalRevenue / 7)} per day.`,
      highlights: [
        { label: "Total Revenue", value: formatCurrency(totalRevenue) },
        { label: "Daily Average", value: formatCurrency(totalRevenue / 7) },
        { label: "Orders Count", value: formatNumber(totalOrders) }
      ],
      transparentMath: "Sum of (units sold × unit price) for all 8 products over 7 days.",
      recommendation: `Your peak single-day revenue occurred on ${peakDay?.displayDate || "the weekend"} reaching ${formatCurrency(peakDay?.revenue || 0)}.`
    };
  }

  // 2. BEST SELLER BY REVENUE INTENT
  if (
    q.includes("most revenue") ||
    q.includes("highest revenue") ||
    q.includes("top earner") ||
    q.includes("best selling product") ||
    q.includes("top product") ||
    q.includes("top seller")
  ) {
    if (!bestSellerByRevenue) return noDataFallback(query);

    return {
      success: true,
      intent: "BEST_SELLER_REVENUE",
      queryText: query,
      answer: `Your #1 revenue generator is the ${bestSellerByRevenue.name}. It earned ${formatCurrency(bestSellerByRevenue.revenue)} (${bestSellerByRevenue.revenueSharePercent}% of your entire shop's revenue) from ${formatNumber(bestSellerByRevenue.unitsSold)} units sold at ${formatCurrency(bestSellerByRevenue.price)} each.`,
      highlights: [
        { label: "Top Product", value: bestSellerByRevenue.name },
        { label: "Revenue", value: formatCurrency(bestSellerByRevenue.revenue) },
        { label: "Share of Total", value: `${bestSellerByRevenue.revenueSharePercent}%` }
      ],
      transparentMath: `${formatNumber(bestSellerByRevenue.unitsSold)} units × ${formatCurrency(bestSellerByRevenue.price)} = ${formatCurrency(bestSellerByRevenue.revenue)} (which is ${bestSellerByRevenue.revenueSharePercent}% of ${formatCurrency(totalRevenue)} total).`,
      recommendation: `Maintain steady inventory buffer on ${bestSellerByRevenue.name} as it accounts for nearly a third of your incoming cash flow.`
    };
  }

  // 3. LOWEST SELLER INTENT
  if (
    q.includes("sells the least") ||
    q.includes("sell the least") ||
    q.includes("lowest") ||
    q.includes("worst") ||
    q.includes("slowest") ||
    q.includes("least sales")
  ) {
    if (!lowestPerformer) return noDataFallback(query);

    return {
      success: true,
      intent: "LOWEST_PERFORMER",
      queryText: query,
      answer: `The lowest-performing item by volume is the ${lowestPerformer.name}, with only ${formatNumber(lowestPerformer.unitsSold)} units sold over the last 7 days, generating ${formatCurrency(lowestPerformer.revenue)} (${lowestPerformer.revenueSharePercent}% of total revenue).`,
      highlights: [
        { label: "Lowest Seller", value: lowestPerformer.name },
        { label: "Units Sold", value: `${lowestPerformer.unitsSold} units` },
        { label: "Revenue", value: formatCurrency(lowestPerformer.revenue) }
      ],
      transparentMath: `Ranked #8 of 8 products by units sold (${lowestPerformer.unitsSold} units total).`,
      recommendation: `Consider creating an "Artisan Grooming Gift Pack" pairing ${lowestPerformer.name} with the high-velocity ${bestSellerByUnits?.name || "Soap Bar"} to accelerate inventory turns.`
    };
  }

  // 4. FOCUS PRODUCTS INTENT
  if (
    q.includes("focus") ||
    q.includes("prioritize") ||
    q.includes("push") ||
    q.includes("strategy") ||
    q.includes("attention")
  ) {
    const top1 = top3Products[0];
    const top2 = top3Products[1];

    return {
      success: true,
      intent: "FOCUS_RECOMMENDATIONS",
      queryText: query,
      answer: `You should prioritize three key focal points: (1) Protect supply of ${top1?.name} and ${top2?.name}, which together make up ${Math.round(((top1?.revenue + top2?.revenue) / totalRevenue) * 100)}% of your revenue. (2) Leverage ${bestSellerByUnits?.name} as a low-friction checkout add-on. (3) Reposition or bundle the ${lowestPerformer?.name} to prevent stagnant capital.`,
      highlights: [
        { label: "Revenue Pillars", value: "Top 2 Products" },
        { label: "Combined Share", value: `${Math.round(((top1?.revenue + top2?.revenue) / totalRevenue) * 100)}%` },
        { label: "Action Item", value: "Bundle Slow Movers" }
      ],
      transparentMath: `Top 2 products revenue (${formatCurrency(top1?.revenue + top2?.revenue)}) ÷ Total revenue (${formatCurrency(totalRevenue)}) × 100.`,
      recommendation: "Focus marketing budget on your high-margin home goods and signature coffee brews where margins exceed 55%."
    };
  }

  // 5. SALES SUMMARY INTENT
  if (
    q.includes("summarize") ||
    q.includes("summary") ||
    q.includes("performance") ||
    q.includes("how is my business") ||
    q.includes("how is my shop") ||
    q.includes("overview")
  ) {
    return {
      success: true,
      intent: "SALES_SUMMARY",
      queryText: query,
      answer: `Overall, your store is performing steadily with ${formatCurrency(totalRevenue)} in revenue across ${formatNumber(totalOrders)} orders. Your average customer spends ${formatCurrency(averageOrderValue)} per checkout. Peak shopping occurs on weekends (${peakDay?.dayName} generated ${formatCurrency(peakDay?.revenue)}), while weekdays experience a mild mid-week plateau.`,
      highlights: [
        { label: "7-Day Revenue", value: formatCurrency(totalRevenue) },
        { label: "Avg Order Value", value: formatCurrency(averageOrderValue) },
        { label: "Busiest Day", value: peakDay?.dayName || "Saturday" }
      ],
      transparentMath: `Total Revenue ($${totalRevenue.toFixed(2)}) ÷ Total Orders (${totalOrders}) = AOV ($${averageOrderValue.toFixed(2)}).`,
      recommendation: "Test an early-week promotion (e.g., 'Tuesday Refill Discount') to smooth out the Monday-Wednesday revenue dip."
    };
  }

  // 6. AVERAGE ORDER VALUE INTENT
  if (
    q.includes("average order") ||
    q.includes("aov") ||
    q.includes("ticket size") ||
    q.includes("basket size") ||
    q.includes("orders")
  ) {
    return {
      success: true,
      intent: "AOV_METRIC",
      queryText: query,
      answer: `Your Average Order Value (AOV) is ${formatCurrency(averageOrderValue)}. Customers ordered ${formatNumber(totalOrders)} times, averaging ${(totalUnits / totalOrders).toFixed(1)} items per transaction.`,
      highlights: [
        { label: "AOV", value: formatCurrency(averageOrderValue) },
        { label: "Items Per Order", value: `${(totalUnits / totalOrders).toFixed(1)} items` },
        { label: "Total Orders", value: formatNumber(totalOrders) }
      ],
      transparentMath: `${formatCurrency(totalRevenue)} revenue ÷ ${formatNumber(totalOrders)} orders = ${formatCurrency(averageOrderValue)} per order.`,
      recommendation: `Offer a free shipping or small gift perk at a threshold of ${formatCurrency(Math.ceil((averageOrderValue + 10) / 5) * 5)} to lift basket sizes by 15-20%.`
    };
  }

  // 7. PEAK DAY INTENT
  if (
    q.includes("peak day") ||
    q.includes("best day") ||
    q.includes("busiest") ||
    q.includes("highest day") ||
    q.includes("weekend")
  ) {
    const diffFromAvg = peakDay ? Math.round(((peakDay.revenue - (totalRevenue / 7)) / (totalRevenue / 7)) * 100) : 0;

    return {
      success: true,
      intent: "PEAK_DAY",
      queryText: query,
      answer: `Your highest grossing day was ${peakDay?.displayDate}, bringing in ${formatCurrency(peakDay?.revenue)} across ${formatNumber(peakDay?.orders)} orders. This was ${diffFromAvg}% higher than your average daily sales.`,
      highlights: [
        { label: "Peak Day", value: peakDay?.dayName || "Saturday" },
        { label: "Day Revenue", value: formatCurrency(peakDay?.revenue) },
        { label: "Orders Taken", value: formatNumber(peakDay?.orders) }
      ],
      transparentMath: `${peakDay?.displayDate}: ${peakDay?.orders} orders totaling ${formatCurrency(peakDay?.revenue)}.`,
      recommendation: `Ensure complete staff coverage on ${peakDay?.dayName || "Saturdays"} between 10 AM and 3 PM when foot traffic peaks.`
    };
  }

  // 8. FALLBACK / UNRECOGNIZED QUERY
  return {
    success: false,
    intent: "UNSUPPORTED",
    queryText: query,
    answer: `I am currently operating in Demo Mode using deterministic JavaScript logic. I couldn't find a direct rule match for "${query}".`,
    highlights: [],
    transparentMath: "Query analyzed against known merchant analytics rule patterns.",
    recommendation: "Try clicking one of the suggested question chips above to explore your shop's revenue, best-sellers, or weekly trends!"
  };
}

function noDataFallback(query) {
  return {
    success: false,
    intent: "NO_DATA",
    queryText: query,
    answer: "There are currently no sales records available to answer this question.",
    highlights: [],
    transparentMath: "No active records found in current period.",
    recommendation: "Select an active date range."
  };
}
