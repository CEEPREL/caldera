"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Dropdown from "../Dropdown";

interface FormData {
  fullName: string;
  email: string;
  state: string;
  location: string;
  manager: string;
  cadre: string;
  userName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  tittle?: string;
  formData: FormData;
  overlayColor?: string;
  drawerStyle?: string;
  id?: number;
  role: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  errorMessage: string | null;
  options?: any[];
}

export const states = [
  { code: "OG", name: "Ogun State", cadre: "Cadre 1" },
  { code: "KW", name: "Kwara State", cadre: "Cadre 2" },
  { code: "LAG", name: "Lagos State", cadre: "Cadre 1" },
  { code: "ABJ", name: "Abuja", cadre: "Cadre 2" },
];
export const cadres = ["Cadre 1", "Cadre 2"];

const SlideDrawer: React.FC<SlideDrawerProps> = ({
  isOpen,
  onClose,
  width = "w-1/4",
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
  tittle = "Add Team Member",
  formData,
  loading,
  errorMessage,
  onChange,
  onSubmit,
  options = states,
}) => {
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (isOpen && !hasOpened) {
      // Call onChange to reset the form data
      onChange({
        target: {
          name: "fullName",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "email",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "password",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "phoneNumber",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "userName",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
      onChange({
        target: {
          name: "confirmPassword",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
    setHasOpened(true);
  }, [isOpen, onChange, hasOpened]);
  return (
    <>
      {/* Overlay (blocks interaction with background) */}
      <div
        className={clsx(
          "fixed z-10 inset-0 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
          overlayColor
        )}
        onClick={onClose}
      />

      <div
        className={clsx(
          "fixed top-0 overflow-y-scroll w-[70%] lg:w-[35%] text-black  right-0 h-full gap-2 z-10 transition-transform duration-300 ease-in-out",
          isOpen ? "-translate-y-0" : "-translate-y-full",
          width,
          drawerStyle
        )}
      >
        {/* Drawer Content - Form */}
        <div className="mt-2 bg w-full">
          <h2 className="text-lg font-bold mb-4">{tittle}</h2>
          <form
            className="flex w-full items-center justify-center flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(formData);
            }}
          >
            {/* Location Section */}
            <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
              <h1 className="text-lg font-bold">Location</h1>
              <div className="flex flex-col gap-1">
                <label htmlFor="state">State</label>
                <Dropdown
                  showSearch
                  className="gap-0"
                  className2="bg-white border-none w-full h-9 flex justify-between items-center rounded-md"
                  label={
                    typeof formData.state === "string"
                      ? formData.state
                      : "Select a State"
                  }
                  options={options}
                  placeholder="Select a State"
                  onSelect={(selectedState) => {
                    // Directly call onChange from the parent to update the 'state' field
                    onChange({
                      target: {
                        name: "state", // Field name to update
                        value: selectedState, // Value from the selected state
                      },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
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
                  name="location"
                  value={formData.location}
                  onChange={onChange}
                />
              </div>
            </div>

            {/* Store Manager Section */}
            <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
              <h1 className="text-lg font-bold">Store Manager</h1>
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Full Name</label>
                <input
                  className="h-8 p-1 rounded-md"
                  type="text"
                  id="name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={onChange}
                />
              </div>
              <div className="flex flex-col gap-1 ">
                <label htmlFor="phone">Phone Number</label>
                <input
                  className="h-8 p-1 rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  id="phone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={onChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="cadre">Cadre</label>
                <Dropdown
                  showSearch
                  className="gap-0"
                  className2="bg-green-100 border-none w-full h-9 flex justify-between items-center rounded-md"
                  label={formData.cadre || "Select cadre"}
                  options={cadres}
                  placeholder="Select Cadre"
                  onSelect={(selected) =>
                    onChange({
                      target: { name: "cadre", value: selected },
                    } as React.ChangeEvent<HTMLInputElement>)
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
                  value={formData.userName}
                  name="userName"
                  onChange={onChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password">Password</label>
                <input
                  className="h-8 p-1 rounded-md"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  className="h-8 p-1 rounded-md"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                />
              </div>
              <button className="bg-button text-white p-2 rounded-full">
                {loading ? "Adding..." : "Add Team Member"}
              </button>
              {/* {errorMessage && (
                <p className="text-red-500 mt-4">{errorMessage}</p>
              )} */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SlideDrawer;
