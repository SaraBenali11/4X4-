# 🔍 Where to Check Supabase Connection Info

## Frontend Connection (React)

**File Location:** `admin/4X4-/src/frontend/config/supabase.js`

Current settings:
```javascript
const supabaseUrl = 'https://ijqhxzcsngpsodslijmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Backend Connection (Flask)

**File Location:** `admin/4X4-/src/backend/config/supabase_config.py`

Current settings:
```python
SUPABASE_URL = 'https://ijqhxzcsngpsodslijmd.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

---

## How to Verify Your Supabase Credentials

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard
2. Select your project: `ijqhxzcsngpsodslijmd`
3. Click **Settings** (gear icon) → **API**

### Step 2: Check Your Credentials

You should see:
- **Project URL**: `https://ijqhxzcsngpsodslijmd.supabase.co`
- **anon public key**: Should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 3: Compare with Code

Make sure these match:
- ✅ Project URL in code = Project URL in Supabase
- ✅ API Key in code = anon public key in Supabase

---

## Test Supabase Connection

Run this command to test:

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python test_supabase_connection.py
```

This will show:
- ✅ If Supabase connection works
- ✅ If admin user exists
- ✅ If all columns are present

---

## Common Issues

### Issue 1: Wrong API Key
- **Symptom**: Connection fails
- **Fix**: Update the key in `supabase_config.py` and `supabase.js`

### Issue 2: Wrong Project URL
- **Symptom**: Connection fails
- **Fix**: Update the URL in both config files

### Issue 3: Backend Not Running
- **Symptom**: "Erreur de connexion"
- **Fix**: Start backend: `python app.py`

---

## Quick Check Commands

```powershell
# Test Supabase connection
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python test_supabase_connection.py

# Check if backend is running
netstat -ano | Select-String ":5000"

# Test backend health
Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing
```

