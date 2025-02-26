"use client";
import ProductTable from "@/components/store/ProductTable";
import Image from "next/image";
import { useState } from "react";

const productList = [
  "Screen",
  "Downboard",
  "Battery",
  "Back Glass",
  "Touch Pad",
];

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState("Screen");
  const [toggle, setToggle] = useState(false);
  const handleToggle = (p: string) => {
    setToggle(!toggle);
    setSelectedProduct(p);
  };
  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl ">
      <div className="w-full p-5 relative text-black  bg-white">
        <div className="flex w-full flex-row justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="flex sticky top-0 items-center flex-row"
          >
            <div className="flex justify-center items-center w-8 h-8 m-4 rounded-full bg-gray-300">
              <Image
                className="top-3 left-1"
                width={20}
                height={20}
                alt="No Data"
                src={"/icons/arrow_left.svg"}
              />
            </div>
            <h1 className="text-black">Create New Store</h1>
          </button>
          <input
            className="w-1/4 h-10 rounded-2xl border border-gray-300 p-2"
            type="text"
            placeholder="Search here..."
          />
        </div>
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

        <div className="w-full pt-5 h-full">
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
