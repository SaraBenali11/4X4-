import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from config.supabase_config import get_supabase_client

def seed_categories():
    try:
        supabase = get_supabase_client()
        categories_to_ensure = ['Foulard', 'Hijabs', 'Abaya', 'Robes', 'Jupes', 'Ensembles', 'Hauts', 'Pantalons', 'Accessoires']
        
        print("Checking categories...")
        existing = supabase.table('categories').select('*').execute().data
        existing_names = {c['name']: c['id'] for c in existing}
        
        for cat_name in categories_to_ensure:
            if cat_name not in existing_names:
                print(f"Creating category: {cat_name}")
                res = supabase.table('categories').insert({'name': cat_name}).execute()
                if res.data:
                    print(f"Created {cat_name}: {res.data[0]['id']}")
                else:
                    print(f"Failed to create {cat_name}")
            else:
                print(f"Category {cat_name} already exists: {existing_names[cat_name]}")
                
        print("Seeding complete.")
        
    except Exception as e:
        print(f"Error seeding categories: {e}")

if __name__ == "__main__":
    seed_categories()
