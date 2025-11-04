#!/usr/bin/env python
"""
Test script to verify checkout system is working
Run this from the gearstore_backend directory
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api/store"

def test_products():
    """Test that products can be fetched"""
    print("1. Testing product list...")
    response = requests.get(f"{API_URL}/products/")
    
    if response.status_code == 200:
        products = response.json()
        print(f"   ✅ Found {len(products)} products")
        if products:
            print(f"   First product: {products[0]['name']}")
            return products
        else:
            print("   ⚠️  No products found. Add some products first!")
            return []
    else:
        print(f"   ❌ Failed: {response.status_code}")
        return []

def test_product_variants(product_id):
    """Test that product variants can be fetched"""
    print(f"\n2. Testing product variants for product {product_id}...")
    response = requests.get(f"{API_URL}/products/{product_id}/variants/")
    
    if response.status_code == 200:
        variants = response.json()
        print(f"   ✅ Found {len(variants)} variants")
        if variants:
            for v in variants:
                print(f"   - Size {v['size']}: Stock {v['stock']}")
            return variants
        else:
            print("   ⚠️  No variants found. Add variants to products!")
            return []
    else:
        print(f"   ❌ Failed: {response.status_code}")
        return []

def test_payment_initialization(variant_id):
    """Test payment initialization"""
    print(f"\n3. Testing payment initialization with variant {variant_id}...")
    
    payload = {
        "email": "test@example.com",
        "cart_items": [
            {
                "variant_id": variant_id,
                "quantity": 1
            }
        ],
        "delivery_fee": 2000,
        "customer_info": {
            "first_name": "Test",
            "last_name": "User",
            "phone": "08012345678",
            "address": "123 Test Street",
            "city": "Lagos",
            "state": "Lagos",
            "delivery_zone": "lagos-mainland",
            "additional_info": "Test order"
        }
    }
    
    print(f"   Payload: {json.dumps(payload, indent=2)}")
    
    response = requests.post(
        f"{API_URL}/payment/initialize/",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"   Status Code: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        result = response.json()
        if result.get('status'):
            print("   ✅ Payment initialization successful!")
            print(f"   Authorization URL: {result['data']['authorization_url'][:50]}...")
            return True
        else:
            print(f"   ❌ Payment failed: {result.get('message')}")
            return False
    else:
        print(f"   ❌ Request failed: {response.text}")
        return False

def main():
    print("=" * 60)
    print("CHECKOUT SYSTEM TEST")
    print("=" * 60)
    
    # Test 1: Get products
    products = test_products()
    if not products:
        print("\n⚠️  Cannot continue without products")
        return
    
    # Test 2: Get variants for first product
    first_product_id = products[0]['id']
    variants = test_product_variants(first_product_id)
    if not variants:
        print("\n⚠️  Cannot continue without variants")
        return
    
    # Test 3: Try payment initialization
    first_variant_id = variants[0]['id']
    success = test_payment_initialization(first_variant_id)
    
    print("\n" + "=" * 60)
    if success:
        print("✅ ALL TESTS PASSED!")
        print("Your checkout system is working correctly.")
    else:
        print("❌ TESTS FAILED")
        print("Check the error messages above.")
        print("\nCommon issues:")
        print("- Paystack keys not configured in .env")
        print("- Backend server not running")
        print("- Database not migrated")
    print("=" * 60)

if __name__ == "__main__":
    main()
