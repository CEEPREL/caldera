"use client";

import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import Dropdown from "../Dropdown";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  name: string;
  phone: string;
  role: string;
  imageUrl: string;
  salesPick: number;
  activeDays: number;
  offlineDays: number;
  isOpen: boolean;
  onClose: () => void;
  width: string;
  overlayColor: string;
  drawerStyle: string;
}

// const states = [
//   { code: "OG", name: "Ogun State", cadre: "Cadre 1" },
//   { code: "KW", name: "Kwara State", cadre: "Cadre 2" },
//   { code: "LAG", name: "Lagos State", cadre: "Cadre 1" },
//   { code: "ABJ", name: "Abuja", cadre: "Cadre 2" },
// ];
const cadres = ["Cadre 1", "Cadre 2"];

const ProfileSlider: React.FC<UserProfile> = ({
  isOpen,
  onClose,
  width = "w-1/4", // Default: 1/4 of the page
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
  name,
  imageUrl = "/images/profile.png",
  phone,
  role,
  salesPick,
  activeDays,
  offlineDays,
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

      <div
        className={clsx(
          "fixed top-0 overflow-y-scroll w-[70%] lg:w-[35%] text-black  right-0 h-full gap-2 z-10 transition-transform duration-300 ease-in-out",
          isOpen ? "-translate-y-0" : "-translate-y-full",
          width,
          drawerStyle
        )}
      >
        {/* Drawer Content - Form */}
        <div className="mt-2 bg p-5 w-full">
          <button
            className={`top-5 z-20 left-[-50px] text-black w-10 h-10 flex items-center justify-center bg-red-300 rounded-full shadow-lg hover:bg-gray-300 transition ${
              isOpen ? "block" : "hidden"
            }`}
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-lg font-bold mb-4">Profile</h2>
          <div className="flex w-full items-center justify-center flex-col gap-4">
            {/* Location Section */}
            <div className="flex flex-row bg-gray-100 p-5 w-full gap-4">
              <Image
                src={imageUrl} //pass as a prop
                alt="picture" //pass as a prop
                width={70}
                height={70}
                className="rounded-full w-[35%]"
              />
              <div className="flex w-[65%] flex-col gap-1">
                <h1 className="text-lg font-bold">{name}</h1>{" "}
                {/* pass as a prop */}
                <p className="text-sm text-gray-500">
                  {phone} {/* pass as a prop */}
                </p>
                <p className="text-lg w-fit bg-yellow-500 rounded-full px-2 py-1">
                  {role}
                </p>
              </div>
            </div>

            {/* Store Manager Section */}
            <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
              <h1 className="text-lg font-bold">Activity Summary</h1>
              {/* clsx classname style as prop, map through the array and pass as a prop */}
              <div className="flex overflow-x-scroll flex-row gap-2 w-full">
                <p className="text-sm cursor-pointer w-full bg-gray-200 rounded-lg px-2 py-1 ">
                  This Week
                </p>
                <p className="text-sm cursor-pointer w-full bg-gray-200 rounded-lg px-2 py-1">
                  This Month
                </p>
                <p className="text-sm cursor-pointer w-full bg-gray-200 rounded-lg px-2 py-1 ">
                  6 Months
                </p>
                <p className="text-sm cursor-pointer w-full bg-gray-200 rounded-lg px-2 py-1 ">
                  All Time
                </p>
              </div>
              {/* map through the array and pass as a prop */}
              <div className="flex text-gray-500 flex-col gap-5">
                <div className="flex flex-row justify-between gap-3">
                  <p className="text-lg ">Total sales pick</p>
                  <p className="text-lg">{salesPick}</p>
                </div>
                <div className="flex flex-row justify-between gap-1">
                  <p className="text-lg ">Active days</p>
                  <p className="text-lg ">{activeDays} days</p>
                </div>
                <div className="flex flex-row justify-between gap-1">
                  <p className="text-lg ">Offline days</p>
                  <p className="text-lg ">{offlineDays} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSlider;
