import tempfile
import os
from scripts.seed_updater import remove_from_py_seed, remove_from_js_seed


def build_py_seed(content):
    # Write a minimal sample_products assignment
    return """# test
sample_products = [
%s
]
""" % content


def build_js_seed(content):
    return """export const productsData = [
%s
]
""" % content


def assert_contains(haystack, needle):
    assert needle in haystack, f"Expected to find {needle} in content"


def test_py_removal_with_extra_fields():
    # Create a temporary file with additional fields in the items
    obj = """{
        'id': 42,
        'name': 'Foo Bar',
        'category': 'Test',
        'price': 123,
        'metadata': {'x': 1},
        'newField': 'added'
    }"""
    content = build_py_seed(obj)
    with tempfile.NamedTemporaryFile('w+', delete=False, suffix='.py') as tf:
        tf.write(content)
        path = tf.name

    try:
        changed, new_content = remove_from_py_seed(path, name='Foo Bar', dry_run=False)
        assert changed
        assert 'Foo Bar' not in open(path).read()
    finally:
        os.unlink(path)


def test_js_removal_with_extra_fields():
    obj = """{
    id: 99,
    produit: 'Bar Foo',
    categorie: 'TestNew',
    prix: 777,
    images: ['a.png'],
    extra: { hello: 'world' }
  }"""
    content = build_js_seed(obj)
    with tempfile.NamedTemporaryFile('w+', delete=False, suffix='.js') as tf:
        tf.write(content)
        path = tf.name

    try:
        changed, new_content = remove_from_js_seed(path, name='Bar Foo', dry_run=False)
        assert changed
        assert 'Bar Foo' not in open(path).read()
    finally:
        os.unlink(path)


def test_py_removal_by_id():
    obj = """{
        'id': 666,
        'name': 'Identity Test',
        'category': 'Num',
        'price': 1.0
    }"""
    content = build_py_seed(obj)
    with tempfile.NamedTemporaryFile('w+', delete=False, suffix='.py') as tf:
        tf.write(content)
        path = tf.name

    try:
        changed, new_content = remove_from_py_seed(path, id=666, dry_run=False)
        assert changed
        assert 'Identity Test' not in open(path).read()
    finally:
        os.unlink(path)


def test_js_removal_by_id():
    obj = """{
    id: 1234,
    produit: 'By Id Test',
    categorie: 'ID',
    prix: 1000
  }"""
    content = build_js_seed(obj)
    with tempfile.NamedTemporaryFile('w+', delete=False, suffix='.js') as tf:
        tf.write(content)
        path = tf.name

    try:
        changed, new_content = remove_from_js_seed(path, id=1234, dry_run=False)
        assert changed
        assert 'By Id Test' not in open(path).read()
    finally:
        os.unlink(path)


def test_py_add_and_remove():
    content = build_py_seed("")
    with tempfile.NamedTemporaryFile('w+', delete=False, suffix='.py') as tf:
        tf.write(content)
        path = tf.name
    try:
        # Add item
        changed, new_content = add_to_py_seed(path, {'id': 1, 'name': 'Add Test', 'category': 'C', 'price': 10, 'sizes': ['M'], 'colors': [], 'images': [], 'isNew': False, 'isBestSeller': False}, dry_run=False)
        assert changed
        assert 'Add Test' in open(path).read()
        # Remove item
        removed, _ = remove_from_py_seed(path, name='Add Test', dry_run=False)
        assert removed
        assert 'Add Test' not in open(path).read()
    finally:
        os.unlink(path)


def test_js_add_and_remove():
    content = build_js_seed("")
    with tempfile.NamedTemporaryFile('w+', delete=False, suffix='.js') as tf:
        tf.write(content)
        path = tf.name
    try:
        changed, new_content = add_to_js_seed(path, {'id': 2000, 'name': 'JS Add', 'category': 'C', 'price': 1, 'statuts': []}, dry_run=False)
        assert changed
        assert 'JS Add' in open(path).read()
        removed, _ = remove_from_js_seed(path, id=2000, dry_run=False)
        assert removed
        assert 'JS Add' not in open(path).read()
    finally:
        os.unlink(path)


def test_py_update_flow():
    # Start with an object, remove it, then add updated version
    obj = """{
        'id': 77,
        'name': 'UpdateMe',
        'category': 'Old',
        'price': 20
    }"""
    content = build_py_seed(obj)
    with tempfile.NamedTemporaryFile('w+', delete=False, suffix='.py') as tf:
        tf.write(content)
        path = tf.name
    try:
        # update by id: remove and add new
        removed, _ = remove_from_py_seed(path, id=77, dry_run=False)
        assert removed
        # Add updated
        changed, _ = add_to_py_seed(path, {'id': 77, 'name': 'IAmUpdated', 'category': 'New', 'price': 25}, dry_run=False)
        assert changed
        assert 'IAmUpdated' in open(path).read()
    finally:
        os.unlink(path)


def test_js_update_flow():
    obj = """{
    id: 77,
    produit: 'JSUpdate',
    categorie: 'Old',
    prix: 333
  }"""
    content = build_js_seed(obj)
    with tempfile.NamedTemporaryFile('w+', delete=False, suffix='.js') as tf:
        tf.write(content)
        path = tf.name
    try:
        removed, _ = remove_from_js_seed(path, id=77, dry_run=False)
        assert removed
        changed, _ = add_to_js_seed(path, {'id': 77, 'name': 'JSUpdated', 'category': 'New', 'price': 1, 'statuts': []}, dry_run=False)
        assert changed
        assert 'JSUpdated' in open(path).read()
    finally:
        os.unlink(path)


if __name__ == '__main__':
    test_py_removal_with_extra_fields()
    test_js_removal_with_extra_fields()
    print('Local seed_updater tests passed')
