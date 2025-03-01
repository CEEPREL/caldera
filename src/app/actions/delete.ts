"use server";
import { cookies } from "next/headers";
// Delete  store
export async function deleteStore(id: string) {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    method: "DELETE",
  });
  const data = await res.json();
  return { message: data.message };
}

// Delete  store
export async function deleteStaff(id: string) {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    method: "DELETE",
  });
  const data = await res.json();
  return { message: data.message };
}
