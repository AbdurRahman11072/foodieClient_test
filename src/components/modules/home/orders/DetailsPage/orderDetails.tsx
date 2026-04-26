// components/orders/OrderDetails.tsx
'use client';

import { updateOrderItemsAction } from '@/actions/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ITEM_STATUS_CONFIG, Order, STATUS_CONFIG } from '@/types/order';
import {
  AlertCircle,
  Calendar,
  MapPin,
  Package,
  Phone,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const router = useRouter();
  const [cancellingItemId, setCancellingItemId] = useState<string | null>(null);

  const StatusIcon = STATUS_CONFIG[order.status]?.icon || Package;
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PREPARING;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOrderItemCancel = async (itemId: string) => {
    setCancellingItemId(itemId);

    try {
      const res = await updateOrderItemsAction(itemId, { status: 'CANCELLED' });

      if (!res?.success) {
        toast.error(res?.message || 'Failed to cancel item');
      } else {
        toast.success(res?.message || 'Item cancelled successfully');
        router.refresh();
      }
    } catch (error) {
      console.error('Error cancelling item:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setCancellingItemId(null);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Order Status Card */}
      <Card
        className={`overflow-hidden border-l-4 ${statusConfig.borderColor}`}
      >
        <div className={`${statusConfig.bgColor} p-6`}>
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-full ${statusConfig.bgColor} flex items-center justify-center`}
            >
              <StatusIcon className={`h-7 w-7 ${statusConfig.textColor}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Order {statusConfig.label}
              </h2>
              <p className="text-muted-foreground">
                {statusConfig.description}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Items with Individual Cancel Buttons */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Order Items ({order.items.length})
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => {
            const ItemStatusIcon =
              ITEM_STATUS_CONFIG[item.status]?.icon || Package;
            const itemStatusConfig =
              ITEM_STATUS_CONFIG[item.status] || ITEM_STATUS_CONFIG.PREPARING;

            // ✅ FIXED: Allow cancellation when order is PENDING or PREPARING
            const canCancel =
              itemStatusConfig.canCancel &&
              (order.status === 'PENDING' || order.status === 'PREPARING');

            const isCancelling = cancellingItemId === item.id;

            return (
              <div
                key={item.id}
                className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Item Image - Clickable separately */}
                  <Link
                    href={`/meals/${item.mealId}`}
                    className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0"
                  >
                    {item.mealImg ? (
                      <Image
                        src={item.mealImg}
                        alt={item.mealName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🍽️
                      </div>
                    )}
                  </Link>

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <Link
                          href={`/meals/${item.mealId}`}
                          className="hover:underline"
                        >
                          <h3 className="font-semibold text-foreground text-lg">
                            {item.mealName}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.restaurantName}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Price: ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-xl">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                        <Badge
                          className={`${itemStatusConfig.color} gap-1 mt-2`}
                          variant="outline"
                        >
                          <ItemStatusIcon className="h-3 w-3" />
                          {itemStatusConfig.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Individual Cancel Button - Shows for PENDING or PREPARING orders */}
                    {canCancel && (
                      <div className="mt-4 pt-3 border-t border-border">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 border-destructive/30"
                          onClick={() => handleOrderItemCancel(item.id)}
                          disabled={isCancelling}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {isCancelling ? 'Cancelling...' : 'Cancel This Item'}
                        </Button>
                      </div>
                    )}

                    {/* Show cancellation message if cancelled */}
                    {item.status === 'CANCELLED' && (
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">
                            This item has been cancelled
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Delivery Information */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Delivery Information
        </h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Delivery Address</p>
              <p className="text-foreground">{order.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Contact Number</p>
              <p className="text-foreground">{order.phoneNumber}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="text-foreground">{formatDate(order.createdAt)}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetails;
