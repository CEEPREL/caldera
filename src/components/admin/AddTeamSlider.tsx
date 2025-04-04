"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Dropdown from "../Dropdown";

// Update FormData interface
export interface FormData {
  userId: string;
  fullName: string;
  email: string;
  state: string;
  storeId: string;
  storeName: string;
  location: string;
  manager: string;
  cadre: string;
  userName: string;
  phoneNumber: string;
  profilePic: string;
  registered: string;
  status: string;
  url: string;
  active: boolean;
  password?: string;
  loginTime?: string;
  loginDate?: string;
}

interface SlideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  handleLocationChange: (selectedState: string) => void;
  tittle?: string;
  btnTitle?: string;
  formData: FormData;
  overlayColor?: string;
  drawerStyle?: string;
  id?: string;
  role: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  loading: boolean;
  errorMessage: string | null;
  optionslocation?: any[];
  resetPass?: boolean;
}

const SlideDrawer: React.FC<SlideDrawerProps> = ({
  isOpen,
  onClose,
  width = "w-1/4",
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
  tittle = "Add Team Member",
  formData,
  loading,
  btnTitle,
  onChange,
  onSubmit,
  resetPass,
  optionslocation,
  handleLocationChange,
}) => {
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      // Reset the form data when the drawer is opened
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

      if (resetPass) {
        onChange({
          target: {
            name: "password",
            value: "Reset",
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }

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

      // Reset location fields when the drawer opens
      onChange({
        target: {
          name: "storeId", // Resetting storeId individually
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "storeName", // Resetting storeName individually
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);

      onChange({
        target: {
          name: "location", // Resetting location individually
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
    setHasOpened(true);
  }, [isOpen, onChange, hasOpened, resetPass]);

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
          "fixed top-0 overflow-y-scroll w-[70%] lg:w-[35%] text-black right-0 h-full gap-2 z-10 transition-transform duration-300 ease-in-out",
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
                <label htmlFor="location">Enter Store Location</label>
                <Dropdown
                  showSearch
                  className="gap-0"
                  className2="bg-white border-none w-full h-9 flex justify-between items-center rounded-md"
                  label={
                    formData.location
                      ? formData.location
                      : "Select a Store Location"
                  }
                  options={optionslocation || []}
                  placeholder="Select a Store Location"
                  onSelect={handleLocationChange}
                  getLabel={(state) => state.storeName}
                  getSubLabel={(state) => ` in ${state.state}`}
                  id="location"
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
                <label htmlFor="email">Email</label>
                <input
                  className="h-8 p-1 rounded-md"
                  type="email"
                  id="email"
                  value={formData.email}
                  name="email"
                  onChange={onChange}
                />
              </div>
              {resetPass && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="resetPass"
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange({
                          target: {
                            name: "password",
                            value: "Reset",
                          },
                        } as React.ChangeEvent<HTMLInputElement>);
                      } else {
                        onChange({
                          target: {
                            name: "password",
                            value: "",
                          },
                        } as React.ChangeEvent<HTMLInputElement>);
                      }
                    }}
                  />
                  <label htmlFor="resetPass">Reset Password</label>
                </div>
              )}

              <button className="bg-button text-white p-2 rounded-full">
                {loading ? "Adding..." : btnTitle || "Add Team Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SlideDrawer;
