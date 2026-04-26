// components/orders/OrderItems.tsx
'use client';

import { OrderItem as OrderItemType, OrderStatus } from '@/types/order';
import { SessionData } from '@/types/session';
import { Package } from 'lucide-react';
import { OrderItemCard } from './orderItemCard';
interface OrderItemsProps {
  items: OrderItemType[];
  session: SessionData;
  orderStatus?: OrderStatus;
}
export function OrderItems({ items, session, orderStatus }: OrderItemsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Package className="h-4 w-4 text-primary" />
        Order Items ({items.length})
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((item) => (
          <OrderItemCard
            key={item.id}
            item={item}
            orderStatus={orderStatus}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
