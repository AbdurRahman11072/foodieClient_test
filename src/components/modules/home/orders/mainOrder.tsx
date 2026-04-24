// components/modules/home/orders/mainOrder.tsx
'use client';

import { Order } from '@/types/order';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OrderCard } from './orderCard';

interface MainOrderProps {
  session: any;
  orders: Order[];
}

export default function MainOrder({
  session,
  orders: initialOrders,
}: MainOrderProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const router = useRouter();

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            My Orders
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and manage all your orders in one place
          </p>
        </div>
      </div>
      <div className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
