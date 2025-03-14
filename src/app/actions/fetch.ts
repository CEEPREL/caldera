"use server";

import { cookies } from "next/headers";
import { PurchaseOrder } from "../caldera/[storeId]/stock-management/page";
//fetch all stores and states
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
      return;
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
};

//fetch products
export const fetchProduct = async () => {
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
    const response = await fetch(`${apiUrl}/product`, {
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
      return;
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
};

// =======fetch for puurchase reequest ============

export async function getallpurchaseOrder(storeId: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    console.error("No token found!");
    return {
      status: false,
      data: [],
      error: "Unauthorized: No token provided",
    };
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("API URL is not defined.");
    return { status: false, data: [], error: "API URL not set" };
  }

  if (!storeId) {
    console.error("Store ID is missing!");
    return { status: false, data: [], error: "Store ID is required" };
  }

  // API endpoints
  const urls = {
    approved: `${apiUrl}/getapprovepo/${storeId}`,
    rejected: `${apiUrl}/getrejectpo/${storeId}`,
    pending: `${apiUrl}/getpendingpo/${storeId}`,
  };

  try {
    // Fetch all API responses
    const responses = await Promise.allSettled(
      Object.entries(urls).map(async ([status, url]) => {
        try {
          const res = await fetch(url, {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) throw new Error(`Failed to fetch: ${url}`);

          const json = await res.json();

          if (!json?.data || !Array.isArray(json.data)) {
            console.warn(`Invalid data from ${status}:`, json);
            return { status, data: [] };
          }

          return { status, data: json.data };
        } catch (err) {
          console.error(`Error fetching ${status}:`, err);
          return { status, data: [] };
        }
      })
    );

    const mergedData: Record<string, PurchaseOrder> = {};

    responses.forEach((res) => {
      if (res.status === "fulfilled" && Array.isArray(res.value.data)) {
        res.value.data.forEach((po: any) => {
          const {
            poId,
            requestDate,
            userId,
            requestTime,
            storeName,
            userName,
            productRequest,
          } = po;

          if (!poId) {
            console.warn("Skipping PO without poId:", po);
            return;
          }

          if (!mergedData[poId]) {
            mergedData[poId] = {
              poId,
              userId: userId,
              storeId,
              requestDate,
              requestTime: requestTime || "00:00:00",
              storeName,
              userName,
              productRequest: [],
              status: res.value.status,
              productRequestCount: 0,
            };
          }

          // Merge product requests (ensure array format)
          if (Array.isArray(productRequest)) {
            mergedData[poId].productRequest.push(...productRequest);
          } else {
            console.warn(
              `Invalid productRequest format for poId: ${poId}`,
              productRequest
            );
          }

          // Update productRequestCount with the number of items in productRequest
          mergedData[poId].productRequestCount =
            mergedData[poId].productRequest.length;
        });
      }
    });

    // Convert merged data to an array
    const finalData = Object.values(mergedData);

    // Sorting by requestTime
    finalData.sort((a, b) => {
      const timeA = a.requestTime
        ? new Date(`1970-01-01T${a.requestTime}Z`).getTime()
        : 0;
      const timeB = b.requestTime
        ? new Date(`1970-01-01T${b.requestTime}Z`).getTime()
        : 0;
      return timeB - timeA;
    });

    return { status: true, data: finalData };
  } catch (error: unknown) {
    console.error("Error in getallpurchaseOrder:", error);
    return {
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =======fetch for Inventory============

export async function getInventoies(storeId: string) {
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
    const response = await fetch(`${apiUrl}/stock/${storeId}`, {
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
}

// =======fetch for Daily============

export async function getSalesReport(storeId: string) {
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
    const response = await fetch(`${apiUrl}/filtertodayorder/${storeId}`, {
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

    const ordersWithProductCount = result.data.map((order: any) => {
      return {
        ...order,
        productCount: order.product.length,
      };
    });
    console.log("its mee the new data: ", ordersWithProductCount);
    return ordersWithProductCount;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
}

// =======fetch for filtered sales============
export async function getFilteredSalesReport(
  storeId: string,
  start: string,
  end: string
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
      `${apiUrl}/filterorderbydate/${storeId}/${start}/${end}`,
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
      return token;
    }
    const result = await response.json();

    const ordersWithProductCount = result.data.map((order: any) => {
      return {
        ...order,
        productCount: order.product.length,
      };
    });
    console.log("its mee the new data: ", ordersWithProductCount);
    return ordersWithProductCount;
  } catch (error) {
    console.error("Error fetching data:", error);
    return "error";
  }
}
