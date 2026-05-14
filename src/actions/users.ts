"use server";

import { env } from "@/env";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";

export const UpdateUserAction = async (id: string, userData: any) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_API_URL}users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!data.success) {
      return data;
    }

    updateTag("AllUsers");
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user",
      data: null,
    };
  }
};
