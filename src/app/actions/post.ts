"use server";
import { cookies } from "next/headers";

export async function createPurchaseOrder(
  products: Array<{
    categoryId: string;
    categoryName: string;
    productId: string;
    productName: string;
    requestQuantity: number;
  }>
) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found!");
    return {
      status: false,
      data: [],
      error: "Unauthorized: No token provided",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/purchaseorder`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product: products }),
      }
    );
    console.log(JSON.stringify({ product: products }));

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);

      throw new Error(
        errorData.error ||
          "Something went wrong while submitting the purchase order"
      );
    }

    const result = await response.json();

    console.log(result);

    return { status: true, data: result };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting purchase order:", error.message);
      return { error: error.message || "Error submitting purchase order" };
    } else {
      console.error("Unknown error occurred", error);
      return { error: "Unknown error occurred" };
    }
  }
}

export async function createSalesOrder(order: any) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found!");
    return {
      status: false,
      data: [],
      error: "Unauthorized: No token provided",
    };
  }

  try {
    console.log("ppayload", JSON.stringify({ order: order }));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error || "Something went wrong while submitting the order"
      );
    }

    const result = await response.json();

    return { status: true, data: result };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting purchase order:", error.message);
      return { error: error.message || "Error submitting purchase order" };
    } else {
      console.error("Unknown error occurred", error);
      return { error: "Unknown error occurred" };
    }
  }
}
export async function createSalesPayment(order: any) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found!");
    return {
      status: false,
      data: [],
      error: "Unauthorized: No token provided",
    };
  }

  try {
    console.log("ppayload", JSON.stringify(order));
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/makepayment`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error || "Something went wrong while submitting the order"
      );
    }

    const result = await response.json();

    return { status: true, data: result };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting purchase order:", error.message);
      return { error: error.message || "Error submitting purchase order" };
    } else {
      console.error("Unknown error occurred", error);
      return { error: "Unknown error occurred" };
    }
  }
}

export async function createSalesRefund(order: any) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found!");
    return {
      status: false,
      data: [],
      error: "Unauthorized: No token provided",
    };
  }

  try {
    console.log("ppayload", JSON.stringify({ order: order }));
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/refundorderproduct`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(
        errorData.error || "Something went wrong while submitting the order"
      );
    }

    const result = await response.json();

    return { status: true, data: result };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting purchase order:", error.message);
      return { error: error.message || "Error submitting purchase order" };
    } else {
      console.error("Unknown error occurred", error);
      return { error: "Unknown error occurred" };
    }
  }
}

export async function acceptAllOrder(order: any) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found!");
    return {
      status: false,
      data: [],
      error: "Unauthorized: No token provided",
    };
  }

  try {
    console.log("payload", JSON.stringify(order));
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/approvepurchaseorder`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);

      throw new Error(
        errorData.error || "Something went wrong while submitting the order"
      );
    }

    const result = await response.json();

    return { status: true, data: result };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting purchase order:", error.message);
      return { error: error.message || "Error submitting purchase order" };
    } else {
      console.error("Unknown error occurred", error);
      return { error: "Unknown error occurred" };
    }
  }
}
export async function resetPass(order: any) {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    console.error("No token found!");
    return {
      status: false,
      data: [],
      error: "Unauthorized: No token provided",
    };
  }

  try {
    console.log("payload", JSON.stringify(order));
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/resetpassword`,
      {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );
    console.log(order);

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);

      throw new Error(
        errorData.error || "Something went wrong while submitting the order"
      );
    }

    const result = await response.json();

    return { status: true, data: result };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting purchase order:", error.message);
      return { error: error.message || "Error submitting purchase order" };
    } else {
      console.error("Unknown error occurred", error);
      return { error: "Unknown error occurred" };
    }
  }
}

export async function assignStore(storesId: string, id: string) {
  const storeId = storesId;
  const userId = id;
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignstore`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Correct authorization header
    },
    method: "POST",
    body: JSON.stringify({ storeId, userId }),
  });

  const data = await res.json();

  return {
    data,
  };
}
