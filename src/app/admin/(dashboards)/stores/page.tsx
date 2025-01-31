"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const states = [
  { code: "OG", name: "Ogun State", stores: ["Ogun1", "Ogun2", "Ogun3"] },
  { code: "KW", name: "Kwara State", stores: ["Kwara1", "Kwara2"] },
  {
    code: "LAG",
    name: "Lagos State",
    stores: ["Lagos1", "Lagos2", "Lagos3", "Lagos4", "Lagos5"],
  },
  { code: "ABJ", name: "Abuja", stores: ["Abuja1", "Abuja2"] },
];

function StorePage() {
  const [selectedState, setSelectedState] = useState(states[0].name);
  const [validPeriod, setValidPeriod] = useState<string>("monthly");

  const router = useRouter();

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

      {/* Navigation Buttons */}
      <div className="flex pt-3 gap-6">
        {states.map((state) => (
          <button
            key={state.code}
            onClick={() => setSelectedState(state.name)}
            className={`p-2 ${
              selectedState === state.name
                ? "border-b-4 text-black border-blue-400 font-semibold"
                : "text-black"
            }`}
          >
            {state.name}
          </button>
        ))}
      </div>

      {/* Store Content - Only Render Selected State */}
      <div className="w-full relative text-black bg-white">
        {states.length === 0 ? (
          <div className="flex flex-col min-h-[80vh] justify-center items-center w-full">
            <div className="flex justify-center items-center w-48 h-48 rounded-full bg-gradient-to-t from-white to-gray-100">
              <Image
                className="top-3 left-1"
                width={100}
                height={100}
                alt="No Data"
                src={"/icons/stores.svg"}
              />
            </div>
            <h2>No store created yet</h2>
            <button
              onClick={() => router.push("/admin/stores/new")}
              className="bg-button font-bold p-3 px-6 mt-5 text-white rounded-full"
            >
              Add New Store
            </button>
          </div>
        ) : (
          <div className="">
            {states
              .filter((state) => state.name === selectedState)
              .map((state) => (
                <div
                  key={state.code}
                  className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {state.stores.map((store, index) => (
                    <Link href={`/admin/stores/${store}`} key={store}>
                      <div
                        key={index}
                        className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex justify-center items-center gap-2">
                            <Image
                              width={30}
                              height={30}
                              alt="No Data"
                              src={"/icons/stores.svg"}
                            />
                            <h2 className="text-lg font-bold">{store}</h2>
                          </div>
                        </div>

                        <p className="text-gray-600">
                          Store Sales Data for {store}
                        </p>

                        <div className="w-full h-[200px]">
                          {/* Example Graph Placeholder */}
                          <p className="text-gray-500">
                            [Sales Graph for {validPeriod}]
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500">Created on</p>
                          <p className="text-sm text-gray-500">2024-01-01</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StorePage;
