# 🏆 AG's GearStore - Complete E-Commerce Platform

A modern, full-stack e-commerce platform for soccer gear featuring Paystack payment integration, user authentication, and a complete shopping experience. Built with Django REST Framework and Next.js.

[![Django](https://img.shields.io/badge/Django-5.2-green.svg)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Paystack](https://img.shields.io/badge/Payments-Paystack-orange.svg)](https://paystack.com/)

## 🌟 Live Demo

**Frontend**: [https://ags-gearstore.vercel.app](https://ags-gearstore.vercel.app)  
**Backend API**: [https://ags-gearstore-api.herokuapp.com](https://ags-gearstore-api.herokuapp.com)

## 🎯 Core Features

### 🛒 E-Commerce Features
- ✅ **Complete Product Catalog** - Soccer jerseys, cleats, and accessories with size variants
- ✅ **Advanced Shopping Cart** - Add/remove items with quantity management
- ✅ **Secure Payment Processing** - Paystack integration with webhook verification
- ✅ **Multi-step Checkout** - Guest checkout + registered user flow
- ✅ **Order Management** - Complete order tracking and history
- ✅ **Inventory Management** - Real-time stock tracking and low stock alerts

### 👤 User Experience
- ✅ **User Authentication** - JWT-based registration and login
- ✅ **Personalized Dashboard** - Order history and profile management
- ✅ **Loyalty Points System** - Earn points on purchases (1 point per $10)
- ✅ **Guest Checkout** - Purchase without registration
- ✅ **Responsive Design** - Perfect on mobile, tablet, and desktop
- ✅ **Dark Mode Support** - Modern UI with theme switching

### 💰 Nigerian Market Features
- ✅ **Naira Pricing** - All prices displayed in ₦ (₦1,600 = $1)
- ✅ **Local Delivery Zones** - 7 Nigerian cities with calculated shipping
- ✅ **Paystack Integration** - Trusted Nigerian payment processor
- ✅ **Local Customer Support** - Optimized for Nigerian users

## 🏗️ Technology Stack

### Backend Architecture
```
Django 5.2 + Django REST Framework
├── SQLite/PostgreSQL Database
├── JWT Authentication
├── Paystack Payment API
├── RESTful API Design
├── Automated Testing
└── Production-Ready Deployment
```

### Frontend Architecture
```
Next.js 16 + TypeScript
├── App Router (Latest Next.js)
├── Server & Client Components
├── TailwindCSS + Custom Design System
├── Framer Motion Animations
├── React Context State Management
├── Paystack Web SDK Integration
└── Progressive Web App (PWA) Ready
```

### DevOps & Deployment
- **Environment Management** - Secure `.env` configuration
- **Database Migrations** - Django migrations for schema changes
- **API Documentation** - Auto-generated OpenAPI/Swagger docs
- **Docker Support** - Containerized deployment ready
- **CI/CD Ready** - GitHub Actions workflow templates

## 📋 Prerequisites

- **Python 3.8+** with pip
- **Node.js 18+** with npm/yarn
- **Paystack Account** - [Sign up at paystack.com](https://paystack.com)
- **Git** for version control

## 🚀 Quick Start (5 Minutes)

### 1. One-Command Setup
```bash
git clone https://github.com/yourusername/ags-gearstore.git
cd ags-gearstore
chmod +x install_dependencies.sh
./install_dependencies.sh
```

### 2. Configure Paystack
Get your API keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developers):

**Backend** (`gearstore_backend/.env`):
```bash
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_CALLBACK_URL=http://localhost:3000/payment/callback
```

**Frontend** (`ag-gearstore/.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

### 3. Launch Application
```bash
# Terminal 1 - Backend
cd gearstore_backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python manage.py migrate
python manage.py runserver

# Terminal 2 - Frontend
cd ag-gearstore
npm run dev
```

### 4. Access Your Store
- 🏪 **Store**: http://localhost:3000
- 🔧 **Admin Panel**: http://localhost:8000/admin
- 📚 **API Docs**: http://localhost:8000/docs

## 💳 Payment Testing

### Test Cards (Paystack Test Mode)
```bash
# Successful Payment
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: 12/25
PIN: 0000
OTP: 123456

# Failed Payment
Card Number: 5060 6666 6666 6666
CVV: 123
Expiry: 12/25
```

## 🏪 Store Features

### Product Management
- **Dynamic Product Catalog** - Add/edit products via Django admin
- **Size Variants** - Multiple sizes per product (S, M, L, XL, etc.)
- **Stock Management** - Real-time inventory tracking
- **Product Categories** - Organized browsing experience
- **Product Images** - High-quality product photography

### Shopping Experience
- **Visual Product Cards** - Hover effects and smooth animations
- **Quick Add to Cart** - One-click size selection modal
- **Cart Persistence** - Items saved in localStorage
- **Quantity Management** - Increase/decrease item quantities
- **Cart Summary** - Real-time total calculations
- **Empty Cart Handling** - Graceful empty state

### Checkout Process
- **Multi-step Form** - Contact info → delivery → payment
- **Form Validation** - Real-time validation with error messages
- **Delivery Zones** - 7 Nigerian cities with calculated fees:
  - Lagos Mainland: ₦2,000
  - Lagos Island: ₦2,500
  - Abuja: ₦3,000
  - Port Harcourt: ₦3,500
  - Ibadan: ₦2,500
  - Kano: ₦4,000
  - Other Cities: ₦4,500
- **Order Summary** - Complete order review before payment
- **Payment Security** - SSL encryption + Paystack security

### User System
- **Registration/Login** - Secure JWT authentication
- **Profile Management** - Update personal information
- **Order History** - Track all past orders
- **Loyalty Points** - Earn 1 point per ₦1,600 spent
- **Password Reset** - Secure password recovery
- **Session Management** - Automatic logout on inactivity

## 🔧 API Architecture

### RESTful Endpoints
```
Products API
├── GET    /api/store/products/          # List products
├── GET    /api/store/products/{id}/     # Product details
├── GET    /api/store/categories/        # Product categories
└── GET    /api/store/products/{id}/variants/  # Size variants

Payment API
├── POST   /api/store/payment/initialize/  # Start payment
├── GET    /api/store/payment/verify/{ref}/ # Verify payment
└── POST   /api/store/payment/webhook/    # Paystack webhooks

User API
├── POST   /api/users/register/          # User registration
├── POST   /api/users/login/             # User login
├── GET    /api/users/profile/           # User profile
└── PUT    /api/users/profile/           # Update profile
```

### Authentication Flow
```javascript
// JWT Token Flow
POST /api/users/login/ → { token, user }
Authorization: Bearer {token}
GET /api/users/profile/ → user data
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue-950 (#1e293b) - Trust and professionalism
- **Secondary**: Amber-500 (#f59e0b) - Energy and excitement
- **Accent**: Blue-600 (#2563eb) - Action buttons
- **Neutral**: Gray-900/100 - Text and backgrounds

### Typography
- **Primary Font**: Geist Sans (Google Fonts)
- **Code Font**: Geist Mono
- **Hierarchy**: Consistent heading sizes and spacing

### Components
- **Buttons**: Rounded-none design with hover states
- **Cards**: Clean shadows with smooth transitions
- **Forms**: Inline validation with error states
- **Modals**: Centered overlays with backdrop blur
- **Navigation**: Minimalist header with cart indicator

## 🚀 Deployment Guide

### Backend Deployment (Railway/Heroku)
```bash
# 1. Create app on Railway/Heroku
# 2. Set environment variables
DEBUG=False
PAYSTACK_SECRET_KEY=sk_live_your_live_key
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key
ALLOWED_HOSTS=your-app-domain.com

# 3. Database setup
python manage.py migrate

# 4. Static files
python manage.py collectstatic
```

### Frontend Deployment (Vercel)
```bash
# 1. Connect GitHub repository
# 2. Set environment variables
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_key

# 3. Deploy
npm run build  # Automatic on Vercel
```

### Production Checklist
- [ ] HTTPS enabled
- [ ] Database migrated
- [ ] Static files served
- [ ] Environment variables set
- [ ] Paystack webhook URL configured
- [ ] Domain configured
- [ ] SSL certificate active

## 🧪 Testing Strategy

### Backend Testing
```bash
cd gearstore_backend
python manage.py test store.tests
python manage.py test users.tests
```

### Frontend Testing
```bash
cd ag-gearstore
npm run test
npm run test:e2e  # End-to-end tests
```

### Payment Testing
```bash
# Test payment initialization
curl -X POST http://localhost:8000/api/store/payment/initialize/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","cart_items":[],"delivery_fee":2000}'
```

## 🐛 Troubleshooting

### Common Issues

**Backend: ModuleNotFoundError**
```bash
cd gearstore_backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend: Dependencies Missing**
```bash
cd ag-gearstore
rm -rf node_modules package-lock.json
npm install
```

**Payment: 401 Unauthorized**
- Check Paystack keys in `.env` files
- Verify keys are for test/live mode consistently
- Restart backend server after key changes

**Database: Migration Errors**
```bash
cd gearstore_backend
python manage.py makemigrations
python manage.py migrate
```

**Frontend: Environment Variables**
```bash
# Delete .next folder and restart
rm -rf .next
npm run dev
```

## 📊 Performance Optimizations

### Frontend
- **Image Optimization** - Next.js automatic image optimization
- **Code Splitting** - Automatic route-based splitting
- **Lazy Loading** - Components loaded on demand
- **Caching** - Browser caching for static assets

### Backend
- **Database Indexing** - Optimized queries
- **Caching** - Redis ready for session/product caching
- **Pagination** - Efficient large dataset handling
- **Rate Limiting** - API rate limiting ready

## 🔐 Security Features

- ✅ **Environment Variables** - No secrets in code
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **CORS Protection** - Configured allowed origins
- ✅ **Input Validation** - Django forms + frontend validation
- ✅ **SQL Injection Prevention** - Django ORM protection
- ✅ **XSS Protection** - React automatic escaping
- ✅ **CSRF Protection** - Django CSRF tokens

## 📈 Analytics & Monitoring

### Built-in Features
- **Order Tracking** - Complete order lifecycle
- **Payment Analytics** - Success/failure rates
- **User Behavior** - Cart abandonment tracking
- **Performance Monitoring** - Response times and errors

### Integration Ready
- **Google Analytics** - User behavior tracking
- **Paystack Analytics** - Payment insights
- **Error Monitoring** - Sentry integration ready
- **Performance Monitoring** - New Relic ready

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

### Code Standards
- **Backend**: PEP 8 Python style
- **Frontend**: ESLint + Prettier
- **Commits**: Conventional commit format
- **Tests**: 80%+ code coverage target

### Pull Request Process
1. Update documentation for new features
2. Add tests for new functionality
3. Ensure CI/CD passes
4. Code review required
5. Squash and merge

## 📄 License

This project is proprietary. All rights reserved.

## 🆘 Support

**Need Help?**
- 📧 **Email**: support@agsgearstore.com
- 💬 **Discord**: [Join our community](https://discord.gg/agsgearstore)
- 📚 **Documentation**: Check inline code comments
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/ags-gearstore/issues)

## 🎉 Acknowledgments

**Built with ❤️ for soccer fans worldwide**

### Core Technologies
- **Paystack** - Secure Nigerian payment processing
- **Django** - Battle-tested Python web framework
- **Next.js** - The React framework for production
- **TailwindCSS** - Utility-first CSS framework

### Inspiration
- **Soccer Culture** - Celebrating football passion
- **Nigerian Tech** - Supporting local innovation
- **Open Source** - Standing on giants' shoulders

---

**AG's GearStore** - Where soccer meets technology. ⚽💻

*Ready to score big with your e-commerce platform?* 🚀
