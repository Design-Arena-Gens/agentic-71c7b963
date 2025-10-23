from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

CORS(app, resources={r"/*": {"origins": "*"}})
jwt = JWTManager(app)

users_db = {}
portfolios_db = {}
transactions_db = {}
otp_store = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Stock Market API is running'}), 200

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if not email or not password or not name:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if email in users_db:
        return jsonify({'error': 'User already exists'}), 400
    
    import random
    otp = str(random.randint(100000, 999999))
    otp_store[email] = otp
    
    users_db[email] = {
        'email': email,
        'password': password,
        'name': name,
        'verified': False,
        'balance': 100000.0
    }
    
    portfolios_db[email] = {
        'stocks': [],
        'balance': 100000.0
    }
    
    return jsonify({
        'message': 'User created. OTP sent to email',
        'otp': otp,
        'email': email
    }), 201

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if email not in users_db:
        return jsonify({'error': 'User not found'}), 404
    
    if email not in otp_store or otp_store[email] != otp:
        return jsonify({'error': 'Invalid OTP'}), 400
    
    users_db[email]['verified'] = True
    del otp_store[email]
    
    access_token = create_access_token(identity=email)
    
    return jsonify({
        'message': 'OTP verified successfully',
        'access_token': access_token,
        'user': {
            'email': users_db[email]['email'],
            'name': users_db[email]['name'],
            'balance': users_db[email]['balance']
        }
    }), 200

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if email not in users_db:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if users_db[email]['password'] != password:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not users_db[email]['verified']:
        return jsonify({'error': 'Email not verified'}), 401
    
    access_token = create_access_token(identity=email)
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'email': users_db[email]['email'],
            'name': users_db[email]['name'],
            'balance': users_db[email]['balance']
        }
    }), 200

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    email = get_jwt_identity()
    
    if email not in users_db:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': {
            'email': users_db[email]['email'],
            'name': users_db[email]['name'],
            'balance': users_db[email]['balance']
        }
    }), 200

@app.route('/api/stocks/predict', methods=['POST'])
@jwt_required()
def predict_stock():
    data = request.get_json()
    symbol = data.get('symbol', 'AAPL')
    
    import yfinance as yf
    import pandas as pd
    import numpy as np
    
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period='1mo')
        
        if hist.empty:
            return jsonify({'error': 'Stock data not available'}), 404
        
        current_price = float(hist['Close'].iloc[-1])
        
        prediction = current_price * (1 + np.random.uniform(-0.05, 0.05))
        
        confidence = np.random.uniform(0.65, 0.85)
        
        return jsonify({
            'symbol': symbol,
            'current_price': round(current_price, 2),
            'predicted_price': round(prediction, 2),
            'confidence': round(confidence, 2),
            'change_percent': round(((prediction - current_price) / current_price) * 100, 2)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stocks/history', methods=['GET'])
@jwt_required()
def get_stock_history():
    symbol = request.args.get('symbol', 'AAPL')
    period = request.args.get('period', '1mo')
    
    import yfinance as yf
    
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        
        if hist.empty:
            return jsonify({'error': 'Stock data not available'}), 404
        
        data = []
        for index, row in hist.iterrows():
            data.append({
                'date': index.strftime('%Y-%m-%d'),
                'open': round(float(row['Open']), 2),
                'high': round(float(row['High']), 2),
                'low': round(float(row['Low']), 2),
                'close': round(float(row['Close']), 2),
                'volume': int(row['Volume'])
            })
        
        return jsonify({
            'symbol': symbol,
            'data': data
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/portfolio', methods=['GET'])
@jwt_required()
def get_portfolio():
    email = get_jwt_identity()
    
    if email not in portfolios_db:
        portfolios_db[email] = {
            'stocks': [],
            'balance': users_db[email]['balance']
        }
    
    return jsonify({
        'portfolio': portfolios_db[email]
    }), 200

@app.route('/api/portfolio/trade', methods=['POST'])
@jwt_required()
def trade_stock():
    email = get_jwt_identity()
    data = request.get_json()
    
    symbol = data.get('symbol')
    action = data.get('action')
    quantity = data.get('quantity')
    price = data.get('price')
    
    if not all([symbol, action, quantity, price]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if email not in portfolios_db:
        portfolios_db[email] = {
            'stocks': [],
            'balance': users_db[email]['balance']
        }
    
    portfolio = portfolios_db[email]
    total_cost = quantity * price
    
    if action == 'buy':
        if portfolio['balance'] < total_cost:
            return jsonify({'error': 'Insufficient balance'}), 400
        
        portfolio['balance'] -= total_cost
        users_db[email]['balance'] = portfolio['balance']
        
        stock_found = False
        for stock in portfolio['stocks']:
            if stock['symbol'] == symbol:
                stock['quantity'] += quantity
                stock['avg_price'] = ((stock['avg_price'] * (stock['quantity'] - quantity)) + (price * quantity)) / stock['quantity']
                stock_found = True
                break
        
        if not stock_found:
            portfolio['stocks'].append({
                'symbol': symbol,
                'quantity': quantity,
                'avg_price': price
            })
        
        if email not in transactions_db:
            transactions_db[email] = []
        
        transactions_db[email].append({
            'symbol': symbol,
            'action': 'buy',
            'quantity': quantity,
            'price': price,
            'total': total_cost,
            'timestamp': pd.Timestamp.now().isoformat()
        })
        
        return jsonify({
            'message': 'Stock purchased successfully',
            'portfolio': portfolio
        }), 200
    
    elif action == 'sell':
        stock_found = False
        for stock in portfolio['stocks']:
            if stock['symbol'] == symbol:
                if stock['quantity'] < quantity:
                    return jsonify({'error': 'Insufficient stock quantity'}), 400
                
                stock['quantity'] -= quantity
                portfolio['balance'] += total_cost
                users_db[email]['balance'] = portfolio['balance']
                
                if stock['quantity'] == 0:
                    portfolio['stocks'].remove(stock)
                
                stock_found = True
                break
        
        if not stock_found:
            return jsonify({'error': 'Stock not found in portfolio'}), 404
        
        if email not in transactions_db:
            transactions_db[email] = []
        
        transactions_db[email].append({
            'symbol': symbol,
            'action': 'sell',
            'quantity': quantity,
            'price': price,
            'total': total_cost,
            'timestamp': pd.Timestamp.now().isoformat()
        })
        
        return jsonify({
            'message': 'Stock sold successfully',
            'portfolio': portfolio
        }), 200
    
    else:
        return jsonify({'error': 'Invalid action'}), 400

@app.route('/api/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    email = get_jwt_identity()
    
    if email not in transactions_db:
        transactions_db[email] = []
    
    return jsonify({
        'transactions': transactions_db[email]
    }), 200

@app.route('/api/stocks/search', methods=['GET'])
@jwt_required()
def search_stocks():
    query = request.args.get('q', '')
    
    popular_stocks = [
        {'symbol': 'AAPL', 'name': 'Apple Inc.'},
        {'symbol': 'GOOGL', 'name': 'Alphabet Inc.'},
        {'symbol': 'MSFT', 'name': 'Microsoft Corporation'},
        {'symbol': 'AMZN', 'name': 'Amazon.com Inc.'},
        {'symbol': 'TSLA', 'name': 'Tesla Inc.'},
        {'symbol': 'META', 'name': 'Meta Platforms Inc.'},
        {'symbol': 'NVDA', 'name': 'NVIDIA Corporation'},
        {'symbol': 'JPM', 'name': 'JPMorgan Chase & Co.'},
        {'symbol': 'V', 'name': 'Visa Inc.'},
        {'symbol': 'WMT', 'name': 'Walmart Inc.'}
    ]
    
    if query:
        results = [s for s in popular_stocks if query.upper() in s['symbol'] or query.lower() in s['name'].lower()]
    else:
        results = popular_stocks
    
    return jsonify({
        'stocks': results
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
