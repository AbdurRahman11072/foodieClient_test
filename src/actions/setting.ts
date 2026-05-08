'use server';

import { env } from '@/env';
import { cookies } from 'next/headers';

export const updateUserProfileAction = async (
  id: string,
  data: { name?: string; image?: string }
) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update profile',
      data: null,
    };
  }
};

export const changePasswordAction = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_BETTER_AUTH_URL}change-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieStore.toString(),
          Origin: env.NEXT_PUBLIC_APP_URL,
          Referer: env.NEXT_PUBLIC_APP_URL,
        },
        body: JSON.stringify({
          newPassword: data.newPassword,
          currentPassword: data.currentPassword,
          revokeOtherSessions: true,
        }),
      }
    );

    // better-auth returns an empty body on success (no `success` field)
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      return {
        success: false,
        message:
          errorData?.message ??
          errorData?.error?.message ??
          'Failed to change password',
        data: null,
      };
    }

    return { success: true, message: 'Password changed successfully', data: null };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to change password',
      data: null,
    };
  }
};
