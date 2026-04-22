// app/(commonLayout)/orders/page.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import orderService from '@/services/order.service';
import { userSerivce } from '@/services/user.service';
import {
  ArrowRight,
  Bike,
  Calendar,
  CheckCircle,
  ChefHat,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Package,
  Phone,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Status configuration using CSS variables
const STATUS_CONFIG = {
  PREPARING: {
    label: 'Preparing',
    icon: ChefHat,
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    description: 'Your order is being prepared',
    iconBg: 'bg-primary/10',
  },
  DELIVERING: {
    label: 'Delivering',
    icon: Bike,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-500',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'Your order is on the way',
    iconBg: 'bg-blue-500/10',
  },
  COMPLETE: {
    label: 'Delivered',
    icon: CheckCircle,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-500',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    description: 'Your order has been delivered',
    iconBg: 'bg-emerald-500/10',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    textColor: 'text-destructive',
    badgeColor: 'bg-destructive/10 text-destructive border-destructive/20',
    description: 'Your order was cancelled',
    iconBg: 'bg-destructive/10',
  },
};

const ITEM_STATUS_CONFIG = {
  PREPARING: {
    label: 'Preparing',
    color: 'bg-primary/10 text-primary border-primary/20',
    icon: ChefHat,
  },
  READY: {
    label: 'Ready',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: CheckCircle,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircle,
  },
};

interface OrderItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  mealId: string;
  mealName: string;
  mealImg: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: keyof typeof ITEM_STATUS_CONFIG;
  createdAt: string;
}

interface Order {
  id: string;
  orderId: string;
  userId: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  status: keyof typeof STATUS_CONFIG;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const MyOrderPage = async () => {
  const session = await userSerivce.getUserSession();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex-1 py-8 md:py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Package className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Please Login
                </h2>
                <p className="text-muted-foreground mb-6">
                  Sign in to view your order history and track deliveries
                </p>
                <Link href="/login">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Login to Continue
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  const response = await orderService.getAllOrderByUserId(session.user.id);
  const orders: Order[] = response?.data || response || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            My Orders
          </h1>
          <p className="text-muted-foreground text-lg">
            Track and manage all your orders in one place
          </p>
        </div>
      </div>

      <div className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {!orders || orders.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  No Orders Yet
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Looks like you haven't placed any orders yet. Start exploring
                  our delicious meals!
                </p>
                <Link href="/meals">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Start Ordering
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-6 ">
              {orders.map((order) => {
                const StatusIcon = STATUS_CONFIG[order.status]?.icon || Package;
                const statusConfig =
                  STATUS_CONFIG[order.status] || STATUS_CONFIG.PREPARING;

                return (
                  <Card
                    key={order.id}
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
                            <StatusIcon
                              className={`h-5 w-5 ${statusConfig.textColor}`}
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Order Status
                            </p>
                            <p
                              className={`font-semibold ${statusConfig.textColor}`}
                            >
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
                            <p className="text-xs text-muted-foreground">
                              Order ID
                            </p>
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
                            <p className="text-xs text-muted-foreground">
                              Placed
                            </p>
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
                            <p className="text-xs text-muted-foreground">
                              Payment
                            </p>
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
                            <p className="text-xs text-muted-foreground">
                              Total
                            </p>
                            <p className="text-xl font-bold text-primary">
                              ${order.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="bg-muted/80 rounded-xl p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">
                                Delivery Address
                              </p>
                              <p className="text-sm text-foreground">
                                {order.address}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium">
                                Contact Number
                              </p>
                              <p className="text-sm text-foreground">
                                {order.phoneNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          Order Items
                        </h3>
                        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-2">
                          {order.items.map((item) => {
                            const ItemStatusIcon =
                              ITEM_STATUS_CONFIG[item.status]?.icon || Package;
                            return (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 p-3 bg-muted/80 rounded-xl hover:bg-muted/50 transition-colors"
                              >
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
                                      <p className="font-semibold text-foreground">
                                        {item.mealName}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.restaurantName}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-primary">
                                        ${item.totalPrice.toFixed(2)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {item.quantity} × $
                                        {item.price.toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <Badge
                                      className={`${ITEM_STATUS_CONFIG[item.status]?.color} gap-1`}
                                      variant="outline"
                                    >
                                      <ItemStatusIcon className="h-3 w-3" />
                                      {ITEM_STATUS_CONFIG[item.status]?.label ||
                                        item.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

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
                        {order.status === 'PREPARING' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10 border-destructive/30"
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MyOrderPage;
