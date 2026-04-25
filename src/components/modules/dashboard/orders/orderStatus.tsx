// components/orders/order-status-dropdown.tsx
'use client';

import { updateOrderItemStatus } from '@/actions/orders';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ITEM_STATUS_CONFIG, OrderItem } from '@/types/order';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface OrderStatusDropdownProps {
  orderItem: OrderItem;
}

export function OrderStatusDropdown({ orderItem }: OrderStatusDropdownProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<keyof typeof ITEM_STATUS_CONFIG>(
    orderItem.status
  );

  const handleStatusChange = async (
    newStatus: keyof typeof ITEM_STATUS_CONFIG
  ) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      // Directly call the API to update order status
      const result = await updateOrderItemStatus(orderItem.id, {
        status: newStatus,
      });

      if (!result.success) {
        toast.error(result.message);
      }
      toast.success('status updated');
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const statusConfig = ITEM_STATUS_CONFIG[status];

  return (
    <Select
      value={status}
      onValueChange={(value: keyof typeof ITEM_STATUS_CONFIG) =>
        handleStatusChange(value)
      }
      disabled={isUpdating}
    >
      <SelectTrigger
        className={cn(
          'w-[120px] h-8 text-xs border',
          statusConfig?.color,
          isUpdating && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isUpdating ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ITEM_STATUS_CONFIG).map(([key, config]) => (
          <SelectItem key={key} value={key} className="text-xs">
            <span className={cn('px-2 py-0.5 rounded', config.color)}>
              {config.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
