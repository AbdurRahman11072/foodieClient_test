import { env } from '@/env';
import { cookies } from 'next/headers';

const orderService = {
  getAllOrders: async (
    id: string,
    role: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const cookieStore = await cookies();
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const url =
        role === 'admin'
          ? `${env.NEXT_PUBLIC_BACKEND_API_URL}orders/order-item?${params.toString()}` // get all meals
          : `${env.NEXT_PUBLIC_BACKEND_API_URL}orders/order-item/${id}?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: 'no-store',
        next: { tags: ['AllOrdersItems'] },
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, data: { data: [], total: 0 } };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Something went wrong',
        data: { data: [], total: 0 },
      };
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
