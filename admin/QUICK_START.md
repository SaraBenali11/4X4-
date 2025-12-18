# Quick Start Guide

## Prerequisites

1. **Update Supabase Database Schema**

Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;
```

## Step 1: Initialize Admin User

```bash
cd admin/4X4-/src/backend
python scripts/init_admin.py
```

This creates the admin user:
- Email: `admin.sutraty@gmail.com`
- Password: `SuTr@ty_Adm1n$89`

## Step 2: Start Backend Server

Open a terminal and run:

```bash
cd admin/4X4-/src/backend
python app.py
```

The backend will run on `http://localhost:5000`

## Step 3: Start Frontend

Open another terminal and run:

```bash
cd admin/4X4-
npm start
```

The frontend will run on `http://localhost:3000`

## Step 4: Login

1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - Email: `admin.sutraty@gmail.com`
   - Password: `SuTr@ty_Adm1n$89`
3. You'll be redirected to the admin dashboard

## Troubleshooting

### Backend won't start
- Make sure all Python dependencies are installed: `pip install -r src/backend/requirements/requirements.txt`
- Check that port 5000 is not in use

### Frontend won't start
- Make sure all npm packages are installed: `npm install`
- Check that port 3000 is not in use

### Login fails
- Verify the admin user exists in Supabase
- Check that the database schema has been updated
- Ensure the backend server is running

### Import errors
- Make sure you're running from the correct directory
- Check that all files are in the correct locations

