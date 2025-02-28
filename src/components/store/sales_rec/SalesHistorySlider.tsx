"use client";

import React from "react";
import clsx from "clsx";
import { DateFilter } from "../general_UI/DateFilter";

interface Data {
  id: string;
  date: string;
  payment: string;
  revenue: number;
}

interface UserProfile {
  data: Data[];
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
}

const SalesHistorySlider: React.FC<UserProfile> = ({
  data,
  isOpen,
  onClose,
  width = "w-1/4", // Default: 1/4 of the page
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
}) => {
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
          "fixed top-0 overflow-y-scroll w-[70%] lg:w-[35%] text-black right-0 h-full gap-2 z-10 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          width,
          drawerStyle
        )}
      >
        {/* Drawer Content - Sales Data */}
        <div className="mt-2 p-5 w-full">
          <button
            className="absolute top-5 right-5 text-black w-10 h-10 flex items-center justify-center bg-red-300 rounded-full shadow-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            ✕
          </button>
          <DateFilter />

          {/* Mapping through Sales Data */}
          {data.map((item) => (
            <div
              key={item.id}
              className="flex w-full items-center justify-center flex-col gap-4"
            >
              {/* Sales Information */}
              <div className="flex flex-row py-5 w-full gap-4">
                <div className="flex w-full flex-col gap-1">
                  <h1 className="text-lg text-blue-300">{item.date}</h1>
                  <div className="flex flex-row justify-between w-full">
                    <p className="text-gray-500">{item.revenue}</p>
                    <p className="text-gray-500">{item.payment}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SalesHistorySlider;
