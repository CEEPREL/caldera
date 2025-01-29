"use client";
import Dropdown from "@/components/Dropdown";
import SalesGraph from "@/components/SalesGraph";
import Image from "next/image";
import React, { useState } from "react";
import products from "@/data/data.json";

function Revenue() {
  const states = [
    { code: "OG", name: "Ogun State" },
    { code: "KW", name: "Kwara State" },
    { code: "LAG", name: "Lagos State" },
    { code: "ABJ", name: "Abuja" },
  ];

  const period = ["year", "month", "week", "day"];

  const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(products[0].name);
  const [selectedPeriod, setselectedPeriod] = useState<
    "year" | "month" | "week" | "day"
  >("year");
  const selectedProductData = products.find((p) => p.name === selectedProduct);
  const validPeriod = selectedPeriod || "year";
  const allProduct = products.map((p) => p.sales.year);
  const renderProductContent = () => {
    switch (selectedProduct) {
      case "Screen":
        return (
          <div className="w-full relative bg-blue-500 h-[100px]">
            <SalesGraph data={selectedProductData?.sales[validPeriod] || []} />
          </div>
        );
      case "Downboard":
        return <p className="text-gray-700">Downboard revenue details.</p>;
      case "Battery":
        return <SalesGraph data={selectedProductData?.sales.year || []} />;
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
    <div className="w-full p-5 relative text-black rounded-3x h-[88%] overflow-y-scroll bg-white">
      {products.length > 0 ? (
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
              getSubLabel={(products) => ""}
            />
            <Dropdown
              showSearch
              className="bg-white rounded-full w-1/4"
              label="Select Product"
              options={allProduct}
              placeholder="Select a Product"
              onSelect={setSelectedProduct}
              getLabel={(products) => ""}
            />
          </div>

          {/* Product Selection */}
          <div className="flex pt-10 flex-col gap-4">
            <div className="flex gap-6">
              {products.map((p, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedProduct(p.name)}
                  className={`${
                    selectedProduct === p.name
                      ? "border-b-4 border-blue-400 font-semibold"
                      : ""
                  } p-2`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Product Content */}
            <div className="mt-4 p-4 rounded-lg">
              <div className="flex justify-between flex-row">
                <div>
                  <label className="text-gray-400">Total sales</label>
                  <h1 className="text-2xl font-medium pb-8">₦97,209,080</h1>
                </div>
                <Dropdown
                  showSearch
                  className="bg-white rounded-full w-1/6"
                  label="Select Product"
                  options={period}
                  placeholder={period[0]}
                  onSelect={(vlaue) =>
                    setselectedPeriod(
                      vlaue as "year" | "month" | "week" | "day"
                    )
                  }
                  // getLabel={(period) => period}
                />
              </div>

              {renderProductContent()}
            </div>
            <div className=" absolute bottom-48 w-full border-t-4 left-0 h-1 bg-gray-200" />

            <PurchasingReport />
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

export function PurchasingReport() {
  const states = [
    { code: "OG", name: "Ogun State" },
    { code: "KW", name: "Kwara State" },
    { code: "LAG", name: "Lagos State" },
    { code: "ABJ", name: "Abuja" },
  ];

  const period = ["year", "month", "week", "day"];

  const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(products[0].name);
  const [selectedPeriod, setselectedPeriod] = useState<
    "year" | "month" | "week" | "day"
  >("year");
  const selectedProductData = products.find((p) => p.name === selectedProduct);
  const validPeriod = selectedPeriod || "year";
  const allProduct = products.map((p) => p.sales.year);
  const renderProductContent = () => {
    switch (selectedProduct) {
      case "Screen":
        return (
          <div className="flex bg-slate-300 flex-row">
            <div className="flex flex-col bg-slate-300 w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex h-[100px] flex-row">
                <Image
                  className=" "
                  width={100}
                  height={100}
                  alt=""
                  src={"/icons/phone_icon.svg"}
                />
                <div className="w-full relative bg-amber-200 h-[100px]">
                  <SalesGraph
                    data={selectedProductData?.sales[validPeriod] || []}
                  />
                </div>
                ;
              </div>
            </div>
          </div>
        );
      case "Downboard":
        return <p className="text-gray-700">Downboard revenue details.</p>;
      case "Battery":
        return <SalesGraph data={selectedProductData?.sales.year || []} />;
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
    <div className="w-full text-black   h-[88%]  bg-white">
      {products.length > 0 ? (
        <div>
          <div className="flex flex-row items-center w-full justify-between">
            <h1 className="text-black font-semibold">Purchasing Report</h1>
            <div className="flex justify-end w-[70%] gap-4 flex-row">
              <Dropdown
                showSearch
                className="bg-white rounded-full w-1/6"
                label="Select Product"
                options={period}
                placeholder={period[0]}
                onSelect={(vlaue) =>
                  setselectedPeriod(vlaue as "year" | "month" | "week" | "day")
                }
                // getLabel={(period) => period}
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-6">
              {products.map((p, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedProduct(p.name)}
                  className={`${
                    selectedProduct === p.name
                      ? "border-b-4 border-blue-400 font-semibold"
                      : ""
                  } p-2`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Product Content */}
            <div className="mt-4 p-4 rounded-lg">{renderProductContent()}</div>
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
