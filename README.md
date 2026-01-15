# Velaris - Cryptocurrency Tracking & AI Assistant

A modern cryptocurrency tracking application with real-time market data, AI-powered sentiment analysis, and whale activity monitoring.

## Features

- **Real-time Cryptocurrency Data**: Track top 100 cryptocurrencies with live pricing and market statistics
- **Global Market Overview**: View aggregated market metrics including total market cap, trading volume, and active cryptocurrencies
- **Detailed Coin Information**: In-depth coin details with price history, supply information, and market performance
- **AI Sentiment Analysis**: Get AI-powered market sentiment and trading signals (requires OpenAI API key)
- **Whale Watch**: Monitor large transactions and market movements
- **Interactive AI Assistant**: Chat with an AI assistant for cryptocurrency insights and market analysis
- **Responsive Design**: Fully optimized for desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **React Router** - Navigation
- **CoinGecko API** - Cryptocurrency data
- **OpenAI API** - AI features 

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cryptoapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory (optional for AI features):
```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

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

## API Configuration

The app uses the following APIs:
- **CoinGecko API** (free, no key required)
- **OpenAI API** (requires API key for AI features)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Author

Built by Clarisse Umulisa

---

