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

export const setTokenAction = async (token: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.set("better-auth.session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      partitioned: true,
    });
    return { success: true, message: "Token set successfully", data: null };
  } catch (error) {
    return { success: false, message: "Login failed", data: null };
  }
};
