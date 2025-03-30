"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import React, { useState } from "react";
import states from "@/data/states.json";
import { createStore, StoreData } from "@/app/actions/create";
import { useToastContext } from "@/ContextAPI/toastContext";
import { useRouter } from "next/navigation";
import { addTeamAction } from "@/app/actions/addTeam";

function New() {
  const allStates = states.states.map((s) => s.name);
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  // State for form data
  const [formData, setFormData] = useState<StoreData>({
    storeLocation: "",
    storeName: "",
    storeState: "",
    phoneNumber: "",
    userId: "",
    fullName: "",
    email: "",
    userName: "",
  });
  const [loading, setLoading] = useState(false);
  const [createManager, setCreateManager] = useState(false);
  const { showToast } = useToastContext();
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle state selection from dropdown
  const handleStateSelect = (state: { name: string }) => {
    setFormData({ ...formData, storeState: state.name });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateManager(e.target.checked);
  };

  // Handle form submission
  const handleSubmit = async (formData: StoreData) => {
    try {
      setLoading(true);
      if (createManager) {
        if (
          !formData.fullName ||
          !formData.email ||
          !formData.phoneNumber ||
          !formData.userName
        ) {
          showToast("Please fill manager details", "error");
          setLoading(false);
          return;
        }
      }
      const result = await createStore({
        storeLocation: formData.storeLocation,
        storeName: formData.storeName,
        storeState: formData.storeState,
        phoneNumber: "0",
      });

      const storeId = result.data.storeId;
      const storeName = result.data.storeName;
      if (storeId) {
        if (createManager) {
          const createManagerResponse = await addTeamAction({
            fullName: formData.fullName || "",
            email: formData.email || "",
            phoneNumber: formData.phoneNumber || "",
            userName: formData.userName || "",
            storeName: storeName || "",
            storeId: storeId || "",
            resetUrl: `${baseUrl}/reset_pass`,
          });

          console.log("create Manager Response; ", createManagerResponse);

          // const userId = createManagerResponse.data.userId;

          // if (createManagerResponse) {
          //   await resetPass({
          //     userId: userId,
          //     resetUrl: `${baseUrl}/reset_pass`,
          //   });
          // }
        }

        // Reset form after successful creation
        setFormData({
          storeLocation: "",
          storeName: "",
          storeState: "",
          phoneNumber: "",
          userId: "",
          fullName: "",
          email: "",
          userName: "",
        });

        showToast("Store created and assigned successfully!", "success");
        router.push("/admin/stores");
      } else {
        showToast("Failed to create store", "error");
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
                name="storeLocation"
                value={formData.storeLocation}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Store Manager Section */}
          <div className="flex flex-col bg-gray-100 p-5 w-1/2 lg:w-1/3 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="storeName">Store Name</label>
              <input
                className="h-8 p-1 rounded-md"
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-row gap-1">
              <label htmlFor="manager">Assign Manager?</label>
              <input
                type="checkbox"
                checked={createManager}
                onChange={handleCheckboxChange}
              />
            </div>

            {/* Conditional Rendering of Manager Section */}
            {createManager && (
              <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
                <h1 className="text-lg font-bold">Store Manager</h1>
                <div className="flex flex-col gap-1">
                  <label htmlFor="name">Full Name</label>
                  <input
                    className="h-8 p-1 rounded-md"
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    className="h-8 p-1 rounded-md"
                    type="number"
                    id="phone"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Authentication</h1>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="username">User Name</label>
                    <input
                      className="h-8 p-1 rounded-md"
                      type="text"
                      id="username"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email</label>
                    <input
                      className="h-8 p-1 rounded-md"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Authentication Section */}
            <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
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
