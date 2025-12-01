# Sutraty Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        SUTRATY ONLINE SHOP                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                            │
│                   http://localhost:3000                          │
│                                                                  │
│  ┌────────────────────────────────────────────────────���────┐   │
│  │  Components:                                            │   │
│  │  - Homepage                                             │   │
│  │  - Product Listing                                      │   │
│  │  - Product Detail                                       │   │
│  │  - Admin Panel                                          │   │
│  │  - Shopping Cart                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              ↕
                         (HTTP/REST)
                              ↕
┌──────────────────────────────────────────────────────────────────┐
│                      BACKEND (Flask)                             │
│                   http://localhost:5000                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  API Endpoints:                                         │   │
│  │  - GET    /api/products          (Get all products)    │   │
│  │  - POST   /api/products          (Create product)      │   │
│  │  - GET    /api/products/<id>     (Get product by ID)   │   │
│  │  - PUT    /api/products/<id>     (Update product)      │   │
│  │  - DELETE /api/products/<id>     (Delete product)      │   │
│  │  - GET    /api/health            (Health check)        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Core Components:                                       │   │
│  │  - app.py (Main Flask application)                      │   │
│  │  - config.py (Configuration management)                │   │
│  │  - init_db.py (Database initialization)                │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              ↕
                         (MySQL Protocol)
                              ↕
┌──────────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                            │
│                   localhost:3306                                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Database: sutraty                                      │   │
│  │                                                         │   │
│  ���  Tables:                                                │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ products                                         │  │   │
│  │  ├──────────────────────────────────────────────────┤  │   │
│  │  │ id (INT, PK)                                     │  │   │
│  │  │ name (VARCHAR)                                   │  │   │
│  │  │ category (VARCHAR)                               │  │   │
│  │  │ price (DECIMAL)                                  │  │   │
│  │  │ sizes (TEXT)                                     │  │   │
│  │  │ colors (TEXT)                                    │  │   │
│  │  │ images (TEXT)                                    │  │   │
│  │  │ is_new (TINYINT)                                 │  │   │
│  │  │ is_best_seller (TINYINT)                         │  │   │
│  │  │ created_at (TIMESTAMP)                           │  │   │
│  │  │ updated_at (TIMESTAMP)                           │  │   │
│  │  └���─────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Getting Products
```
Frontend (React)
    ↓
fetch('/api/products')
    ↓
Backend (Flask)
    ↓
Query: SELECT * FROM products
    ↓
MySQL Database
    ↓
Return JSON array
    ↓
Frontend displays products
```

### 2. Creating Product
```
Frontend (React)
    ↓
POST /api/products
{name, category, price, ...}
    ↓
Backend (Flask)
    ↓
Validate data
    ↓
INSERT INTO products
    ↓
MySQL Database
    ↓
Return success + product ID
    ↓
Frontend updates UI
```

### 3. Updating Product
```
Frontend (React)
    ↓
PUT /api/products/<id>
{updated fields}
    ↓
Backend (Flask)
    ↓
Validate data
    ↓
UPDATE products WHERE id = <id>
    ↓
MySQL Database
    ↓
Return success
    ↓
Frontend updates UI
```

## Technology Stack

### Frontend
- **Framework:** React 19.2.0
- **Build Tool:** Create React App
- **UI Components:** React Icons, Lucide React
- **Port:** 3000

### Backend
- **Framework:** Flask 2.3.3
- **Database Driver:** PyMySQL (via pymysql module)
- **CORS:** Flask-CORS 4.0.0
- **Environment:** python-dotenv 1.0.0
- **Port:** 5000

### Database
- **System:** MySQL
- **Database Name:** sutraty
- **Port:** 3306

## File Organization

```
sutraty/
├── src/
│   ├── backend/
│   │   ├── app.py                 # Main Flask app
│   │   ├── config.py              # Configuration
│   │   ├── init_db.py             # DB initialization
│   │   ├── test_backend.py        # Test suite
│   │   ├── requirements.txt       # Python dependencies
│   │   ├── .env.example           # Environment template
│   │   ├── run.bat                # Windows startup
│   │   ├── run.sh                 # Unix startup
│   │   └── README.md              # API docs
│   │
│   └── frontend/
│       ├── views/
│       │   ├── components/        # React components
│       │   ├── pages/             # Page components
│       │   └── styles/            # CSS files
│       ├── assets/                # Images, fonts
│       ├── App.js                 # Main app component
│       └── index.js               # Entry point
│
├── public/                        # Static files
├── package.json                   # Frontend dependencies
├── QUICK_START.md                 # Quick start guide
├── BACKEND_SETUP.md               # Backend setup guide
├── BACKEND_IMPLEMENTATION.md      # Implementation details
└── ARCHITECTURE.md                # This file
```

## API Response Format

### Success Response
```json
{
  "status": "success",
  "data": [...],
  "count": 10
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "data": [],
  "count": 0
}
```

## Environment Configuration

```
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=sutraty
```

## Deployment Considerations

### Frontend
- Build: `npm run build`
- Deploy to: Vercel, Netlify, AWS S3, etc.
- Environment: Production React build

### Backend
- Use Gunicorn for production WSGI server
- Set `DEBUG=False` in production
- Use environment variables for credentials
- Consider using Docker for containerization

## Security Considerations

1. **Environment Variables:** Never commit `.env` file
2. **CORS:** Configure allowed origins in production
3. **Input Validation:** All inputs validated on backend
4. **SQL Injection:** Using parameterized queries
5. **Error Messages:** Generic messages in production
6. **HTTPS:** Use HTTPS in production

## Performance Optimization

1. **Database Indexing:** Add indexes on frequently queried columns
2. **Caching:** Implement caching for product listings
3. **Pagination:** Add pagination for large product lists
4. **Compression:** Enable gzip compression
5. **CDN:** Use CDN for static assets

## Monitoring & Logging

1. **Health Check:** `/api/health` endpoint
2. **Error Logging:** Log errors to file or service
3. **Request Logging:** Log all API requests
4. **Database Monitoring:** Monitor query performance

---
