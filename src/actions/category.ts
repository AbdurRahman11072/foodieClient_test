'use server';
import { env } from '@/env';
import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const CreateCategoryAction = async (data: {
  name: string;
  coverImg: string;
}) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },

      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (!resData.success) {
      return resData;
    }

    updateTag('AllCategory');
    return resData;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to create category1',
      data: null,
    };
  }
};

export const DeleteCategoryAction = async (id: string) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_API_URL}category/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStore.toString(),
        },
      }
    );

    const resData = await res.json();
    if (!resData.success) {
      return resData;
    }

    updateTag('AllCategory');
    return resData;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to delete category1',
      data: null,
    };
  }
};
export const UpdateCategoryAction = async (
  id: string,
  data: { name: string; coverImg: string }
) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_API_URL}category/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(data),
      }
    );

    const resData = await res.json();

    if (!resData.success) {
      return resData;
    }

    updateTag('AllCategory');
    return resData;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to update category',
      data: null,
    };
  }
};
