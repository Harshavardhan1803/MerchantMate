/**
 * MerchantMate - Business Analytics & Calculation Engine
 * 
 * Clean, transparent mathematical utility functions.
 * Designed to be modular, readable, and easy to explain in technical interviews.
 */

/**
 * Calculates aggregated financial metrics for a given subset of daily records.
 * 
 * @param {Array} records - Daily sales records for the chosen period
 * @param {Array} products - List of catalog products with prices and costs
 * @returns {Object} Comprehensive sales analytics
 */
export function calculateAnalytics(records, products) {
  if (!records || records.length === 0 || !products || products.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalUnits: 0,
      averageOrderValue: 0,
      dailyTrend: [],
      productPerformance: [],
      bestSellerByRevenue: null,
      bestSellerByUnits: null,
      lowestPerformer: null,
      top3Products: [],
      peakDay: null,
      slowestDay: null
    };
  }

  // Create a quick lookup map for products by ID
  const productMap = new Map(products.map(p => [p.id, p]));

  let totalRevenue = 0;
  let totalOrders = 0;
  let totalUnits = 0;

  // Initialize per-product tracking counters
  const productTotals = {};
  products.forEach(p => {
    productTotals[p.id] = {
      product: p,
      unitsSold: 0,
      revenue: 0,
      costTotal: 0
    };
  });

  // 1. Process daily records
  const dailyTrend = records.map(record => {
    let dayRevenue = 0;
    let dayUnits = 0;

    Object.entries(record.salesByProduct || {}).forEach(([productId, units]) => {
      const product = productMap.get(productId);
      if (product) {
        const itemRevenue = units * product.price;
        const itemCost = units * product.cost;

        dayRevenue += itemRevenue;
        dayUnits += units;

        if (productTotals[productId]) {
          productTotals[productId].unitsSold += units;
          productTotals[productId].revenue += itemRevenue;
          productTotals[productId].costTotal += itemCost;
        }
      }
    });

    totalRevenue += dayRevenue;
    totalOrders += record.ordersCount;
    totalUnits += dayUnits;

    const dayAOV = record.ordersCount > 0 ? dayRevenue / record.ordersCount : 0;

    return {
      date: record.date,
      dayName: record.dayName,
      shortDay: record.shortDay,
      displayDate: record.displayDate || record.shortDay,
      orders: record.ordersCount,
      units: dayUnits,
      revenue: Math.round(dayRevenue * 100) / 100,
      averageOrderValue: Math.round(dayAOV * 100) / 100
    };
  });

  // 2. Calculate Average Order Value (AOV = Total Revenue / Total Orders)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // 3. Compile Product Performance List with margins and revenue shares
  const productPerformance = Object.values(productTotals).map(item => {
    const rev = Math.round(item.revenue * 100) / 100;
    const profit = Math.round((item.revenue - item.costTotal) * 100) / 100;
    const margin = rev > 0 ? Math.round((profit / rev) * 1000) / 10 : 0;
    const revenueShare = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 1000) / 10 : 0;

    return {
      ...item.product,
      unitsSold: item.unitsSold,
      revenue: rev,
      profit: profit,
      marginPercent: margin,
      revenueSharePercent: revenueShare
    };
  });

  // 4. Identify Rankers
  // Sorted by Revenue (descending)
  const sortedByRevenue = [...productPerformance].sort((a, b) => b.revenue - a.revenue);
  
  // Sorted by Units Sold (descending)
  const sortedByUnits = [...productPerformance].sort((a, b) => b.unitsSold - a.unitsSold);

  const bestSellerByRevenue = sortedByRevenue[0] || null;
  const bestSellerByUnits = sortedByUnits[0] || null;
  
  // Lowest performing product by units sold
  const lowestPerformer = sortedByUnits[sortedByUnits.length - 1] || null;
  
  // Top 3 products by revenue
  const top3Products = sortedByRevenue.slice(0, 3);

  // Peak and Slowest Days
  const sortedDaysByRev = [...dailyTrend].sort((a, b) => b.revenue - a.revenue);
  const peakDay = sortedDaysByRev[0] || null;
  const slowestDay = sortedDaysByRev[sortedDaysByRev.length - 1] || null;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    totalUnits,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    dailyTrend,
    productPerformance,
    bestSellerByRevenue,
    bestSellerByUnits,
    lowestPerformer,
    top3Products,
    peakDay,
    slowestDay
  };
}

/**
 * Calculates percentage growth between two numbers.
 * Formula: ((current - previous) / previous) * 100
 * 
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {Object} { percent: number, isPositive: boolean, formatted: string }
 */
export function calculateGrowth(current, previous) {
  if (!previous || previous === 0) {
    return { percent: 0, isPositive: true, formatted: "+0.0%" };
  }
  const growth = ((current - previous) / previous) * 100;
  const rounded = Math.round(growth * 10) / 10;
  const isPositive = rounded >= 0;
  const formatted = `${isPositive ? "+" : ""}${rounded}%`;
  
  return {
    percent: rounded,
    isPositive,
    formatted
  };
}

/**
 * Format currency values in USD ($XX.XX).
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
}

/**
 * Format numbers with comma grouping (e.g., 1,420).
 */
export function formatNumber(num) {
  return new Intl.NumberFormat("en-US").format(num || 0);
}
