// components/orders/order-table.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { OrderItem } from '@/types/order';
import { OrderRow } from './orderTableBody';
import { OrderTableHeader } from './orderTableHeader';

export function OrderTable({
  orders,
  role,
}: {
  orders: OrderItem[];
  role: string;
}) {
  const handleViewDetails = (orderItem: OrderItem) => {};

  if (!orders || orders.length === 0) {
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
          {orders.map((orderItem) => (
            <OrderRow
              key={orderItem.id}
              orderItem={orderItem}
              onViewDetails={handleViewDetails}
              role={role}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
