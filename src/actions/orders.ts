'use server';

import { env } from '@/env';
import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const cancelOrder = async (id: string) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_API_URL}orders/cancel-order/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStore.toString(),
        },
      }
    );
    const data = await res.json();

    if (!data.success) return data;

    updateTag('AllOrders');
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong. Please try again later',
      data: null,
    };
  }
};
export const updateOrderItems = async (id: string, data: any) => {
  try {
    const cookieStore = await cookies();

    console.log(data);

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_API_URL}orders/update-order-items/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();

    if (!result.success) return result;

    updateTag('AllOrders');
    return result;
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong. Please try again later',
      data: null,
    };
  }
};
