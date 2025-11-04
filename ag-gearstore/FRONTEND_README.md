# AG's GearStore - Frontend

## Auth UI for fans, guest checkout for quick buys

Next.js 16 authentication and shopping interface with navy/gold theme.

## Features

### Authentication
- **Login**: `/login` - User authentication with JWT tokens
- **Register**: `/register` - New user registration with auto-login
- **Profile**: `/profile` - View user profile, favorite teams, and gear points
- **Guest Checkout**: Quick purchases without registration

### Components

#### Auth Components
- `LoginForm.tsx` - Username/password login with error handling
- `RegisterForm.tsx` - User registration form (username, email, password)
- `GuestCheckoutButton.tsx` - Quick access to guest checkout flow
- `Navbar.tsx` - Dynamic navigation (shows Login/Register for guests, Profile/Logout for authenticated users)

#### Auth Library (`lib/auth.ts`)
- `login()` - Authenticate user, store JWT tokens in localStorage
- `register()` - Create new user account, auto-login after success
- `logout()` - Clear authentication tokens
- `getToken()` - Retrieve current access token
- `isAuthenticated()` - Check if user is logged in

### Pages

- `/` - Home page with brand introduction
- `/login` - Login page with navy/gold gradient
- `/register` - Registration page with gold/navy gradient
- `/profile` - Protected user profile page
- `/checkout/guest` - Guest checkout flow (placeholder)

### Styling

**Theme**: Navy blue (`blue-950`, `blue-900`) + Gold/Amber (`amber-500`, `amber-600`)

**Features**:
- Responsive design (mobile-first)
- Dark mode support
- Gradient backgrounds
- Tailwind CSS utility classes
- Error toast notifications

### API Integration

Backend URL: `http://localhost:8000`

**Endpoints**:
- `POST /api/users/login/` - Login
- `POST /api/users/register/` - Register
- `POST /api/users/refresh/` - Refresh token
- `GET /api/users/profile/` - Get user profile
- `POST /api/store/guest-checkout/` - Guest checkout
- `POST /api/store/auth-checkout/` - Authenticated checkout

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### Test Users

- **fan1** / password123 (Favorite team: Arsenal)
- **fan2** / password123 (Favorite team: PSG)

### Error Handling

- Invalid credentials display in-form error messages
- Duplicate username/email errors from backend
- Automatic redirect to login for protected routes
- Token expiration handling

### Security

- JWT tokens stored in localStorage
- Protected routes check authentication
- CORS enabled for localhost:3000
- Password validation on backend

### Future Enhancements

- Product browsing and cart
- Complete guest checkout flow
- Loyalty points display and redemption
- Order history
- Team-based product filtering
