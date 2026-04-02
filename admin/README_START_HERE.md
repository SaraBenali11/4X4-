# 🚀 START HERE - How to Run the Admin Application

## ⚠️ IMPORTANT: You Must Navigate to This Directory First!

You're getting errors because you're running commands from the **wrong directory**.

## Quick Start (Choose One Method)

### Method 1: Double-Click Scripts (Easiest)

1. **Navigate to this folder**: `admin\4X4-`
2. **Double-click**: `start-frontend.bat` (Windows)
   - OR `start-frontend.ps1` (PowerShell)

### Method 2: Manual Commands

**Open PowerShell or Command Prompt and type these commands EXACTLY:**

```powershell
# Step 1: Navigate to the correct directory
cd "C:\Users\haith\Desktop\Software Project\admin\4X4-"

# Step 2: Verify you're in the right place (should show package.json)
dir package.json

# Step 3: Install dependencies (first time only)
npm install

# Step 4: Start the app
npm start
```

## Why You're Getting Errors

Your error shows:
```
npm error path C:\Users\haith\Desktop\Software Project\package.json
```

This means npm is looking for `package.json` in:
- ❌ `C:\Users\haith\Desktop\Software Project\` (WRONG - no package.json here)

But `package.json` is actually in:
- ✅ `C:\Users\haith\Desktop\Software Project\admin\4X4-\` (CORRECT)

## Visual Guide

```
Software Project/                    ← You're here (WRONG)
├── admin/
│   └── 4X4-/                       ← You need to be HERE
│       ├── package.json            ← This is what npm is looking for
│       ├── start-frontend.bat      ← Double-click this!
│       └── src/
```

## Verify You're in the Right Directory

After running `cd admin\4X4-`, check:

```powershell
# Should show: C:\Users\haith\Desktop\Software Project\admin\4X4-
Get-Location

# Should list package.json
dir package.json
```

## Still Having Issues?

1. **Check your current directory:**
   ```powershell
   Get-Location
   ```

2. **Navigate step by step:**
   ```powershell
   cd admin
   cd 4X4-
   ```

3. **Verify package.json exists:**
   ```powershell
   Test-Path package.json
   ```
   Should return: `True`

4. **Then run:**
   ```powershell
   npm start
   ```

## Need Help?

- Make sure you're in: `admin\4X4-` directory
- The path should end with: `...\admin\4X4-`
- You should see `package.json` when you type `dir`

