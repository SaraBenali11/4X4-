import os
import time
import requests

BASE = os.getenv('API_BASE_URL', 'http://localhost:5000')


def wait_for_health(timeout=120):
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.get(f"{BASE}/api/health", timeout=2)
            if r.ok:
                return True
        except Exception:
            pass
        time.sleep(1)
    return False


def test_crud_persistence():
    assert wait_for_health(), "Backend health endpoint not available"

    # Initial get products
    r = requests.get(f"{BASE}/api/products")
    assert r.status_code == 200
    data = r.json().get('data', [])
    initial_count = len(data)

    # Add a product
    payload = {
        'name': 'Integration Test Product',
        'category': 'Test',
        'price': 123.45
    }
    r = requests.post(f"{BASE}/api/products", json=payload)
    assert r.status_code == 201
    product_id = r.json()['data']['id']

    # Verify product is present
    r = requests.get(f"{BASE}/api/products/{product_id}")
    assert r.status_code == 200
    assert r.json()['data']['name'] == payload['name']

    # Delete product
    r = requests.delete(f"{BASE}/api/products/{product_id}")
    assert r.status_code == 200

    # Verify product is gone
    r = requests.get(f"{BASE}/api/products/{product_id}")
    assert r.status_code == 404

    # Now verify persistence across backend restart
    r = requests.get(f"{BASE}/api/products")
    assert r.status_code == 200
    after_count = len(r.json().get('data', []))
    assert after_count == initial_count

    # Restart backend to verify persistence
    # This requires docker-compose available in the environment running tests
    import subprocess
    from shutil import which
    compose_cmd = 'docker compose' if which('docker') and 'compose' else 'docker-compose'
    # If docker compose plugin is available, use `docker compose` rather than docker-compose
    if which('docker'):
        # check whether the plugin is available
        try:
            subprocess.check_call(['docker', 'compose', 'version'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.check_call(['docker', 'compose', 'restart', 'backend'])
        except Exception:
            subprocess.check_call(['docker-compose', 'restart', 'backend'])
    else:
        subprocess.check_call(['docker-compose', 'restart', 'backend'])
    # wait for backend
    assert wait_for_health(), 'Backend did not return to healthy state after restart'
    r = requests.get(f"{BASE}/api/products")
    assert r.status_code == 200
    after_count_2 = len(r.json().get('data', []))
    assert after_count_2 == initial_count


def test_admin_seed_edit_endpoint_dry_run():
    assert wait_for_health(), "Backend health endpoint not available"
    # Test admin endpoint dry-run remove
    headers = {'X-ADMIN-TOKEN': 'test-token'}
    payload = {
        'action': 'remove',
        'target': 'both',
        'payload': {'name': 'Abaya Élégante Beige'},
        'dry_run': True
    }
    r = requests.post(f"{BASE}/api/admin/seed-edit", json=payload, headers=headers)
    assert r.status_code == 200
