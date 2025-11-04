'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, User, Mail, Phone } from 'lucide-react';
import { formatNaira, convertToNaira } from '@/lib/currency';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

/**
 * Unified checkout page - detects auth status and adapts
 */
// Delivery zones and fees
const DELIVERY_ZONES = [
  { id: 'lagos-mainland', name: 'Lagos Mainland', fee: 2000 },
  { id: 'lagos-island', name: 'Lagos Island', fee: 2500 },
  { id: 'abuja', name: 'Abuja', fee: 3000 },
  { id: 'port-harcourt', name: 'Port Harcourt', fee: 3500 },
  { id: 'ibadan', name: 'Ibadan', fee: 2500 },
  { id: 'kano', name: 'Kano', fee: 4000 },
  { id: 'other', name: 'Other Cities', fee: 4500 },
];

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  deliveryZone: string;
  additionalInfo: string;
}

export default function CheckoutPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    deliveryZone: '',
    additionalInfo: '',
  });
  
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    
    // Redirect to cart if empty
    if (items.length === 0) {
      router.push('/cart');
    }
    
    // Fetch user profile if authenticated
    if (authStatus) {
      const fetchUserProfile = async () => {
        try {
          const token = getToken();
          const response = await fetch('http://localhost:8000/api/users/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            // Pre-fill form with user data
            setFormData(prev => ({
              ...prev,
              firstName: userData.first_name || '',
              lastName: userData.last_name || '',
              email: userData.email || '',
            }));
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      };
      
      fetchUserProfile();
    }
  }, [items, router]);
  
  // Update delivery fee when zone changes
  useEffect(() => {
    const zone = DELIVERY_ZONES.find(z => z.id === formData.deliveryZone);
    setDeliveryFee(zone ? zone.fee : 0);
  }, [formData.deliveryZone]);
  
  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.deliveryZone) newErrors.deliveryZone = 'Please select a delivery zone';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    // Validate form
    if (!validateForm()) {
      setMessage('❌ Please fill in all required fields correctly');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      // Format cart items for backend
      const cartItems = items.map(item => ({
        variant_id: item.variantId,
        quantity: item.quantity
      }));
      
      // Calculate total with delivery
      const subtotal = getTotal();
      const totalAmount = subtotal + deliveryFee;

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth token if user is logged in
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Initialize payment
      const response = await fetch('http://localhost:8000/api/store/payment/initialize/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: formData.email,
          cart_items: cartItems,
          delivery_fee: deliveryFee,
          customer_info: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            delivery_zone: formData.deliveryZone,
            additional_info: formData.additionalInfo,
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.status && result.data) {
          // Store order info in localStorage for callback
          localStorage.setItem('pending_order', JSON.stringify({
            reference: result.data.reference,
            order_id: result.data.order_id,
            amount: result.data.amount,
            customer_info: formData,
          }));
          
          // Redirect to Paystack payment page
          window.location.href = result.data.authorization_url;
        } else {
          setMessage(`❌ ${result.message || 'Payment initialization failed'}`);
        }
      } else {
        const error = await response.json();
        setMessage(`❌ Error: ${error.error || error.message || 'Payment initialization failed'}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setMessage('❌ Network error - please try again');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-8">
            Checkout {authenticated && <span className="text-blue-950 dark:text-amber-500">- Member</span>}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="border border-gray-200 dark:border-gray-800 rounded-none">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? 'border-red-500' : ''}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={errors.phone ? 'border-red-500' : ''}
                      placeholder="08012345678"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card className="border border-gray-200 dark:border-gray-800 rounded-none">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={errors.address ? 'border-red-500' : ''}
                      placeholder="Enter your full delivery address"
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="deliveryZone">Delivery Zone *</Label>
                    <Select value={formData.deliveryZone} onValueChange={(value) => handleInputChange('deliveryZone', value)}>
                      <SelectTrigger className={errors.deliveryZone ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select delivery zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERY_ZONES.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name} - ₦{zone.fee.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.deliveryZone && <p className="text-red-500 text-xs mt-1">{errors.deliveryZone}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      placeholder="Landmarks, special instructions, etc."
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="border border-gray-200 dark:border-gray-800 rounded-none">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>Review your items</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-none"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                          {formatNaira(convertToNaira(item.price * item.quantity * 1600))}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-200 dark:border-gray-800 rounded-none sticky top-4">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <CardTitle className="text-xl font-medium">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatNaira(convertToNaira(getTotal()))}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee > 0 ? formatNaira(deliveryFee) : 'Select zone'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between text-xl font-medium text-gray-900 dark:text-gray-100">
                      <span>Total</span>
                      <span>{formatNaira(convertToNaira(getTotal()) + deliveryFee)}</span>
                    </div>
                  </div>

                  {authenticated && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-3 rounded-none">
                      <p className="text-amber-900 dark:text-amber-500 text-sm">
                        ★ You'll earn {Math.floor(getTotal() / 10)} loyalty points
                      </p>
                    </div>
                  )}

                  {message && (
                    <div className={`p-4 rounded-none text-sm ${message.includes('✅') ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'}`}>
                      {message}
                    </div>
                  )}

                  <Button 
                    onClick={handleCheckout} 
                    disabled={loading || deliveryFee === 0}
                    className="w-full bg-blue-950 hover:bg-blue-900 dark:bg-blue-900 dark:hover:bg-blue-800 text-white rounded-none py-6"
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </Button>

                  {!authenticated && (
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/register')}
                      className="w-full rounded-none border-gray-300 hover:bg-gray-50"
                    >
                      Register for Points
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
