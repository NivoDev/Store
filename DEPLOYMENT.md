# Production Deployment Guide

## 🚀 Deployment Overview

This application is designed for production deployment with the following architecture:

- **Frontend**: Netlify (Static site hosting)
- **Backend**: Render (Python application hosting)
- **Database**: MongoDB Atlas (Cloud database)
- **File Storage**: Cloudflare R2 (Object storage)

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Ensure all environment variables are properly configured:

#### Backend (Render)
- `MONGODB_URI` - MongoDB connection string
- `R2_ACCESS_KEY_ID` - Cloudflare R2 access key
- `R2_SECRET_ACCESS_KEY` - Cloudflare R2 secret key
- `R2_BUCKET_NAME` - R2 bucket name
- `R2_ACCOUNT_ID` - Cloudflare account ID
- `R2_PUBLIC_URL` - Public R2 URL
- `JWT_SECRET_KEY` - JWT signing secret

#### Frontend (Netlify)
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_ENVIRONMENT` - Set to "production"

### 2. Security Configuration
- [ ] All sensitive data removed from repository
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented

### 3. Database Setup
- [ ] MongoDB Atlas cluster configured
- [ ] Network access rules set
- [ ] Database user created with proper permissions
- [ ] Connection string tested

### 4. File Storage Setup
- [ ] Cloudflare R2 bucket created
- [ ] CORS policy configured
- [ ] Access keys generated
- [ ] Public URL configured

## 🔧 Deployment Steps

### Backend Deployment (Render)

1. Connect GitHub repository to Render
2. Configure build settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python simple_api.py`
3. Set environment variables in Render dashboard
4. Deploy and test API endpoints

### Frontend Deployment (Netlify)

1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build Command: `cd frontend && npm run build`
   - Publish Directory: `frontend/build`
3. Set environment variables in Netlify dashboard
4. Deploy and test frontend

### Database Migration

1. Run database setup scripts:
   ```bash
   python backend/scripts/update_product_validation.js
   python backend/scripts/add_sample_files.py
   ```
2. Verify data integrity
3. Test all database operations

## 🔒 Security Considerations

### Production Security
- Use strong, unique JWT secrets
- Implement proper CORS policies
- Enable rate limiting on all endpoints
- Use HTTPS for all communications
- Regular security updates

### Data Protection
- Encrypt sensitive data at rest
- Use secure file storage with presigned URLs
- Implement proper access controls
- Regular backup procedures

## 📊 Monitoring and Maintenance

### Health Checks
- API health endpoint: `/api/v1/health`
- Database connection monitoring
- File storage availability checks

### Logging
- Application logs for debugging
- Error tracking and monitoring
- Performance metrics

### Updates
- Regular dependency updates
- Security patches
- Feature updates and bug fixes

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Check CORS configuration in backend
2. **Database Connection**: Verify MongoDB Atlas settings
3. **File Upload Issues**: Check R2 configuration
4. **Authentication Problems**: Verify JWT secret and configuration

### Support
For production issues, check:
1. Application logs
2. Database connection status
3. Environment variable configuration
4. Network connectivity

---

**Note**: This is a production deployment guide. Ensure all security measures are in place before going live.
