"use client";
import PurchaseOrderTable from "@/components/ui-utils/purchaseOrderTable";
import Link from "next/link";
import React from "react";

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
        className="bg-blue-500 rounded-sm px-2 py-1 hover:bg-blue-300 text-white font-semibold"
      >
        {row.status === "Pending" ? "Approve" : "View"}
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
  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col ">
        <h1 className="text-2xl font-medium">Purchase Order</h1>
        <div className="">
          <PurchaseOrderTable
            columns={columns}
            data={apiData}
            onActionClick={handleAction}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
