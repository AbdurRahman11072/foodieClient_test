// components/orders/orderItemCard.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ITEM_STATUS_CONFIG,
  OrderItem as OrderItemType,
  OrderStatus,
} from '@/types/order';
import { SessionData } from '@/types/session';
import { Package, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ReviewModal } from './reviewModel';

interface OrderItemCardProps {
  item: OrderItemType;
  orderStatus?: OrderStatus;
  session: SessionData;
}

export function OrderItemCard({
  item,
  session,
}: OrderItemCardProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(
    () => (item.meal?.reviews?.length ?? 0) > 0
  );

  const ItemStatusIcon = ITEM_STATUS_CONFIG[item.status]?.icon || Package;
  const itemStatusConfig = ITEM_STATUS_CONFIG[item.status];


  const handleReviewSuccess = () => {
    setHasReviewed(true);
    // Optional: Show success toast
    console.log('Review submitted successfully for:', item.mealName);
  };

  return (
    <>
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

          <div className="flex items-center justify-between mt-2">
            <Badge
              className={`${itemStatusConfig?.color} gap-1`}
              variant="outline"
            >
              <ItemStatusIcon className="h-3 w-3" />
              {itemStatusConfig?.label || item.status}
            </Badge>

            {/* Review Button */}
            {!hasReviewed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReviewModalOpen(true)}
                className="gap-2 h-7 px-3 text-xs"
              >
                <Star className="h-3 w-3" />
                Write Review
              </Button>
            )}

            {/* Review Submitted Badge */}
            {hasReviewed && (
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                Reviewed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        itemName={item.mealName}
        userId={session?.user?.id}
        userName={session?.user?.name}
        userImg={session?.user?.image}
        restaurantId={item.restaurantId}
        mealId={item.mealId}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}
