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

  // const products = [
  //   {
  //     name: "Screen",
  //     sales: {
  //       year: [
  //         {
  //           name: "Page A",
  //           uv: 4000,
  //           pv: 2400,
  //           amt: 2400,
  //         },
  //         {
  //           name: "Page B",
  //           uv: 3000,
  //           pv: 1398,
  //           amt: 2210,
  //         },
  //         {
  //           name: "Page C",
  //           uv: 2000,
  //           pv: 9800,
  //           amt: 2290,
  //         },
  //         {
  //           name: "Page D",
  //           uv: 2780,
  //           pv: 3908,
  //           amt: 2000,
  //         },
  //         {
  //           name: "Page E",
  //           uv: 1890,
  //           pv: 4800,
  //           amt: 2181,
  //         },
  //         {
  //           name: "Page F",
  //           uv: 2390,
  //           pv: 3800,
  //           amt: 2500,
  //         },
  //         {
  //           name: "Page G",
  //           uv: 3490,
  //           pv: 4300,
  //           amt: 2100,
  //         },
  //       ],
  //       month: [
  //         {
  //           name: "Page A",
  //           uv: 4000,
  //           pv: 2400,
  //           amt: 2400,
  //         },
  //         {
  //           name: "Page B",
  //           uv: 3000,
  //           pv: 1398,
  //           amt: 2210,
  //         },
  //         {
  //           name: "Page C",
  //           uv: 2000,
  //           pv: 9800,
  //           amt: 2290,
  //         },
  //         {
  //           name: "Page D",
  //           uv: 2780,
  //           pv: 3908,
  //           amt: 2000,
  //         },
  //         {
  //           name: "Page E",
  //           uv: 1890,
  //           pv: 4800,
  //           amt: 2181,
  //         },
  //         {
  //           name: "Page F",
  //           uv: 2390,
  //           pv: 3800,
  //           amt: 2500,
  //         },
  //         {
  //           name: "Page G",
  //           uv: 3490,
  //           pv: 4300,
  //           amt: 2100,
  //         },
  //       ],
  //       week: [
  //         {
  //           name: "Page A",
  //           uv: 4000,
  //           pv: 2400,
  //           amt: 2400,
  //         },
  //         {
  //           name: "Page B",
  //           uv: 3000,
  //           pv: 1398,
  //           amt: 2210,
  //         },
  //         {
  //           name: "Page C",
  //           uv: 2000,
  //           pv: 9800,
  //           amt: 2290,
  //         },
  //         {
  //           name: "Page D",
  //           uv: 2780,
  //           pv: 3908,
  //           amt: 2000,
  //         },
  //         {
  //           name: "Page E",
  //           uv: 1890,
  //           pv: 4800,
  //           amt: 2181,
  //         },
  //         {
  //           name: "Page F",
  //           uv: 2390,
  //           pv: 3800,
  //           amt: 2500,
  //         },
  //         {
  //           name: "Page G",
  //           uv: 3490,
  //           pv: 4300,
  //           amt: 2100,
  //         },
  //       ],
  //       day: [
  //         {
  //           name: "Page A",
  //           uv: 4000,
  //           pv: 2400,
  //           amt: 2400,
  //         },
  //         {
  //           name: "Page B",
  //           uv: 3000,
  //           pv: 1398,
  //           amt: 2210,
  //         },
  //         {
  //           name: "Page C",
  //           uv: 2000,
  //           pv: 9800,
  //           amt: 2290,
  //         },
  //         {
  //           name: "Page D",
  //           uv: 2780,
  //           pv: 3908,
  //           amt: 2000,
  //         },
  //         {
  //           name: "Page E",
  //           uv: 1890,
  //           pv: 4800,
  //           amt: 2181,
  //         },
  //         {
  //           name: "Page F",
  //           uv: 2390,
  //           pv: 3800,
  //           amt: 2500,
  //         },
  //         {
  //           name: "Page G",
  //           uv: 3490,
  //           pv: 4300,
  //           amt: 2100,
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     name: "Battery",
  //     sales: {
  //       year: [
  //         {
  //           name: "Page A",
  //           uv: 4000,
  //           pv: 2400,
  //           amt: 2400,
  //         },
  //         {
  //           name: "Page B",
  //           uv: 3000,
  //           pv: 1398,
  //           amt: 2210,
  //         },
  //         {
  //           name: "Page C",
  //           uv: 2000,
  //           pv: 9800,
  //           amt: 2290,
  //         },
  //         {
  //           name: "Page D",
  //           uv: 2780,
  //           pv: 3908,
  //           amt: 2000,
  //         },
  //         {
  //           name: "Page E",
  //           uv: 1890,
  //           pv: 4800,
  //           amt: 2181,
  //         },
  //         {
  //           name: "Page F",
  //           uv: 2390,
  //           pv: 3800,
  //           amt: 2500,
  //         },
  //         {
  //           name: "Page G",
  //           uv: 3490,
  //           pv: 4300,
  //           amt: 2100,
  //         },
  //       ],
  //       month: [
  //         {
  //           name: "Page A",
  //           uv: 4000,
  //           pv: 2400,
  //           amt: 2400,
  //         },
  //         {
  //           name: "Page B",
  //           uv: 3000,
  //           pv: 1398,
  //           amt: 2210,
  //         },
  //         {
  //           name: "Page C",
  //           uv: 2000,
  //           pv: 9800,
  //           amt: 2290,
  //         },
  //         {
  //           name: "Page D",
  //           uv: 2780,
  //           pv: 3908,
  //           amt: 2000,
  //         },
  //         {
  //           name: "Page E",
  //           uv: 1890,
  //           pv: 4800,
  //           amt: 2181,
  //         },
  //         {
  //           name: "Page F",
  //           uv: 2390,
  //           pv: 3800,
  //           amt: 2500,
  //         },
  //         {
  //           name: "Page G",
  //           uv: 3490,
  //           pv: 4300,
  //           amt: 2100,
  //         },
  //       ],
  //       week: [
  //         {
  //           name: "Page A",
  //           uv: 4000,
  //           pv: 2400,
  //           amt: 2400,
  //         },
  //         {
  //           name: "Page B",
  //           uv: 3000,
  //           pv: 1398,
  //           amt: 2210,
  //         },
  //         {
  //           name: "Page C",
  //           uv: 2000,
  //           pv: 9800,
  //           amt: 2290,
  //         },
  //         {
  //           name: "Page D",
  //           uv: 2780,
  //           pv: 3908,
  //           amt: 2000,
  //         },
  //         {
  //           name: "Page E",
  //           uv: 1890,
  //           pv: 4800,
  //           amt: 2181,
  //         },
  //         {
  //           name: "Page F",
  //           uv: 2390,
  //           pv: 3800,
  //           amt: 2500,
  //         },
  //         {
  //           name: "Page G",
  //           uv: 3490,
  //           pv: 4300,
  //           amt: 2100,
  //         },
  //       ],
  //       day: [
  //         {
  //           name: "Page A",
  //           uv: 4000,
  //           pv: 2400,
  //           amt: 2400,
  //         },
  //         {
  //           name: "Page B",
  //           uv: 3000,
  //           pv: 1398,
  //           amt: 2210,
  //         },
  //         {
  //           name: "Page C",
  //           uv: 2000,
  //           pv: 9800,
  //           amt: 2290,
  //         },
  //         {
  //           name: "Page D",
  //           uv: 2780,
  //           pv: 3908,
  //           amt: 2000,
  //         },
  //         {
  //           name: "Page E",
  //           uv: 1890,
  //           pv: 4800,
  //           amt: 2181,
  //         },
  //         {
  //           name: "Page F",
  //           uv: 2390,
  //           pv: 3800,
  //           amt: 2500,
  //         },
  //         {
  //           name: "Page G",
  //           uv: 3490,
  //           pv: 4300,
  //           amt: 2100,
  //         },
  //       ],
  //     },
  //   },
  // ];

  const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedPeriod, setselectedPeriod] = useState("");
  const selectedProductData = products.find((p) => p.name === selectedProduct);
  const validPeriod = ["year", "month", "week", "day"].includes(selectedPeriod)
    ? selectedPeriod
    : "year";
  const allProduct = products.map((p) => p.sales.year);
  const renderProductContent = () => {
    switch (selectedProduct) {
      case "Screen":
        return (
          <div className="w-full h-full">
            <SalesGraph data={selectedProductData?.sales[validPeriod] || []} />;
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
    <div className="w-full text-black rounded-3xl p-5 h-[88%] overflow-y-scroll bg-white">
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
                  <h1 className="text-2xl font-bold">₦97,209,080</h1>
                </div>
                <Dropdown
                  showSearch
                  className="bg-white rounded-full w-1/6"
                  label="Select Product"
                  options={period}
                  placeholder="Select a Product"
                  onSelect={setselectedPeriod}
                  // getLabel={(period) => period}
                />
              </div>

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

// c

// const [selectedState, setSelectedState] = useState("");
// const [selectedProduct, setSelectedProduct] = useState("");
// const highest = products.products.reduce((max, obj) =>
//   max.sales.year > obj.sales.year ? max : obj
// );
