import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const urls = [
      `http://localhost:3000/api/getpendingpo/${storeId}`,
      `http://localhost:3000/api/getrejectpo/${storeId}`,
      `http://localhost:3000/api/getapprovepo/${storeId}`,
    ];

    // Use Promise.allSettled to avoid breaking the entire request if one API fails
    const responses = await Promise.allSettled(
      urls.map(async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
        return res.json();
      })
    );

    // Extract data from fulfilled promises and log errors for rejected ones
    const allData = responses
      .filter((res) => res.status === "fulfilled")
      .map((res) => (res as PromiseFulfilledResult<any>).value);

    // Log errors if any API request failed
    const errors = responses
      .filter((res) => res.status === "rejected")
      .map((res) => (res as PromiseRejectedResult).reason.message);

    return NextResponse.json(
      {
        status: true,
        data: allData.flat(),
        errors: errors.length ? errors : null,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
