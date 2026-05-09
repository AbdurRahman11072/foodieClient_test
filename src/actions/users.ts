"use server";

import { env } from "@/env";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";

export const SignIn = async (userData: any) => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(
      `${env.NEXT_PUBLIC_BACKEND_BETTER_AUTH_URL}sign-in/email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: env.NEXT_PUBLIC_APP_URL,
        },
        // ensure fetch follows credential semantics when proxied
        credentials: "include",
        body: JSON.stringify(userData),
      },
    );

    const data = await res.json();

    console.log(data);

    // If backend set a cookie (e.g. session token), forward its value
    // but store it under the canonical name `better-auth.session_token`.
    const setCookieHeader = res.headers.get("set-cookie");
    if (setCookieHeader) {
      try {
        const cookiePair = setCookieHeader.split(";")[0];
        const [, ...rawValParts] = cookiePair.split("=");
        const value = rawValParts.join("=");
        if (value !== undefined) {
          cookieStore.set({
            name: "better-auth.session_token",
            value: decodeURIComponent(value),
            path: "/",
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
          });
        }
      } catch (err) {
        // non-fatal; still return response body
        console.warn("Failed to proxy set-cookie header:", err);
      }
    }

    updateTag("AllUsers");
    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed Login",
      data: null,
    };
  }
};

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
