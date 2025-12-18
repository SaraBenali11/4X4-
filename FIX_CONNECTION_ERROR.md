# 🔧 Fix: "Erreur de connexion" Error

## The Problem

The error "Erreur de connexion. Veuillez réessayer." happens because:

1. ✅ **Supabase connection**: Working (we tested it)
2. ❌ **Backend server**: NOT running on port 5000

The login process needs BOTH:
- Supabase (to get admin user) ✅
- Backend (to verify password) ❌

---

## Where Supabase Connection Info Is

### Frontend (React)
**File:** `admin/4X4-/src/frontend/config/supabase.js`

```javascript
const supabaseUrl = 'https://ijqhxzcsngpsodslijmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Backend (Flask)
**File:** `admin/4X4-/src/backend/config/supabase_config.py`

```python
SUPABASE_URL = 'https://ijqhxzcsngpsodslijmd.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

---

## ✅ Solution: Start the Backend Server

### Step 1: Open a NEW PowerShell Window

### Step 2: Run These Commands

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python app.py
```

### Step 3: You Should See

```
Starting Flask server...
API available at http://localhost:5000/api/products
Health check at http://localhost:5000/api/health
Running on http://0.0.0.0:5000
```

**Keep this window open!** The backend must stay running.

### Step 4: Verify Backend is Running

Open browser: http://localhost:5000/api/health

Should see: `{"status":"success"...}`

### Step 5: Try Login Again

1. Go to: http://localhost:3000/login
2. Enter credentials
3. Click "Se connecter"

It should work now! ✅

---

## Why This Happens

The login flow:
1. Frontend gets admin from Supabase ✅
2. Frontend sends password to backend for verification ❌ (backend not running)
3. Backend verifies password with bcrypt ❌
4. Returns success/failure ❌

**Without backend, step 2 fails → "Erreur de connexion"**

---

## Quick Test Commands

```powershell
# Test Supabase connection
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python test_supabase_connection.py

# Check if backend is running
netstat -ano | Select-String ":5000"

# Test backend
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

---

## Summary

- ✅ Supabase: Connected correctly
- ❌ Backend: **MUST BE RUNNING**
- 🔧 Fix: Start backend with `python app.py`
- ✅ Then: Login will work

**The Supabase connection is fine. You just need to start the backend server!**

