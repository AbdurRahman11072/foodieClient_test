// app/(dashboardLayout)/dashboard/orders/page.tsx

import { OrderTable } from '@/components/modules/dashboard/orders/orderTable';
import { Card } from '@/components/ui/card';
import orderService from '@/services/order.service';
import { userSerivce } from '@/services/user.service';
import { OrderItem } from '@/types/order';
import { SessionData } from '@/types/session';

const OrdersPage = async () => {
  const session: SessionData = await userSerivce.getUserSession();
  const role = session.user.role;

  const response = await orderService.getAllOrders(
    session.user.restaurantId as string,
    session.user.role
  );

  // Extract orders from response
  let orders: OrderItem[] = response.data || [];

  if (!response.success) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <Card className="p-8 text-center">
          <p className="text-destructive">{response.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Orders: {orders.length}
        </div>
      </div>

      <OrderTable orders={orders} role={role} />
    </div>
  );
};

export default OrdersPage;
