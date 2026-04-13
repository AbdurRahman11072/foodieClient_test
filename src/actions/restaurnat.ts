'use server';

import { cookies } from 'next/headers';
import { env } from 'process';

export const CreateRestaurntsAction = async (restaurnts: any) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },

      body: JSON.stringify(restaurnts),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create restaurant',
      data: null,
    };
  }
};
