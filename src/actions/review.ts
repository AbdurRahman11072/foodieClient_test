'use server';

import { env } from '@/env';
import { CreateReviewType } from '@/types/review';

export const CreateReviewAction = async (reviewData: CreateReviewType) => {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create review',
      data: null,
    };
  }
};
