// components/orders/order-table-header.tsx
'use client';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function OrderTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-b border-border bg-muted/50 hover:bg-muted/50">
        <TableHead className="font-medium text-foreground">Order ID</TableHead>
        <TableHead className="font-medium text-foreground">Item</TableHead>
        <TableHead className="text-center font-medium text-foreground">
          Quantity
        </TableHead>
        <TableHead className="text-right font-medium text-foreground">
          Price
        </TableHead>
        <TableHead className="text-right font-medium text-foreground">
          Total
        </TableHead>
        <TableHead className="text-center font-medium text-foreground">
          Status
        </TableHead>
        <TableHead className="text-center font-medium text-foreground">
          Placed On
        </TableHead>
        <TableHead className="text-center font-medium text-foreground">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
