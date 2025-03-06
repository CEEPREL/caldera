import type { NextApiRequest, NextApiResponse } from "next";

type ProductRequest = {
  prId: string;
  poId: string;
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  categoryId: string;
  categoryName: string;
  productId: string;
  productName: string;
  costPrice: number | null;
  unitPrice: number | null;
  requestQuantity: number;
};

type PurchaseOrder = {
  poId: string;
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  requestDate: string;
  requestTime: string;
  status: string;
  productRequest: ProductRequest[];
};

const fetchData = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  const data = await res.json();
  return data.data; // Assuming the data is in the `data` array
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { storeId } = req.query;
    if (!storeId)
      return res.status(400).json({ error: "Store ID is required" });

    const urls = [
      `/getpendingpo/${storeId}`,
      `/getrejectpo/${storeId}`,
      `/getapprovepo/${storeId}`,
    ];

    const responses = await Promise.all(urls.map((url) => fetchData(url)));

    // Merge all data into a single array
    const allData: PurchaseOrder[] = responses.flat();

    // Sort by date & time (latest first)
    allData.sort((a, b) => {
      const dateA = new Date(`${a.requestDate} ${a.requestTime}`).getTime();
      const dateB = new Date(`${b.requestDate} ${b.requestTime}`).getTime();
      return dateB - dateA;
    });

    res.status(200).json({ status: true, data: allData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
