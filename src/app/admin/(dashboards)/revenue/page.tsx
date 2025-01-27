"use client";
import Dropdown from "@/components/Dropdown";
import SalesGraph from "@/components/SalesGraph";
import Image from "next/image";
import React, { useState } from "react";

function Revenue() {
  const states = [
    { code: "OG", name: "Ogun State" },
    { code: "KW", name: "Kwara State" },
    { code: "LAG", name: "Lagos State" },
    { code: "ABJ", name: "Abuja" },
  ];

  const products = [
    "Screen",
    "Downboard",
    "Battery",
    "Back Glass",
    "Touch Pad",
  ];

  const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  const renderProductContent = () => {
    switch (selectedProduct) {
      case "Screen":
        return (
          <div className="w-full h-full">
            <SalesGraph />
          </div>
        );
      case "Downboard":
        return <p className="text-gray-700">Downboard revenue details.</p>;
      case "Battery":
        return <p className="text-gray-700">Battery performance insights.</p>;
      case "Back Glass":
        return <p className="text-gray-700">Back Glass sales tracking.</p>;
      case "Touch Pad":
        return <p className="text-gray-700">Touch Pad revenue summary.</p>;
      default:
        return (
          <p className="text-gray-500">Select a product to see details.</p>
        );
    }
  };

  return (
    <div className="w-full text-black rounded-3xl p-5 h-[88%] bg-white">
      {states.length > 0 ? (
        <div>
          <h1 className="text-black font-semibold">Revenue</h1>
          <div className="flex w-[70%] gap-4 flex-row">
            <Dropdown
              showSearch
              className="bg-white rounded-full w-1/4"
              label={states[0].name}
              options={states}
              placeholder="Select a State"
              onSelect={setSelectedState}
              getLabel={(state) => state.name}
              getSubLabel={(state) => state.code}
            />
            <Dropdown
              showSearch
              className="bg-white rounded-full w-1/4"
              label="Select Product"
              options={products}
              placeholder="Select a Product"
              onSelect={setSelectedProduct}
              getLabel={(product) => product}
            />
          </div>

          {/* Product Selection */}
          <div className="flex pt-10 flex-col gap-4">
            <div className="flex gap-6">
              {products.map((p, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedProduct(p)}
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

            {/* Product Content */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              {renderProductContent()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex justify-center items-center w-48 h-48 rounded-full bg-gradient-to-t from-white to-gray-100">
            <Image
              className="top-3 left-1"
              width={100}
              height={100}
              alt="No Data"
              src={"/icons/revenue.svg"}
            />
          </div>
          <h2>No sales record yet</h2>
        </div>
      )}
    </div>
  );
}

export default Revenue;
