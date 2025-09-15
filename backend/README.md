# Atomic Rose Tools Store - Backend

FastAPI-based backend application for the Atomic Rose Tools e-commerce store.

## Features

- **FastAPI Framework**: High-performance Python web framework
- **MongoDB Integration**: Document-based database with Motor async driver
- **JWT Authentication**: Secure user authentication and authorization
- **R2 File Storage**: Cloudflare R2 integration for secure file downloads
- **Rate Limiting**: Download limits and quota management
- **Guest Checkout**: Email verification system for guest users
- **CORS Support**: Cross-origin resource sharing for frontend integration

## Tech Stack

- **FastAPI** - Web framework
- **MongoDB** - Database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Bcrypt** - Password hashing
- **JWT** - Authentication tokens
- **Boto3** - AWS/R2 SDK

## Project Structure

```
backend/
├── simple_api.py     # Main FastAPI application
├── requirements.txt  # Python dependencies
├── .env             # Environment variables
└── scripts/         # Utility scripts
    ├── insert_sample_product.py
    ├── test_auth.py
    └── ...
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

## Environment Variables

Create a `.env` file in the backend directory:

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

## Development

1. **Install dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start the server:**
   ```bash
   python3 simple_api.py
   ```

4. **Run tests:**
   ```bash
   python3 scripts/test_auth.py
   ```

## Database Collections

### Users
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "created_at": "datetime",
  "is_active": "boolean"
}
```

### Products
```json
{
  "_id": "ObjectId",
  "title": "string",
  "artist": "string",
  "type": "string",
  "price": "number",
  "cover_image_url": "string",
  "file_path": "string",
  "status": "string"
}
```

### Orders
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "products": ["ObjectId"],
  "total_amount": "number",
  "status": "string",
  "created_at": "datetime"
}
```

## Scripts

### Insert Sample Product
```bash
python3 scripts/insert_sample_product.py
```

### Test Authentication
```bash
python3 scripts/test_auth.py
```

### Check Products
```bash
python3 scripts/check_products.py
```

## Security Features

- **Password Hashing**: Bcrypt with salt
- **JWT Tokens**: Secure authentication
- **CORS Protection**: Configured for frontend domain
- **Rate Limiting**: Download quotas per user
- **Input Validation**: Pydantic models

## Deployment

The backend is configured for deployment on Render with automatic builds from GitHub.

### Render Configuration
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python3 simple_api.py`
- **Environment**: Python 3.9+

## Monitoring

The application includes comprehensive logging for:
- API requests and responses
- Authentication events
- Download activities
- Error tracking
- Database operations