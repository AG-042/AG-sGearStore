# Debugging 400 Bad Request Error

## 🔍 Current Issue

```
Bad Request: /api/store/payment/initialize/
[04/Nov/2025 01:40:57] "POST /api/store/payment/initialize/ HTTP/1.1" 400 44
```

## 🛠️ Debugging Steps

### **Step 1: Check Django Console Output**

The backend now has detailed logging. Look for these messages:

```python
# What to look for in terminal:
INFO - Payment initialization request: {...}
ERROR - Email is missing from request
ERROR - Cart items validation failed: {...}
```

### **Step 2: Check Browser Console**

Open browser DevTools (F12) and check:

1. **Network Tab**
   - Find the `payment/initialize/` request
   - Click on it
   - Check "Payload" tab to see what was sent
   - Check "Response" tab to see error details

2. **Console Tab**
   - Look for any JavaScript errors
   - Check the logged request data

### **Step 3: Common Causes of 400 Error**

#### **Cause 1: Missing Email**
```json
// Error response
{"error": "Email is required"}
```

**Fix**: Ensure email field is filled in checkout form

#### **Cause 2: Invalid Cart Items**
```json
// Error response
{
  "cart_items": [
    {"variant_id": ["This field is required"]},
    {"quantity": ["This field is required"]}
  ]
}
```

**Fix**: Check cart items format:
```typescript
const cartItems = items.map(item => ({
  variant_id: item.variantId,  // Must be a number
  quantity: item.quantity       // Must be a number
}));
```

#### **Cause 3: Variant Doesn't Exist**
```json
{"error": "Variant with ID 123 does not exist"}
```

**Fix**: Ensure products in cart still exist in database

#### **Cause 4: Insufficient Stock**
```json
{"error": "Insufficient stock for Nike Jersey - XL. Available: 0"}
```

**Fix**: Product is out of stock, remove from cart

#### **Cause 5: Invalid Delivery Fee**
```python
# Backend tries to convert delivery_fee to float
delivery_fee = float(request.data.get('delivery_fee', 0))
```

**Fix**: Ensure delivery_fee is a number, not string

## 🧪 Manual Testing

### **Test 1: Check Cart Items Format**

Open browser console and run:
```javascript
// Check what's in your cart
const cart = JSON.parse(localStorage.getItem('cart') || '[]');
console.log('Cart items:', cart);

// Check the format being sent
const cartItems = cart.map(item => ({
  variant_id: item.variantId,
  quantity: item.quantity
}));
console.log('Formatted cart items:', cartItems);
```

### **Test 2: Test Payment API Directly**

Use curl or Postman:
```bash
curl -X POST http://localhost:8000/api/store/payment/initialize/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "cart_items": [
      {
        "variant_id": 1,
        "quantity": 1
      }
    ],
    "delivery_fee": 2000,
    "customer_info": {
      "first_name": "John",
      "last_name": "Doe",
      "phone": "08012345678",
      "address": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "delivery_zone": "lagos-mainland"
    }
  }'
```

### **Test 3: Check Product Variants Exist**

```bash
# List all product variants
curl http://localhost:8000/api/store/products/

# Check specific variant
curl http://localhost:8000/api/store/products/1/variants/
```

## 🔧 Quick Fixes

### **Fix 1: Clear Cart and Re-add Items**

```javascript
// In browser console
localStorage.removeItem('cart');
// Then refresh page and add items again
```

### **Fix 2: Check Delivery Zone Selected**

The button is disabled if no delivery zone is selected:
```typescript
disabled={loading || deliveryFee === 0}
```

Make sure you select a delivery zone from the dropdown!

### **Fix 3: Validate Form Fields**

All these fields are required:
- ✅ First Name
- ✅ Last Name
- ✅ Email (valid format)
- ✅ Phone (10-11 digits)
- ✅ Address
- ✅ City
- ✅ State
- ✅ Delivery Zone

## 📊 Expected Request Format

### **Complete Valid Request**
```json
{
  "email": "customer@example.com",
  "cart_items": [
    {
      "variant_id": 1,
      "quantity": 2
    },
    {
      "variant_id": 3,
      "quantity": 1
    }
  ],
  "delivery_fee": 2000,
  "customer_info": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "08012345678",
    "address": "123 Main Street, Ikeja",
    "city": "Lagos",
    "state": "Lagos",
    "delivery_zone": "lagos-mainland",
    "additional_info": "Near City Mall"
  }
}
```

### **Expected Response (Success)**
```json
{
  "status": true,
  "message": "Payment initialized successfully",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "abc123xyz",
    "reference": "AGS-ORDER123-ABC12345",
    "order_id": "AGS-ORDER123",
    "amount": 162000.0
  }
}
```

### **Expected Response (Error)**
```json
{
  "error": "Email is required"
}
// OR
{
  "cart_items": [
    {"variant_id": ["This field is required"]}
  ]
}
// OR
{
  "error": "Insufficient stock for Nike Jersey - XL. Available: 0"
}
```

## 🎯 Specific Debugging for Your Error

Since the error shows `400 44` (44 bytes response), it's likely a short error message.

### **Most Likely Causes:**

1. **Email validation failing**
   ```json
   {"error": "Email is required"}  // 31 bytes
   ```

2. **Cart items validation failing**
   ```json
   {"cart_items": [{"variant_id": ["This field is required"]}]}
   ```

3. **Variant doesn't exist**
   ```json
   {"error": "Variant with ID X does not exist"}
   ```

### **How to Confirm:**

1. **Check Django Terminal**
   Look for the logged error message

2. **Check Browser Network Tab**
   - Click on the failed request
   - Look at "Response" tab
   - You'll see the exact error

3. **Check Browser Console**
   The error should be logged:
   ```
   Checkout error: ...
   ❌ Error: ...
   ```

## 🚀 Next Steps

1. **Start Django server** (if not running):
   ```bash
   cd gearstore_backend
   source ../venv/bin/activate
   python manage.py runserver
   ```

2. **Open browser DevTools** (F12)

3. **Go to checkout page** and fill form

4. **Click "Proceed to Payment"**

5. **Check both**:
   - Django terminal for logged errors
   - Browser Network tab for response
   - Browser Console for client errors

6. **Report back** with:
   - The exact error message from Django
   - The request payload from browser
   - The response from browser

## 📝 Enable Detailed Logging

If you need even more details, add this to `settings.py`:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'store': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

This will show all DEBUG messages from the store app.

---

**Follow these steps and you'll find the exact cause of the 400 error!** 🔍
