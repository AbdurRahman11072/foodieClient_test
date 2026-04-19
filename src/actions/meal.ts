'use server';
import { env } from '@/env';
import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const CreateMealAction = async (meal: any) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}meals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },

      body: JSON.stringify(meal),
    });

    const data = await res.json();
    if (!data.success) {
      return data;
    }

    updateTag('AllMeals');
    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create category1',
      data: null,
    };
  }
};

export const UpdateMealAction = async (meal: any, id: string) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}meals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },

      body: JSON.stringify(meal),
    });

    const data = await res.json();

    console.log(data);

    if (!data.success) {
      return data;
    }

    updateTag('AllMeals');
    return data;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create category1',
      data: null,
    };
  }
};
