import { env } from '@/env';
import { cookies } from 'next/headers';

const orderService = {
  getAllOrders: async (id: string, role: string) => {
    try {
      const cookieStore = await cookies();
      const url =
        role === 'admin'
          ? `${env.NEXT_PUBLIC_BACKEND_API_URL}orders/order-item` // get all meals
          : `${env.NEXT_PUBLIC_BACKEND_API_URL}orders/order-item/${id}`;
      const res = await fetch(url, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: 'no-store',
        next: { tags: ['AllOrdersItems'] },
      });

      const data = await res.json();

      return data;
    } catch (error) {
      return { success: false, message: 'Something went wrong', data: [] };
    }
  },

  getAllOrderByUserId: async (id: string) => {
    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}orders/${id}`);
    const data = await res.json();

    return data;
  },
  getAllOrderByOrderId: async (id: string) => {
    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_API_URL}orders/order-id/${id}`
    );
    const data = await res.json();

    return data;
  },
};

export default orderService;
