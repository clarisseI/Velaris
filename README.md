
# Velaris – Crypto Tracker & AI Assistant

> A modern cryptocurrency dashboard with real-time market data, AI-powered sentiment analysis, and whale activity monitoring—all in a beautiful, responsive interface.

---

## ✨ Features

- **Live Crypto Data:** Track the top 100 coins with up-to-date prices and stats
- **Global Market Overview:** See total market cap, volume, and active coins at a glance
- **Detailed Coin Pages:** View price charts, supply, and performance for each coin
- **AI Sentiment Analysis:** Get market mood and trading signals (OpenAI API required)
- **Whale Watch:** Monitor large transactions and market moves
- **AI Chat Assistant:** Ask questions and get crypto insights instantly
- **Mobile Friendly:** Fully responsive for all devices

---

## 📸 Screenshots

| Home | Coin Details | AI Assistant |
|------|--------------|-------------|
| ![Home](/public/iphone-15-mockup.png) | ![Coin Details](/public/ipad-mockup.png) | ![AI Assistant](/public/FloatingMockup.png) |

> _Add your screenshots to the `public/` folder and update the filenames above._

---

## 🛠️ Tech Stack

- **React 18** (UI)
- **Redux Toolkit** (State)
- **Ant Design** (Components)
- **React Router** (Navigation)
- **CoinGecko API** (Data)
- **OpenAI API** (AI)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd Velaris
npm install
```

### Environment Variables

Create a `.env` file in the root directory with:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

---

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Homepage.jsx    # Main dashboard
│   ├── Cryptocurrencies.jsx
│   ├── CoinDetails.jsx
│   ├── AISentiment.jsx
│   ├── WhaleWatch.jsx
│   ├── CryptoAI.jsx
│   └── Navbar.jsx
├── services/           # API services
│   ├── coinGeckoApi.js
│   ├── aiService.js
│   └── whaleTracker.js
├── App/                # Redux store
│   └── store.js
├── App.js              # Main app component
└── App.css             # Global styles
```

---

## 📦 Scripts

- `npm start` – Run in development
- `npm run build` – Production build
- `npm test` – Run tests
- `npm eject` – Ejects from Create React App (one-way operation)

---

## Features Overview

### Homepage
- Global cryptocurrency statistics
- Top 12/100 cryptocurrencies grid
- Toggle between compact and full view
- Responsive card layout

### Coin Details Modal
- Current price and 24h change
- Market statistics (Market Cap, Volume, High/Low)
- Price performance (1h, 7d, 30d)
- Supply information with progress visualization
- All-time high/low statistics
- "What If" calculator for price projections
- AI sentiment analysis tab
- Whale activity monitoring tab

### AI Features
- Market sentiment analysis
- Trading signal recommendations
- Risk level assessment
- Interactive chat assistant
- Context-aware responses

---

## API Configuration

The app uses the following APIs:
- **CoinGecko API** (free, no key required)
- **OpenAI API** (requires API key for AI features)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is open source and available under the MIT License.

---

## Author

Built by Clarisse Umulisa

