import OrderDetails from '@/components/modules/home/orders/DetailsPage/orderDetails';
import OrderSummary from '@/components/modules/home/orders/DetailsPage/orderSummary';
import orderService from '@/services/order.service';
import { userService } from '@/services/user.service';
import { Order } from '@/types/order';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';



const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await userService.getUserSession();

  const response = await orderService.getAllOrderByOrderId(id);
  const order: Order | null = response?.data;

  if (!order) {
    notFound();
  }

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
            <OrderDetails order={order} />

            {/* Sidebar - Order Summary */}
            <OrderSummary order={order} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailPage;
