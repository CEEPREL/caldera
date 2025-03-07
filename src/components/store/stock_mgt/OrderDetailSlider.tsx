"use client";

import React from "react";
import clsx from "clsx";

interface Data {
  prId: string;
  requestQuantity: number;
  productName: string;
  categoryName: string;
}

interface OrderDetailSliderProps {
  data: Data[];
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
}

const OrderDetailSlider: React.FC<OrderDetailSliderProps> = ({
  data,
  isOpen,
  onClose,
  width = "w-1/4",
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
        onClick={onClose}
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
        <div className="mt-2 p-5 w-full relative">
          <button
            className="absolute top-5 right-5 text-black w-10 h-10 flex items-center justify-center bg-red-300 rounded-full shadow-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            ✕
          </button>

          {/* Check if data is an array and has items */}
          {Array.isArray(data) && data.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">
                No product request details available
              </p>
            </div>
          ) : (
            // Mapping through Sales Data if data is an array
            Array.isArray(data) &&
            data.map((item) => (
              <div
                key={item.prId}
                className="flex w-full items-center justify-center flex-col gap-4 border-b py-4"
              >
                {/* Sales Information */}
                <div className="flex flex-row w-full gap-4">
                  <div className="flex w-full flex-col gap-1">
                    <h1 className="text-lg font-semibold text-blue-500">
                      {item.productName}
                    </h1>
                    <div className="flex flex-row justify-between w-full">
                      <p className="text-gray-500">{item.categoryName}</p>
                      <p className="text-gray-500">{item.requestQuantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailSlider;
