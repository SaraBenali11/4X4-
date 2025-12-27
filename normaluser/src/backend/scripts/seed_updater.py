"""
Seed updater helper

This script provides functions to remove a product from the
backend Python seed file and the frontend JS mock file.

It is intentionally simple: it uses string-based parsing to avoid
executing the user's code. Use `--dry-run` when in doubt.
"""
import argparse
import os
import re
from typing import Optional


def _split_top_level_objects(block: str):
    """Split a string representing an array of top-level objects into list of strings.
    This performs a brace depth-based split so nested objects won't break it.
    """
    objects = []
    start = None
    depth = 0
    for i, ch in enumerate(block):
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start is not None:
                objects.append(block[start:i+1])
                start = None
    return objects


def remove_from_py_seed(py_path: str, name: Optional[str] = None, id: Optional[int] = None, dry_run: bool = True, name_keys: Optional[list] = None):
    """Remove entries from a Python seed file `sample_products` by name.
    Returns a tuple: (modified_bool, new_content_str). If dry_run, file is not updated.
    """
    content = open(py_path, 'r', encoding='utf-8').read()

    m = re.search(r"sample_products\s*=\s*\[", content)
    if not m:
        raise ValueError('Could not find sample_products in %s' % py_path)
    start_index = m.end() - 1
    # Find matching closing bracket
    depth = 0
    end_index = None
    for i in range(start_index, len(content)):
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
            if depth == 0:
                end_index = i
                break
    if end_index is None:
        raise ValueError('Could not find end of sample_products list')

    block = content[start_index+1:end_index]
    objects = _split_top_level_objects(block)
    keep = []
    removed = []
    if name_keys is None:
        name_keys = ['name', 'nom', 'title', 'label']

    def _matches_py_name(objtext, name_to_match):
        for key in name_keys:
            if re.search(r"['\"]%s['\"]\s*:\s*['\"]%s['\"]" % (re.escape(key), re.escape(name_to_match)), objtext, flags=re.IGNORECASE):
                return True
        return False

    for obj in objects:
        # Normalize whitespace for pattern match
        matched = False
        if id is not None and re.search(r"\bid\s*:\s*%s\b" % id, obj):
            matched = True
        if name and _matches_py_name(obj, name):
            matched = True
        if matched:
            removed.append(obj)
        else:
            keep.append(obj)

    if not removed:
        return False, content

    # Reconstruct block with proper comma separation
    new_block = ',\n    '.join(keep)
    new_content = content[:start_index+1] + '\n    ' + new_block + '\n' + content[end_index:]
    if not dry_run:
        with open(py_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    return True, new_content


def remove_from_js_seed(js_path: str, name: Optional[str] = None, id: Optional[int] = None, dry_run: bool = True, name_keys: Optional[list] = None):
    """Remove an object from `export const productsData = [ ... ]` by name or id.
    Returns (modified_bool, new_content)
    """
    content = open(js_path, 'r', encoding='utf-8').read()
    # Find array block for productsData
    m = re.search(r"export\s+const\s+productsData\s*=\s*\[", content)
    if not m:
        raise ValueError('Could not find productsData in %s' % js_path)
    start_index = m.end() - 1
    depth = 0
    end_index = None
    for i in range(start_index, len(content)):
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
            if depth == 0:
                end_index = i
                break
    if end_index is None:
        raise ValueError('Could not find end of productsData array')

    block = content[start_index+1:end_index]
    objects = _split_top_level_objects(block)
    keep = []
    removed = []
    if name_keys is None:
        name_keys = ['produit', 'produitName', 'name', 'product', 'title']

    def _matches_js_name(objtext, nm):
        for key in name_keys:
            # Key can appear as unquoted identifier or quoted property
            if re.search(r"\b%s\b\s*:\s*['\"]%s['\"]" % (re.escape(key), re.escape(nm)), objtext, flags=re.IGNORECASE):
                return True
        return False

    for obj in objects:
        matched = False
        if id is not None and re.search(r"\bid\s*:\s*%s\b" % id, obj):
            matched = True
        if name and _matches_js_name(obj, name):
            matched = True
        if matched:
            removed.append(obj)
        else:
            keep.append(obj)

    if not removed:
        return False, content

    new_block = ',\n  '.join(keep)
    new_content = content[:start_index+1] + '\n  ' + new_block + '\n' + content[end_index:]
    if not dry_run:
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    return True, new_content


def add_to_py_seed(py_path: str, data: dict, dry_run: bool = True):
    """Append a product object to sample_products list in python seed file.
    data keys: name, category, price, sizes(list), colors(list), images(list), isNew(bool), isBestSeller(bool), id(optional)
    """
    content = open(py_path, 'r', encoding='utf-8').read()
    m = re.search(r"sample_products\s*=\s*\[", content)
    if not m:
        raise ValueError('Could not find sample_products in %s' % py_path)
    start_index = m.end() - 1
    depth = 0
    end_index = None
    for i in range(start_index, len(content)):
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
            if depth == 0:
                end_index = i
                break
    if end_index is None:
        raise ValueError('Could not find end of sample_products list')

    # Build python object string
    parts = []
    if 'id' in data and data['id'] is not None:
        parts.append(f"'id': {int(data['id'])}")
    parts.append(f"'name': '{data.get('name','')}'")
    parts.append(f"'category': '{data.get('category','')}'")
    parts.append(f"'price': {float(data.get('price',0))}")
    sizes = data.get('sizes', []) or []
    parts.append("'sizes': [%s]" % ', '.join(f"'{s}'" for s in sizes))
    colors = data.get('colors', []) or []
    parts.append("'colors': [%s]" % ', '.join(f"'{c}'" for c in colors))
    images = data.get('images', []) or []
    parts.append("'images': [%s]" % ', '.join(f"'{i}'" for i in images))
    parts.append(f"'isNew': {bool(data.get('isNew', False))}")
    parts.append(f"'isBestSeller': {bool(data.get('isBestSeller', False))}")
    obj_text = '{\n        ' + ',\n        '.join(parts) + '\n    }'

    # If the list currently empty, don't add extra comma
    before = content[:end_index].rstrip()
    if before.endswith('['):
        new_content = content[:end_index] + '\n    ' + obj_text + '\n' + content[end_index:]
    else:
        new_content = content[:end_index] + ',\n    ' + obj_text + '\n' + content[end_index:]
    if not dry_run:
        with open(py_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    return True, new_content


def add_to_js_seed(js_path: str, data: dict, dry_run: bool = True):
    """Append a product object to productsData array in JS seed file.
    Data keys similar to add_to_py_seed; uses `produit` and `categorie` and `prix` to match existing structure.
    """
    content = open(js_path, 'r', encoding='utf-8').read()
    m = re.search(r"export\s+const\s+productsData\s*=\s*\[", content)
    if not m:
        raise ValueError('Could not find productsData in %s' % js_path)
    start_index = m.end() - 1
    depth = 0
    end_index = None
    for i in range(start_index, len(content)):
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
            if depth == 0:
                end_index = i
                break
    if end_index is None:
        raise ValueError('Could not find end of productsData array')

    id_part = f"id: {int(data.get('id'))},\n    " if 'id' in data and data['id'] is not None else ''
    statuts = data.get('statuts', []) or []
    statuts_text = '[' + ', '.join(f"'{s}'" for s in statuts) + ']' if statuts else '[]'
    obj_text = "{\n    " + id_part + "produit: '%s',\n    categorie: '%s',\n    prix: %s,\n    statuts: %s\n  }" % (
        data.get('name', ''), data.get('category', ''), float(data.get('price', 0)), statuts_text
    )

    before = content[:end_index].rstrip()
    if before.endswith('['):
        new_content = content[:end_index] + '\n  ' + obj_text + '\n' + content[end_index:]
    else:
        new_content = content[:end_index] + ',\n  ' + obj_text + '\n' + content[end_index:]
    if not dry_run:
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    return True, new_content


def main():
    parser = argparse.ArgumentParser(description='Remove product from seed files')
    parser.add_argument('--name', type=str, help='Product name to remove')
    parser.add_argument('--id', type=int, help='Product id to remove (frontend seed)')
    # compute default paths relative to repo root (3 levels up from this script file)
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    default_py = os.path.join(repo_root, 'src', 'backend', 'database', 'data.py')
    default_js = os.path.join(repo_root, 'src', 'database', 'data', 'adminData.js')
    parser.add_argument('--py', type=str, default=default_py, help='Path to backend seed (py)')
    parser.add_argument('--js', type=str, default=default_js, help='Path to frontend seed (js)')
    parser.add_argument('--dry-run', action='store_true', help='Do not change files')
    args = parser.parse_args()

    if not args.name and not args.id:
        print('Please provide --name or --id to remove')
        return 1

    changed_py = False
    changed_js = False
    try:
        if args.name:
            changed_py, _ = remove_from_py_seed(args.py, name=args.name, dry_run=args.dry_run)
            changed_js, _ = remove_from_js_seed(args.js, name=args.name, id=args.id, dry_run=args.dry_run)
        elif args.id is not None:
            changed_js, _ = remove_from_js_seed(args.js, id=args.id, dry_run=args.dry_run)

        print('Results:')
        print(' backend (py):', 'changed' if changed_py else 'no change')
        print(' frontend (js):', 'changed' if changed_js else 'no change')
        return 0
    except Exception as e:
        print('Error:', e)
        return 2


if __name__ == '__main__':
    exit(main())
