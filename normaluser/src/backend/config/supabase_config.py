import os
from supabase import create_client, Client

def get_supabase_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_ANON_KEY")
    
    if not url or not key:
        print("Warning: SUPABASE_URL or SUPABASE_KEY not set")
        # You might want to raise an error here or return None if critical
        
    return create_client(url, key)
