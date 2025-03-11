"use client";
import Dropdown from "@/components/Dropdown";
import SalesGraph from "@/components/visualizationToola/SalesGraph";
import Image from "next/image";
import React, { useState } from "react";
import products from "@/data/data.json";
import Piechart from "@/components/visualizationToola/pieChart";
// import { DateFilter } from "@/components/store/general_UI/DateFilter";
import PurchasingReport from "@/components/store/report/PurchaseReport";

type PeriodType = "year" | "month" | "week" | "day";

function Report() {
  const period = ["year", "month", "week", "day"];
  const productList = [
    "Screen",
    "Downboard",
    "Battery",
    "Back Glass",
    "Touch Pad",
  ];

  // const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("Screen");
  const [stateIndex, setStateIndex] = useState(0);
  // const [selectedStore, setSelectedStore] = useState("");
  const [selectedPeriod, setselectedPeriod] = useState<PeriodType>("year");
  const [storeIndex, setStoreIndex] = useState(0);
  // const selectedProductData = products.find((p) => p.name === selectedProduct);
  const allProduct = products.map((p) => p);
  // const allStoreNamesForFirstProduct = allProduct[0].stores.flatMap(
  //   (store) => store.name
  // );
  const states = allProduct.map((p) => p.name);
  // const storeObj = allProduct.flatMap((p) => p.stores.map((s) => s.name));
  const stores = allProduct[stateIndex].stores;
  // const periodData = stores[storeIndex].sales[selectedPeriod];

  // const storeData = stores.find((store) => store.name === selectedStore);

  const handleStateChange = (state: string) => {
    // setSelectedState(state);
    const stateIndex = states.findIndex((s) => s === state);
    setStateIndex(stateIndex);
    // setSelectedStore(stores[0].name);
  };

  const handleStoreChange = (store: string) => {
    // setSelectedStore(store);
    const storeIndex = stores.findIndex((s) => s.name === store);
    setStoreIndex(storeIndex);
    const data = stores[storeIndex].sales[selectedPeriod] || [];
    console.log(data);
  };
  const data = stores[storeIndex].sales[selectedPeriod] || [];
  console.log(data);
  const [toggle, setToggle] = useState(false);
  const handleToggle = (p: string) => {
    setToggle(!toggle);
    setSelectedProduct(p);
  };

  const renderProductContent = () => {
    switch (selectedProduct) {
      case "Screen":
        return (
          <div className="w-full  h-[200px]">
            <SalesGraph
              data={data}
              nameKeyX=""
              nameKeyY={toggle && selectedProduct === "Screen" ? "pv" : "amt"}
            />
          </div>
        );
      case "Downboard":
        return (
          <div className="w-full h-[200px]">
            <SalesGraph
              data={data}
              nameKeyX=""
              nameKeyY={
                toggle && selectedProduct === "Downboard" ? "uv" : "amt"
              }
            />
          </div>
        );
      case "Battery":
        return (
          <div className="w-full h-[200px]">
            <SalesGraph
              data={data}
              nameKeyX=""
              nameKeyY={toggle ? "pv" : "amt"}
            />
          </div>
        );
      case "Back Glass":
        return (
          <div className="w-full h-[200px]">
            <SalesGraph
              data={data}
              nameKeyX=""
              nameKeyY={toggle ? "pv" : "amt"}
            />
          </div>
        );
      case "Touch Pad":
        return (
          <div className="w-full h-[200px]">
            <SalesGraph
              data={data}
              nameKeyX=""
              nameKeyY={toggle ? "pv" : "amt"}
            />
          </div>
        );
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
            <h1 className="text-black  font-semibold">Report</h1>
            <div className="flex pt-4 w-[100%] gap-4 flex-row">
              <Dropdown
                showSearch
                className="bg-white rounded-full w-1/6"
                label={states[0]}
                options={states}
                placeholder={states[0]}
                onSelect={(state) => handleStateChange(state)}
                getLabel={(product) => product}
                // getSubLabel={(products) => ""}
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

              {/* Product Content */}
              <div className="mt-4 p-4 rounded-lg">
                <div className="flex justify-between flex-row">
                  <div>
                    <label className="text-gray-400">Total sales</label>
                    <h1 className="text-2xl font-medium pb-8">₦97,209,080</h1>
                  </div>
                  {/* <DateFilter /> */}
                </div>
                <div className="flex flex-row items-center justify-start w-full">
                  <div className=" w-[70%] lg:w-[70%]">
                    {renderProductContent()}
                  </div>{" "}
                  <div className="w-[0%] lg:w-[30%]">
                    <Piechart data={data} />
                  </div>{" "}
                </div>
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
            <PurchasingReport
              data={data}
              toggle={toggle}
              nameKeyY="amt"
              nameKeyX=""
              period={period}
              products={productList}
              selectedProduct={selectedProduct}
              setSelectedProduct={(p) => handleToggle(p)}
              selectedPeriod={selectedPeriod}
              setselectedPeriod={(period) =>
                setselectedPeriod(period as PeriodType)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;

{
  /* Purchase report*/
}
