# 🔧 Fix: Database Column Error

## The Problem

You're getting this error:
```
Could not find the 'address' column of 'admins' in the schema cache
```

This means the `admins` table in Supabase is missing the profile columns.

## ✅ Solution: Update Supabase Schema

### Step 1: Go to Supabase Dashboard

1. Open https://supabase.com/dashboard
2. Select your project: `ijqhxzcsngpsodslijmd`
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run This SQL Command

Copy and paste this into the SQL Editor:

```sql
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;
```

### Step 3: Click "Run" or Press F5

You should see: "Success. No rows returned"

### Step 4: Verify Columns Were Added

Run this to check:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admins';
```

You should see `name`, `phone`, and `address` in the results.

### Step 5: Run the Init Script Again

Now go back to PowerShell and run:

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python scripts/init_admin.py
```

This time it should work! ✅

---

## Quick Copy-Paste SQL

```sql
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;
```

**That's it!** Just run this in Supabase SQL Editor, then run the init script again.

