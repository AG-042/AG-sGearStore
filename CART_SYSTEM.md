# Shopping Cart System

## Overview
A complete shopping cart implementation using React Context API with localStorage persistence and proper product variant handling.

## Features

### ✅ Cart Context (`/src/contexts/CartContext.tsx`)
- **Persistent Storage**: Cart data saved to localStorage
- **Variant-Based**: Each cart item tracks specific product variant (size)
- **Price Locking**: Prices captured at time of adding to cart
- **Quantity Management**: Add, update, remove items
- **Total Calculation**: Real-time cart total and item count

### ✅ Cart UI Components

#### Cart Icon (`/src/components/CartIcon.tsx`)
- Badge showing item count
- Located in navbar
- Links to cart page

#### Cart Page (`/src/app/cart/page.tsx`)
- View all cart items with images
- Adjust quantities with +/- buttons
- Remove individual items
- Clear entire cart
- Order summary with totals
- Proceed to checkout button

#### Toaster (`/src/components/Toaster.tsx`)
- Global toast notifications
- Auto-dismiss after 3 seconds
- Success and error variants
- Animated entrance/exit

### ✅ Product Integration

#### Product Detail Page (`/src/app/shop/[id]/page.tsx`)
- **Size Selection**: Dropdown with available sizes and stock
- **Quantity Selector**: +/- buttons to choose quantity
- **Add to Cart**: Validates size selection and stock
- **Buy Now**: Adds to cart and redirects to cart page
- **Toast Notifications**: Feedback on add to cart actions

### ✅ Checkout Flow (`/src/app/checkout/page.tsx`)
- Displays all cart items with images
- Order summary with totals
- Loyalty points preview for authenticated users
- Sends variant-based cart data to backend
- Clears cart on successful order
- Redirects to home after completion

## Backend Integration

### API Endpoints
- `POST /api/store/guest-checkout/` - Guest checkout
- `POST /api/store/auth-checkout/` - Authenticated checkout with points

### Request Format
```json
{
  "cart_items": [
    {
      "variant_id": 1,
      "quantity": 2
    }
  ]
}
```

### Backend Validation
- Stock availability checked per variant
- Price calculated from variant.price_override or product.base_price
- Loyalty points calculated (1 point per $10)

## Data Flow

1. **Add to Cart**
   - User selects size and quantity on product page
   - Click "Add to Cart"
   - Item added to CartContext with variant details
   - Cart saved to localStorage
   - Toast notification shown
   - Cart icon badge updates

2. **View Cart**
   - Navigate to `/cart`
   - See all items with images, sizes, quantities
   - Adjust quantities or remove items
   - Changes persist to localStorage

3. **Checkout**
   - Click "Proceed to Checkout"
   - Review order items
   - See order summary with totals
   - Click "Place Order"
   - Cart items formatted as variant_id + quantity
   - Sent to backend API
   - On success: cart cleared, redirect to home

## Cart Item Structure

```typescript
interface CartItem {
  product: Product;        // Full product details
  variantId: number;       // Specific variant ID
  size: string;            // Size label (e.g., "M", "XL")
  quantity: number;        // Quantity selected
  price: number;           // Price at time of adding
}
```

## Key Improvements Over Old System

### Before (Flawed)
- ❌ Manual product ID entry in checkout
- ❌ No size/variant selection
- ❌ No cart persistence
- ❌ No cart management UI
- ❌ Direct checkout without review

### After (Standard)
- ✅ Visual product selection with images
- ✅ Size/variant selection with stock validation
- ✅ Persistent cart across sessions
- ✅ Full cart management (add/update/remove)
- ✅ Cart review before checkout
- ✅ Toast notifications for feedback
- ✅ Cart icon with item count badge

## Usage

### Adding Items to Cart
```typescript
import { useCart } from '@/contexts/CartContext';

const { addItem } = useCart();

// Add item with variant details
addItem(product, variantId, size, quantity, price);
```

### Accessing Cart Data
```typescript
const { items, getTotal, getItemCount } = useCart();

// Get all items
console.log(items);

// Get total price
const total = getTotal();

// Get item count
const count = getItemCount();
```

### Showing Toasts
```typescript
import { toast } from '@/components/Toaster';

// Success toast
toast({
  title: 'Added to cart',
  description: 'Product added successfully'
});

// Error toast
toast({
  title: 'Error',
  description: 'Something went wrong',
  variant: 'destructive'
});
```

## Testing

1. **Add to Cart**
   - Visit `/shop` or product detail page
   - Select a size
   - Choose quantity
   - Click "Add to Cart"
   - Verify toast notification
   - Check cart icon badge updates

2. **Cart Management**
   - Click cart icon in navbar
   - Verify all items display correctly
   - Test quantity adjustment
   - Test item removal
   - Test "Clear Cart"

3. **Checkout**
   - Add items to cart
   - Click "Proceed to Checkout"
   - Review order items
   - Complete checkout
   - Verify cart clears on success

4. **Persistence**
   - Add items to cart
   - Refresh page
   - Verify cart persists
   - Close and reopen browser
   - Verify cart still persists

## Future Enhancements

- [ ] Cart drawer/modal for quick view
- [ ] Save for later functionality
- [ ] Cart item recommendations
- [ ] Promo code support
- [ ] Shipping calculator
- [ ] Multiple shipping addresses
- [ ] Gift wrapping options
