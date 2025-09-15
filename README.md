# Atomic Rose Tools Store

A full-stack e-commerce application for selling digital music products (sample packs, MIDI packs, acapellas) with both guest and authenticated user checkout flows.

## Project Structure

```
Store/
├── frontend/          # React frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── .env          # Frontend environment variables
├── backend/          # FastAPI backend application
│   ├── simple_api.py # Main API server
│   ├── scripts/      # Utility scripts
│   ├── requirements.txt # Backend dependencies
│   └── .env          # Backend environment variables
└── *.md             # Documentation files
```

## Features

### 🛒 E-commerce Features
- **Product Catalog**: Sample packs, MIDI packs, and acapellas
- **Guest Checkout**: Email verification with 1 download per product
- **User Checkout**: Full account with 3 downloads per product
- **Cart Management**: Add/remove items, quantity controls
- **Download System**: Secure R2 presigned URLs with rate limiting

### 🔐 Authentication
- **User Registration**: Email, password, terms acceptance
- **User Login**: JWT-based authentication
- **Profile Management**: View purchased products, download history
- **Account Settings**: Password change, account deletion

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Neon-themed, dark mode interface
- **Smooth Animations**: Framer Motion transitions
- **Error Handling**: User-friendly error messages

## Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB and R2 credentials
   ```

4. **Start the backend server:**
   ```bash
   python3 simple_api.py
   ```
   Server will run on `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   App will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atomic_rose
JWT_SECRET=your-secret-key
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_ACCOUNT_ID=your-r2-account-id
R2_PUBLIC_URL=your-r2-public-url
MAX_DOWNLOADS_PER_USER=3
```

### Frontend (.env)
```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Products
- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/{id}` - Get product by ID

### Orders
- `POST /api/v1/orders/purchase` - Purchase products (authenticated)
- `POST /api/v1/guest/checkout` - Guest checkout
- `POST /api/v1/guest/verify` - Verify guest order

### Downloads
- `GET /api/v1/download/{product_id}` - Download product
- `GET /api/v1/user/download-info` - Get download info

## Database Collections

- **users**: User accounts and authentication
- **products**: Product catalog
- **orders**: Purchase history
- **guest_orders**: Guest purchase records
- **download_quotas**: Download limits per user
- **download_events**: Download activity logs

## Deployment

### Backend (Render)
1. Connect GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python3 simple_api.py`
4. Add environment variables

### Frontend (Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

## Development

### Adding New Products
```bash
cd backend
python3 scripts/insert_sample_product.py
```

### Testing API
```bash
cd backend
python3 scripts/test_auth.py
```

## License

© 2025 Atomic Rose Tools. Made with ❤️ for the psytrance community.