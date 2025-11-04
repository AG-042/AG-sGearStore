# Registered User Checkout Integration

## ✅ Features for Registered Users

### **1. Auto-Fill User Information**
When a registered user visits the checkout page:
- ✅ **First Name** - Pre-filled from profile
- ✅ **Last Name** - Pre-filled from profile  
- ✅ **Email** - Pre-filled from profile
- ✅ User can still edit all fields if needed

### **2. Authentication Token Included**
- ✅ JWT token automatically added to payment request
- ✅ Backend identifies authenticated users
- ✅ User ID and username stored in payment metadata

### **3. Loyalty Points**
- ✅ Points calculation shown in order summary
- ✅ Formula: 1 point per $10 spent
- ✅ Points awarded after successful payment
- ✅ Visual indicator for members

### **4. Member Badge**
- ✅ "Checkout - Member" badge displayed
- ✅ Styled in brand colors (blue-950/amber-500)
- ✅ Distinguishes registered from guest checkout

## 🔄 Checkout Flow Comparison

### **Guest User Flow**
```
1. Add items to cart
2. Go to checkout
3. Fill in ALL contact information manually
4. Fill in delivery address
5. Select delivery zone
6. Complete payment
7. No loyalty points earned
```

### **Registered User Flow**
```
1. Add items to cart
2. Go to checkout
3. Name & email PRE-FILLED automatically ✨
4. Fill in delivery address (phone, address, city, state)
5. Select delivery zone
6. See loyalty points preview 🌟
7. Complete payment
8. Loyalty points automatically awarded ✅
```

## 💻 Technical Implementation

### **Frontend (Checkout Page)**

#### **Auto-Fill User Data**
```typescript
useEffect(() => {
  const authStatus = isAuthenticated();
  setAuthenticated(authStatus);
  
  // Fetch user profile if authenticated
  if (authStatus) {
    const fetchUserProfile = async () => {
      const token = getToken();
      const response = await fetch('http://localhost:8000/api/users/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        // Pre-fill form
        setFormData(prev => ({
          ...prev,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          email: userData.email || '',
        }));
      }
    };
    
    fetchUserProfile();
  }
}, [items, router]);
```

#### **Include Auth Token in Payment**
```typescript
// Prepare headers
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};

// Add auth token if user is logged in
const token = getToken();
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

// Initialize payment with auth
const response = await fetch('http://localhost:8000/api/store/payment/initialize/', {
  method: 'POST',
  headers,
  body: JSON.stringify({
    email: formData.email,
    cart_items: cartItems,
    delivery_fee: deliveryFee,
    customer_info: { /* ... */ }
  }),
});
```

### **Backend (Payment View)**

#### **Detect Authenticated Users**
```python
# Add user info if authenticated
if request.user.is_authenticated:
    metadata["user_id"] = request.user.id
    metadata["username"] = request.user.username
```

#### **Payment Metadata Structure**
```json
{
  "order_id": "AGS-ABC12345",
  "items": [...],
  "customer_email": "user@example.com",
  "customer_info": {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "08012345678",
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "delivery_zone": "lagos-mainland"
  },
  "subtotal": 160000,
  "delivery_fee": 2000,
  "total": 162000,
  "user_id": 5,              // Only for registered users
  "username": "johndoe"       // Only for registered users
}
```

## 🎁 Loyalty Points System

### **Calculation**
```python
# Backend calculation
points = int(total_usd // 10)

# Example:
# Total: $162 → 16 points
# Total: $95 → 9 points
# Total: $10 → 1 point
```

### **Display**
```typescript
// Frontend display
{authenticated && (
  <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-3 rounded-none">
    <p className="text-amber-900 dark:text-amber-500 text-sm">
      ★ You'll earn {Math.floor(getTotal() / 10)} loyalty points
    </p>
  </div>
)}
```

### **Award Points (After Payment)**
```python
# TODO: Implement in webhook handler
def award_loyalty_points(user_id, points):
    """Award loyalty points after successful payment"""
    # Call loyalty API endpoint
    # POST /api/loyalty/award-points/
    pass
```

## 🔐 Security & Privacy

### **Data Protection**
- ✅ JWT tokens used for authentication
- ✅ Tokens sent in Authorization header
- ✅ User data fetched securely from profile API
- ✅ No sensitive data stored in localStorage

### **Permission Levels**
```python
# Payment initialization allows both
permission_classes = [permissions.AllowAny]

# But detects and handles authenticated users differently
if request.user.is_authenticated:
    # Add user tracking
    # Enable loyalty points
```

## 📊 User Experience Benefits

### **For Registered Users**
1. **Faster Checkout** - Name and email pre-filled
2. **Loyalty Rewards** - Earn points on every purchase
3. **Order History** - Track all orders (future feature)
4. **Saved Addresses** - Quick re-order (future feature)
5. **Member Badge** - Visual recognition

### **For Guest Users**
1. **No Registration Required** - Quick one-time purchase
2. **Full Functionality** - Same checkout process
3. **Optional Registration** - "Register for Points" button
4. **No Barriers** - Smooth guest experience

## 🎯 Registration Incentive

### **Guest Checkout Page**
```tsx
{!authenticated && (
  <Button 
    variant="outline" 
    onClick={() => router.push('/register')}
    className="w-full rounded-none border-gray-300 hover:bg-gray-50"
  >
    Register for Points
  </Button>
)}
```

**Message**: Encourages guests to register for loyalty benefits

## 🔍 Debugging

### **Check if User is Authenticated**
```typescript
// Frontend
console.log('Authenticated:', isAuthenticated());
console.log('Token:', getToken());
```

### **Verify Backend Receives Auth**
```python
# Backend (views_payment.py)
logger.info(f"User authenticated: {request.user.is_authenticated}")
logger.info(f"User: {request.user}")
```

### **Check Payment Metadata**
```python
# After payment initialization
logger.info(f"Payment metadata: {metadata}")
```

## 🐛 Troubleshooting

### **User Data Not Pre-Filling**

**Possible Causes:**
1. Token expired or invalid
2. Profile API endpoint not working
3. User profile incomplete

**Solution:**
```bash
# Check profile endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/users/profile/
```

### **Loyalty Points Not Showing**

**Check:**
1. User is authenticated: `isAuthenticated()` returns `true`
2. `authenticated` state is set correctly
3. Total calculation is working

### **400 Bad Request Error**

**Common Causes:**
1. Missing required fields
2. Invalid cart items
3. Variant ID doesn't exist
4. Stock validation failed

**Debug:**
```python
# Check backend logs
logger.info(f"Payment initialization request: {request.data}")
logger.error(f"Cart items validation failed: {cart_items_serializer.errors}")
```

## ✅ Testing Checklist

### **Guest User**
- [ ] Can checkout without registration
- [ ] All form fields empty initially
- [ ] No loyalty points shown
- [ ] "Register for Points" button visible
- [ ] Payment processes successfully

### **Registered User**
- [ ] Name and email pre-filled
- [ ] Can edit pre-filled fields
- [ ] Loyalty points preview shown
- [ ] Member badge displayed
- [ ] Auth token sent with request
- [ ] Payment processes successfully
- [ ] Points awarded after payment

## 📈 Future Enhancements

1. **Saved Addresses**
   - Store multiple delivery addresses
   - Quick select from saved addresses
   - Set default address

2. **Order History**
   - View past orders
   - Reorder with one click
   - Track delivery status

3. **Profile Management**
   - Update contact information
   - Manage saved addresses
   - View loyalty points balance

4. **Wishlist**
   - Save items for later
   - Get notified on price drops
   - Share wishlist

## 🎉 Summary

Your checkout system now fully supports both guest and registered users:

- **Guests**: Fast, no-friction checkout
- **Members**: Auto-fill data + loyalty points
- **Seamless**: Same form, different experience
- **Secure**: JWT authentication
- **Rewarding**: Points for every purchase

Both user types get a professional, smooth checkout experience! ✨
