# 📋 EXACT COMMANDS TO RUN

## Step 1: Update Supabase Database (One-Time Setup)

**Go to your Supabase Dashboard → SQL Editor and run:**

```sql
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;
```

## Step 2: Initialize Admin User (One-Time Setup)

**Open PowerShell/Command Prompt and run:**

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python scripts/init_admin.py
```

## Step 3: Start Backend Server

**Open a NEW PowerShell/Command Prompt window and run:**

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python app.py
```

**Keep this window open!** The backend will run here.

## Step 4: Start Frontend Server

**Open ANOTHER NEW PowerShell/Command Prompt window and run:**

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-"
npm start
```

**Keep this window open too!** The frontend will run here.

## Step 5: Access the Application

Open your browser and go to:
- **Login Page**: http://localhost:3000/login
- **Credentials**:
  - Email: `admin.sutraty@gmail.com`
  - Password: `SuTr@ty_Adm1n$89`

---

## Summary - Copy & Paste These Commands:

### Terminal 1 (Backend):
```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python app.py
```

### Terminal 2 (Frontend):
```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-"
npm start
```

### One-Time Setup (Run Once):
```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python scripts/init_admin.py
```

