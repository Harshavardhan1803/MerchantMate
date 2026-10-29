import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import OverviewView from './components/OverviewView.jsx';
import ProductsView from './components/ProductsView.jsx';
import InsightsView from './components/InsightsView.jsx';
import AskAssistantView from './components/AskAssistantView.jsx';
import ProductDetailModal from './components/ProductDetailModal.jsx';

import { SAMPLE_PRODUCTS, DAILY_SALES_RECORDS } from './data/salesData.js';
import { calculateAnalytics, calculateGrowth } from './utils/calculations.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'insights' | 'assistant'
  const [selectedRange, setSelectedRange] = useState('current_7'); // 'current_7' | 'previous_7' | 'all_14'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Filter active daily records based on selected date range
  const activeRecords = useMemo(() => {
    if (selectedRange === 'current_7') {
      return DAILY_SALES_RECORDS.filter(r => r.period === 'current');
    }
    if (selectedRange === 'previous_7') {
      return DAILY_SALES_RECORDS.filter(r => r.period === 'previous');
    }
    return DAILY_SALES_RECORDS;
  }, [selectedRange]);

  // 2. Previous period records for comparison indicators
  const comparisonRecords = useMemo(() => {
    if (selectedRange === 'current_7') {
      return DAILY_SALES_RECORDS.filter(r => r.period === 'previous');
    }
    return null;
  }, [selectedRange]);

  // 3. Compute live analytics on active records
  const currentAnalytics = useMemo(() => {
    return calculateAnalytics(activeRecords, SAMPLE_PRODUCTS);
  }, [activeRecords]);

  // 4. Compute previous period analytics (if available)
  const previousAnalytics = useMemo(() => {
    if (!comparisonRecords) return null;
    return calculateAnalytics(comparisonRecords, SAMPLE_PRODUCTS);
  }, [comparisonRecords]);

  // 5. Compute period-over-period growth rates
  const comparison = useMemo(() => {
    if (!previousAnalytics) return null;
    return {
      revenue: calculateGrowth(currentAnalytics.totalRevenue, previousAnalytics.totalRevenue),
      orders: calculateGrowth(currentAnalytics.totalOrders, previousAnalytics.totalOrders),
      aov: calculateGrowth(currentAnalytics.averageOrderValue, previousAnalytics.averageOrderValue)
    };
  }, [currentAnalytics, previousAnalytics]);

  // Navigation handlers
  const handleAskQuestionFromInsight = (prompt) => {
    setAssistantInitialQuery(prompt);
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Radiant Ambient Glows */}
      <div className="ambient-glow-top" />
      <div className="ambient-glow-side" />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <OverviewView
            analytics={currentAnalytics}
            comparison={comparison}
            selectedRange={selectedRange}
            setSelectedRange={setSelectedRange}
            onSelectProduct={setSelectedProduct}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <ProductsView
            productPerformance={currentAnalytics.productPerformance}
            top3Products={currentAnalytics.top3Products}
            lowestPerformer={currentAnalytics.lowestPerformer}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {/* Tab 3: Sales Insights */}
        {activeTab === 'insights' && (
          <InsightsView
            analytics={currentAnalytics}
            comparison={comparison}
            onAskQuestion={handleAskQuestionFromInsight}
          />
        )}

        {/* Tab 4: Ask MerchantMate */}
        {activeTab === 'assistant' && (
          <AskAssistantView
            analytics={currentAnalytics}
            comparison={comparison}
            initialQuery={assistantInitialQuery}
          />
        )}

      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          dailyData={activeRecords}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-12 relative z-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-300">MerchantMate</span> — Your business, made easier to understand.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">
              Deterministic JavaScript Math · Production Ready
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-indigo-400">
              Portfolio Edition
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
