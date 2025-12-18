# 📝 Step-by-Step: Add Columns to Admins Table

## Current Table Structure
Your `admins` table currently has:
- ✅ `id` (uuid)
- ✅ `email` (text)
- ✅ `password_hash` (text)
- ✅ `created_at` (timestamp)

## Missing Columns (Need to Add)
- ❌ `name` (text)
- ❌ `phone` (text)
- ❌ `address` (text)

---

## Method 1: Using SQL Editor (FASTEST - Recommended)

### Step 1: Open SQL Editor
1. In Supabase Dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### Step 2: Paste This SQL
```sql
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;
```

### Step 3: Run It
- Click the **"Run"** button (or press **F5**)
- You should see: **"Success. No rows returned"**

### Step 4: Verify
Go back to Table Editor → `admins` table
You should now see 7 columns instead of 4!

---

## Method 2: Using Table Editor UI

### Add `name` Column:
1. In Table Editor, click the **+** icon next to `created_at`
2. Fill in:
   - **Name**: `name`
   - **Type**: `text`
   - **Nullable**: ✅ (checked)
3. Click **Save**

### Add `phone` Column:
1. Click the **+** icon again
2. Fill in:
   - **Name**: `phone`
   - **Type**: `text`
   - **Nullable**: ✅ (checked)
3. Click **Save**

### Add `address` Column:
1. Click the **+** icon again
2. Fill in:
   - **Name**: `address`
   - **Type**: `text`
   - **Nullable**: ✅ (checked)
3. Click **Save**

---

## After Adding Columns

Run the init script again:

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python scripts/init_admin.py
```

It should work now! ✅

