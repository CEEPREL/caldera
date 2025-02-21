"use server";

import { cookies } from "next/headers";

export const fetchStores = async () => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found in cookies.");
    return null; // or throw an error
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined.");
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/store`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch: ${response.statusText} (status: ${response.status})`
      );
      return token;
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
};

//fetch staffs or team
export const fetchStaff = async () => {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found in cookies.");
    return null; // or throw an error
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined.");
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/staff`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch: ${response.statusText} (status: ${response.status})`
      );
      return token;
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
};
