#!/usr/bin/env python
"""
Quick test script to verify Paystack configuration
Run from gearstore_backend directory: python -m store.test_paystack
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gearstore_backend.settings')
django.setup()

from django.conf import settings
import requests

def test_paystack_config():
    """Test Paystack configuration"""
    print("=" * 60)
    print("PAYSTACK CONFIGURATION TEST")
    print("=" * 60)
    
    # Check if keys are loaded
    print("\n1. Checking environment variables...")
    secret_key = settings.PAYSTACK_SECRET_KEY
    public_key = settings.PAYSTACK_PUBLIC_KEY
    
    print(f"   Secret Key: {secret_key[:15]}...{secret_key[-10:] if len(secret_key) > 25 else ''}")
    print(f"   Public Key: {public_key[:15]}...{public_key[-10:] if len(public_key) > 25 else ''}")
    
    # Validate key format
    print("\n2. Validating key format...")
    if not secret_key.startswith('sk_test_') and not secret_key.startswith('sk_live_'):
        print("   ❌ Secret key format is invalid!")
        print(f"      Current: {secret_key[:20]}...")
        print("      Should start with: sk_test_ or sk_live_")
        return False
    else:
        print("   ✅ Secret key format is valid")
    
    if not public_key.startswith('pk_test_') and not public_key.startswith('pk_live_'):
        print("   ❌ Public key format is invalid!")
        print(f"      Current: {public_key[:20]}...")
        print("      Should start with: pk_test_ or pk_live_")
        return False
    else:
        print("   ✅ Public key format is valid")
    
    # Test API connection
    print("\n3. Testing Paystack API connection...")
    url = "https://api.paystack.co/transaction/initialize"
    headers = {
        "Authorization": f"Bearer {secret_key}",
        "Content-Type": "application/json",
    }
    
    # Minimal test payload
    payload = {
        "email": "test@example.com",
        "amount": 100000,  # ₦1000 in kobo
        "reference": "TEST-" + str(os.urandom(8).hex()),
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ Paystack API connection successful!")
            data = response.json()
            print(f"   Authorization URL: {data['data']['authorization_url'][:50]}...")
            return True
        elif response.status_code == 401:
            print("   ❌ Authentication failed (401 Unauthorized)")
            print("   This means your secret key is invalid or expired")
            print("\n   Possible causes:")
            print("   - Key is from a different Paystack account")
            print("   - Key has been regenerated in dashboard")
            print("   - Key has extra spaces or characters")
            print("\n   Solution:")
            print("   1. Go to https://dashboard.paystack.com/#/settings/developers")
            print("   2. Copy the EXACT secret key (starts with sk_test_)")
            print("   3. Update .env file")
            print("   4. Restart Django server")
            
            # Show response details
            try:
                error_data = response.json()
                print(f"\n   Paystack says: {error_data.get('message', 'No message')}")
            except:
                pass
            
            return False
        else:
            print(f"   ❌ Unexpected response: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Connection error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_paystack_config()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ PAYSTACK CONFIGURATION IS WORKING!")
        print("You can now process payments.")
    else:
        print("❌ PAYSTACK CONFIGURATION HAS ISSUES")
        print("Fix the issues above and try again.")
    print("=" * 60)
