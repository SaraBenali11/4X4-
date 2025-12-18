"""
Test Supabase Connection
Run this to verify Supabase is connected correctly
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from config.supabase_config import get_supabase_client

def test_supabase_connection():
    """Test connection to Supabase"""
    print("Testing Supabase connection...")
    print("=" * 60)
    
    try:
        supabase = get_supabase_client()
        print("[OK] Supabase client created successfully")
        
        # Test 1: Check if we can access the admins table
        print("\n1. Testing admins table access...")
        response = supabase.table('admins').select('id, email').limit(1).execute()
        print(f"   [OK] Successfully connected to 'admins' table")
        print(f"   Response: {len(response.data)} row(s) found")
        
        if response.data:
            print(f"   Sample data: {response.data[0]}")
        
        # Test 2: Check table structure
        print("\n2. Testing table structure...")
        response = supabase.table('admins').select('*').limit(1).execute()
        if response.data:
            columns = list(response.data[0].keys())
            print(f"   [OK] Table columns: {', '.join(columns)}")
            
            required_columns = ['id', 'email', 'password_hash', 'name', 'phone', 'address']
            missing = [col for col in required_columns if col not in columns]
            if missing:
                print(f"   [WARNING] Missing columns: {', '.join(missing)}")
            else:
                print(f"   [OK] All required columns present")
        
        # Test 3: Try to get admin user
        print("\n3. Testing admin user retrieval...")
        response = supabase.table('admins').select('*').eq('email', 'admin.sutraty@gmail.com').execute()
        if response.data and len(response.data) > 0:
            admin = response.data[0]
            print(f"   [OK] Admin user found!")
            print(f"   ID: {admin.get('id')}")
            print(f"   Email: {admin.get('email')}")
            print(f"   Name: {admin.get('name', 'Not set')}")
            print(f"   Phone: {admin.get('phone', 'Not set')}")
            print(f"   Address: {admin.get('address', 'Not set')}")
        else:
            print(f"   [WARNING] Admin user not found")
        
        print("\n" + "=" * 60)
        print("[OK] Supabase connection test PASSED!")
        return True
        
    except Exception as e:
        print(f"\n[ERROR] {e}")
        print("\n" + "=" * 60)
        print("[FAILED] Supabase connection test FAILED!")
        print("\nPossible issues:")
        print("1. Check your Supabase URL and API key")
        print("2. Verify your internet connection")
        print("3. Check if Supabase project is active")
        print("4. Verify table permissions in Supabase")
        return False

if __name__ == '__main__':
    test_supabase_connection()

