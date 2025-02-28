"use client";
import PurchaseOrderTable from "@/components/ui-utils/purchaseOrderTable";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import SalesHistorySlider from "@/components/user/SalesHistorySlider";

const dailySalesData = [
  {
    id: "1",
    date: "Today",
    totalSales: 15000,
    totalOrders: 5,
    status: "20 Products",
  },
  {
    id: "2",
    date: "Yesterday",
    totalSales: 12000,
    totalOrders: 3,
    status: "20 Products",
  },
  {
    id: " 3",
    date: "2024-01-03",
    totalSales: 18000,
    totalOrders: 7,
    status: "20 Products",
  },
];

const productRecordData = [
  {
    id: "1",
    productName: "iPhone X Screen",
    revenue: 5000,
    date: "2024-01-01",
    sales: 0,
    payment: "Out of Stock",
  },
  {
    id: "2",
    productName: "Samsung Battery",
    revenue: 3000,
    date: "2024-01-02",
    sales: 2,
    payment: "In Stock",
  },
  {
    id: "3",
    productName: "MacBook Charger",
    revenue: 8000,
    date: "2024-01-03",
    sales: 5,
    payment: "In Stock",
  },
];

const productList = [
  "Screen",
  "Downboard",
  "Battery",
  "Back Glass",
  "Touch Pad",
];

function Page() {
  const [salesToggle, setSalesToggle] = useState<"daily" | "product">("daily");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Screen");
  const [toggle, setToggle] = useState(false);
  const handleToggle = (p: string) => {
    setToggle(!toggle);
    setSelectedProduct(p);
  };

  const columns = [
    { key: "id", label: "#" },
    { key: "productName", label: "Product" },
    { key: "sales", label: "Number of sales" },
    { key: "revenue", label: "Total Revenue" },

    {
      key: "action",
      label: "",
      render: (row: any) => (
        <div>
          <button onClick={() => setOpen(true)} className={``}>
            <ChevronRight />
          </button>

          <SalesHistorySlider
            isOpen={open}
            onClose={() => setOpen(false)}
            data={productRecordData} // Pass the entire array
            width="w-1/4"
            overlayColor="bg-black bg-opacity-50"
            drawerStyle="bg-white"
          />
        </div>
      ),
    },
  ];
  const handleAction = (row: any) => {
    console.log("Perform action on:", row);
    alert(`Action performed on ${row.productName}`);
  };
  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex gap-2 flex-col">
        <h1 className="text-2xl font-medium">Sales</h1>
        <div className="flex gap-2 flex-row">
          <button
            className={`${
              salesToggle === "daily"
                ? "bg-button text-white"
                : "border bg-white"
            } p-2 px-4 rounded-full `}
            onClick={() => setSalesToggle("daily")}
          >
            Daily Sales
          </button>
          <button
            className={`${
              salesToggle === "product"
                ? "bg-button text-white"
                : "border bg-white"
            } p-2 px-4 rounded-full `}
            onClick={() => setSalesToggle("product")}
          >
            Product Record
          </button>
        </div>

        {salesToggle === "daily" ? (
          <div className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dailySalesData.map((sale) => (
              <Link key={sale.id} href={`/sales-record/${sale.id}`}>
                <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex w-full flex-col gap-8">
                      <p className="text-sm text-gray-500">{sale.date}</p>
                      <div className="flex flex-row justify-between w-full">
                        <p className="text-sm text-black">{sale.status}</p>
                        <ChevronRight />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="gap-2 flex flex-col">
            <div className="flex gap-6">
              {productList.map((p, index) => (
                <button
                  key={index}
                  onClick={() => handleToggle(p)}
                  className={`${
                    selectedProduct === p
                      ? "border-b-4 border-blue-400 font-semibold"
                      : ""
                  } p-2`}
                >
                  {p}
                </button>
              ))}
            </div>
            <PurchaseOrderTable
              columns={columns}
              data={productRecordData}
              onActionClick={handleAction}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
