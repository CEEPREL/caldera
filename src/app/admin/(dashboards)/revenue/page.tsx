"use client";
import Dropdown from "@/components/Dropdown";
import SalesGraph from "@/components/visualizationToola/SalesGraph";
import Image from "next/image";
import React, { useState } from "react";
import products from "@/data/data.json";

type PeriodType = "year" | "month" | "week" | "day";

function Revenue() {
  // const states = [
  //   { code: "OG", name: "Ogun State" },
  //   { code: "KW", name: "Kwara State" },
  //   { code: "LAG", name: "Lagos State" },
  //   { code: "ABJ", name: "Abuja" },
  // ];

  const period = ["year", "month", "week", "day"];
  const productList = [
    "Screen",
    "Downboard",
    "Battery",
    "Back Glass",
    "Touch Pad",
  ];

  const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("Screen");
  const [stateIndex, setStateIndex] = useState(0);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedPeriod, setselectedPeriod] = useState<PeriodType>("year");
  const [storeIndex, setStoreIndex] = useState(0);
  const selectedProductData = products.find((p) => p.name === selectedProduct);
  const allProduct = products.map((p) => p);
  const allStoreNamesForFirstProduct = allProduct[0].stores.flatMap(
    (store) => store.name
  );
  const states = allProduct.map((p) => p.name);
  const storeObj = allProduct.flatMap((p) => p.stores.map((s) => s.name));
  const stores = allProduct[stateIndex].stores;
  const periodData = stores[storeIndex].sales[selectedPeriod];

  const storeData = selectedProductData?.stores.find(
    (store) => store.name === selectedStore
  );

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const stateIndex = states.findIndex((s) => s === state);
    setStateIndex(stateIndex);
    const stores = allProduct[stateIndex].stores;
    setSelectedStore(stores[0].name);
  };

  const handleStoreChange = (store: string) => {
    setSelectedStore(store);
    const storeIndex = stores.findIndex((s) => s.name === store);
    setStoreIndex(storeIndex);
  };
  const data = storeData?.sales[selectedPeriod] || [];
  const renderProductContent = () => {
    switch (selectedProduct) {
      case "Screen":
        return (
          <div className="w-full  h-[200px]">
            <SalesGraph data={data} nameKeyX="name" nameKeyY="amt" />
          </div>
        );
      case "Downboard":
        return <p className="text-gray-700">Downboard revenue details.</p>;
      case "Battery":
        return (
          <div className="w-full h-[200px]">
            <SalesGraph data={data} nameKeyX="name" nameKeyY="amt" />
          </div>
        );
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
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl ">
      <div className="w-full p-5 relative text-black  bg-white">
        {products.length === 0 ? (
          <div
            className={`flex flex-col ${
              products.length === 0 ? "min-h-[80vh]" : "min-h-0"
            } justify-center items-center w-full`}
          >
            <div className="flex justify-center  items-center w-48 h-48 rounded-full bg-gradient-to-t from-white to-gray-100">
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
        ) : (
          <div>
            <h1 className="text-black  font-semibold">Revenue</h1>
            <div className="flex pt-4 w-[100%] gap-4 flex-row">
              <Dropdown
                showSearch
                className="bg-white rounded-full w-1/6"
                label={states[0]}
                options={states}
                placeholder={states[0]}
                onSelect={(state) => handleStateChange(state)}
                getLabel={(product) => product}
                getSubLabel={(products) => ""}
              />
              <Dropdown
                showSearch
                className="bg-white rounded-full w-1/6"
                label="Select Product"
                options={stores.map((store) => store.name)}
                placeholder={stores[0].name}
                onSelect={handleStoreChange}
                getLabel={(store) => store}
              />
            </div>

            {/* Product Selection */}
            <div className="flex pt-5 flex-col gap-4">
              <div className="flex gap-6">
                {productList.map((p, index) => (
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
              <div className="mt-4 p-4 rounded-lg">
                <div className="flex justify-between flex-row">
                  <div>
                    <label className="text-gray-400">Total sales</label>
                    <h1 className="text-2xl font-medium pb-8">₦97,209,080</h1>
                  </div>
                  <Dropdown
                    showSearch
                    className="bg-white rounded-full h-10 w-[100px]"
                    label="Select Product"
                    options={period}
                    placeholder={period[0]}
                    onSelect={(value) => setselectedPeriod(value as PeriodType)}
                    // getLabel={(period) => period}
                  />
                </div>

                {renderProductContent()}
              </div>
            </div>
          </div>
        )}
      </div>
      {products.length === 0 ? (
        <></>
      ) : (
        <div className="border-t-8 border-gray-100">
          <div className="bg-white p-5">
            <PurchasingReport />
          </div>
        </div>
      )}
    </div>
  );
}

export default Revenue;

{
  /* Purchase report*/
}

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
  const allProduct = products.map((p) => p.name);
  const renderProductContent = () => {
    switch (selectedProduct) {
      case "Screen":
        return (
          <div className="flex w-full flex-row">
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  w-full h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">6 sold </span>
                  </h1>
                </div>

                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph
                    stroke="#008342"
                    fill="#a2d7ad"
                    type="monotone"
                    fontSizeX={0}
                    fontSizeY={0}
                    // nameKeyY="name"
                    // nameKeyX="name"
                    data={selectedProductData?.sales[validPeriod] || []}
                  />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_up_green.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-green-600">2.8% </span>from last
                      week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">LEAST PURCHASED</h1>
              <div className="flex  w-full h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">0 sold </span>
                  </h1>
                </div>
                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph
                    stroke="#fc1e05"
                    fill="#e69e9e"
                    type="monotone"
                    fontSizeX={0}
                    fontSizeY={0}
                    // nameKeyY="name"
                    // nameKeyX="name"
                    data={selectedProductData?.sales[validPeriod] || []}
                  />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_down_red.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-red-800">0% </span>from last week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Downboard":
        return <p className="text-gray-700">Downboard revenue details.</p>;
      case "Battery":
        return (
          <div className="flex w-full flex-row">
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-1/2 h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">6 sold </span>
                  </h1>
                </div>

                <div className="w-1/2 relative h-[100px]">
                  <SalesGraph
                    data={selectedProductData?.sales[validPeriod] || []}
                  />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_up_green.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-green-600">2.8% </span>from last
                      week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-1/2 h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">0 sold </span>
                  </h1>
                </div>
                <div className="w-1/2 relative h-[100px]">
                  <SalesGraph
                    data={selectedProductData?.sales[validPeriod] || []}
                  />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_down_red.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-red-800">0% </span>from last week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
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
    <div className="w-full text-black   h-[30%]  bg-white">
      {products.length > 0 ? (
        <div>
          <div className="flex flex-row items-center w-full justify-between">
            <h1 className="text-black font-semibold">Purchasing Report</h1>
            <div className="flex justify-end w-[70%] gap-4 flex-row">
              <Dropdown
                showSearch
                className="bg-white rounded-full w-[100px]"
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
