# Paystack Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Get Paystack Keys (2 minutes)
1. Go to [https://paystack.com](https://paystack.com)
2. Sign up or log in
3. Navigate to: **Settings → API Keys & Webhooks**
4. Copy your keys:
   - Secret Key (starts with `sk_test_`)
   - Public Key (starts with `pk_test_`)

### Step 2: Configure Backend (1 minute)
Open `gearstore_backend/.env` and update:

```bash
# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
PAYSTACK_PUBLIC_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
```

**Note**: Never commit the `.env` file to git!

### Step 3: Install Dependencies (1 minute)
```bash
cd gearstore_backend
source venv/bin/activate
pip install -r requirements.txt
# Or manually: pip install python-dotenv requests
```

### Step 4: Start Servers (1 minute)
```bash
# Terminal 1 - Backend
cd gearstore_backend
source venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend  
cd ag-gearstore
npm run dev
```

## ✅ Test Payment Flow

1. Visit: `http://localhost:3000`
2. Add items to cart
3. Go to checkout
4. Enter email: `test@example.com`
5. Click "Place Order"
6. Use test card:
   - **Card**: 4084 0840 8408 4081
   - **CVV**: 408
   - **Expiry**: Any future date
   - **PIN**: 0000
   - **OTP**: 123456

## 🎯 What Was Added

### Backend Files
- ✅ `store/payment.py` - Paystack API wrapper
- ✅ `store/views_payment.py` - Payment endpoints
- ✅ `store/models_payment.py` - Order models (ready to migrate)
- ✅ Updated `store/urls.py` - Payment routes
- ✅ Updated `settings.py` - Paystack config

### Frontend Files
- ✅ `lib/paystack.ts` - Payment utilities
- ✅ `app/payment/callback/page.tsx` - Success/failure page
- ✅ Updated `app/checkout/page.tsx` - Payment integration

### API Endpoints
- ✅ `POST /api/store/payment/initialize/` - Start payment
- ✅ `GET /api/store/payment/verify/{ref}/` - Verify payment
- ✅ `POST /api/store/payment/webhook/` - Webhook handler

## 🔄 Payment Flow

```
User adds to cart → Checkout → Enter email → 
Initialize payment → Redirect to Paystack → 
User pays → Redirect back → Verify payment → 
Show success → Clear cart
```

## 💳 Test Cards

### Success
- Card: `4084 0840 8408 4081`
- CVV: `408`
- PIN: `0000`
- OTP: `123456`

### Failure
- Card: `5060 6666 6666 6666`
- CVV: `123`

## 🐛 Troubleshooting

**Payment initialization fails?**
- Check your API keys are correct
- Verify backend is running on port 8000
- Check browser console for errors

**Callback page not loading?**
- Ensure frontend is running on port 3000
- Check the callback URL in settings.py

**Payment not verifying?**
- Wait a few seconds after payment
- Check Paystack dashboard for transaction
- Verify reference is correct

## 📚 Full Documentation

For detailed setup, security, production deployment, and more:
- See `PAYSTACK_SETUP.md`

## 🎉 You're Ready!

Your payment system is now configured. Test it with the test cards above, then replace with live keys when ready to go live!

---

**Need Help?**
- Paystack Docs: https://paystack.com/docs
- Support: support@paystack.com
