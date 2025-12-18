# Admin Integration with Supabase

This document describes the admin authentication and profile management system integrated with Supabase.

## Features

- ✅ Password hashing using bcrypt
- ✅ Admin authentication with Supabase
- ✅ Admin profile management (name, email, phone, address)
- ✅ Protected routes
- ✅ Session management

## Setup Instructions

### 1. Database Schema Update

First, update your Supabase `admins` table to include profile fields:

```sql
-- Add profile fields to admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;
```

### 2. Initialize Admin User

Run the initialization script to create the admin user:

```bash
cd admin/4X4-/src/backend
python scripts/init_admin.py
```

This creates an admin with:
- **Email**: `admin.sutraty@gmail.com`
- **Password**: `SuTr@ty_Adm1n$89`
- **Name**: `Admin Sutraty`

### 3. Start the Backend Server

```bash
cd admin/4X4-/src/backend
python app.py
```

The backend will run on `http://localhost:5000`

### 4. Start the Frontend

```bash
cd admin/4X4-
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
admin/4X4-/
├── src/
│   ├── frontend/
│   │   ├── config/
│   │   │   └── supabase.js          # Supabase client configuration
│   │   ├── services/
│   │   │   └── adminService.js       # Admin authentication service
│   │   ├── context/
│   │   │   └── AdminAuthContext.jsx  # Authentication context provider
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx   # Route protection component
│   │   └── views/
│   │       └── adminview/
│   │           ├── components/
│   │           │   ├── AdminLogin.jsx           # Login component
│   │           │   └── adminprofile/
│   │           │       └── adminprofile.jsx     # Profile management
│   │           └── app2.js                      # Main app with routes
│   └── backend/
│       ├── config/
│       │   └── supabase_config.py   # Supabase backend config
│       ├── utils/
│       │   └── password_utils.py     # Password hashing utilities
│       ├── controllers/
│       │   └── admin.py              # Admin API endpoints
│       └── scripts/
│           └── init_admin.py         # Admin initialization script
```

## API Endpoints

### Authentication

- `POST /api/admin/verify-password` - Verify admin password
  - Body: `{ "email": "...", "password": "...", "password_hash": "..." }`

### Profile Management

- `GET /api/admin/profile/<admin_id>` - Get admin profile
- `PUT /api/admin/profile/<admin_id>` - Update admin profile
  - Body: `{ "name": "...", "email": "...", "phone": "...", "address": "..." }`

## Frontend Routes

- `/login` - Admin login page
- `/admin` - Admin dashboard (protected)
- `/userinfo` - Admin profile page (protected)

## Authentication Flow

1. User enters email and password on login page
2. Frontend calls `adminService.login()`
3. Service fetches admin from Supabase by email
4. Backend verifies password using bcrypt
5. On success, admin data is stored in localStorage
6. User is redirected to `/admin` dashboard
7. Protected routes check authentication via `AdminAuthContext`

## Profile Management

Admins can update their profile information:
- Name
- Email
- Phone
- Address

Changes are saved to Supabase and the local session is updated.

## Security Features

- Passwords are hashed using bcrypt
- Password hashes are never sent to frontend
- Authentication tokens stored in localStorage
- Protected routes require authentication
- Session validation on page load

## Environment Variables

Create a `.env` file in `admin/4X4-/src/backend/` (optional, defaults are set):

```env
SUPABASE_URL=https://ijqhxzcsngpsodslijmd.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

## Troubleshooting

### Admin login fails
- Verify the admin user exists in Supabase
- Check that password hash is correct
- Ensure backend server is running

### Profile update fails
- Verify the `admins` table has `name`, `phone`, and `address` columns
- Check Supabase connection
- Review backend logs for errors

### Protected routes redirect to login
- Clear localStorage and login again
- Check that `adminService.isAuthenticated()` returns true

