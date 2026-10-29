import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  Sparkles, 
  AlertCircle, 
  Trophy, 
  Layers, 
  Grid3X3, 
  List, 
  ArrowUpRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/calculations.js';

export default function ProductsView({
  productPerformance = [],
  top3Products = [],
  lowestPerformer = null,
  onSelectProduct
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('revenue-desc'); // 'revenue-desc', 'revenue-asc', 'units-desc', 'units-asc', 'name-asc', 'price-desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(productPerformance.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [productPerformance]);

  // Top 3 IDs lookup
  const top3Ids = useMemo(() => {
    return new Set(top3Products.map(p => p.id));
  }, [top3Products]);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return productPerformance
      .filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'revenue-desc') return b.revenue - a.revenue;
        if (sortBy === 'revenue-asc') return a.revenue - b.revenue;
        if (sortBy === 'units-desc') return b.unitsSold - a.unitsSold;
        if (sortBy === 'units-asc') return a.unitsSold - b.unitsSold;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [productPerformance, searchQuery, selectedCategory, sortBy]);

  // Map product rank by revenue
  const revenueRankMap = useMemo(() => {
    const map = new Map();
    top3Products.forEach((p, idx) => {
      map.set(p.id, idx + 1);
    });
    return map;
  }, [top3Products]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header and Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Product Catalog & Performance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Analyze individual sales velocity, revenue contribution, and margins across all items.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 & Lowest Performer Highlight Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top 3 Overview Card */}
        <div className="lg:col-span-2 liquid-glass-card rounded-2xl p-5 border border-amber-500/20 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Top 3 Revenue Pillars
            </h3>
            <span className="text-[11px] text-slate-400">
              · Generating {Math.round(top3Products.reduce((sum, p) => sum + p.revenueSharePercent, 0))}% of store revenue
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {top3Products.map((p, idx) => {
              const medalColors = [
                "border-amber-400/40 text-amber-300 bg-amber-400/10",
                "border-slate-300/40 text-slate-200 bg-slate-300/10",
                "border-amber-700/40 text-amber-600 bg-amber-700/10"
              ];
              const labels = ["#1 Top Seller", "#2 Runner Up", "#3 Performer"];

              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${medalColors[idx]}`}>
                      {labels[idx]}
                    </span>
                    <span className="text-xs font-mono-numbers text-emerald-400 font-bold">
                      {formatCurrency(p.revenue)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                    <span>{p.unitsSold} units sold</span>
                    <span>{p.revenueSharePercent}% share</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lowest Performer Spotlight */}
        {lowestPerformer && (
          <div className="liquid-glass-card rounded-2xl p-5 border border-rose-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Lowest Velocity Item
                </h3>
              </div>
              <div 
                onClick={() => onSelectProduct(lowestPerformer)}
                className="cursor-pointer group"
              >
                <div className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                  {lowestPerformer.name}
                </div>
                <div className="text-xs text-slate-300 mt-1 flex items-center gap-3">
                  <span className="font-mono-numbers text-rose-400 font-bold">
                    {lowestPerformer.unitsSold} units
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="font-mono-numbers text-slate-300">
                    {formatCurrency(lowestPerformer.revenue)} revenue
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400">
              <span className="text-indigo-300 font-medium">Strategy:</span> Bundle with #{top3Products[0]?.name.split(' (')[0] || "Top Seller"} to stimulate product trials and turnover.
            </div>
          </div>
        )}
      </div>

      {/* Control Bar: Search + Category Tabs + Sort */}
      <div className="liquid-glass-subtle rounded-2xl p-4 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name, SKU, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills & Sort Selector */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto max-w-full">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-white text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="revenue-desc" className="bg-slate-900 text-white">Revenue (High to Low)</option>
              <option value="revenue-asc" className="bg-slate-900 text-white">Revenue (Low to High)</option>
              <option value="units-desc" className="bg-slate-900 text-white">Units Sold (High to Low)</option>
              <option value="units-asc" className="bg-slate-900 text-white">Units Sold (Low to High)</option>
              <option value="name-asc" className="bg-slate-900 text-white">Product Name (A - Z)</option>
              <option value="price-desc" className="bg-slate-900 text-white">Unit Price (High to Low)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="liquid-glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-8">
          <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No matching products found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search query or reset the category filter to view all items.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const isTopRanked = revenueRankMap.has(product.id);
            const rank = revenueRankMap.get(product.id);
            const isLowest = lowestPerformer && lowestPerformer.id === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="liquid-glass-card rounded-2xl p-5 relative flex flex-col justify-between cursor-pointer group hover:border-indigo-500/50"
              >
                {/* Top Badge Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-medium text-slate-400">
                      {product.category}
                    </span>
                    
                    {isTopRanked && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/40 text-amber-300 bg-amber-400/10">
                        Top #{rank}
                      </span>
                    )}

                    {isLowest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 text-rose-300 bg-rose-500/10">
                        Low Volume
                      </span>
                    )}
                  </div>

                  {/* Title & SKU */}
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                    SKU: {product.sku}
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Unit Price:</span>
                    <span className="font-semibold text-white font-mono-numbers">
                      {formatCurrency(product.price)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Units Sold:</span>
                    <span className="font-semibold text-white font-mono-numbers">
                      {formatNumber(product.unitsSold)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Revenue:</span>
                    <span className="font-extrabold text-emerald-400 font-mono-numbers">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-white/5 text-[11px]">
                    <span className="text-slate-500">Margin:</span>
                    <span className="font-mono-numbers font-medium text-indigo-300">
                      {product.marginPercent}% (${product.profit.toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-indigo-400 group-hover:text-indigo-300">
                  <span>Stock: {product.stock} in inventory</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredProducts.length > 0 && (
        <div className="liquid-glass-card rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Units Sold</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-right">Share</th>
                  <th className="py-3 px-4 text-right">Margin</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono-numbers">
                {filteredProducts.map((p) => {
                  const isTop = revenueRankMap.has(p.id);
                  const isLowest = lowestPerformer && lowestPerformer.id === p.id;

                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-sans font-medium text-white group-hover:text-indigo-300">
                        {p.name}
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {p.sku}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-300">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-200">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-white">
                        {formatNumber(p.unitsSold)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                        {formatCurrency(p.revenue)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-indigo-300">
                        {p.revenueSharePercent}%
                      </td>
                      <td className="py-3.5 px-4 text-right text-slate-300">
                        {p.marginPercent}%
                      </td>
                      <td className="py-3.5 px-4 text-center font-sans">
                        {isTop && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/40 text-amber-300 bg-amber-400/10">
                            Top #{revenueRankMap.get(p.id)}
                          </span>
                        )}
                        {isLowest && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 text-rose-300 bg-rose-500/10">
                            Low Velocity
                          </span>
                        )}
                        {!isTop && !isLowest && (
                          <span className="text-[11px] text-slate-400">
                            {p.badge}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
