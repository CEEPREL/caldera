"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchStores } from "@/app/actions/fetch";

function StorePage() {
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  // const [validPeriod, setValidPeriod] = useState<string>("monthly");
  // const [data, setData] = useState<FormData[]>([]);
  // const [loading, setLoading] = useState(false);
  const [stateObj, setStateObj] = useState<Record<string, any[]>>({});

  const router = useRouter();

  const groupStores = (stores: any[]) => {
    return stores.reduce((acc, store) => {
      const { state } = store;
      if (!acc[state]) {
        acc[state] = [];
      }
      acc[state].push(store);
      return acc;
    }, {} as Record<string, any[]>);
  };

  useEffect(() => {
    const allStaffs = async () => {
      // setLoading(true);

      const res = await fetchStores();
      if (!res || res.length === 0) {
        console.log("No data fetched!");
        // setLoading(false);
        return;
      }

      console.log("Fetched Stores (res):", res);

      const groupedStores = groupStores(res);
      const stateNames = Object.keys(groupedStores);

      setStates(stateNames);
      setStateObj(groupedStores);
      // setData(res);
      // setLoading(false);

      // Set the first state as selected after fetching
      if (stateNames.length > 0) {
        setSelectedState(stateNames[0]);
      }
    };

    allStaffs();
  }, []);

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
            key={state}
            onClick={() => setSelectedState(state)}
            className={`p-2 ${
              selectedState === state
                ? "border-b-4 text-black border-blue-400 font-semibold"
                : "text-black"
            }`}
          >
            {state}
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
          <div className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {selectedState &&
              stateObj[selectedState]?.map((store) => (
                <Link
                  href={`/admin/stores/${store.storeId}`}
                  key={store.storeId}
                >
                  <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex justify-center items-center gap-2">
                        <Image
                          width={30}
                          height={30}
                          alt="No Data"
                          src={"/icons/stores.svg"}
                        />
                        <h2 className="text-lg font-bold">{store.storeName}</h2>
                      </div>
                    </div>

                    <p className="text-gray-600">
                      Location: {store.storeLocation}
                    </p>

                    <div className="w-full h-[200px]">
                      {/* Example Graph Placeholder */}
                      <p className="text-gray-500">
                        {/* [Sales Graph for {validPeriod}] */}
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
        )}
      </div>
    </div>
  );
}

export default StorePage;
