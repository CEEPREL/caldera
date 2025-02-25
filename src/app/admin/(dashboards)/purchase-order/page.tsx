import PurchaseOrderTable from "@/components/ui-utils/purchaseOrderTable";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      {/* Header */}
      <div className="flex flex-col ">
        <h1 className="text-2xl font-medium">Purchase Order</h1>
        <div className="">
          <PurchaseOrderTable />
        </div>
      </div>
    </div>
  );
}

export default page;
