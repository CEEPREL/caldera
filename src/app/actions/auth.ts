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
      const { storeId, role } = data.data;
      const { token } = data;

      if (role === "staff" && !storeId) {
        return { error: "You are not assigned to any store." };
      }

      // Set cookies with JSON.stringify for objects
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

      (await cookieStore).set("storeData", JSON.stringify(data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
      });

      if (role === "admin") {
        return { success: true, redirectTo: `admin/report` };
      }
      return {
        success: true,
        redirectTo: `caldera/${storeId}/report`,
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
  (await cookieStore).delete("storeData");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      return { success: true, redirectTo: "/login" };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

// Retrieve storeId
export async function getStoreId() {
  const cookieStore = cookies();
  return (await cookieStore).get("storeId")?.value || null;
}

// Retrieve storeData (now properly parsing JSON)
export async function getStoreData() {
  const cookieStore = cookies();
  const storeData = (await cookieStore).get("storeData")?.value;

  if (!storeData) {
    return null;
  }

  try {
    const parsedData = JSON.parse(storeData);
    return parsedData;
  } catch (error) {
    return error;
  }
}

export async function resetPass(
  prevState: { error?: string; success?: boolean; redirectTo?: string } | null,
  formData: FormData
) {
  const userId = formData.get("userId") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/updatepassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return { success: true, redirectTo: "/login" };
    } else {
      return { error: data.message || "Reset failed!" };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
