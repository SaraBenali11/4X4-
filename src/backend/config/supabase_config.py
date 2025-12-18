"""
Supabase Configuration
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://ijqhxzcsngpsodslijmd.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqcWh4emNzbmdwc29kc2xpam1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MzMxMjgsImV4cCI6MjA4MTQwOTEyOH0.64LTSqOpeh218dCRcge9NzG45lZraOYpmlU4O15sUrA')

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

