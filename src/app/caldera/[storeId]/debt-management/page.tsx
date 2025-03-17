"use client";
import { useStore } from "@/ContextAPI/storeContex";
import { getDebtorsList, getOutOfStockList } from "@/app/actions/fetch";
import PurchaseOrderTable from "@/components/store/inventory/purchaseOrderTable";
// import PurchaseOrderTable from "@/components/store/stock_mgt/purchaseOrderTable";
import React, { useEffect, useState } from "react";

export interface InventoryItem {
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  categoryId: string;
  categoryName: string;
  total: number;
  outOfStock: "0" | "1";
  createdDate: string;
  createdTime: string;
}

function Page() {
  const { storeData } = useStore();
  const storeId = storeData?.data.storeId;
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  // const [error, setError] = useState("");

  const inventoryTable = [
    { key: "", label: "#" },
    { key: "customerName", label: "Customer Name" },
    { key: "paidAmount", label: " Paid Amount" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "transactionDate", label: "Transaction Date" },
    { key: "userName", label: "Sold By " },
    // {
    //   key: "action",
    //   label: "Action",
    //   render: (row: InventoryItem) => (
    //     <div>
    //       {/* <button
    //         onClick={() => handleAction(row)}
    //         className={`${
    //           row.status === "Pending"
    //             ? "bg-gray-400 w-full hover:bg-gray-300"
    //             : "bg-blue-500 w-full hover:bg-blue-300"
    //         } rounded-sm px-2 py-1 text-white font-semibold`}
    //       >
    //         {row.status === "Pending" ? "Pending" : "View"}
    //       </button> */}
    //     </div>
    //   ),
    // },
  ];

  useEffect(() => {
    if (!storeId) return;

    const fetchPoData = async () => {
      setLoading(true);
      const result = await getDebtorsList(`${storeId}`);
      console.log("debt  res:", result);

      if (!result) {
        console.error("Unknown error fetching data");
      } else {
        setInventoryData(result.data);
      }
      setLoading(false);
    };

    fetchPoData();
  }, [storeId]);
  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium">Debt Lists</h1>
        <div>
          {loading ? (
            <p className="text-2xl">Loading...</p>
          ) : (
            <PurchaseOrderTable columns={inventoryTable} data={inventoryData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
