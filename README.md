# 📊 MarketVibe - Technical Analysis Platform

A modern, full-stack trading dashboard built with Next.js that combines professional technical analysis with AI-powered sentiment scoring. Track crypto, stocks, ETFs, and forex with real-time data visualization and comprehensive market insights.

**✨ NEW:** Now with 12+ technical indicators, mobile PWA support, and learning mode tooltips!

## 🌐 Live Demo

🚀 **[View Live Demo](https://your-app.vercel.app)** _(deploy to get your URL)_

📱 **Mobile-ready** - Works perfectly on phones and tablets. Install as an app!

---

![Trading Dashboard](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 📈 Multi-Market Support
- **Crypto**: Real-time data from CoinGecko/Kraken APIs (Bitcoin, Ethereum, XRP, Solana, etc.)
- **Stocks**: Real-time data from Yahoo Finance (AAPL, GOOGL, MSFT, TSLA, NVDA, etc.)
- **ETFs**: Real-time ETF data from Yahoo Finance (SPY, QQQ, VTI, etc.)
- **Forex**: Real-time exchange rates from ExchangeRate-API (EURUSD, GBPUSD, USDJPY, etc.)

### 📊 Technical Analysis (12+ Indicators)
- **RSI (Relative Strength Index)**: 14-period momentum oscillator
- **MACD**: Moving Average Convergence Divergence with signal line and histogram
- **Moving Averages**: SMA/EMA 20, 50, 200 with visual overlays
- **Bollinger Bands**: 20-period with 2 standard deviations
- **Stochastic Oscillator**: %K and %D lines for momentum
- **ADX (Average Directional Index)**: Trend strength indicator
- **ATR (Average True Range)**: Volatility measurement
- **CCI (Commodity Channel Index)**: Price deviation indicator
- **Williams %R**: Momentum oscillator
- **OBV (On Balance Volume)**: Volume-based momentum
- **Parabolic SAR**: Trend reversal indicator
- **Volume Analysis**: Relative volume with color-coded bars

### 🎯 Market Vibe Sentiment
Proprietary sentiment scoring system that combines:
- **Momentum Analysis**: RSI + MACD signals
- **Trend Strength**: Price position vs Moving Averages
- **Volume Signals**: Volume momentum and trends
- **Overall Score**: 0-100 composite score with labels (Strong Bearish → Strong Bullish)
- **Confidence Indicator**: Shows agreement level between indicators

### 📱 Interactive Charts
- **TradingView Lightweight Charts**: Professional financial charting
- **Candlestick/Line Charts**: Toggle between views
- **Multiple Timeframes**: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w, 1M, 3M, 1Y
- **Dynamic Time Formatting**: Auto-adjusts based on selected timeframe
- **Separate Indicator Panes**: RSI, MACD, Stochastic, ADX, CCI, Williams %R
- **Responsive Design**: Works on desktop, tablet, and mobile
- **PWA Support**: Install as a native app on mobile devices

### 🎨 Modern UI/UX
- **Gradient Header**: Eye-catching design with live clock and MarketVibe branding
- **Color-Coded Metrics**: Intuitive green/red price movements
- **Learning Mode**: Comprehensive tooltips explaining every indicator with Investopedia links
- **Multiple Modes**: Trading, Learning, AI Selection, Portfolio, Demos Wallet (coming soon)
- **Loading States**: Smooth skeleton screens
- **Error Handling**: User-friendly error messages
- **Mobile Optimized**: Touch-friendly controls, responsive layouts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3" > .env.local
echo "NEXT_PUBLIC_UPDATE_INTERVAL=30000" >> .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
trading-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main dashboard
│   │   ├── layout.tsx          # Root layout
│   │   └── api/                # API routes
│   │       ├── crypto/         # Crypto endpoints
│   │       ├── stocks/         # Stock endpoints
│   │       └── forex/          # Forex endpoints
│   │
│   ├── components/
│   │   ├── dashboard/          # Market/symbol selectors
│   │   ├── charts/             # Chart components
│   │   ├── indicators/         # Indicator panels
│   │   └── sentiment/          # Vibe score components
│   │
│   ├── lib/
│   │   ├── api/                # API clients
│   │   │   ├── crypto/         # CoinGecko integration
│   │   │   ├── stocks/         # Mock stock data
│   │   │   └── forex/          # Mock forex data
│   │   ├── indicators/         # TA calculations
│   │   └── sentiment/          # Vibe calculation engine
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # Zustand state management
│   └── types/                  # TypeScript definitions
│
├── public/                     # Static assets
├── .env.local                  # Environment variables
└── package.json
```

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 18
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Charts**: Lightweight Charts 4.2 (TradingView)
- **State Management**: Zustand
- **Data Fetching**: SWR

### Backend
- **API**: Next.js API Routes (serverless)
- **Data Sources**:
  - CoinGecko API (Crypto)
  - Mock generators (Stocks/Forex)
- **Caching**: Response caching + SWR

### Technical Indicators
- **Library**: technicalindicators
- **Calculations**: Server-side for performance
- **Real-time**: Recalculates every 30s

## 🎯 Market Vibe Algorithm

The Market Vibe score uses a weighted formula:

```
Overall Score (0-100) =
  35% × Momentum (RSI + MACD)
  + 30% × Trend Strength (MA position + BB position)
  + 20% × Volume Momentum
  + 15% × Recent Price Action
```

**Score Interpretation:**
- 75-100: Strong Bullish 🟢
- 60-74: Bullish 🟢
- 40-59: Neutral ⚪
- 25-39: Bearish 🔴
- 0-24: Strong Bearish 🔴

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🚀 Deployment & Mobile Access

### Quick Deploy to Vercel (5 minutes):

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/marketvibe.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New..." → "Project"
   - Import your repository
   - Click "Deploy"
   - Done! 🎉

3. **Use on Mobile:**
   - **iPhone**: Open in Safari → Share → "Add to Home Screen"
   - **Android**: Open in Chrome → Menu → "Add to Home screen"

📖 **Full guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions, custom domains, and troubleshooting.

## 🔐 Environment Variables

```env
# Required
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3

# Optional
NEXT_PUBLIC_UPDATE_INTERVAL=30000
```

## 📄 License

MIT License

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) - Crypto market data
- [TradingView](https://www.tradingview.com/) - Lightweight Charts library
- [technicalindicators](https://github.com/anandanand84/technicalindicators) - TA calculations

---

**Built with Next.js, React, and TradingView Charts**
