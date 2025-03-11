"use client";

import React from "react";
import clsx from "clsx";
import { Order, Transaction } from "@/app/caldera/[storeId]/daily-sales/page";

interface UserProfile {
  // data?: Transaction[];
  mainOrder?: Order[];
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
}

const OrderDetailSlider: React.FC<UserProfile> = ({
  // data,
  mainOrder,
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
        <div className="mt-2 p-5 w-full">
          <button
            className="absolute top-5 right-5 text-black w-10 h-10 flex items-center justify-center bg-red-300 rounded-full shadow-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            ✕
          </button>

          {mainOrder && mainOrder.length > 0 ? (
            mainOrder.map((order) => (
              <div key={order.orderId}>
                {/* Mapping through Sales Data */}
                {order.product.length > 0 ? (
                  order.product.map((item) => (
                    <div
                      key={item.productId}
                      className="flex w-full items-center justify-center flex-col gap-4"
                    >
                      {/* Sales Information */}
                      <div className="flex flex-row py-5 w-full gap-4">
                        <div className="flex w-full flex-col gap-1">
                          <h1 className="text-lg text-blue-300">
                            Customer Name:{" "}
                            <span className=" font-bold">
                              {item.customerName
                                ? item.customerName.charAt(0).toUpperCase() +
                                  item.customerName.slice(1).toLowerCase()
                                : ""}
                            </span>
                          </h1>
                          <div className="flex flex-row justify-between w-full">
                            <p className="text-gray-500">
                              Product Price:{" "}
                              <span className=" font-bold">{item.price}</span>
                            </p>
                            <p className="text-gray-500">
                              Product Name:{" "}
                              <span className=" font-bold">
                                {item.productName}
                              </span>
                            </p>
                          </div>
                          <div className="flex flex-row justify-between w-full">
                            <p className="text-gray-500">
                              Total amount:{" "}
                              <span className=" font-bold">{item.total}</span>
                            </p>
                            <p className="text-gray-500">
                              Quantity:{" "}
                              <span className=" font-bold">
                                {item.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products found for this order.</p>
                )}
              </div>
            ))
          ) : (
            <p>No order details available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetailSlider;
