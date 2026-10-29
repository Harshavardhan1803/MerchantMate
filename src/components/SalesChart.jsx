import React, { useState, useRef, useId } from 'react';
import { formatCurrency, formatNumber } from '../utils/calculations.js';
import { TrendingUp, DollarSign, ShoppingBag, Layers } from 'lucide-react';

export default function SalesChart({ dailyData = [] }) {
  const [activeMetric, setActiveMetric] = useState('revenue'); // 'revenue' | 'orders' | 'units'
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);
  const gradientId = useId();

  if (!dailyData || dailyData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No sales data available for this range.
      </div>
    );
  }

  // Get data points based on metric
  const points = dailyData.map(d => {
    let val = 0;
    if (activeMetric === 'revenue') val = d.revenue;
    else if (activeMetric === 'orders') val = d.orders;
    else if (activeMetric === 'units') val = d.units;
    return {
      raw: d,
      val: val
    };
  });

  const values = points.map(p => p.val);
  const maxVal = Math.max(...values, 10);
  const minVal = 0;

  // Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates
  const coords = points.map((p, i) => {
    const x = paddingX + (i / (points.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((p.val - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, ...p };
  });

  // Construct smooth cubic Bezier path
  function buildSmoothPath(dataCoords) {
    if (dataCoords.length < 2) return '';
    let d = `M ${dataCoords[0].x} ${dataCoords[0].y}`;

    for (let i = 0; i < dataCoords.length - 1; i++) {
      const p0 = i > 0 ? dataCoords[i - 1] : dataCoords[i];
      const p1 = dataCoords[i];
      const p2 = dataCoords[i + 1];
      const p3 = i < dataCoords.length - 2 ? dataCoords[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;

      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const linePath = buildSmoothPath(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${svgHeight - paddingBottom} L ${coords[0].x} ${svgHeight - paddingBottom} Z`;

  // Grid levels (4 ticks)
  const gridTicks = [0, 0.33, 0.66, 1].map(ratio => {
    const val = minVal + ratio * (maxVal - minVal);
    const y = paddingTop + chartHeight - ratio * chartHeight;
    return { val, y };
  });

  // Active hover info
  const activePoint = hoveredIndex !== null ? coords[hoveredIndex] : null;

  const formatMetricValue = (val) => {
    if (activeMetric === 'revenue') return formatCurrency(val);
    return formatNumber(val);
  };

  return (
    <div className="liquid-glass-card rounded-2xl p-6 relative">
      {/* Chart Header & Metric Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">
              Performance Trend
            </h3>
            <span className="text-xs text-slate-400">
              · {dailyData.length}-Day Timeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Hover over any day to inspect revenue, order count, and basket averages.
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveMetric('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'revenue'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue</span>
          </button>
          <button
            onClick={() => setActiveMetric('orders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'orders'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>
          <button
            onClick={() => setActiveMetric('units')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'units'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Units</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden select-none"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#6366F1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines & Y-Axis labels */}
          {gridTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingX}
                y1={tick.y}
                x2={svgWidth - paddingX}
                y2={tick.y}
                stroke="rgba(255, 255, 255, 0.07)"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-500 font-mono-numbers"
              >
                {activeMetric === 'revenue' 
                  ? `$${Math.round(tick.val)}` 
                  : Math.round(tick.val)}
              </text>
            </g>
          ))}

          {/* Gradient Underfill */}
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            className="transition-all duration-300"
          />

          {/* Smooth Trend Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#818CF8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />

          {/* Interactive Scrub Column & Nodes */}
          {coords.map((pt, i) => (
            <g 
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
            >
              {/* Invisible wide touch/mouse hit area */}
              <rect
                x={pt.x - chartWidth / (coords.length * 2)}
                y={paddingTop}
                width={chartWidth / coords.length}
                height={chartHeight + 20}
                fill="transparent"
              />

              {/* Node dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIndex === i ? 6 : 3.5}
                fill={hoveredIndex === i ? "#FFFFFF" : "#818CF8"}
                stroke="#4F46E5"
                strokeWidth={hoveredIndex === i ? 3 : 2}
                className="transition-all duration-150"
              />

              {/* Vertical Crosshair line when hovered */}
              {hoveredIndex === i && (
                <line
                  x1={pt.x}
                  y1={paddingTop}
                  x2={pt.x}
                  y2={svgHeight - paddingBottom}
                  stroke="rgba(129, 140, 248, 0.5)"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />
              )}

              {/* X-axis Day labels */}
              <text
                x={pt.x}
                y={svgHeight - 12}
                textAnchor="middle"
                className={`text-[12px] font-mono-numbers transition-colors ${
                  hoveredIndex === i ? 'fill-indigo-300 font-bold' : 'fill-slate-400'
                }`}
              >
                {pt.raw.shortDay}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip Card */}
        {activePoint && (
          <div
            className="absolute z-20 pointer-events-none transition-all duration-100 ease-out"
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${(activePoint.y / svgHeight) * 100}%`,
              transform: `translate(${activePoint.x > svgWidth / 2 ? '-105%' : '5%'}, -50%)`
            }}
          >
            <div className="liquid-glass border border-white/20 p-3.5 rounded-xl shadow-2xl min-w-[190px]">
              <div className="text-xs font-bold text-white mb-1.5 flex items-center justify-between border-b border-white/10 pb-1">
                <span>{activePoint.raw.displayDate || activePoint.raw.shortDay}</span>
                <span className="text-[10px] text-indigo-400 font-mono-numbers">
                  {activePoint.raw.dayName}
                </span>
              </div>
              
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Revenue:</span>
                  <span className="font-bold text-emerald-400 font-mono-numbers">
                    {formatCurrency(activePoint.raw.revenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Orders:</span>
                  <span className="font-semibold text-white font-mono-numbers">
                    {formatNumber(activePoint.raw.orders)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Items Sold:</span>
                  <span className="font-semibold text-white font-mono-numbers">
                    {formatNumber(activePoint.raw.units)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-white/5">
                  <span className="text-slate-400">Day AOV:</span>
                  <span className="font-semibold text-indigo-300 font-mono-numbers">
                    {formatCurrency(activePoint.raw.averageOrderValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
