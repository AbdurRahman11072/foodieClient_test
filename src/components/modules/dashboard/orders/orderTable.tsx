// components/orders/order-table.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { OrderItem } from '@/types/order';
import { useState } from 'react';
import { OrderRow } from './orderTableBody';
import { OrderTableHeader } from './orderTableHeader';

export function OrderTable({ orders }: { orders: OrderItem[] }) {
  const [localOrders, setLocalOrders] = useState<OrderItem[]>(orders || []);

  const handleViewDetails = (orderItem: OrderItem) => {
    console.log('View details for order:', orderItem);
  };

  if (!localOrders || localOrders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </Card>
    );
  }

  return (
    <div className="rounded-md border border-border bg-background overflow-x-auto">
      <Table>
        <OrderTableHeader />
        <tbody>
          {localOrders.map((orderItem) => (
            <OrderRow
              key={orderItem.id}
              orderItem={orderItem}
              onViewDetails={handleViewDetails}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
