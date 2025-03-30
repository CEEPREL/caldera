"use server";

import { cookies } from "next/headers";
//fetch all stores and states
export const fetchAllAdminReport = async () => {
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
    const response = await fetch(`${apiUrl}/adminrevenue/all`, {
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

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
};

export async function fetchDatedCatAdminReport(
  fromDate: string,
  toDate: string,
  cat: string
) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found in cookies.");
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined.");
    return null;
  }

  try {
    const response = await fetch(
      `${apiUrl}/adminrevenue/${cat}/${fromDate}/${toDate}`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch: ${response.statusText} (status: ${response.status})`
      );
      return;
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
}
export async function fetchDatedStoreReport(
  storeId: string,
  fromDate: string,
  toDate: string
) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found in cookies.");
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined.");
    return null;
  }

  try {
    const response = await fetch(
      `${apiUrl}/storerevenue/${storeId}/all/${fromDate}/${toDate}`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch: ${response.statusText} (status: ${response.status})`
      );
      return;
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
}
export async function fetchDatedAdminReport(fromDate: string, toDate: string) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found in cookies.");
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined.");
    return null;
  }

  try {
    const response = await fetch(
      `${apiUrl}/adminrevenue/all/${fromDate}/${toDate}`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch: ${response.statusText} (status: ${response.status})`
      );
      return;
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
}
