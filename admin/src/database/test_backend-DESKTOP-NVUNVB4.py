# Backend Testing Script
# This script tests if the backend is properly configured and running

import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_python_version():
    """Test if Python version is compatible"""
    print("Testing Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 7:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor} - FAILED (requires 3.7+)")
        return False

def test_dependencies():
    """Test if all required packages are installed"""
    print("\nTesting dependencies...")
    dependencies = {
        'flask': 'Flask',
        'flask_cors': 'Flask-CORS',
        'pymysql': 'PyMySQL',
        'dotenv': 'python-dotenv'
    }
    
    all_ok = True
    for module, name in dependencies.items():
        try:
            __import__(module)
            print(f"✓ {name} - OK")
        except ImportError:
            print(f"✗ {name} - MISSING")
            all_ok = False
    
    return all_ok

def test_env_file():
    """Test if .env file exists and has required variables"""
    print("\nTesting environment configuration...")
    
    if not os.path.exists('.env'):
        print("✗ .env file not found")
        print("  Run: cp .env.example .env")
        return False
    
    print("✓ .env file exists")
    
    required_vars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_DB']
    missing = []
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✓ {var} = {value}")
        else:
            print(f"✗ {var} - NOT SET")
            missing.append(var)
    
    return len(missing) == 0

def test_mysql_connection():
    """Test if MySQL connection is working"""
    print("\nTesting MySQL connection...")
    
    try:
        import pymysql as MySQLdb
        
        host = os.getenv('MYSQL_HOST', 'localhost')
        user = os.getenv('MYSQL_USER', 'root')
        password = os.getenv('MYSQL_PASSWORD', '')
        db = os.getenv('MYSQL_DB', 'sutraty')
        
        print(f"Connecting to MySQL at {host}...")
        
        connection = MySQLdb.connect(
            host=host,
            user=user,
            password=password,
            db=db,
            cursorclass=MySQLdb.cursors.DictCursor
        )
        
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        connection.close()
        
        print(f"✓ MySQL connection successful")
        print(f"  Host: {host}")
        print(f"  User: {user}")
        print(f"  Database: {db}")
        return True
        
    except Exception as e:
        print(f"✗ MySQL connection failed")
        print(f"  Error: {str(e)}")
        print("\n  Make sure:")
        print("  1. MySQL server is running")
        print("  2. Database 'sutraty' exists")
        print("  3. Credentials in .env are correct")
        print("  4. Run: python init_db.py")
        return False

def test_flask_app():
    """Test if Flask app can be imported"""
    print("\nTesting Flask application...")
    
    try:
        from admin.src.backend.app import app
        print("✓ Flask app imported successfully")
        
        # Test if routes are registered
        routes = [rule.rule for rule in app.url_map.iter_rules()]
        print(f"✓ Found {len(routes)} routes")
        
        expected_routes = ['/api/products', '/api/health']
        for route in expected_routes:
            if any(route in r for r in routes):
                print(f"  ✓ {route}")
            else:
                print(f"  ✗ {route} - NOT FOUND")
        
        return True
        
    except Exception as e:
        print(f"✗ Flask app import failed")
        print(f"  Error: {str(e)}")
        return False


def test_orm_models():
    """Test if SQLAlchemy models and DB are usable via the app context"""
    print("\nTesting ORM & SQLAlchemy models...")
    try:
        from admin.src.backend.app import app
        from admin.src.database.models.models import db, Product
        with app.app_context():
            # Ensure db is bound
            db.session.execute('SELECT 1')
            count = Product.query.count()
            print(f"✓ ORM available: Product count = {count}")
        return True
    except Exception as e:
        print(f"✗ ORM test failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("=" * 50)
    print("Sutraty Backend Test Suite")
    print("=" * 50)
    
    results = {
        'Python Version': test_python_version(),
        'Dependencies': test_dependencies(),
        'Environment': test_env_file(),
        'MySQL Connection': test_mysql_connection(),
        'Flask App': test_flask_app(),
        'ORM Models': test_orm_models(),
    }
    
    print("\n" + "=" * 50)
    print("Test Summary")
    print("=" * 50)
    
    for test_name, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    
    print("=" * 50)
    if all_passed:
        print("✓ All tests passed! Backend is ready to run.")
        print("\nStart the backend with:")
        print("  python app.py")
        return 0
    else:
        print("✗ Some tests failed. Please fix the issues above.")
        return 1

if __name__ == '__main__':
    sys.exit(main())
