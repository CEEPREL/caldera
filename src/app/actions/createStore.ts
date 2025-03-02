"use server";

import { cookies } from "next/headers";
export interface StoreData {
  storeLocation: string;
  storeName: string;
  storeState: string;
  phoneNumber: string;
}

export async function createStore(formData: StoreData) {
  const storeLocation = formData.storeLocation;
  const storeName = formData.storeName;
  const storeState = formData.storeState;
  const phoneNumber = formData.phoneNumber;
  const token = (await cookies()).get("token")?.value;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
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

// Assign user

interface assignStoreInfoProp {
  userId: string;
  storeId: string;
}
export async function assignStore(assignStoreInfo: assignStoreInfoProp) {
  const userId = assignStoreInfo.userId;
  const storeId = assignStoreInfo.storeId;
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignstore`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    method: "POST",
    body: JSON.stringify({
      storeId,
      userId,
    }),
  });
  const data = await res.json();
  return { message: data.message };
}
