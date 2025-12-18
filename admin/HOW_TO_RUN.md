# How to Run the Admin Application

## ⚠️ IMPORTANT: You Must Be in the Correct Directory

The `package.json` file is located in:
```
C:\Users\haith\Desktop\Software Project\admin\4X4-\
```

**NOT** in:
```
C:\Users\haith\Desktop\Software Project\
```

## Step-by-Step Instructions

### Step 1: Navigate to the Correct Directory

Open PowerShell or Command Prompt and run:

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-"
```

Or use the shorter path:
```powershell
cd admin\4X4-
```
(if you're already in `C:\Users\haith\Desktop\Software Project`)

### Step 2: Install Dependencies (if not already installed)

```powershell
npm install
```

### Step 3: Start the Frontend

```powershell
npm start
```

This will start the React development server on `http://localhost:3000`

## For Backend (Separate Terminal)

Open a **NEW** terminal window and run:

```powershell
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-\src\backend"
python app.py
```

## Quick Reference

**Frontend commands** (run from `admin\4X4-`):
- `npm install` - Install dependencies
- `npm start` - Start development server
- `npm run build` - Build for production

**Backend commands** (run from `admin\4X4-\src\backend`):
- `python app.py` - Start Flask server
- `python scripts/init_admin.py` - Initialize admin user

## Common Error Fix

If you see:
```
npm error enoent Could not read package.json
```

**Solution**: Make sure you're in the `admin\4X4-` directory, not the root project directory.

Check your current directory:
```powershell
pwd
# or
Get-Location
```

You should see: `C:\Users\haith\Desktop\Software Project\admin\4X4-`

