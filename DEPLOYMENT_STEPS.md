# 🚀 Step-by-Step Deployment Guide

## 📋 **Prerequisites**
- GitHub repository with your code
- Render account (for backend)
- Netlify account (for frontend)

---

## 🔧 **Step 1: Deploy Backend to Render**

### **1.1 Create Render Service**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

### **1.2 Configure Render Settings**
```
Name: atomic-rose-backend
Environment: Python 3
Region: Choose closest to your users
Branch: main (or your default branch)
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: python simple_api.py
```

### **1.3 Set Environment Variables in Render**
Go to **Environment** tab and add:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atomic_rose
JWT_SECRET=your-super-secret-jwt-key-here
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_ACCOUNT_ID=your-account-id
R2_PUBLIC_URL=https://your-public-url.com
MAX_DOWNLOADS_PER_USER=3
```

### **1.4 Deploy**
- Click **"Create Web Service"**
- Wait for deployment to complete
- **Copy your backend URL** (e.g., `https://atomic-rose-backend.onrender.com`)

---

## 🌐 **Step 2: Deploy Frontend to Netlify**

### **2.1 Create Netlify Site**
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub repository

### **2.2 Configure Netlify Settings**
```
Repository: your-github-username/your-repo-name
Branch to deploy: main
Base directory: frontend
Build command: npm run build
Publish directory: frontend/build
```

### **2.3 Set Environment Variables in Netlify**
Go to **Site settings** → **Environment variables** and add:
```
REACT_APP_API_BASE_URL=https://your-backend-url.onrender.com/api/v1
```
**Replace `your-backend-url` with your actual Render URL!**

### **2.4 Deploy**
- Click **"Deploy site"**
- Wait for deployment to complete
- **Copy your frontend URL** (e.g., `https://atomic-rose-tools.netlify.app`)

---

## 🔗 **Step 3: Update CORS Settings**

### **3.1 Update Backend CORS**
In your local code, update `/backend/simple_api.py`:
```python
# Line 84-88, change to:
allow_origins=["https://atomic-rose-tools.netlify.app"]  # Your Netlify URL
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
```

### **3.2 Commit and Push Changes**
```bash
git add .
git commit -m "Update CORS for production deployment"
git push origin main
```

### **3.3 Redeploy Backend**
- Render will automatically redeploy when you push
- Or manually trigger redeploy in Render dashboard

---

## ✅ **Step 4: Test Everything**

### **4.1 Test Backend**
Visit: `https://your-backend-url.onrender.com/health`
Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000000"
}
```

### **4.2 Test Frontend**
Visit: `https://atomic-rose-tools.netlify.app`
- Should load without errors
- Test user registration
- Test product browsing
- Test cart functionality

### **4.3 Test Integration**
- Register a new user
- Add products to cart
- Complete a purchase
- Check if everything works end-to-end

---

## 🎯 **Summary of URLs**

After deployment, you'll have:
- **Frontend**: `https://atomic-rose-tools.netlify.app`
- **Backend**: `https://your-backend-url.onrender.com`
- **Health Check**: `https://your-backend-url.onrender.com/health`

---

## 🚨 **Important Notes**

1. **Update Backend URL**: Make sure to update the `REACT_APP_API_BASE_URL` in Netlify with your actual Render backend URL
2. **CORS Configuration**: Update the CORS settings in your backend to allow your Netlify domain
3. **Environment Variables**: Double-check all environment variables are set correctly
4. **Database**: Ensure your MongoDB Atlas cluster allows connections from Render's IP ranges

---

## 🔧 **Troubleshooting**

### **Common Issues:**
- **CORS Errors**: Check that your frontend URL is in the backend's CORS settings
- **API 404**: Verify the `REACT_APP_API_BASE_URL` is correct
- **Database Errors**: Check MongoDB connection string and IP whitelist
- **Build Failures**: Check Node.js version compatibility

### **Debug Steps:**
1. Check Render logs for backend errors
2. Check Netlify build logs for frontend errors
3. Check browser console for API errors
4. Test backend health endpoint directly
