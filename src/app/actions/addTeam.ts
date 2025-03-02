"use server";

import { cookies } from "next/headers";
export interface TeamData {
  fullName: string;
  email: string;
  phoneNumber: string;
  userName: string;
}

export async function addTeamAction(formData: TeamData) {
  const fullName = formData.fullName;
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
          Authorization: `${token}`,
        },
        method: "POST",
        body: JSON.stringify({
          fullName,
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
