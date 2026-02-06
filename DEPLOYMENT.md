# 🚀 MarketVibe - Deployment Guide

## Make Your App Available to Everyone (including Mobile!)

This guide will help you deploy MarketVibe so anyone can access it online and use it on their phone.

## 📱 Mobile Support

✅ **MarketVibe is already mobile-ready!**
- Responsive design works on all screen sizes
- Touch-friendly controls
- PWA support (install like a native app)
- Optimized charts for mobile devices

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account (free)
- Vercel account (free tier works perfectly)

## Local Development

### 1. Install Dependencies

```bash
cd trading-app
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
NEXT_PUBLIC_UPDATE_INTERVAL=30000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or 3001 if 3000 is taken)

### 4. Build for Production

```bash
npm run build
npm start
```

## 🌐 Deploying to Vercel (Easiest - Recommended)

Vercel is **completely free** for personal projects and is the easiest way to deploy Next.js apps.

### Quick Start: GitHub + Vercel (5 minutes)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
cd trading-app
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `trading-dashboard` (or your choice)
- In which directory is your code located? `./`
- Want to modify settings? **N**

4. **Deploy to Production**

```bash
vercel --prod
```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit: Trading Dashboard"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Import to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "Add New..." → "Project"
- Import your GitHub repository
- Configure:
  - Framework Preset: **Next.js**
  - Root Directory: `./trading-app` (if repo contains parent folder)
  - Build Command: `npm run build`
  - Output Directory: `.next`

3. **Add Environment Variables**

In Vercel dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
NEXT_PUBLIC_UPDATE_INTERVAL=30000
```

4. **Deploy**

Click "Deploy" and Vercel will automatically build and deploy your app.

## 📱 Using on Mobile (Install as App)

Once deployed, users can install MarketVibe like a native app:

### iPhone/iPad:
1. Open your app URL in **Safari** (e.g., `https://marketvibe.vercel.app`)
2. Tap the **Share** button (square with up arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. ✨ App icon appears on home screen!

### Android:
1. Open your app URL in **Chrome**
2. Tap the **Menu** (three dots in top right)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Install"**
5. ✨ App icon appears on home screen!

### PWA Benefits:
- 📱 Full-screen app experience
- 🚀 Faster loading
- 🏠 Home screen icon
- 📊 Works like a native app

## Post-Deployment

### Verify Deployment

After deployment, test these features:

- ✅ Crypto market data loads (Bitcoin, Ethereum)
- ✅ Stocks market data loads (AAPL, GOOGL, etc.)
- ✅ Forex market data loads (EURUSD, GBPUSD, etc.)
- ✅ Charts render correctly (price, volume, RSI, MACD)
- ✅ Technical indicators display
- ✅ Market Vibe sentiment score calculates
- ✅ Time range selector works (1H, 4H, 1D, etc.)
- ✅ Market type switching works (Crypto/Stocks/Forex)
- ✅ Symbol selector dropdown works
- ✅ Responsive design on mobile

### Custom Domain (Optional)

1. Go to Vercel dashboard → Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel

## Features

### Current Implementation

- **Real-time Crypto Data**: CoinGecko API integration
- **Simulated Stock Data**: Mock data for popular stocks (AAPL, GOOGL, MSFT, TSLA, etc.)
- **Simulated Forex Data**: Mock data for major currency pairs (EURUSD, GBPUSD, etc.)
- **Technical Indicators**: RSI, MACD, Moving Averages, Bollinger Bands
- **Market Vibe**: AI-powered sentiment analysis (0-100 score)
- **Multiple Timeframes**: 1H, 4H, 12H, 1D, 7D, 1M, 3M, 1Y
- **Interactive Charts**: TradingView Lightweight Charts

### Future Enhancements

- Real-time stock data (Alpha Vantage, Polygon.io)
- Real-time forex data
- WebSocket for live crypto updates (Binance)
- User authentication and preferences
- Watchlists and portfolios
- Price alerts
- Social sentiment from Twitter/Reddit
- Drawing tools on charts
- Multi-timeframe analysis

## Troubleshooting

### Build Errors

**Error: "Module not found"**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**Error: "Type error in API routes"**
- Ensure Next.js 15+ uses async params: `params: Promise<{ symbol: string }>`

### Runtime Errors

**Error: "429 Rate Limit"**
- CoinGecko free tier: 10-30 calls/min
- Solution: Use Stocks/Forex (simulated) or upgrade CoinGecko plan

**Error: "Failed to fetch"**
- Check API endpoints are accessible
- Verify environment variables are set correctly

### Performance Issues

**Slow initial load**
- Expected: First load includes chart library (60KB)
- Subsequent loads use browser cache

**Charts not rendering**
- Check console for errors
- Verify Lightweight Charts v4.2.0 is installed

## API Rate Limits

### CoinGecko (Free Tier)
- 10-30 calls per minute
- Cache: 30 seconds
- Retry logic: Exponential backoff

### Dexscreener (Free)
- Rate limits vary
- Cache: 2 minutes
- Status: Beta (requires pair addresses)

### Mock Data (Stocks/Forex)
- No rate limits
- Deterministic generation based on symbol
- Cache: 30 seconds

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Next.js documentation
3. Check CoinGecko API status
4. Open an issue in the repository

## License

MIT License - Feel free to use and modify for your projects

---

Built with ❤️ using Next.js, React, TradingView Charts, and CoinGecko API
