# ✅ How to Verify Backend is Connected Correctly

## Step 1: Check if Backend is Running

Open your browser and go to:
```
http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Backend is healthy",
  "database": "connected"
}
```

If you see this, the backend is running correctly! ✅

---

## Step 2: Test Admin Password Verification Endpoint

You can test the login endpoint directly:

**Method 1: Using Browser**
Go to: `http://localhost:5000/api/admin/verify-password`
(Note: This is a POST endpoint, so browser won't work directly)

**Method 2: Using PowerShell**
```powershell
$body = @{
    email = "admin.sutraty@gmail.com"
    password = "SuTr@ty_Adm1n$89"
    password_hash = "your_hash_here"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/verify-password" -Method POST -Body $body -ContentType "application/json"
```

---

## Step 3: Check Backend Logs

In the PowerShell window where you ran `python app.py`, you should see:

```
Starting Flask server...
API available at http://localhost:5000/api/products
Health check at http://localhost:5000/api/health
Running on http://0.0.0.0:5000
 * Serving Flask app 'app'
 * Debug mode: on
```

If you see these messages, the backend is running! ✅

---

## Step 4: Test Login in Frontend

1. Go to: http://localhost:3000/login
2. Enter:
   - Email: `admin.sutraty@gmail.com`
   - Password: `SuTr@ty_Adm1n$89`
3. Click "Se connecter"

If login works, everything is connected correctly! ✅

---

## Common Issues

### Backend Not Starting
- Check if port 5000 is already in use
- Make sure all dependencies are installed: `pip install -r requirements/requirements.txt`

### Health Check Fails
- Wait 10-15 seconds after starting the backend
- Check the backend terminal for error messages

### Login Still Fails
- Verify backend is running: http://localhost:5000/api/health
- Check browser console (F12) for errors
- Verify admin user exists in Supabase

---

## Quick Verification Checklist

- [ ] Backend server running (check http://localhost:5000/api/health)
- [ ] Frontend server running (check http://localhost:3000)
- [ ] Admin user exists in Supabase
- [ ] Database columns (name, phone, address) added
- [ ] All Python dependencies installed

All checked? You're good to go! 🚀

