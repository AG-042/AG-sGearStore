# Environment Variables Setup Guide

## Overview
This guide explains how to configure environment variables for both backend (Django) and frontend (Next.js) using `.env` files.

## 🔐 Security Benefits

Using `.env` files provides:
- ✅ **Security**: API keys not hardcoded in source code
- ✅ **Flexibility**: Different configs for dev/staging/production
- ✅ **Git Safety**: `.env` files are gitignored
- ✅ **Team Collaboration**: `.env.example` shows required variables

## 📁 File Structure

```
AG's/
├── gearstore_backend/
│   ├── .env                    # Your actual config (gitignored)
│   ├── .env.example            # Template for team
│   ├── .gitignore              # Ignores .env
│   └── requirements.txt        # Includes python-dotenv
│
└── ag-gearstore/
    ├── .env.local              # Your actual config (gitignored)
    ├── .env.example            # Template for team
    └── .gitignore              # Already ignores .env*
```

## 🔧 Backend Setup (Django)

### Step 1: Install Dependencies

```bash
cd gearstore_backend
source venv/bin/activate
pip install python-dotenv requests
```

Or install from requirements.txt:
```bash
pip install -r requirements.txt
```

### Step 2: Configure .env File

Edit `gearstore_backend/.env`:

```bash
# Django Settings
SECRET_KEY=django-insecure-$^zbvk*ec!(_bcc(@9%u1$ai^-+-^b@w1k_6$lt*1$61bdn9sy
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your_actual_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here
PAYSTACK_CALLBACK_URL=http://localhost:3000/payment/callback

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Step 3: Get Paystack Keys

1. Go to [https://dashboard.paystack.com](https://dashboard.paystack.com)
2. Navigate to: **Settings → API Keys & Webhooks**
3. Copy your keys:
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - **Public Key** (starts with `pk_test_` or `pk_live_`)
4. Paste them in your `.env` file

### Step 4: Verify Configuration

The `settings.py` file now automatically loads from `.env`:

```python
from dotenv import load_dotenv
import os

load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
PAYSTACK_SECRET_KEY = os.getenv('PAYSTACK_SECRET_KEY')
```

## 🎨 Frontend Setup (Next.js)

### Step 1: Configure .env.local

Edit `ag-gearstore/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Paystack Public Key (for frontend)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_public_key_here
```

⚠️ **Note**: In Next.js, variables must be prefixed with `NEXT_PUBLIC_` to be accessible in the browser.

### Step 2: Access in Code

```typescript
// In your TypeScript/JavaScript files
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
```

### Step 3: Restart Dev Server

After changing `.env.local`, restart your Next.js dev server:

```bash
# Stop with Ctrl+C, then:
npm run dev
```

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `SECRET_KEY` | Django secret key | `django-insecure-...` | Yes |
| `DEBUG` | Debug mode | `True` or `False` | Yes |
| `ALLOWED_HOSTS` | Allowed hostnames | `localhost,127.0.0.1` | Yes |
| `DATABASE_URL` | Database connection | `sqlite:///db.sqlite3` | Yes |
| `PAYSTACK_SECRET_KEY` | Paystack secret key | `sk_test_...` | Yes |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key | `pk_test_...` | Yes |
| `PAYSTACK_CALLBACK_URL` | Payment callback URL | `http://localhost:3000/payment/callback` | Yes |
| `CORS_ALLOWED_ORIGINS` | CORS origins | `http://localhost:3000` | Yes |

### Frontend (.env.local)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` | Yes |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key | `pk_test_...` | Yes |

## 🚀 Production Configuration

### Backend Production (.env)

```bash
# Django Settings
SECRET_KEY=your-super-secret-production-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database (PostgreSQL example)
DATABASE_URL=postgresql://user:password@localhost:5432/gearstore

# Paystack Configuration (LIVE KEYS)
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_CALLBACK_URL=https://yourdomain.com/payment/callback

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend Production (.env.production)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Paystack Public Key (LIVE KEY)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
```

## 🔒 Security Best Practices

### DO ✅
- ✅ Use `.env` files for all sensitive data
- ✅ Add `.env` to `.gitignore`
- ✅ Provide `.env.example` for team members
- ✅ Use different keys for dev/staging/production
- ✅ Rotate keys periodically
- ✅ Use strong, random SECRET_KEY in production

### DON'T ❌
- ❌ Commit `.env` files to git
- ❌ Share API keys in chat/email
- ❌ Use production keys in development
- ❌ Hardcode secrets in source code
- ❌ Use weak or default SECRET_KEY in production

## 🧪 Testing Configuration

### Verify Backend

```bash
cd gearstore_backend
source venv/bin/activate
python manage.py shell
```

```python
from django.conf import settings

# Check if variables are loaded
print(settings.PAYSTACK_SECRET_KEY)
print(settings.PAYSTACK_PUBLIC_KEY)
print(settings.DEBUG)
```

### Verify Frontend

Create a test page or check browser console:

```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Paystack Key:', process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
```

## 🐛 Troubleshooting

### Backend: Variables Not Loading

**Problem**: Settings show default values instead of `.env` values

**Solution**:
1. Check `.env` file exists in `gearstore_backend/` directory
2. Verify `python-dotenv` is installed: `pip install python-dotenv`
3. Restart Django server
4. Check for syntax errors in `.env` file (no spaces around `=`)

### Frontend: Variables Undefined

**Problem**: `process.env.NEXT_PUBLIC_*` is undefined

**Solution**:
1. Check `.env.local` file exists in `ag-gearstore/` directory
2. Verify variable names start with `NEXT_PUBLIC_`
3. Restart Next.js dev server (Ctrl+C, then `npm run dev`)
4. Check for typos in variable names

### Paystack Keys Not Working

**Problem**: Payment initialization fails

**Solution**:
1. Verify you're using the correct keys (test vs live)
2. Check keys are complete (no truncation)
3. Ensure no extra spaces in `.env` file
4. Test keys in Paystack dashboard
5. Check your Paystack account is active

## 📚 Additional Resources

- [Django python-dotenv](https://pypi.org/project/python-dotenv/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Paystack API Keys](https://paystack.com/docs/api/#authentication)
- [12-Factor App Config](https://12factor.net/config)

## ✅ Quick Checklist

Before starting development:
- [ ] Created `.env` file in `gearstore_backend/`
- [ ] Created `.env.local` file in `ag-gearstore/`
- [ ] Added Paystack keys to both files
- [ ] Installed `python-dotenv` in backend
- [ ] Verified `.env` is in `.gitignore`
- [ ] Tested backend loads variables correctly
- [ ] Tested frontend loads variables correctly
- [ ] Restarted both servers after changes

## 🎉 You're All Set!

Your environment variables are now properly configured. Remember:
- Keep your `.env` files secure and never commit them
- Use `.env.example` files to document required variables
- Use different keys for development and production
- Rotate your API keys regularly

Happy coding! 🚀
