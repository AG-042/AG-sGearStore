# Design System Update

## Overview
Updated all loading skeletons and placeholder pages to match the new minimalist design system.

## Design Principles

### Color Scheme
- **Primary Background**: White / Dark Gray-950
- **Card Borders**: Gray-200 / Dark Gray-800
- **Primary Accent**: Blue-950 / Dark Blue-900
- **Secondary Accent**: Amber-500 / Amber-600
- **Text**: Gray-900 / Gray-100

### Typography
- **Headings**: Font-light, tracking-tight
- **Body**: Font-normal
- **Labels**: Font-medium, uppercase, tracking-wide

### Components
- **Cards**: Rounded-none (sharp corners), subtle borders
- **Buttons**: Rounded-none, clear hierarchy
- **Shadows**: Shadow-sm (minimal)
- **Spacing**: Consistent 4/6/8/12 scale

## Updated Components

### ✅ Product Detail Page Loading Skeleton
**Before:**
- Gradient background (blue-950 to amber-900)
- Rounded corners
- Heavy shadows (shadow-2xl)
- Mismatched layout

**After:**
- Clean white/dark background
- Sharp corners (rounded-none)
- Subtle shadow (shadow-sm)
- Matches actual product layout with:
  - Aspect-square image skeleton
  - Proper section dividers
  - Size selector skeleton
  - Quantity controls skeleton
  - Button skeletons

### ✅ Product Detail Error State
**Before:**
- Gradient background
- Bold typography
- Heavy shadows

**After:**
- Clean background
- Light typography (font-light)
- Minimal shadows
- Consistent button styling

### ✅ Guest Checkout Page
**Before:**
- Gradient background
- Bold typography
- "Coming soon" placeholder
- No actionable CTAs

**After:**
- Clean background
- Light typography
- Clear description
- Action buttons (Browse Products, View Cart)
- Proper navigation flow

## Consistency Checklist

✅ **Home Page** - Already using new design
✅ **Shop Page** - Already using new design
✅ **Product Detail** - Updated loading & error states
✅ **Cart Page** - New component, follows design
✅ **Checkout** - New component, follows design
✅ **Login** - Already using new design
✅ **Register** - Already using new design
✅ **Profile** - Already using new design
✅ **Guest Checkout** - Updated to new design

## Loading States

All loading skeletons now:
- Match the actual component layout
- Use rounded-none for consistency
- Include proper section dividers
- Show realistic content structure
- Use subtle animations

## Error States

All error states now:
- Use clean backgrounds
- Show clear error messages
- Provide actionable next steps
- Maintain design consistency
- Use proper button styling

## Design Tokens

```css
/* Backgrounds */
bg-white dark:bg-gray-950

/* Borders */
border border-gray-200 dark:border-gray-800

/* Cards */
rounded-none shadow-sm

/* Primary Buttons */
bg-blue-950 hover:bg-blue-900 
dark:bg-blue-900 dark:hover:bg-blue-800

/* Secondary Buttons */
border-gray-300 hover:bg-gray-50

/* Accent Color */
text-blue-950 dark:text-amber-500

/* Typography */
font-light tracking-tight (headings)
font-medium uppercase tracking-wide (labels)
```

## Benefits

1. **Visual Consistency**: All pages follow same design language
2. **Better UX**: Loading states match actual content
3. **Modern Aesthetic**: Clean, minimalist approach
4. **Dark Mode**: Proper support throughout
5. **Accessibility**: Clear hierarchy and contrast
6. **Performance**: Lighter shadows, simpler animations

## Testing

To verify the design updates:

1. **Loading States**
   - Navigate to product detail page
   - Observe skeleton matches final layout
   - Check transitions are smooth

2. **Error States**
   - Try accessing invalid product ID
   - Verify error message is clear
   - Test "Back to Shop" button

3. **Guest Checkout**
   - Visit `/checkout/guest`
   - Verify new design
   - Test navigation buttons

4. **Dark Mode**
   - Toggle dark mode
   - Check all pages maintain consistency
   - Verify contrast ratios

## Future Considerations

- Consider adding subtle animations to skeletons (pulse effect)
- Add loading progress indicators for long operations
- Implement skeleton variants for different content types
- Consider adding empty state illustrations
