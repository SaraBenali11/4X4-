# 🔧 Fix: Login Error "Erreur de connexion"

## The Problem

You're seeing: **"Erreur de connexion. Veuillez réessayer."**

This happens because the **backend server is not running**.

The login process needs:
1. ✅ Frontend (React) - Running on port 3000
2. ❌ Backend (Flask) - **NOT running on port 5000**

## ✅ Solution: Start the Backend Server

### Option 1: I'll Start It For You
The backend server is now starting automatically.

### Option 2: Start It Manually

Open a **NEW PowerShell window** and run:

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python app.py
```

You should see:
```
Starting Flask server...
API available at http://localhost:5000/api/products
Health check at http://localhost:5000/api/health
Running on http://0.0.0.0:5000
```

**Keep this window open!** The backend must stay running.

## Verify Backend is Running

After starting, wait 5-10 seconds, then check:

1. **Open browser**: http://localhost:5000/api/health
2. **You should see**: `{"status":"success","message":"Backend is healthy"...}`

## Then Try Login Again

1. Go to: http://localhost:3000/login
2. Enter credentials:
   - Email: `admin.sutraty@gmail.com`
   - Password: `SuTr@ty_Adm1n$89`
3. Click "Se connecter"

It should work now! ✅

---

## Why This Happens

The login process:
1. Gets admin from Supabase ✅
2. Sends password to backend for verification ❌ (backend not running)
3. Backend verifies password with bcrypt ❌
4. Returns success/failure ❌

Without the backend, step 2 fails, causing the error.

---

## Quick Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Admin user exists in Supabase
- [ ] Database columns (name, phone, address) added

All must be ✅ for login to work!

