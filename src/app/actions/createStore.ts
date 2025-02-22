"use server";

import { cookies } from "next/headers";
export interface TeamData {
  storeLocation: string;
  storeName: string;
  storeState: string;
  phoneNumber: string;
}

export async function addTeamAction(
  formData: TeamData,
  prevState: { error?: string; success?: boolean } | null
) {
  const storeLocation = formData.storeLocation;
  const storeName = formData.storeName;
  const storeState = formData.storeState;
  const phoneNumber = formData.phoneNumber;
  const token = (await cookies()).get("token")?.value;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        storeLocation,
        storeName,
        storeState,
        phoneNumber,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      return { success: true };
    } else {
      return { error: data.message || "failed to add team member" };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
