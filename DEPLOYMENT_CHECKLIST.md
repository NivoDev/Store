# 🚀 Deployment Checklist for Atomic Rose Tools Store

## ✅ **Pre-Deployment Checklist**

### **Frontend (Netlify)**
- [x] **Homepage URL**: Updated to `https://atomic-rose-tools.netlify.app`
- [x] **API Base URL**: Configured for production (needs backend URL update)
- [x] **Build Process**: Tested and working (`npm run build`)
- [x] **Error Handling**: Added database connection error handling
- [x] **Environment Variables**: Ready for production

### **Backend (Your Choice)**
- [x] **MongoDB Error Handling**: Server continues running even if DB is unavailable
- [x] **Health Check**: `/health` endpoint shows database status
- [x] **CORS**: Configured for production
- [x] **Error Responses**: Proper 503 responses for database issues

## 🔧 **Required Changes Before Deployment**

### **1. Update Backend URL in Frontend**
**File**: `/frontend/src/services/api.js` (Line 11)
```javascript
// Change this line:
? 'https://your-backend-url.com/api/v1'  // Update this to your actual backend URL

// To your actual backend URL, for example:
? 'https://your-app-name.herokuapp.com/api/v1'
// OR
? 'https://your-app-name.railway.app/api/v1'
// OR
? 'https://your-app-name.onrender.com/api/v1'
```

### **2. Backend Environment Variables**
Make sure your backend has these environment variables set:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atomic_rose
JWT_SECRET=your-jwt-secret-key
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_ACCOUNT_ID=your-account-id
R2_PUBLIC_URL=https://your-public-url.com
MAX_DOWNLOADS_PER_USER=3
```

### **3. CORS Configuration**
**File**: `/backend/simple_api.py` (Line 84-88)
```python
# Update this for production:
allow_origins=["https://atomic-rose-tools.netlify.app"]  # Add your frontend URL
allow_credentials=True,  # Can be True for production
```

## 🚀 **Deployment Steps**

### **Frontend (Netlify)**
1. **Connect Repository**: Connect your GitHub repo to Netlify
2. **Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `frontend/build`
   - Node Version: `20.x`
3. **Environment Variables** (in Netlify dashboard):
   - `REACT_APP_API_BASE_URL`: `https://your-backend-url.com/api/v1`

### **Backend (Choose One)**
#### **Option A: Railway**
1. Connect GitHub repo
2. Set environment variables
3. Deploy from `backend/` directory

#### **Option B: Render**
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && python simple_api.py`
5. Set environment variables

#### **Option C: Heroku**
1. Create new app
2. Connect GitHub repo
3. Set buildpacks: `python` and `nodejs`
4. Set environment variables
5. Deploy from `backend/` directory

## 🔍 **Post-Deployment Testing**

### **1. Health Check**
- Visit: `https://your-backend-url.com/health`
- Should return: `{"status": "healthy", "database": "connected", "timestamp": "..."}`

### **2. Frontend Testing**
- Visit: `https://atomic-rose-tools.netlify.app`
- Test: Product loading, user registration, login, cart functionality
- Check: Console for any API errors

### **3. Database Testing**
- Test: User registration and login
- Test: Product purchase flow
- Test: Download functionality

## 🛠️ **Troubleshooting**

### **Common Issues**
1. **CORS Errors**: Update `allow_origins` in backend
2. **API 404**: Check backend URL in frontend
3. **Database Errors**: Check MongoDB connection string
4. **Build Failures**: Check Node.js version compatibility

### **Environment Variables**
- **Frontend**: Set in Netlify dashboard
- **Backend**: Set in your hosting platform dashboard
- **MongoDB**: Ensure connection string is correct
- **R2**: Verify all R2 credentials are set

## 📝 **Notes**
- The website will gracefully handle MongoDB connection issues
- Users will see appropriate error messages if database is unavailable
- All API endpoints check database connection before processing
- Health check endpoint shows real-time database status

## 🎯 **Ready for GitHub Push**
All files are cleaned up and ready for deployment. The main thing left is updating the backend URL in the frontend API service.
