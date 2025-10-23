# Stock Market Prediction & Demo Trading Platform

A full-stack AI-powered stock market prediction and demo trading application built with Flask, Next.js, and machine learning.

## 🚀 Live Demo

**Frontend**: https://agentic-71c7b963.vercel.app

## 📋 Features

### Authentication & Security
- User registration with email/password
- OTP verification system (6-digit code)
- JWT-based authentication
- Secure password handling
- Protected API routes

### Stock Market Predictions
- AI-powered stock price predictions using XGBoost
- Real-time stock data from Yahoo Finance
- Confidence scores for predictions
- Historical price charts (30-day view)
- Support for major stocks (AAPL, GOOGL, MSFT, TSLA, etc.)

### Demo Trading
- Virtual currency ($100,000 starting balance)
- Buy and sell stocks with real-time prices
- Portfolio tracking and management
- Transaction history
- Real-time balance updates

### User Interface
- Modern, responsive design with Tailwind CSS
- Interactive charts using Recharts
- Real-time stock search
- Dashboard with portfolio overview
- Transaction history view

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask 3.0.0
- **Authentication**: Flask-JWT-Extended
- **Database**: In-memory storage (MongoDB-ready structure)
- **ML Model**: XGBoost 2.0.3
- **Data Processing**: Pandas, NumPy
- **Stock Data**: yfinance API
- **CORS**: Flask-CORS

### Frontend
- **Framework**: Next.js 16.0.0 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📁 Project Structure

```
agentic-71c7b963/
├── backend/
│   ├── app.py              # Flask application with all routes
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example       # Environment variables template
│   └── venv/              # Virtual environment
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/page.tsx     # Login page
│   │   ├── signup/page.tsx    # Signup with OTP verification
│   │   └── dashboard/page.tsx # Main trading dashboard
│   ├── lib/
│   │   └── api.ts            # API client configuration
│   ├── package.json          # Node dependencies
│   └── vercel.json          # Vercel deployment config
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Run the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/verify-otp` - Verify OTP and activate account
- `POST /api/auth/login` - Login with email/password
- `GET /api/user/profile` - Get user profile (protected)

### Stock Operations
- `POST /api/stocks/predict` - Get AI prediction for a stock
- `GET /api/stocks/history` - Get historical price data
- `GET /api/stocks/search` - Search for stocks

### Portfolio & Trading
- `GET /api/portfolio` - Get user's portfolio
- `POST /api/portfolio/trade` - Execute buy/sell trade
- `GET /api/transactions` - Get transaction history

## 🎯 How to Use

1. **Sign Up**: Create an account with your email and password
2. **Verify OTP**: Enter the 6-digit OTP sent to your email (displayed on screen for demo)
3. **Search Stocks**: Use the search bar to find stocks (e.g., AAPL, GOOGL)
4. **View Predictions**: See AI-powered price predictions with confidence scores
5. **Trade**: Buy or sell stocks using your virtual $100,000 balance
6. **Track Portfolio**: Monitor your holdings and transaction history

## 🔒 Security Features

- JWT token-based authentication
- Password hashing (bcrypt ready)
- CORS protection
- Protected API routes
- Input validation
- Secure OTP verification

## 🚀 Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel and accessible at:
https://agentic-71c7b963.vercel.app

To deploy updates:
```bash
cd frontend
vercel deploy --prod --token YOUR_TOKEN --name agentic-71c7b963
```

### Backend
The backend can be deployed to:
- Heroku
- AWS Elastic Beanstalk
- Google Cloud Run
- DigitalOcean App Platform

For production, update the `NEXT_PUBLIC_API_URL` in the frontend to point to your deployed backend.

## 📝 Notes

### Current Implementation
- Uses in-memory storage for demo purposes (data resets on server restart)
- OTP is displayed on screen for testing (in production, send via email/SMS)
- Stock predictions use a simplified model (can be enhanced with more features)
- Virtual trading only (no real money involved)

### Production Considerations
- Replace in-memory storage with MongoDB Atlas
- Implement proper OTP delivery (Twilio, SendGrid)
- Add more sophisticated ML features
- Implement rate limiting
- Add comprehensive error handling
- Set up monitoring and logging
- Use environment-specific configurations

## 🤝 Contributing

This is an AI-generated project. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙋‍♂️ Support

For questions or issues:
- Create an issue in the GitHub repository
- Check the documentation
- Review the API endpoints

## 🎨 Screenshots

### Landing Page
Modern landing page with feature highlights and call-to-action

### Dashboard
Interactive dashboard with stock search, predictions, and portfolio tracking

### Trading Interface
Real-time trading with buy/sell functionality and price charts

---

**Built with ❤️ by Devin AI**
- Link to Devin run: https://app.devin.ai/sessions/8381d13b0d034999b0d7978defe98222
- Requested by: Design Arena Founders (founders@designarena.ai) / @grxxce
