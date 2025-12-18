"""
Initialize admin user in Supabase
This script creates the initial admin user with hashed password
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.supabase_config import get_supabase_client
from utils.password_utils import hash_password

def init_admin():
    """Initialize admin user in Supabase"""
    supabase = get_supabase_client()
    
    admin_email = "admin.sutraty@gmail.com"
    admin_password = "SuTr@ty_Adm1n$89"
    
    # Hash the password
    password_hash = hash_password(admin_password)
    
    # Check if admin already exists
    try:
        # First, try to select only basic fields to check if admin exists
        response = supabase.table('admins').select('id, email, password_hash').eq('email', admin_email).execute()
        
        if response.data and len(response.data) > 0:
            print(f"Admin with email {admin_email} already exists.")
            print("Updating password and profile...")
            
            # Prepare update data - only include fields that exist
            update_data = {
                'password_hash': password_hash
            }
            
            # Try to update optional fields if they exist
            try:
                update_data['name'] = 'Admin Sutraty'
                update_data['phone'] = ''
                update_data['address'] = ''
            except:
                # If columns don't exist, just update password
                pass
            
            # Update password
            supabase.table('admins').update(update_data).eq('email', admin_email).execute()
            print("Admin password updated successfully!")
        else:
            # Create new admin - only include basic required fields first
            admin_data = {
                'email': admin_email,
                'password_hash': password_hash
            }
            
            # Try to add optional fields if columns exist
            try:
                admin_data['name'] = 'Admin Sutraty'
                admin_data['phone'] = ''
                admin_data['address'] = ''
            except:
                # If columns don't exist, create without them
                pass
            
            response = supabase.table('admins').insert(admin_data).execute()
            print(f"Admin created successfully with email: {admin_email}")
    except Exception as e:
        error_msg = str(e)
        print(f"Error initializing admin: {e}")
        
        # Check if it's a column error
        if 'address' in error_msg or 'name' in error_msg or 'phone' in error_msg:
            print("\n" + "="*60)
            print("ERROR: Missing database columns!")
            print("="*60)
            print("\nYou need to update your Supabase database schema first.")
            print("\nGo to Supabase Dashboard → SQL Editor and run:")
            print("\nALTER TABLE admins")
            print("ADD COLUMN IF NOT EXISTS name TEXT,")
            print("ADD COLUMN IF NOT EXISTS phone TEXT,")
            print("ADD COLUMN IF NOT EXISTS address TEXT;")
            print("\n" + "="*60)
        
        return False
    
    return True

if __name__ == '__main__':
    print("Initializing admin user...")
    if init_admin():
        print("Admin initialization completed!")
    else:
        print("Admin initialization failed!")
        sys.exit(1)

