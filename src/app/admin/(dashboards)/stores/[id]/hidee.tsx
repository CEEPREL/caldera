"use client";
import ProductTable from "@/components/store/general_UI/ProductTable";

export default function StorePage() {
  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl ">
      <div className="w-full p-5 relative text-black  bg-white">
        <div className="flex w-full flex-row justify-between items-center">
          <h1 className="text-2xl font-bold">Stock Management</h1>
          <input
            className="w-1/4 h-10 rounded-2xl border border-gray-300 p-2"
            type="text"
            placeholder="Search here..."
          />
        </div>
        <div className="w-full pt-5 h-full">
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
