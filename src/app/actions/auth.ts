"use server";

import { cookies } from "next/headers";

export async function loginAction(
  prevState: { error?: string; success?: boolean } | null,
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
      (await cookies()).set("token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      return { success: true };
    } else {
      return { error: data.message || "Login failed!" };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

export async function logout() {
  (await cookies()).set("token", "", { expires: new Date(0) });
}
