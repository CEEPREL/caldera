"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import states from "@/data/states.json";
import { createStore, StoreData } from "@/app/actions/create";
import { useToastContext } from "@/ContextAPI/toastContext";
import { useRouter } from "next/navigation";
import { fetchStaff } from "@/app/actions/fetch";
import { FormData } from "@/components/admin/AddTeamSlider";
import { assignStore } from "@/app/actions/post";

function New() {
  const allStates = states.states.map((s) => s.name);

  // State for form data
  const [formData, setFormData] = useState<StoreData>({
    storeLocation: "",
    storeName: "",
    storeState: "",
    phoneNumber: "",
    userId: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [staff, setStaff] = useState<FormData[]>([]);
  const { showToast } = useToastContext();
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle state selection from dropdown
  const handleStateSelect = (state: { name: string }) => {
    setFormData({ ...formData, storeState: state.name });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchStaff();
        setStaff(res);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (formData: StoreData) => {
    try {
      setLoading(true);
      const result = await createStore({
        storeLocation: formData.storeLocation,
        storeName: formData.storeName,
        storeState: formData.storeState,
        phoneNumber: "0",
      });

      console.log(result.data.storeId, formData.userId);
      const storeId = result.data.storeId;
      if (storeId) {
        const assignResult = await assignStore(storeId, formData.userId || "");

        if (assignResult) {
          setFormData({
            storeLocation: "",
            storeName: "",
            storeState: "",
            phoneNumber: "",
            userId: "",
            fullName: "",
          });

          showToast("Store created and assigned successfully!", "success");
          router.push("/admin/stores");
        } else {
          showToast("error" || "Failed to assign store", "error");
        }
      } else {
        showToast("Store ID not found in the response.", "error");
      }
    } catch (error) {
      console.error("Error creating and assigning store", error);
      showToast(
        "An error occurred while creating and assigning the store",
        "error"
      );
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl">
      <button
        onClick={() => window.history.back()}
        className="flex sticky top-0 items-center flex-row"
      >
        <div className="flex justify-center items-center w-8 h-8 m-4 rounded-full bg-gray-300">
          <Image
            className="top-3 left-1"
            width={20}
            height={20}
            alt="No Data"
            src={"/icons/arrow_left.svg"}
          />
        </div>
        <h1 className="text-black">Create New Store</h1>
      </button>

      <div className="w-full p-5 relative flex text-black">
        <form
          className="flex w-full items-center justify-center flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
        >
          {/* Location Section */}
          <div className="flex flex-col bg-gray-100 p-5 w-1/2 lg:w-1/3 gap-4">
            <h1 className="text-lg font-bold">Location</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="store-state">State</label>
              <Dropdown
                className="gap-0 "
                className2="bg-white border-none w-full h-9 flex justify-between items-center rounded-md"
                label={formData.storeState || "Select a State"}
                options={allStates}
                placeholder="Select a State"
                onSelect={(state) => handleStateSelect({ name: state })}
                getLabel={(state) => state}
                getSubLabel={() => ""}
                id="store-state"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="location">Enter Store Location</label>
              <input
                className="h-8 p-1 rounded-md"
                type="text"
                id="storeLocation"
                value={formData.storeLocation}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Store Manager Section */}
          <div className="flex flex-col bg-gray-100 p-5 w-1/2 lg:w-1/3 gap-4">
            {/* <h1 className="text-lg font-bold">Store Manager</h1> */}
            <div className="flex flex-col gap-1">
              <label htmlFor="manager">Store Name</label>
              <input
                className="h-8 p-1 rounded-md"
                type="text"
                id="storeName"
                value={formData.storeName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="manager">Assign Manager</label>
              <Dropdown
                showSearch
                className="gap-0"
                className2="bg-white border-none w-full h-9 flex justify-between items-center rounded-md"
                label={
                  typeof formData.fullName === "string"
                    ? formData.fullName
                    : "Select a State"
                }
                options={staff || []}
                placeholder="Select a State"
                onSelect={(selectedStaff) => {
                  const selectedstaff = staff?.find(
                    (user) => user.fullName === selectedStaff
                  );

                  if (selectedstaff) {
                    setFormData((prevData) => ({
                      ...prevData,
                      fullName: selectedstaff.fullName,
                      userId: selectedstaff.userId, // Assign the userId to formData
                    }));
                  }
                }}
                getLabel={(staff) => staff.fullName}
                getSubLabel={(staff) => ` `}
                id="storeId"
              />
              <button className="bg-button mt-2 text-white p-2 rounded-full">
                {loading ? "Creating..." : "Create store"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default New;
