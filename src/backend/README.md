# Flask Backend Setup Guide

## 📋 Prerequisites
- Python 3.7 or higher
- MySQL Server installed and running
- pip (Python package manager)

Note: This backend uses PyMySQL for database connectivity rather than `mysqlclient`/`MySQLdb` to simplify setup on Windows. If you need `mysqlclient` for production, install it separately.

## 🚀 Quick Start

### 1. Install Python Dependencies
```bash
cd src/backend
pip install -r requirements.txt
```

### 2. Setup MySQL Database

#### Option A: Using MySQL Command Line
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE sutraty;
EXIT;
```

#### Option B: Using MySQL Workbench
- Open MySQL Workbench
- Create a new database named `sutraty`

#### Option C: Using the initialization script (Recommended)
```bash
python init_db.py
```
This will automatically create the database and tables with sample data.

### Prevent re-seeding sample data on restart
By default the app will seed sample data if the `products` table is empty. To keep deletions or edits persistent across restarts, you can disable seeding:

- Add to your `.env` file: `SKIP_DB_SEED=true` to stop seeding on app startup.
- Or run the init script without seeding: `python init_db.py --skip-seed`.

If neither of these is set and the `products` table is empty at startup, the sample products will be re-inserted.

### 3. Configure Database Connection

#### Option A: Using Environment Variables (Recommended)
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and update with your MySQL credentials:
```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=sutraty
```

#### Option B: Direct Configuration
Edit `app.py` and update these lines (around line 20-24):
```python
app.config['MYSQL_HOST'] = 'localhost'      # Your MySQL host
app.config['MYSQL_USER'] = 'root'           # Your MySQL username
app.config['MYSQL_PASSWORD'] = 'your_password'  # Your MySQL password
app.config['MYSQL_DB'] = 'sutraty'          # Database name
```

### 4. Run the Server
```bash
python app.py
```

The server will:
- Automatically create the `products` table if it doesn't exist
- Start on `http://localhost:5000`
- API endpoints available at `http://localhost:5000/api/products`

## 📡 Quick endpoint checks

If you're on Windows and the server is running, you can quickly test the API endpoints using the included PowerShell script from the `src/backend` directory:

```powershell
cd src/backend
./check_routes.ps1
```

If you have Python installed, there's also a quick helper to inspect Flask routes directly (run from `src/backend`):

```bash
python check_routes.py
```

You should see output like:
```
Initializing database tables...
Starting Flask server...
API available at http://localhost:5000/api/products
Health check at http://localhost:5000/api/health
```

## 📡 API Endpoints

### GET /api/health
Check if backend is running and database is connected
```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "success",
  "message": "Backend is healthy",
  "database": "connected"
}
```

### GET /api/products
Get all products
```bash
curl http://localhost:5000/api/products
```

Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Abaya Élégante Beige",
      "category": "Abaya",
      "price": 8500,
      "sizes": ["S", "M", "L"],
      "colors": ["Beige", "Noir"],
      "images": [],
      "isNew": true,
      "isBestSeller": false,
      "createdAt": "2024-01-15T10:30:00"
    }
  ],
  "count": 1
}
```

### POST /api/products
Add a new product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Abaya Élégante Beige",
    "category": "Abaya",
    "price": 8500,
    "sizes": ["S", "M", "L"],
    "colors": ["Beige", "Noir"],
    "images": [],
    "isNew": true,
    "isBestSeller": false
  }'
```

Response:
```json
{
  "status": "success",
  "message": "Product added successfully",
  "data": {
    "id": 2
  }
}
```

### GET /api/products/<id>
Get a single product by ID
```bash
curl http://localhost:5000/api/products/1
```

Response:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Abaya Élégante Beige",
    "category": "Abaya",
    "price": 8500,
    "sizes": ["S", "M", "L"],
    "colors": ["Beige", "Noir"],
    "images": [],
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

### PUT /api/products/<id>
Update a product
```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 9000,
    "isBestSeller": true
  }'
```

Response:
```json
{
  "status": "success",
  "message": "Product updated successfully"
}
```

### DELETE /api/products/<id>
Delete a product
```bash
curl -X DELETE http://localhost:5000/api/products/1
```

Response:
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

## 🗄️ Database Schema

The `products` table has the following structure:
- `id` - Auto-increment primary key
- `name` - Product name (VARCHAR 255)
- `category` - Product category (VARCHAR 100)
- `price` - Product price (DECIMAL 10,2)
- `sizes` - Available sizes (TEXT, comma-separated)
- `colors` - Available colors (TEXT, comma-separated)
- `images` - Product images (TEXT, comma-separated URLs)
- `is_new` - New product flag (TINYINT)
- `is_best_seller` - Best seller flag (TINYINT)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🔧 Troubleshooting

### MySQL Connection Error
**Error:** `Database not connected. Please check MySQL setup.`

**Solution:**
1. Verify MySQL is running:
   - Windows: Check Services or run `mysql -u root -p`
   - Mac: `brew services list`
   - Linux: `sudo systemctl status mysql`

2. Check credentials in `.env` file
3. Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Table Not Found Error
**Error:** `Table 'sutraty.products' doesn't exist`

**Solution:**
Run the initialization script:
```bash
python init_db.py
```

Or let `init_db.py` create the database and use the SQLAlchemy seeder to create tables and seed sample data.

### Port Already in Use
**Error:** `Address already in use`

**Solution:**
The backend is already running on port 5000. Either:
1. Stop the existing process
2. Change the port in `app.py` (line 280): `app.run(debug=True, host='0.0.0.0', port=5001)`

### CORS Issues
If frontend can't connect to backend, ensure CORS is enabled (it is by default in `app.py`).

## 📝 Environment Variables

Create a `.env` file in the backend directory with:
```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=sutraty
```

### Update seed files (administrative)
By default the application will not modify seed source files at runtime. For controlled updates to seed files (for example, when you want to keep development mock files in sync with your DB changes), you can:

- Use the administrative endpoint:
  - POST /api/admin/seed-edit (see JSON contract below) and provide the `X-ADMIN-TOKEN` header set to the `ADMIN_API_TOKEN` value in `.env`.
  - This endpoint is a guarded way to request add/remove/update operations on `data.py` and `adminData.js`.
- Use the CLI updater for manual operations in the repo: `python src/backend/scripts/seed_updater.py --name "Product Name" --dry-run`.

This is safer than auto-updating seed files during normal API operations and is meant for dev/ops convenience only.

Admin endpoint JSON contract (dry_run default true):
```
POST /api/admin/seed-edit
Header: X-ADMIN-TOKEN: <ADMIN_API_TOKEN>
Body (JSON): {
  "action": "add" | "remove" | "update",
  "target": "py" | "js" | "both",
  "payload": { ... },
  "dry_run": true | false
}
```

Use this with caution: modifying source files from runtime is uncommon and can surprise other developers. Prefer `--skip-seed` and manual edits in production.

### Frontend offline persistence and sync
If you are running the frontend without the backend (or have a temporary connectivity issue), the admin product list uses a local fallback and allows offline edits. To persist them across refreshes, the admin panel stores local edits in `localStorage` and provides a "Synchroniser" button to push local changes when the backend becomes available.

Troubleshooting tips:
- If you delete an item and it reappears after refresh, check whether the frontend banner shows "Mode hors ligne". If so, use the `Synchroniser` button to push local changes once backend connectivity is restored.
- If your backend restarts with an in-memory DB (e.g., `sqlite:///:memory:`), data will not persist across restarts. Use a file-based sqlite or a persistent DB (MySQL) for stable storage.

### Manually update seed files
You can remove a product from both seed files using the included helper script.

From the repo root, run (dry-run to preview):
```bash
python src/backend/scripts/seed_updater.py --name "Abaya Élégante Beige" --dry-run
```

To apply the change:
```bash
python src/backend/scripts/seed_updater.py --name "Abaya Élégante Beige"
```

You can also target by id (frontend id) with `--id 2`.


## 🚀 Production Deployment

For production, modify `app.py` line 280:
```python
app.run(debug=False, host='0.0.0.0', port=5000)
```

Consider using a production WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [PyMySQL Documentation](https://pymysql.readthedocs.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
