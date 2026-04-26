// components/orders/order-status-dropdown.tsx
'use client';

import { updateOrderItemStatusAction } from '@/actions/orders';
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
  role: string;
}

export function OrderStatusDropdown({
  orderItem,
  role,
}: OrderStatusDropdownProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<keyof typeof ITEM_STATUS_CONFIG>(
    orderItem.status
  );
  const isAdmin = role === 'admin';

  console.log(role, isAdmin);

  const statusConfig = ITEM_STATUS_CONFIG[status];
  if (isAdmin) {
    const isCancelled = status === 'CANCELLED';
    return (
      <div
        className={cn(
          'w-[120px] h-8 text-xs border rounded-md flex items-center justify-center font-medium',
          statusConfig?.color,
          isCancelled && 'opacity-75'
        )}
        title={
          isAdmin ? 'Admin view only' : 'Cancelled orders cannot be modified'
        }
      >
        {statusConfig?.label || status}
      </div>
    );
  }

  const handleStatusChange = async (
    newStatus: keyof typeof ITEM_STATUS_CONFIG
  ) => {
    if (newStatus === status) return;

    setIsUpdating(true);
    try {
      // Directly call the API to update order status
      const result = await updateOrderItemStatusAction(orderItem.id, {
        status: newStatus,
      });

      if (!result.success) {
        toast.error(result.message);
      }
      setStatus(newStatus);
      toast.success('status updated');
      router.refresh();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

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
