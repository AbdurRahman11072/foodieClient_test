// components/orders/order-row.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { OrderItem, STATUS_CONFIG } from '@/types/order';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { OrderStatusDropdown } from './orderStatus';

interface OrderRowProps {
  orderItem: OrderItem;
  onStatusChange?: (
    orderItemId: string,
    newStatus: keyof typeof STATUS_CONFIG
  ) => Promise<void>;
  onViewDetails?: (orderItem: OrderItem) => void;
}

export function OrderRow({
  orderItem,
  onStatusChange,
  onViewDetails,
}: OrderRowProps) {
  if (!orderItem) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <TableRow className="border-b border-border hover:bg-muted/50 transition-colors">
      <TableCell className="font-mono text-sm font-medium">
        {orderItem.orderId.slice(0, 8)}...
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {orderItem.mealImg ? (
              <Image
                src={orderItem.mealImg}
                alt={orderItem.mealName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">
                🍽️
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="font-medium text-foreground">
              {orderItem.mealName}
            </div>
            <div className="text-xs text-muted-foreground">
              {orderItem.restaurantName}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-center">
        <Badge variant="secondary" className="font-mono">
          {orderItem.quantity}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="text-sm text-foreground">
          ${orderItem.price.toFixed(2)}
        </div>
      </TableCell>

      <TableCell className="text-right">
        <div className="font-semibold text-primary">
          ${orderItem.totalPrice.toFixed(2)}
        </div>
      </TableCell>

      {/* Fixed: Added text-center and vertical alignment */}
      <TableCell className="text-center align-middle">
        <div className="flex items-center justify-center">
          <OrderStatusDropdown orderItem={orderItem} />
        </div>
      </TableCell>

      <TableCell className="text-center align-middle">
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(orderItem.createdAt)}
        </div>
      </TableCell>

      <TableCell className="text-center align-middle">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(orderItem)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
