"use client";
import PurchaseOrderTable from "@/components/store/stock_mgt/purchaseOrderTable";
import Link from "next/link";
import React, { useState } from "react";

const apiData = [
  {
    id: 1,
    productName: "iPhone X Screen",
    cadre: "Lagos 1",
    quantity: 10,
    note: "This product...",
    status: "Pending",
  },
  {
    id: 2,
    productName: "Samsung Battery",
    cadre: "Abuja 2",
    quantity: 5,
    note: "Urgent replacement needed.",
    status: "Approved",
  },
];

// Table Columns with Conditional Rendering
const columns = [
  { key: "id", label: "#" },
  { key: "productName", label: "Product Name" },
  { key: "cadre", label: "Cadre" },
  { key: "quantity", label: "Quantity" },
  { key: "note", label: "Note" },
  { key: "status", label: "Status" },
  {
    key: "action",
    label: "Action",
    render: (row: any) => (
      <button
        onClick={() => handleAction(row)}
        className={`${
          row.status === "Pending"
            ? "bg-gray-400 w-full"
            : "bg-blue-500 w-full hover:bg-blue-300"
        }  rounded-sm px-2 py-1  text-white font-semibold`}
      >
        {row.status === "Pending" ? "Pending" : "View"}
      </button>
    ),
  },
];

// Function to Handle Button Clicks
const handleAction = (row: any) => {
  console.log("Perform action on:", row);
  alert(`Action performed on ${row.productName}`);
};

function page() {
  const [salesToggle, setSalesToggle] = useState<"purchase order" | "product">(
    "purchase order"
  );
  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Stock Management</h1>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2 py-2 flex-row">
            <button
              className={`${
                salesToggle === "purchase order"
                  ? "bg-button text-white"
                  : "border bg-white"
              } p-2 px-4 rounded-full `}
              onClick={() => setSalesToggle("purchase order")}
            >
              Purchase Order
            </button>
            <button
              className={`${
                salesToggle === "product"
                  ? "bg-button text-white"
                  : "border bg-white"
              } p-2 px-4 rounded-full `}
              onClick={() => setSalesToggle("product")}
            >
              Products
            </button>
          </div>
          {salesToggle === "purchase order" ? (
            <div className="flex gap-2 py-2 flex-row">
              {" "}
              <Link
                href="/stock-management/purchase-order"
                className="bg-button text-white  p-2 px-4 rounded-full"
              >
                Purchase Order
              </Link>
            </div>
          ) : (
            <div className="flex gap-2 py-2 flex-row">
              {" "}
              <Link
                href="/stock-management/new-product"
                className="bg-button text-white  p-2 px-4 rounded-full"
              >
                Create new Product
              </Link>
            </div>
          )}
        </div>

        {salesToggle === "purchase order" ? (
          <div className="">
            <PurchaseOrderTable
              columns={columns}
              data={apiData}
              onActionClick={handleAction}
            />
          </div>
        ) : (
          <div>
            <PurchaseOrderTable
              columns={columns}
              data={apiData}
              onActionClick={handleAction}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
