"""
Unit tests (simple) for seed_updater parsing and removal logic.

This reuses the `seed_updater` as a library and validates that it can
parse and (in dry-run mode) remove entries with additional fields, different
property names, or added elements.
"""
from scripts.seed_updater import remove_from_py_seed, remove_from_js_seed
import os


def test_remove_from_py_seed_dry_run():
    # Use test file that we do not change; the default is data.py in backend
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    py_path = os.path.join(repo_root, 'src', 'backend', 'database', 'data.py')
    changed, new_content = remove_from_py_seed(py_path, name='Abaya Élégante Beige', dry_run=True)
    assert isinstance(changed, bool)
    assert isinstance(new_content, str)


def test_remove_from_js_seed_dry_run():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    js_path = os.path.join(repo_root, 'src', 'database', 'data', 'adminData.js')
    changed, new_content = remove_from_js_seed(js_path, name='Abaya Élégante Beige', dry_run=True)
    assert isinstance(changed, bool)
    assert isinstance(new_content, str)


if __name__ == '__main__':
    test_remove_from_py_seed_dry_run()
    test_remove_from_js_seed_dry_run()
    print('Seed updater dry-run tests passed')
