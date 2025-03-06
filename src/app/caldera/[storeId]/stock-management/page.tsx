"use client";
import { useStore } from "@/ContextAPI/storeContex";
import { getStoreId } from "@/app/actions/auth";
import CartSlider from "@/components/store/daily_sales/CartSlider";
import PurchaseOrderTable from "@/components/store/stock_mgt/purchaseOrderTable";
import { ShoppingBasket } from "lucide-react";
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

const dailySalesData = [
  {
    id: "1",
    date: "Today",
    revenue: 15000,
    quantity: 5,
    payment: "20 Products",
  },
  {
    id: "2",
    date: "Yesterday",
    revenue: 12000,
    quantity: 3,
    payment: "20 Products",
  },
  {
    id: " 3",
    date: "2024-01-03",
    revenue: 18000,
    quantity: 7,
    payment: "20 Products",
  },
];

// ==========Table Columns header =======
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

const productsTable = [
  { key: "id", label: "#" },
  { key: "productName", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "userId", label: "Append By" },
  {
    key: "action",
    label: "Action",
    render: (row: any) => (
      <button
        onClick={() => handleAction(row)}
        className={`text-button w-fullbg-blue-500 w-full hover:text-blue-300  rounded-sm px-2 py-1 font-semibold`}
      >
        Add
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
  const { storeData } = useStore();
  const storeId = storeData?.data.storeId;
  const [openCart, setOpenCart] = useState(false);

  const [salesToggle, setSalesToggle] = useState<"purchase order" | "product">(
    "purchase order"
  );

  const handleOnDelete = () => {
    console.log("Hi");
  };
  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-medium">Stock Managment</h1>

          <button onClick={() => setOpenCart(true)} className="relative">
            <h1 className="flex text-xs -top-2 right-0 absolute w-5 h-5 items-center justify-center bg-red-400 text-white rounded-full">
              {}
            </h1>
            <div className="bg-gray-200 rounded-full p-1">
              <ShoppingBasket />
            </div>
          </button>
          <CartSlider
            onDelete={handleOnDelete}
            isOpen={openCart}
            onClose={() => setOpenCart(false)}
            data={dailySalesData}
            width="w-1/4"
            overlayColor="bg-black bg-opacity-50"
            drawerStyle="bg-white"
          />
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
                href={`/caldera/${storeId}/stock-management/purchase-order`}
                className="bg-button text-white p-2 px-4 rounded-full"
              >
                Purchase Order
              </Link>
            </div>
          ) : (
            <div className="flex gap-2 py-2 flex-row">
              {" "}
              <Link
                href={`/caldera/${storeId}/stock-management/new-product`}
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
              columns={productsTable}
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
