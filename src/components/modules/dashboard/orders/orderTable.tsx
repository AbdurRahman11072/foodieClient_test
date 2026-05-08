// components/orders/order-table.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { OrderItem } from '@/types/order';
import { OrderRow } from './orderTableBody';
import { OrderTableHeader } from './orderTableHeader';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination-custom';

export function OrderTable({
  orders,
  role,
  totalItems,
  currentPage,
  limit,
}: {
  orders: OrderItem[];
  role: string;
  totalItems: number;
  currentPage: number;
  limit: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalItems / limit);
  const handleViewDetails = (orderItem: OrderItem) => {};

  if (!orders || orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
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

      {/* Pagination */}
      <div className="flex justify-center py-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
