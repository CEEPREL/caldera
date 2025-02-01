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

// function New() {
//   const router = useRouter();

//   // State for form data
//   const [formData, setFormData] = useState({
//     state: "",
//     location: "",
//     manager: "",
//     phone: "",
//     cadre: "",
//     username: "",
//     password: "",
//     confirmPassword: "",
//   }); // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };
//   // Handle state selection from dropdown
//   const handleStateSelect = (state: { code: string; name: string }) => {
//     setFormData({ ...formData, state: state.name });
//   };
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Form Data:", formData);

//     setFormData({
//       state: "",
//       location: "",
//       manager: "",
//       phone: "",
//       cadre: "",
//       username: "",
//       password: "",
//       confirmPassword: "",
//     });

//     setTimeout(() => router.push("/admin/stores"), 500);
//   };
// }

const ProfileSlider: React.FC<SlideDrawerProps> = ({
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
          <h2 className="text-lg font-bold mb-4">Profile</h2>
          <div className="flex w-full items-center justify-center flex-col gap-4">
            {/* Location Section */}
            <div className="flex flex-row bg-gray-100 p-5 w-full gap-4">
              <Image
                src={`/images/profile.png`} //pass as a prop
                alt="profile" //pass as a prop
                width={100}
                height={100}
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-bold">Adebowale Olaniyan</h1>{" "}
                {/* pass as a prop */}
                <p className="text-sm text-gray-500">
                  08067836473 {/* pass as a prop */}
                </p>
                <p className="text-lg bg-yellow-500 rounded-full px-2 py-1">
                  Attendant
                </p>
              </div>
            </div>

            {/* Store Manager Section */}
            <div className="flex flex-col bg-gray-100 p-5 w-full gap-4">
              <h1 className="text-lg font-bold">Activity Summary</h1>
              {/* clsx classname style as prop, map through the array and pass as a prop */}
              <div className="flex flex-row gap-3">
                <p className="text-lg bg-gray-200 rounded-lg px-2 py-1 font-bold">
                  This Week
                </p>
                <p className="text-lg bg-gray-200 rounded-lg px-2 py-1 font-bold">
                  This Month
                </p>
                <p className="text-lg bg-gray-200 rounded-lg px-2 py-1 font-bold">
                  6 Months
                </p>
                <p className="text-lg bg-gray-200 rounded-lg px-2 py-1 font-bold">
                  This Year
                </p>
                <p className="text-lg bg-gray-200 rounded-lg px-2 py-1 font-bold">
                  All Time
                </p>
              </div>
              {/* map through the array and pass as a prop */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-row justify-between gap-3">
                  <p className="text-lg font-bold">Total sales pick</p>
                  <p className="text-lg font-bold">10</p>
                </div>
                <div className="flex flex-row justify-between gap-1">
                  <p className="text-lg font-bold">Active days</p>
                  <p className="text-lg font-bold">3 days</p>
                </div>
                <div className="flex flex-row justify-between gap-1">
                  <p className="text-lg font-bold">Offline days</p>
                  <p className="text-lg font-bold">2 days</p>
                </div>
              </div>

              <button className="bg-button text-white p-2 rounded-full">
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSlider;
