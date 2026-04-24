// components/orders/OrderCard.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Order, STATUS_CONFIG } from '@/types/order';
import {
  ArrowRight,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Package,
  Phone,
  Truck,
} from 'lucide-react';
import Link from 'next/link';
import { CancelOrderAction } from './orderAction';
import { OrderItems } from './orderList';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const StatusIcon = STATUS_CONFIG[order.status]?.icon || Package;
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PREPARING;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 border-l-4 ${statusConfig.borderColor}`}
    >
      {/* Status Bar */}
      <div
        className={`${statusConfig.bgColor} p-4 border-b ${statusConfig.borderColor}`}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${statusConfig.iconBg} flex items-center justify-center`}
            >
              <StatusIcon className={`h-5 w-5 ${statusConfig.textColor}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Order Status</p>
              <p className={`font-semibold ${statusConfig.textColor}`}>
                {statusConfig.label}
              </p>
            </div>
          </div>
          <Badge className={statusConfig.badgeColor}>
            {statusConfig.description}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        {/* Order Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {order.orderId.slice(0, 12)}...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Placed</p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment</p>
              <p className="text-sm font-semibold text-foreground">
                {order.paymentMethod}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-primary">
                ${order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Delivery Address
                </p>
                <p className="text-sm text-foreground">{order.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Contact Number
                </p>
                <p className="text-sm text-foreground">{order.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items - Separate Component */}
        <OrderItems items={order.items} />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          {order.status === 'DELIVERING' && (
            <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
              <Truck className="h-4 w-4" />
              <span>ETA: 25-35 min</span>
            </div>
          )}

          <Link href={`/orders/${order.id}`}>
            <Button variant="outline" size="sm">
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>

          {order.status === 'COMPLETE' && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Rate Order
            </Button>
          )}

          {/* Cancel Action - Separate Component */}
          <CancelOrderAction
            orderId={order.id}
            orderStatus={order.status}
            buttonText="Cancel Order"
            variant="outline"
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
}
