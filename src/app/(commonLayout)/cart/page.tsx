'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CartItem } from '@/types/cart';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart data after hydration
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    Promise.resolve().then(() => {
      setItems(JSON.parse(storedCart || '[]'));
      setIsLoading(false);
    });
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoading]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.menuItemId !== id));
    toast.success('Item removed from cart');
  };

  // Show loading state while hydrating
  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading cart...</p>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price as number) * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const delivery = 2.99;
  const total = subtotal + tax + delivery;

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Add some delicious meals to get started
            </p>
            <Link href="/meals">
              <Button size="lg">Browse Meals</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 py-8 md:py-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.menuItemId} className="p-4">
                  <div className="flex gap-4">
                    <Image
                      src={item.image as string}
                      alt={item.name as string}
                      width={300}
                      height={300}
                      className="w-40 h-28 rounded-lg"
                    />

                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.name}
                        </h3>
                        <p className="text-lg font-bold text-primary">
                          ${((item.price as number) * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.menuItemId as string,
                                item.quantity - 1
                              )
                            }
                            className="p-2 hover:bg-secondary"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.menuItemId as string,
                                item.quantity + 1
                              )
                            }
                            className="p-2 hover:bg-secondary"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.menuItemId as string)}
                          className="p-2 hover:bg-destructive/10 rounded text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              <Link href="/meals">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <h2 className="text-lg font-bold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Delivery</span>
                    <span>${delivery.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-foreground">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout" className="w-full block">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Free delivery on orders over $50
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
