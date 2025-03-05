"use server";
import { cookies } from "next/headers";

export async function loginAction(
  prevState: { error?: string; success?: boolean; redirectTo?: string } | null,
  formData: FormData
) {
  const userName = formData.get("userName") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token, storeId, role } = data.data;
      console.log(storeId);

      if (role === "staff" && !storeId) {
        return { error: "You are not assigned to any store." };
      }

      // Set cookies
      const cookieStore = cookies();
      (await cookieStore).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      });

      (await cookieStore).set("storeId", storeId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      });

      return {
        success: true,
        redirectTo: `/${storeId}/report`,
      };
    } else {
      return { error: data.message || "Login failed!" };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// Logout function
export async function logout() {
  const cookieStore = cookies();
  (await cookieStore).delete("token");
  (await cookieStore).delete("storeId");

  return { success: true, redirectTo: "/login" };
}

export async function getStoreId() {
  const cookieStore = cookies();
  return (await cookieStore).get("storeId")?.value || null;
}
