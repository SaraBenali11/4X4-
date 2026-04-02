# Database Migration Guide

## Supabase Admin Table Schema Update

The `admins` table needs to be updated to include profile fields. Run the following SQL in your Supabase SQL Editor:

```sql
-- Add profile fields to admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;
```

## Initialize Admin User

After updating the schema, run the initialization script to create the admin user:

```bash
cd admin/4X4-/src/backend
python scripts/init_admin.py
```

This will create an admin user with:
- Email: `admin.sutraty@gmail.com`
- Password: `SuTr@ty_Adm1n$89`
- Name: `Admin Sutraty`

The password will be properly hashed using bcrypt.

