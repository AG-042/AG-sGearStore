# Paystack Payment Integration

## Overview
Complete Paystack payment integration for AG's GearStore with backend API and frontend checkout flow.

## 🎯 Features

### Backend
- ✅ Payment initialization endpoint
- ✅ Payment verification endpoint
- ✅ Webhook handler for payment events
- ✅ Order tracking with payment status
- ✅ Stock validation before payment
- ✅ Automatic cart total calculation

### Frontend
- ✅ Seamless checkout flow
- ✅ Payment callback handling
- ✅ Success/failure pages
- ✅ Cart clearing on successful payment
- ✅ Order reference tracking

## 📋 Setup Instructions

### 1. Get Paystack API Keys

1. Sign up at [https://paystack.com](https://paystack.com)
2. Go to Settings → API Keys & Webhooks
3. Copy your:
   - **Public Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. Configure Backend

Update `/gearstore_backend/gearstore_backend/settings.py`:

```python
# Paystack Configuration
PAYSTACK_SECRET_KEY = 'sk_test_your_actual_secret_key_here'
PAYSTACK_PUBLIC_KEY = 'pk_test_your_actual_public_key_here'
PAYSTACK_CALLBACK_URL = 'http://localhost:3000/payment/callback'
```

⚠️ **Important**: Replace the placeholder keys with your actual Paystack keys!

### 3. Install Python Dependencies

```bash
cd gearstore_backend
source venv/bin/activate
pip install requests
```

### 4. Test the Integration

Start both servers:

```bash
# Terminal 1 - Backend
cd gearstore_backend
source venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend
cd ag-gearstore
npm run dev
```

## 🔄 Payment Flow

### User Journey

```
1. User adds items to cart
   ↓
2. Goes to checkout (/checkout)
   ↓
3. Enters email address
   ↓
4. Clicks "Place Order"
   ↓
5. Backend initializes payment with Paystack
   ↓
6. User redirected to Paystack payment page
   ↓
7. User completes payment (card/bank/USSD)
   ↓
8. Paystack redirects to callback URL
   ↓
9. Backend verifies payment
   ↓
10. Success page shown, cart cleared
```

### Technical Flow

```
Frontend                Backend                 Paystack
   |                       |                       |
   |-- POST /payment/initialize/ ----------------->|
   |                       |                       |
   |                       |<-- Initialize ------->|
   |                       |                       |
   |<-- authorization_url --|                      |
   |                       |                       |
   |-- Redirect user ------------------------------>|
   |                       |                       |
   |                       |                  (User pays)
   |                       |                       |
   |<-- Redirect to callback ----------------------|
   |                       |                       |
   |-- GET /payment/verify/{ref} ----------------->|
   |                       |                       |
   |                       |<-- Verify ----------->|
   |                       |                       |
   |<-- Payment status -----|                      |
   |                       |                       |
```

## 🔌 API Endpoints

### Initialize Payment
```http
POST /api/store/payment/initialize/
Content-Type: application/json

{
  "email": "customer@example.com",
  "cart_items": [
    {
      "variant_id": 1,
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "status": true,
  "message": "Payment initialized successfully",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "abc123",
    "reference": "AGS-ORDER123-ABC12345",
    "order_id": "AGS-ORDER123",
    "amount": 50000.00
  }
}
```

### Verify Payment
```http
GET /api/store/payment/verify/{reference}/
```

**Response:**
```json
{
  "status": true,
  "message": "Payment verified successfully",
  "data": {
    "reference": "AGS-ORDER123-ABC12345",
    "amount": 50000.00,
    "status": "success",
    "paid_at": "2025-11-04T01:30:00Z",
    "customer": {
      "email": "customer@example.com"
    },
    "metadata": {
      "order_id": "AGS-ORDER123",
      "items": [...]
    }
  }
}
```

### Webhook (for Paystack callbacks)
```http
POST /api/store/payment/webhook/
Content-Type: application/json

{
  "event": "charge.success",
  "data": {
    "reference": "AGS-ORDER123-ABC12345",
    "amount": 5000000,
    "status": "success"
  }
}
```

## 💰 Currency & Amounts

Paystack uses **kobo** (smallest currency unit):
- 1 Naira = 100 kobo
- Amount of ₦500.00 = 50000 kobo

The backend automatically converts:
```python
# Backend handles conversion
amount_in_kobo = int(amount * 100)
```

## 🔐 Security

### API Keys
- ✅ Never commit API keys to git
- ✅ Use environment variables in production
- ✅ Use test keys for development
- ✅ Rotate keys periodically

### Webhook Verification
```python
# TODO: Implement webhook signature verification
import hmac
import hashlib

def verify_webhook_signature(payload, signature):
    secret = settings.PAYSTACK_SECRET_KEY
    hash = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha512
    ).hexdigest()
    return hash == signature
```

## 📱 Frontend Components

### Checkout Page
- Location: `/src/app/checkout/page.tsx`
- Handles payment initialization
- Redirects to Paystack

### Payment Callback
- Location: `/src/app/payment/callback/page.tsx`
- Verifies payment
- Shows success/failure
- Clears cart on success

### Paystack Utilities
- Location: `/src/lib/paystack.ts`
- Helper functions for API calls

## 🧪 Testing

### Test Cards (Paystack Test Mode)

**Successful Payment:**
```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

**Failed Payment:**
```
Card Number: 5060 6666 6666 6666
CVV: 123
Expiry: Any future date
```

### Test Flow

1. Add items to cart
2. Go to checkout
3. Enter test email: `test@example.com`
4. Use test card details above
5. Complete payment
6. Verify callback page shows success

## 🚀 Production Deployment

### Environment Variables

Create `.env` file:
```bash
# Backend
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_CALLBACK_URL=https://yourdomain.com/payment/callback

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Django Settings (Production)
```python
import os
from dotenv import load_dotenv

load_dotenv()

PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY')
PAYSTACK_PUBLIC_KEY = os.getenv('PAYSTACK_PUBLIC_KEY')
PAYSTACK_CALLBACK_URL = os.getenv('PAYSTACK_CALLBACK_URL')
```

### Webhook Setup

1. Go to Paystack Dashboard → Settings → Webhooks
2. Add webhook URL: `https://api.yourdomain.com/api/store/payment/webhook/`
3. Select events to listen for:
   - `charge.success`
   - `charge.failed`
   - `transfer.success`

## 📊 Order Management

### Database Models (To be migrated)

```python
# store/models_payment.py contains:
- Order model (tracks orders)
- OrderItem model (individual items)
- PaymentTransaction model (payment records)
```

### Migration Commands
```bash
cd gearstore_backend
python manage.py makemigrations
python manage.py migrate
```

## 🐛 Troubleshooting

### Payment Initialization Fails
- ✅ Check API keys are correct
- ✅ Verify email format is valid
- ✅ Ensure cart items have valid variant IDs
- ✅ Check backend logs for errors

### Payment Verification Fails
- ✅ Verify reference is correct
- ✅ Check payment was actually completed
- ✅ Ensure callback URL is accessible
- ✅ Check Paystack dashboard for transaction status

### Webhook Not Receiving Events
- ✅ Verify webhook URL is publicly accessible
- ✅ Check webhook signature verification
- ✅ Review Paystack webhook logs
- ✅ Test with Paystack webhook tester

## 📚 Resources

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack API Reference](https://paystack.com/docs/api)
- [Test Cards](https://paystack.com/docs/payments/test-payments)
- [Webhook Events](https://paystack.com/docs/payments/webhooks)

## ✅ Checklist

Before going live:
- [ ] Replace test keys with live keys
- [ ] Set up environment variables
- [ ] Configure webhook URL
- [ ] Test with real card (small amount)
- [ ] Implement order confirmation emails
- [ ] Add order history page
- [ ] Set up error monitoring
- [ ] Configure SSL certificate
- [ ] Test callback URL is accessible
- [ ] Implement webhook signature verification

## 🎉 Next Steps

1. **Get your Paystack keys** from dashboard
2. **Update settings.py** with your keys
3. **Test the payment flow** with test cards
4. **Customize success/failure pages** as needed
5. **Implement order tracking** for customers
6. **Add email notifications** for orders
7. **Set up webhook handlers** for automated processing

---

**Need Help?**
- Paystack Support: support@paystack.com
- Documentation: https://paystack.com/docs
