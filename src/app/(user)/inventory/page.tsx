import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium">Stores</h1>
        <Link
          href="/admin/stores/new"
          className="bg-button text-white p-2 px-4 rounded-full"
        >
          Add New Store
        </Link>
      </div>
    </div>
  );
}

export default page;
