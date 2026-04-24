// components/orders/OrderItems.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { ITEM_STATUS_CONFIG, OrderItem as OrderItemType } from '@/types/order';
import { Package } from 'lucide-react';
import Image from 'next/image';

interface OrderItemsProps {
  items: OrderItemType[];
}

function OrderItemCard({ item }: { item: OrderItemType }) {
  const ItemStatusIcon = ITEM_STATUS_CONFIG[item.status]?.icon || Package;
  const itemStatusConfig = ITEM_STATUS_CONFIG[item.status];

  return (
    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
      {/* Item Image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {item.mealImg ? (
          <Image
            src={item.mealImg}
            alt={item.mealName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🍽️
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <p className="font-semibold text-foreground">{item.mealName}</p>
            <p className="text-xs text-muted-foreground">
              {item.restaurantName}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">
              ${item.totalPrice.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {item.quantity} × ${item.price.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <Badge
            className={`${itemStatusConfig?.color} gap-1`}
            variant="outline"
          >
            <ItemStatusIcon className="h-3 w-3" />
            {itemStatusConfig?.label || item.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Package className="h-4 w-4 text-primary" />
        Order Items ({items.length})
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((item) => (
          <OrderItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
