import { env } from '@/env';
import { cookies } from 'next/headers';

const orderService = {
  getAllOrders: async () => {
    const cookieStore = await cookies();
    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}orders`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: { tags: ['AllCategory'] },
    });

    const data = await res.json();

    return data;
  },

  getAllOrderByUserId: async (id: string) => {
    console.log(id);

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}orders/${id}`);
    const data = await res.json();

    return data;
  },
  getAllOrderByOrderId: async (id: string) => {
    console.log(id);

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_API_URL}orders/order-id/${id}`
    );
    const data = await res.json();

    return data;
  },
};

export default orderService;
