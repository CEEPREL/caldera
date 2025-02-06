"use server";

import { cookies } from "next/headers";
export interface TeamData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userName: string;
}

export async function addTeamAction(
  formData: TeamData,
  prevState: { error?: string; success?: boolean } | null
) {
  const fullName = formData.fullName;
  const password = formData.password;
  const phoneNumber = formData.phoneNumber;
  const userName = formData.userName;
  const email = formData.email;
  const token = (await cookies()).get("token")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/addstaff`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          fullName,
          password,
          phoneNumber,
          userName,
          email,
        }),
      }
    );
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
