# 🚀 Servers Started!

## Status

✅ **Backend Server (Flask)**: Starting on `http://localhost:5000`
✅ **Frontend Server (React)**: Starting on `http://localhost:3000`

## Access Your Application

1. **Frontend (Admin Panel)**: 
   - URL: http://localhost:3000
   - Login Page: http://localhost:3000/login

2. **Backend API**: 
   - URL: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## Login Credentials

- **Email**: `admin.sutraty@gmail.com`
- **Password**: `SuTr@ty_Adm1n$89`

## Important Notes

⚠️ **Before logging in, make sure you have:**

1. **Updated Supabase Database Schema** - Run this SQL in Supabase:
   ```sql
   ALTER TABLE admins 
   ADD COLUMN IF NOT EXISTS name TEXT,
   ADD COLUMN IF NOT EXISTS phone TEXT,
   ADD COLUMN IF NOT EXISTS address TEXT;
   ```

2. **Initialized Admin User** - If you haven't already:
   ```bash
   cd admin/4X4-/src/backend
   python scripts/init_admin.py
   ```

## What to Do Next

1. Open your browser
2. Go to: http://localhost:3000/login
3. Enter the credentials above
4. You'll be redirected to the admin dashboard

## If You See Errors

- **Backend not responding**: Check if port 5000 is available
- **Frontend not loading**: Check if port 3000 is available
- **Login fails**: Make sure the admin user exists in Supabase and the schema is updated

## Stopping the Servers

Press `Ctrl+C` in the terminal windows where the servers are running, or close those terminal windows.

