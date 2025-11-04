# AG's GearStore

A modern e-commerce platform for soccer gear with Paystack payment integration, built with Django REST Framework and Next.js.

## 🎯 Features

- ✅ **Product Catalog** - Browse soccer jerseys, cleats, and accessories
- ✅ **Shopping Cart** - Add items with size selection
- ✅ **Secure Payments** - Paystack integration for card payments
- ✅ **User Authentication** - JWT-based auth with loyalty points
- ✅ **Guest Checkout** - Buy without creating an account
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Dark Mode** - Modern UI with dark theme support

## 🏗️ Tech Stack

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Database (easily switchable to PostgreSQL)
- **JWT Authentication** - Secure token-based auth
- **Paystack API** - Payment processing

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **React Context** - State management

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn
- Paystack account ([Sign up here](https://paystack.com))

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd "AG's"
chmod +x install_dependencies.sh
./install_dependencies.sh
```

### 2. Configure Environment Variables

#### Backend (.env)
Edit `gearstore_backend/.env`:
```bash
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

#### Frontend (.env.local)
Edit `ag-gearstore/.env.local`:
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd gearstore_backend
source venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend
cd ag-gearstore
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📚 Documentation

- **[Environment Setup Guide](ENV_SETUP_GUIDE.md)** - Complete .env configuration
- **[Paystack Quick Start](PAYSTACK_QUICK_START.md)** - 5-minute payment setup
- **[Paystack Full Setup](PAYSTACK_SETUP.md)** - Detailed payment integration
- **[Cart System](CART_SYSTEM.md)** - Shopping cart documentation
- **[Design Update](DESIGN_UPDATE.md)** - UI/UX design system

## 🔧 Project Structure

```
AG's/
├── gearstore_backend/          # Django backend
│   ├── store/                  # Store app (products, orders)
│   ├── users/                  # User authentication
│   ├── loyalty/                # Loyalty points system
│   ├── fanzone/                # Fan community features
│   ├── .env                    # Environment variables (gitignored)
│   ├── .env.example            # Environment template
│   └── requirements.txt        # Python dependencies
│
├── ag-gearstore/               # Next.js frontend
│   ├── src/
│   │   ├── app/                # Next.js pages
│   │   ├── components/         # React components
│   │   ├── contexts/           # React contexts (cart, etc.)
│   │   └── lib/                # Utilities and API clients
│   ├── .env.local              # Environment variables (gitignored)
│   ├── .env.example            # Environment template
│   └── package.json            # Node dependencies
│
└── Documentation files         # Setup guides and docs
```

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ `.env` files gitignored
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Paystack webhook verification (TODO)

## 💳 Payment Testing

### Test Cards (Paystack Test Mode)

**Successful Payment:**
```
Card: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

**Failed Payment:**
```
Card: 5060 6666 6666 6666
CVV: 123
Expiry: Any future date
```

## 🧪 Testing the Application

1. **Browse Products**
   - Visit http://localhost:3000
   - Click "Shop" to see products

2. **Add to Cart**
   - Click "Add to Cart" on any product
   - Select size
   - View cart icon badge update

3. **Checkout**
   - Go to cart
   - Click "Proceed to Checkout"
   - Enter email
   - Complete payment with test card

4. **Verify Payment**
   - Redirected to success page
   - Cart cleared automatically

## 📦 API Endpoints

### Products
- `GET /api/store/products/` - List all products
- `GET /api/store/products/{id}/` - Get product details
- `GET /api/store/categories/` - List categories

### Payment
- `POST /api/store/payment/initialize/` - Initialize payment
- `GET /api/store/payment/verify/{ref}/` - Verify payment
- `POST /api/store/payment/webhook/` - Paystack webhook

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user
- `GET /api/users/profile/` - Get user profile

## 🚀 Deployment

### Backend (Django)

1. Update `.env` for production:
```bash
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
PAYSTACK_SECRET_KEY=sk_live_your_live_key
```

2. Use PostgreSQL or MySQL instead of SQLite
3. Set up static file serving
4. Configure webhook URL in Paystack dashboard

### Frontend (Next.js)

1. Update `.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_key
```

2. Build for production:
```bash
npm run build
npm start
```

3. Deploy to Vercel, Netlify, or your preferred host

## 🐛 Troubleshooting

### Backend Issues

**Module not found errors:**
```bash
cd gearstore_backend
source venv/bin/activate
pip install -r requirements.txt
```

**Database errors:**
```bash
python manage.py migrate
```

### Frontend Issues

**Dependencies not installed:**
```bash
cd ag-gearstore
npm install
```

**Environment variables not loading:**
- Restart dev server after changing `.env.local`
- Ensure variables start with `NEXT_PUBLIC_`

### Payment Issues

**Payment initialization fails:**
- Check Paystack keys in `.env`
- Verify keys are correct (test vs live)
- Check backend logs for errors

**Callback not working:**
- Ensure frontend is running on port 3000
- Check callback URL in Paystack settings

## 📝 Development Workflow

1. **Create feature branch**
```bash
git checkout -b feature/your-feature
```

2. **Make changes**
- Backend: Edit files in `gearstore_backend/`
- Frontend: Edit files in `ag-gearstore/src/`

3. **Test locally**
- Run both servers
- Test functionality
- Check for errors

4. **Commit and push**
```bash
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
- Check documentation files
- Review Paystack docs: https://paystack.com/docs
- Contact: your-email@example.com

## 🎉 Acknowledgments

- Paystack for payment processing
- Next.js team for the amazing framework
- Django community for the robust backend

---

**Made with ❤️ for soccer fans worldwide**
