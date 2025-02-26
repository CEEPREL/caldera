import PurchaseOrderTable from "@/components/ui-utils/purchaseOrderTable";
import Link from "next/link";
import React from "react";

interface MenuItem {
  label: string;
  icon: string;
  actionType?: "link" | "button" | "div";
  href?: string;
}

const apiData = [
  {
    id: 1,
    productName: "iPhone X Screen",
    Purchased: 5000,
    price: 10,
    stock: 0,
    status: "out of stock",
  },
  {
    id: 2,
    productName: "Samsung Battery",
    Purchased: 3000,
    price: 5,
    stock: 2,
    status: "In Stock",
  },
];

function page() {
  const columns = [
    { key: "id", label: "#" },
    { key: "productName", label: "Product" },
    { key: "Purchased", label: "Purchased" },
    { key: "price", label: "Selling Price" },
    { key: "stock", label: "Stock" },
    { key: "status", label: "Status" },
    {
      key: "Set",
      label: "Set",
    },
  ];

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium">Purchase Order</h1>
        <div>
          <PurchaseOrderTable columns={columns} data={apiData} />
        </div>
      </div>
    </div>
  );
}

export default page;
