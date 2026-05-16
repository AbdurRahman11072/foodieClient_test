import { env } from "@/env";
import { cookies } from "next/headers";

export const userService = {
  getUserSession: async () => {
    try {
      const cookieStore = await cookies();

      console.log("user Session", cookieStore);

      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_BETTER_AUTH_URL}get-session`,
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
          credentials: "include",
          cache: "no-store",
        },
      );
      const session = await res.json();

      if (!session) {
        return null;
      }
      console.log(session);
      return session;
    } catch {
      return null;
    }
  },

  getAllUsers: async (page: number = 1, limit: number = 10) => {
    try {
      const cookieStore = await cookies();
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      const res = await fetch(
        `${env.NEXT_PUBLIC_BACKEND_API_URL}users?${params.toString()}`,
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
          next: { tags: ["AllUsers"] },
        },
      );
      const data = await res.json();

      if (!res.ok) {
        return { success: false, data: { data: [], total: 0 } };
      }

      return data;
    } catch {
      return {
        success: false,
        message: "Something went wrong",
        data: { data: [], total: 0 },
      };
    }
  },
};
