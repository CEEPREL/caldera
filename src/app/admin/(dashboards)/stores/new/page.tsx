"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const states = [
  { code: "OG", name: "Ogun State" },
  { code: "KW", name: "Kwara State" },
  { code: "LAG", name: "Lagos State" },
  { code: "ABJ", name: "Abuja" },
];

function New() {
  const router = useRouter();

  // State for form data
  const [formData, setFormData] = useState({
    state: "",
    location: "",
    manager: "",
    phone: "",
    cadre: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle state selection from dropdown
  const handleStateSelect = (state: { code: string; name: string }) => {
    setFormData({ ...formData, state: state.name });
  };

  //   const handleCadreSelect = (cadre: string) => {
  //     setFormData({ ...formData, cadre });
  //   };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    setFormData({
      state: "",
      location: "",
      manager: "",
      phone: "",
      cadre: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    setTimeout(() => router.push("/admin/stores"), 500);
  };

  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl">
      <button
        onClick={() => router.back()}
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
        <h1>Create New Store</h1>
      </button>

      <div className="w-full p-5 relative flex text-black">
        <form
          className="flex w-full items-center justify-center flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {/* Location Section */}
          <div className="flex flex-col bg-gray-100 p-5 w-1/3 gap-4">
            <h1 className="text-lg font-bold">Location</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="store-state">State</label>
              <Dropdown
                showSearch
                className="gap-0"
                className2="bg-white border-none w-full h-9 flex justify-between items-center rounded-md"
                label={formData.state || "Select a State"}
                options={states}
                placeholder="Select a State"
                onSelect={(state) => state}
                getLabel={(state) => state.name}
                getSubLabel={() => ""}
                id="store-state"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="location">Enter Store Location</label>
              <input
                className="h-8 p-1 rounded-md"
                type="text"
                id="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Store Manager Section */}
          <div className="flex flex-col bg-gray-100 p-5 w-1/3 gap-4">
            <h1 className="text-lg font-bold">Store Manager</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="manager">Full Name</label>
              <input
                className="h-8 p-1 rounded-md"
                type="text"
                id="manager"
                value={formData.manager}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phone">Phone Number</label>
              <input
                className="h-8 p-1 rounded-md"
                type="text"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="cadre">Cadre</label>
              <input
                className="h-8 p-1 rounded-md"
                type="text"
                id="cadre"
                value={formData.cadre}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Authentication Section */}
          <div className="flex flex-col bg-gray-100 p-5 w-1/3 gap-4">
            <h1 className="text-lg font-bold">Authentication</h1>
            <div className="flex flex-col gap-1">
              <label htmlFor="username">User Name</label>
              <input
                className="h-8 p-1 rounded-md"
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Password</label>
              <input
                className="h-8 p-1 rounded-md"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="h-8 p-1 rounded-md"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <button className="bg-button text-white p-2 rounded-full">
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default New;
