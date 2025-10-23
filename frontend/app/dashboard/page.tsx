'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { stockAPI, portfolioAPI } from '@/lib/api';
import { TrendingUp, LogOut, Search, DollarSign, TrendingDown, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tradeModal, setTradeModal] = useState<{ show: boolean; action: string }>({ show: false, action: '' });
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadPortfolio();
    loadTransactions();
  }, [router]);

  const loadPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio();
      setPortfolio(response.data.portfolio);
    } catch (err) {
      console.error('Failed to load portfolio:', err);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await portfolioAPI.getTransactions();
      setTransactions(response.data.transactions);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await stockAPI.search(searchQuery);
      setSearchResults(response.data.stocks);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSelectStock = async (stock: any) => {
    setSelectedStock(stock);
    setSearchResults([]);
    setSearchQuery('');
    setLoading(true);

    try {
      const [predResponse, histResponse] = await Promise.all([
        stockAPI.predict(stock.symbol),
        stockAPI.getHistory(stock.symbol, '1mo')
      ]);

      setPrediction(predResponse.data);
      setStockHistory(histResponse.data.data);
    } catch (err) {
      console.error('Failed to load stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    if (!selectedStock || !prediction) return;

    try {
      await portfolioAPI.trade({
        symbol: selectedStock.symbol,
        action: tradeModal.action,
        quantity: tradeQuantity,
        price: prediction.current_price
      });

      setTradeModal({ show: false, action: '' });
      setTradeQuantity(1);
      loadPortfolio();
      loadTransactions();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Trade failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">StockPredictor</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Balance</p>
                <p className="text-lg font-bold text-gray-900">
                  ${portfolio?.balance?.toLocaleString() || '0'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
          <p className="text-gray-600">Search for stocks to get AI-powered predictions and start trading</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search stocks (e.g., AAPL, GOOGL, TSLA)"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0"
                >
                  <p className="font-semibold">{stock.symbol}</p>
                  <p className="text-sm text-gray-600">{stock.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {selectedStock && prediction && !loading && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedStock.symbol}</h2>
              <p className="text-gray-600 mb-6">{selectedStock.name}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-gray-900">${prediction.current_price}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Predicted Price</p>
                  <p className="text-2xl font-bold text-green-600">${prediction.predicted_price}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Confidence</span>
                  <span className="text-sm font-semibold">{(prediction.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className={`p-4 rounded-lg mb-6 ${prediction.change_percent >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2">
                  {prediction.change_percent >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`text-lg font-semibold ${prediction.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {prediction.change_percent >= 0 ? '+' : ''}{prediction.change_percent}%
                  </span>
                  <span className="text-gray-600">predicted change</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setTradeModal({ show: true, action: 'buy' })}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeModal({ show: true, action: 'sell' })}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
                >
                  Sell
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Price History (30 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="close" stroke="#4f46e5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="h-6 w-6 text-indigo-600" />
              Your Portfolio
            </h3>
            {portfolio?.stocks?.length > 0 ? (
              <div className="space-y-3">
                {portfolio.stocks.map((stock: any) => (
                  <div key={stock.symbol} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{stock.symbol}</p>
                      <p className="text-sm text-gray-600">{stock.quantity} shares @ ${stock.avg_price.toFixed(2)}</p>
                    </div>
                    <p className="font-bold">${(stock.quantity * stock.avg_price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No stocks in portfolio yet. Start trading!</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-indigo-600" />
              Recent Transactions
            </h3>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(-5).reverse().map((tx: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{tx.symbol}</p>
                      <p className="text-sm text-gray-600">
                        {tx.action.toUpperCase()} {tx.quantity} @ ${tx.price.toFixed(2)}
                      </p>
                    </div>
                    <p className={`font-bold ${tx.action === 'buy' ? 'text-red-600' : 'text-green-600'}`}>
                      {tx.action === 'buy' ? '-' : '+'}${tx.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No transactions yet</p>
            )}
          </div>
        </div>
      </main>

      {tradeModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {tradeModal.action === 'buy' ? 'Buy' : 'Sell'} {selectedStock?.symbol}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={tradeQuantity}
                onChange={(e) => setTradeQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600">Price per share: ${prediction?.current_price}</p>
              <p className="text-lg font-bold">Total: ${(tradeQuantity * (prediction?.current_price || 0)).toFixed(2)}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setTradeModal({ show: false, action: '' })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTrade}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  tradeModal.action === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {tradeModal.action === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
