"use client";

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Dropdown from "../Dropdown";
import { useRouter } from "next/navigation";

interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string; // Customizable width
  overlayColor?: string; // Overlay background
  drawerStyle?: string; // Additional drawer styles
}

const states = [
  { code: "OG", name: "Ogun State", cadre: "Cadre 1" },
  { code: "KW", name: "Kwara State", cadre: "Cadre 2" },
  { code: "LAG", name: "Lagos State", cadre: "Cadre 1" },
  { code: "ABJ", name: "Abuja", cadre: "Cadre 2" },
];
const cadres = ["Cadre 1", "Cadre 2"];

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
  }); // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // Handle state selection from dropdown
  const handleStateSelect = (state: { code: string; name: string }) => {
    setFormData({ ...formData, state: state.name });
  };
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
}

const SlideDrawer: React.FC<SlideDrawerProps> = ({
  isOpen,
  onClose,
  width = "w-1/4", // Default: 1/4 of the page
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
}) => {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    state: "",
    location: "",
    manager: "",
    phone: "",
    cadre: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    // Clear Form Fields
    setFormData({
      name: "",
      email: "",
      state: "",
      location: "",
      manager: "",
      phone: "",
      cadre: "",
      username: "",
      password: "",
      confirmPassword: "",
    });

    // Auto Close Drawer
    onClose();
  };

  return (
    <>
      {/* Overlay (blocks interaction with background) */}
      <div
        className={clsx(
          "fixed z-10 inset-0 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
          overlayColor
        )}
        onClick={onClose} // Clicking overlay closes drawer
      />

      <button
        className={`absolute top-5 z-20 left-[-420px] text-black w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full shadow-lg hover:bg-gray-300 transition ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      >
        ✕
      </button>
      <div
        className={clsx(
          "fixed top-0 overflow-y-scroll  text-black  right-0 h-full gap-2 z-10 transition-transform duration-300 ease-in-out",
          isOpen ? "-translate-y-0" : "-translate-y-full",
          width,
          drawerStyle
        )}
      >
        {/* Drawer Content - Form */}
        <div className="mt-2 bg w-full">
          <h2 className="text-lg font-bold mb-4">Edit Team Member</h2>
          <form
            className="flex w-full items-center justify-center flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* Location Section */}
            <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
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
            <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
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
                <Dropdown
                  showSearch
                  className="gap-0"
                  className2="bg-green-100 border-none w-full h-9 flex justify-between items-center rounded-md"
                  label={formData.state || "Select cadre"}
                  options={cadres}
                  placeholder="Select Cadre"
                  onSelect={(selected) =>
                    setFormData({ ...formData, state: selected })
                  }
                  className3="p-2 rounded-2xl bg-green-100"
                  getLabel={(cadre) => cadre}
                  getSubLabel={() => ""}
                  id="store-state"
                />
              </div>
            </div>

            {/* Authentication Section */}
            <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
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
                Add Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SlideDrawer;
