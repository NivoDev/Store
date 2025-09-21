# Atomic Rose Tools - E-commerce Platform

A modern, full-stack e-commerce platform for digital music products built with React and FastAPI.

## 🚀 Features

- **Product Catalog** - Browse and search digital music products
- **User Authentication** - Secure user registration and login
- **Shopping Cart** - Add products to cart with guest and user support
- **Audio Previews** - Sample previews for music products
- **Responsive Design** - Mobile-first, responsive UI
- **Secure Payments** - Mock payment integration ready for production

## 🛠️ Tech Stack

### Frontend
- React 18
- Styled Components
- React Router
- Context API for state management

### Backend
- FastAPI
- MongoDB with Motor (async)
- JWT Authentication
- Cloudflare R2 for file storage

### Deployment
- Frontend: Netlify
- Backend: Render
- Database: MongoDB Atlas

## 📁 Project Structure

```
Store/
├── frontend/          # React frontend application
├── backend/           # FastAPI backend application
├── scripts/           # Database and utility scripts
└── requirements.txt   # Python dependencies
```

## 🔧 Environment Setup

### Backend Environment Variables
```bash
MONGODB_URI=your_mongodb_connection_string
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_ACCOUNT_ID=your_account_id
R2_PUBLIC_URL=your_public_url
JWT_SECRET_KEY=your_jwt_secret
```

### Frontend Environment Variables
```bash
REACT_APP_API_URL=your_backend_api_url
```

## 🚀 Getting Started

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python simple_api.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📱 Features Overview

### Product Management
- Product catalog with filtering and search
- Audio sample previews
- Product categories and tags
- Featured and bestseller products

### User Experience
- User registration and authentication
- Shopping cart functionality
- Guest checkout support
- Responsive mobile design

### Admin Features
- Product management
- User management
- Order tracking
- Analytics dashboard

## 🔒 Security

- JWT-based authentication
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- Secure file storage with presigned URLs
- CORS configuration for production

## 📦 Deployment

The application is configured for deployment on:
- **Frontend**: Netlify (automatic deployment from main branch)
- **Backend**: Render (automatic deployment from main branch)
- **Database**: MongoDB Atlas (cloud-hosted)

## 🤝 Contributing

This is a private project. For access or collaboration, please contact the repository owner.

## 📄 License

Private - All rights reserved.

---

**Atomic Rose Tools** - Professional digital music e-commerce platform