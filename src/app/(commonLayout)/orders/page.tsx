import { EmptyOrdersState } from '@/components/modules/home/orders/emptyOrder';
import MainOrder from '@/components/modules/home/orders/mainOrder';
import orderService from '@/services/order.service';
import { userSerivce } from '@/services/user.service';
import { Order } from '@/types/order';

// Status configuration using CSS variables

const OrderPage = async () => {
  const session = await userSerivce.getUserSession();

  const response = await orderService.getAllOrderByUserId(session.user.id);
  const orders: Order[] = response?.data || [];

  console.log(orders);

  if (orders.length === 0) {
    return <EmptyOrdersState />;
  }

  return <MainOrder session={session} orders={orders} />;
};

export default OrderPage;
