'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { env } from '@/env';
import { CartItem } from '@/types/cart';
import { SessionData } from '@/types/session';
import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutPage({ session }: { session: SessionData }) {
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
  });
  const [step, setStep] = useState<'delivery' | 'payment' | 'confirmation'>(
    'delivery'
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState('');

  // Load cart data after hydration
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Calculate totals
  const subtotal = cart.reduce((sum: number, item: CartItem) => {
    return sum + (item.price as number) * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const delivery = 2.99;
  const total = subtotal + tax + delivery;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.address && formData.phone) {
      // Update cart items with delivery address
      const updatedCart = cart.map((item) => ({
        ...item,
        deliveryAddress: formData.address,
      }));
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setStep('payment');
    } else {
      toast.error('Please fill in all fields');
    }
  };
  // Generate random order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const handleCheckout = async () => {
    try {
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      const orderData = {
        userId: session?.user?.id,
        orderId: newOrderId,
        address: formData.address,
        phoneNumber: formData.phone,
        totalPrice: total,
        paymentMethod: 'Cash On Delivery',
        items: cart,
      };

      console.log(orderData);

      const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      }

      toast.success('Order placed successfully!');
      setStep('confirmation');
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };
  console.log(orderId);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          {step !== 'confirmation' && (
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to cart
            </Link>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Delivery Step */}
              {step === 'delivery' && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Delivery Information
                  </h2>

                  <form onSubmit={handleDeliverySubmit} className="space-y-6">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll call you to confirm the order
                      </p>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="address"
                        placeholder="123 Main Street, Apt 4B, New York, NY 10001"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Full address with street, apartment, city, and zip code
                      </p>
                    </div>

                    <Button type="submit" size="lg" className="w-full mt-6">
                      Continue to Payment
                    </Button>
                  </form>
                </Card>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <Card className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="border-2 border-primary rounded-lg p-4 cursor-pointer bg-primary/5">
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="radio"
                          name="payment"
                          defaultChecked
                          className="w-4 h-4 text-primary"
                          readOnly
                        />
                        <span className="font-semibold text-foreground">
                          Cash on Delivery
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-7">
                        Pay when your order arrives
                      </p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-secondary/30 rounded-lg p-4 mb-8 space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-sm">{formData.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-sm">{formData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        Estimated delivery: 25-35 minutes
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1 bg-transparent"
                      onClick={() => setStep('delivery')}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1"
                      onClick={handleCheckout}
                    >
                      Place Order
                    </Button>
                  </div>
                </Card>
              )}

              {/* Confirmation Step */}
              {step === 'confirmation' && (
                <Card className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Order Confirmed! 🎉
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your order has been placed successfully. You can track your
                    delivery in your account.
                  </p>

                  <div className="bg-secondary/30 rounded-lg p-6 mb-8 space-y-2">
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono font-bold text-lg text-foreground">
                      {orderId}
                    </p>
                  </div>

                  <div className="space-y-2 mb-8">
                    <p className="text-sm text-muted-foreground">
                      Estimated delivery time
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      25-35 minutes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Delivering to: {formData.address}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/orders" className="flex-1">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full bg-transparent"
                      >
                        View My Orders
                      </Button>
                    </Link>
                    <Link href="/meals" className="flex-1">
                      <Button size="lg" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            {step !== 'confirmation' && (
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-20">
                  <h2 className="text-lg font-bold text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {cart.map((item: CartItem, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.mealName} × {item.quantity}
                        </span>
                        <span>
                          ${((item.price as number) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${delivery.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
