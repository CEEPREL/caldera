"use server";

import { cookies } from "next/headers";
export interface TeamData {
  fullName: string;
  email: string;
  phoneNumber: string;
  userName: string;
  storeName: string;
  resetUrl: string;
  storeId: string;
}

export async function addTeamAction(formData: TeamData) {
  const fullName = formData.fullName;
  const phoneNumber = formData.phoneNumber;
  const userName = formData.userName;
  const email = formData.email;
  const storeName = formData.storeName;
  const resetUrl = formData.resetUrl;
  const storeId = formData.storeId;
  const token = (await cookies()).get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/addstaff`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          fullName,
          phoneNumber,
          userName,
          email,
          storeName,
          resetUrl,
          storeId,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return { error: data.message || "failed to add team member" };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
