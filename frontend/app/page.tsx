'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, BarChart3, Shield, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">StockPredictor</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Stock Market Predictions
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Make informed trading decisions with machine learning predictions and demo trading
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-lg"
          >
            Get Started Free
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <BarChart3 className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Predictions</h3>
            <p className="text-gray-600">
              Get AI-powered stock price predictions based on historical data and market trends
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Zap className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Demo Trading</h3>
            <p className="text-gray-600">
              Practice trading with virtual currency before investing real money
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Shield className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
            <p className="text-gray-600">
              Your data is protected with industry-standard security measures
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <TrendingUp className="h-12 w-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Portfolio Tracking</h3>
            <p className="text-gray-600">
              Monitor your demo portfolio performance and transaction history
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account and verify your email with OTP</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Predictions</h3>
              <p className="text-gray-600">View AI-powered predictions for your favorite stocks</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Trading</h3>
              <p className="text-gray-600">Practice with $100,000 virtual currency</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 StockPredictor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
