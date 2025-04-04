"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { fetchStores } from "@/app/actions/fetch";
import { Trash2 } from "lucide-react";
import { deleteStore } from "@/app/actions/delete";
import Confirm from "@/components/store/general_UI/ConfirmBox";
import { useToastContext } from "@/ContextAPI/toastContext";
import { useStore } from "@/ContextAPI/storeContex";
import SkeletonLoader from "../loading";

function StorePage() {
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateObj, setStateObj] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const { showToast } = useToastContext();
  const { setStoreIdState, storeId } = useStore();

  const handleLinkClick = async (
    e: React.MouseEvent<HTMLDivElement>,
    store: any
  ) => {
    setLoading(true);
    try {
      e.preventDefault();
      if (!storeId && pathname.includes("admin")) {
        setStoreIdState(store.storeId);
      }
      router.push(`/admin/stores/${store.storeId}/report`);
      setLoading(false);
      showToast("Store loaded successfully", "success");
    } catch {
      showToast("Failed to load store", "error");
    }
    console.log(store.storeId);
  };

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
    const allStores = async () => {
      setLoading(true);

      try {
        const res = await fetchStores();
        if (!res || res.length === 0) {
          console.log("No data fetched!");
          return;
        }

        const groupedStores = groupStores(res);
        const stateNames = Object.keys(groupedStores);

        setStates(stateNames);
        setStateObj(groupedStores);

        if (stateNames.length > 0) {
          setSelectedState(stateNames[0]);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    };

    allStores();
  }, []);

  // Delete store
  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      const response = await deleteStore(id);
      alert(response.message);

      // Reload the store list after deletion
      const res = await fetchStores();
      const groupedStores = groupStores(res);
      setStateObj(groupedStores);
      setStates(Object.keys(groupedStores));

      //  Reset selected state if empty
      if (Object.keys(groupedStores).length === 0) {
        setSelectedState(null);
      }
    } catch (error) {
      console.error("Failed to delete store:", error);
      showToast("Error deleting store", "error");
    } finally {
      setDeleting(null);
    }
  };

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
      <div className="flex overflow-x-auto pt-3 gap-6">
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

      {/* Store Content */}
      <div className="w-full relative text-black bg-white">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <SkeletonLoader />
          </div>
        ) : states.length === 0 ? (
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
                <div
                  className=" cursor-auto"
                  onClick={(e) => handleLinkClick(e, store)}
                  key={store.storeId}
                >
                  <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col justify-center w-full gap-2">
                        <Image
                          width={30}
                          height={30}
                          alt="No Data"
                          src={"/icons/stores.svg"}
                        />
                        <div className="flex flex-row  w-full justify-between items-center gap-2">
                          <h2 className="text-lg font-bold">
                            {store.storeName}
                          </h2>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            className=""
                          >
                            <Confirm
                              message={`Are you sure you want to delete ${store.storeName}?`}
                              button={
                                deleting === store.storeId ? (
                                  <span className="text-red-600">
                                    Deleting...
                                  </span>
                                ) : (
                                  <Trash2 className="text-red-600" />
                                )
                              }
                              onConfirm={() => handleDelete(store.storeId)}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600">
                      Location: {store.storeLocation}
                    </p>

                    <div className="w-full h-[200px]">
                      <p className="text-gray-500">
                        {/* [Sales Graph for {validPeriod}] */}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Created on</p>
                      <p className="text-sm text-gray-500">
                        {store.createdDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StorePage;
