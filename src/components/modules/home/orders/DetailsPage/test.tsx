// app/(commonLayout)/orders/[id]/page.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import orderService from '@/services/order.service';
import { userSerivce } from '@/services/user.service';
import {
  AlertCircle,
  ArrowLeft,
  Bike,
  Calendar,
  CheckCircle,
  ChefHat,
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
import { notFound } from 'next/navigation';

// Status configuration
const STATUS_CONFIG = {
  PREPARING: {
    label: 'Preparing',
    icon: ChefHat,
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    textColor: 'text-primary',
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    description: 'Your order is being prepared',
  },
  DELIVERING: {
    label: 'Delivering',
    icon: Bike,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-500',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'Your order is on the way',
  },
  COMPLETE: {
    label: 'Delivered',
    icon: CheckCircle,
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    textColor: 'text-emerald-500',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    description: 'Your order has been delivered',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    textColor: 'text-destructive',
    badgeColor: 'bg-destructive/10 text-destructive border-destructive/20',
    description: 'Your order was cancelled',
  },
};

const ITEM_STATUS_CONFIG = {
  PREPARING: {
    label: 'Preparing',
    color: 'bg-primary/10 text-primary border-primary/20',
    icon: ChefHat,
    canCancel: true,
  },
  READY: {
    label: 'Ready',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: CheckCircle,
    canCancel: false,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: CheckCircle,
    canCancel: false,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircle,
    canCancel: false,
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

const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
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
                  You need to be logged in to view order details
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

  const response = await orderService.getAllOrderByOrderId(id);
  const order: Order | null = response?.data;

  if (!order) {
    notFound();
  }

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

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateDeliveryFee = () => {
    return 2.99;
  };

  const StatusIcon = STATUS_CONFIG[order.status]?.icon || Package;
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PREPARING;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-border py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Order Details
          </h1>
          <p className="text-muted-foreground mt-2">Order #{order.orderId}</p>
        </div>
      </div>

      <div className="flex-1 py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
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
                      <StatusIcon
                        className={`h-7 w-7 ${statusConfig.textColor}`}
                      />
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
                  Order Items
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => {
                    const ItemStatusIcon =
                      ITEM_STATUS_CONFIG[item.status]?.icon || Package;
                    const itemStatusConfig =
                      ITEM_STATUS_CONFIG[item.status] ||
                      ITEM_STATUS_CONFIG.PREPARING;

                    return (
                      <div
                        key={item.id}
                        className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex gap-4">
                          {/* Item Image */}
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                          </div>

                          {/* Item Details */}
                          <div className="flex-1">
                            <div className="flex flex-wrap justify-between items-start gap-2">
                              <div>
                                <h3 className="font-semibold text-foreground text-lg">
                                  {item.mealName}
                                </h3>
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

                            {/* Individual Cancel Button */}
                            {itemStatusConfig.canCancel && (
                              <div className="mt-4 pt-3 border-t border-border">
                                <form
                                  action={`/api/orders/items/${item.id}/cancel`}
                                  method="POST"
                                >
                                  <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:bg-destructive/10 border-destructive/30"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel This Item
                                  </Button>
                                </form>
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
                      <p className="text-sm text-muted-foreground">
                        Delivery Address
                      </p>
                      <p className="text-foreground">{order.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contact Number
                      </p>
                      <p className="text-foreground">{order.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Date
                      </p>
                      <p className="text-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1 space-y-6 ">
              {/* Price Summary */}
              <Card className="p-6 ">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Price Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="text-foreground">
                      ${calculateTax().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-foreground">
                      ${calculateDeliveryFee().toFixed(2)}
                    </span>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Information
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Method</span>
                    <span className="text-foreground font-medium">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      Paid
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Order Actions */}
              {order.status === 'PREPARING' && (
                <Card className="p-6 border-destructive/20">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Order Actions
                  </h2>
                  <form action={`/api/orders/${order.id}/cancel`} method="POST">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Entire Order
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Only orders that are still preparing can be cancelled
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailPage;
