# MerchantMate — Premium AI Business Assistant

> **"Your business, made easier to understand."**

MerchantMate is a visual analytics and business assistant web application built specifically for small shop owners and independent merchants. It translates raw sales logs into clear executive cards, responsive trend curves, product performance rankings, actionable commercial recommendations, and a conversational query assistant.

Designed with a sophisticated **liquid-glass** aesthetic (translucent surfaces, ambient mesh gradients, accessible contrast, and tabular numerals), MerchantMate looks and feels like a modern startup product while maintaining a clean, beginner-friendly JavaScript codebase that can be explained with 100% confidence in technical interviews.

---

## 🌟 Key Application Features

### 1. Executive Overview Dashboard
- **4 Primary KPI Summary Cards**:
  - **Total Revenue**: Computed from `Σ (units sold × unit price)` across all active products.
  - **Total Orders**: Total customer transactions completed during the selected period.
  - **Average Order Value (AOV)**: Exact formula: `Total Revenue ÷ Total Orders`.
  - **Best-Selling Product**: Instant identification of the #1 revenue earner with revenue and unit metrics.
- **Interactive SVG Sales Trend Chart**:
  - Smooth Bezier area chart with gradient underfill.
  - Metric view toggling: **Revenue ($)**, **Order Count**, and **Units Sold**.
  - Interactive hover scrubbing with crosshair and floating glass tooltip card showing daily revenue, orders, and daily AOV.
- **Dynamic Date Range Filtering**:
  - Switch between **Last 7 Days (Oct 22 - 28)**, **Prior 7 Days (Oct 15 - 21)**, and **Full 14 Days**.
  - All summary cards, charts, rankings, and growth rates dynamically recalculate in real-time.
- **Store Pulse Strip**: Highlights peak shopping day, top category contribution, and basket density (items per order).

### 2. Product Catalog & Performance
- **8 Realistic Artisanal Products**: Spanning Beverages, Home Goods, Accessories, and Personal Care.
- **Multi-Factor Sorting**:
  - By Gross Revenue (High to Low / Low to High)
  - By Units Sold (High to Low / Low to High)
  - By Product Name (A - Z)
  - By Unit Price
- **Live Search & Category Filtering**: Instant client-side search by item name, SKU, or category.
- **Rank Highlights**:
  - **Top 3 Revenue Pillars**: Visual medal callouts (#1 Top Seller, #2 Runner Up, #3 Performer).
  - **Lowest Velocity Spotlight**: Flags the slowest-moving item by volume with an actionable bundle strategy.
- **Dual View Modes**: Switch between responsive card grid and compact high-density data table.
- **Product Detail Modal**: Click any item to inspect its description, wholesale cost, gross margin percentage, and 7-day sales breakdown.

### 3. Data-Driven Sales Insights
Every recommendation is backed by real mathematical calculations:
- **Revenue Concentration & Supply Protection**: Highlights that the top 2 products generate over 50% of revenue and warns against stockouts.
- **Inventory Velocity Acceleration**: Identifies slow-moving high-margin items and prescribes pairing with fast-moving low-friction products.
- **Weekly Demand Rhythm**: Measures weekend traffic spikes (+35% over weekday averages) and recommends staff allocation.
- **Basket Size Expansion**: Suggests an optimal free shipping / gift threshold ($45) based on current Average Order Value ($32.89).
- **Interactive Verification Math Drawers**: Click "Verify Math" on any card to inspect the exact formula and numbers used.

### 4. Ask MerchantMate (Interactive Assistant)
- **Conversational Rule Engine**: Processes merchant questions through deterministic JavaScript logic with transparent numerical extraction.
- **Pre-Configured Suggested Question Chips**:
  - *"What is my total revenue?"*
  - *"Which product generates the most revenue?"*
  - *"Which product sells the least?"*
  - *"Which products should I focus on?"*
  - *"Summarize my sales performance."*
  - *"What is my average order value?"*
  - *"When was my peak sales day?"*
- **Rich Structured Responses**: Formatted prose, highlight metric boxes, merchant takeaway tips, and mathematical breakdown logs.
- **Honest Demo Labeling**: Honestly labeled as Demo Mode with zero external API fees. Structured with a clean separated interface so a Gemini AI API model can be plugged in seamlessly.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Language**: JavaScript (clean, beginner-friendly syntax)
- **Styling**: Tailwind CSS v4 + custom liquid-glass glassmorphism utilities
- **Icons**: Lucide React
- **Data Visualizations**: Custom responsive SVG Bezier curve charts (zero peer-dependency collisions)
- **State Management**: React Hooks (`useState`, `useMemo`, `useEffect`)

---

## 📐 Project Structure

```
├── .gitignore                   # Git ignore specifications
├── index.html                   # HTML entry point with Plus Jakarta Sans & JetBrains Mono fonts
├── metadata.json                # AI Studio application metadata
├── package.json                 # Dependencies and npm scripts
├── README.md                    # Project documentation
├── src/
│   ├── App.jsx                  # Main application orchestrator & state container
│   ├── index.css                # Tailwind imports, liquid-glass styles, ambient glows
│   ├── main.tsx                 # React application mounting point
│   ├── components/
│   │   ├── AskAssistantView.jsx # Conversational business assistant interface
│   │   ├── DateRangeSelector.jsx# Time window filter (7-day / 14-day)
│   │   ├── InsightsView.jsx     # Actionable data-backed recommendations
│   │   ├── MetricCard.jsx       # Liquid-glass KPI summary cards with trend badges
│   │   ├── Navbar.jsx           # Top navigation following the Top Bar Contract
│   │   ├── OverviewView.jsx     # Main dashboard with KPIs and trend chart
│   │   ├── ProductDetailModal.jsx # Detailed product modal with daily sales table
│   │   ├── ProductsView.jsx     # Product catalog, sorting, filtering, and rank badges
│   │   └── SalesChart.jsx       # Custom responsive SVG Bezier line & area chart
│   ├── data/
│   │   └── salesData.js         # Realistic 14-day sample sales transactions
│   └── utils/
│       ├── assistantEngine.js   # Deterministic natural language query matcher
│       └── calculations.js      # Pure mathematical functions (Revenue, AOV, Growth, Rankings)
└── vite.config.ts               # Vite configuration with Tailwind CSS plugin
```

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd merchantmate
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run production build**:
   ```bash
   npm run build
   ```

---

## 🐙 GitHub Integration Guide

To push this codebase to your own GitHub account:

1. **Initialize Git (if not already done)**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial MerchantMate production release"
   ```

2. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository `merchantmate`.
   - Leave it public or private, without initializing with a README.

3. **Link and Push**:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/merchantmate.git
   git branch -M main
   git push -u origin main
   ```

---

## ▲ Vercel Deployment Guide

MerchantMate is configured to deploy directly to Vercel with zero configuration:

### Method A: Deploy via Vercel CLI (Fastest)
1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Log in and deploy:
   ```bash
   vercel
   ```
3. For production release:
   ```bash
   vercel --prod
   ```

### Method B: Deploy via Vercel Web Dashboard (Recommended)
1. Push your project to GitHub (see GitHub guide above).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your `merchantmate` repository.
4. Keep the default build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Vercel will build the project and output a live `.vercel.app` production URL in ~30 seconds!

---

## 💼 Interview Talking Points & Explainability

If presenting MerchantMate in a job interview or portfolio review:

1. **Deterministic Business Math vs AI Hallucination**:
   - Point out that all financial figures are calculated directly from `salesData.js` using pure JavaScript functions in `calculations.js`.
   - Demonstrate how `AOV = Total Revenue / Total Orders` and period-over-period growth are mathematically provable via the "Verify Math" drawers.
2. **Separation of Concerns**:
   - The conversational assistant is completely decoupled into `assistantEngine.js`.
   - Explain how this allows swapping the demo rule engine for an LLM API endpoint (e.g. Gemini 2.5 Flash) without altering the UI components.
3. **Responsive SVG Visualization**:
   - Explain why custom SVG was chosen over heavy charting libraries: zero bundle bloat, no React 19 version mismatches, customizable cubic Bezier curves, and full styling integration with the liquid-glass design system.
4. **Accessibility & Design Polish**:
   - Enforces tabular figures (`tabular-nums`) to prevent metric jitter.
   - Respects user accessibility preferences with `@media (prefers-reduced-motion: reduce)`.
   - Adheres to WCAG AA contrast standards while presenting an aesthetic dark liquid-glass visual language.

---

## 📄 License

Apache-2.0 License. Built with Google AI Studio.
