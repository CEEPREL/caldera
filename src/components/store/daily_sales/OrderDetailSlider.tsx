"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Order } from "@/app/caldera/[storeId]/daily-sales/page";

interface UserProfile {
  mainOrder?: Order[];
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
  onDelete: (id: string) => void;
  onSubmit: (
    transactionId: string,
    quantities: { [key: string]: number },
    amountPaid: number
  ) => void; // Include amountPaid in the submission
  form?: string;
}

const OrderDetailSlider: React.FC<UserProfile> = ({
  mainOrder,
  isOpen,
  onSubmit,
  onClose,
  width = "w-1/4", // Default: 1/4 of the page
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    Object.fromEntries(
      (mainOrder ?? []).flatMap((order) =>
        (order.product ?? []).map((item) => [
          item.productId,
          item.quantity || 1,
        ])
      )
    )
  );
  const [amountPaid, setAmountPaid] = useState<number>(0); // State for amountPaid

  const handleChange = (id: string, value: number) => {
    if (value < 1) return; // Prevent negative or zero quantities
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleIncrease = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const handleSubmit = (event: React.FormEvent, transactionId: string) => {
    event.preventDefault();
    onSubmit(transactionId, quantities, amountPaid); // Submit quantities and amountPaid to parent component
  };

  const handleDecrease = (id: string) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 1;
      return {
        ...prev,
        [id]: currentQuantity > 1 ? currentQuantity - 1 : 1,
      };
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      setAmountPaid(value);
    }
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
              <div className="mt-8" key={order.orderId}>
                <div className="flex flex-row justify-between w-full">
                  <h1 className="text-lg text-blue-300">
                    Customer Name:{" "}
                    <span className=" font-bold">
                      {order.customerName
                        ? order.customerName.charAt(0).toUpperCase() +
                          order.customerName.slice(1).toLowerCase()
                        : ""}
                    </span>
                  </h1>
                  <h1>{order.customerNumber}</h1>
                </div>
                <div className="flex flex-row justify-between w-full">
                  <p className="text-gray-500">
                    Paid:{" "}
                    <span className=" font-bold">₦{order.paidAmount} </span> out
                    of <span className=" font-bold">₦{order.costAmount}</span>
                  </p>
                  <p className="text-gray-500">
                    Credit:{" "}
                    <span className=" font-bold">
                      {order.creditAmount || 0}
                    </span>
                  </p>
                </div>
                {/* Mapping through Sales Data */}
                {order.product.length > 0 ? (
                  order.product.map((item) => (
                    <div
                      key={item.productId}
                      className="flex w-full border-t border-gray-400 items-center justify-center flex-col gap-4"
                    >
                      {/* Sales Information */}
                      <div className="flex flex-row w-full gap-4">
                        <div className="flex w-full flex-col gap-1">
                          <div className="flex flex-row justify-between w-full">
                            <p className="text-gray-500">
                              {item.quantity}, {item.productName}
                              <span className=" font-bold"> ₦{item.price}</span>
                            </p>
                            <p className="text-gray-500">
                              Total:
                              <span className=" font-bold"> ₦{item.total}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full">
                        {/* Only show inputs if costPrice > paidAmount */}
                        {order.costAmount > order.paidAmount && (
                          <div className="flex gap-2">
                            <form
                              onSubmit={(e) =>
                                handleSubmit(e, item.transactionId)
                              }
                              className="mt-4 flex flex-col"
                            >
                              {order.status === "pending" && (
                                <div className="flex">
                                  <button
                                    type="button"
                                    className="bg-gray-500 text-white w-10 h-6 flex items-center justify-center rounded"
                                    onClick={() =>
                                      handleDecrease(item.productId)
                                    }
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    className="border-gray-500 h-6 w-16 text-center border"
                                    value={Number(quantities[item.productId])}
                                    onChange={(e) =>
                                      handleChange(
                                        item.productId,
                                        Number(e.target.value) || 1
                                      )
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="bg-gray-500 text-white w-10 h-6 flex items-center justify-center rounded"
                                    onClick={() =>
                                      handleIncrease(item.productId)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products found for this order.</p>
                )}
                {/* Amount Paid Input */}
                <div className="mt-4">
                  <label
                    htmlFor="amountPaid"
                    className="block text-sm font-medium"
                  >
                    Payment
                  </label>
                  <input
                    id="amountPaid"
                    type="text"
                    placeholder="Amount Paid"
                    value={amountPaid}
                    onChange={handleAmountChange}
                    className="w-full border p-2 mt-2"
                    min={order.paidAmount}
                    max={order.costAmount}
                    inputMode="decimal"
                  />
                </div>

                {/* Submit button only visible if costPrice > paidPrice */}
                <button
                  type="submit"
                  className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition w-full"
                >
                  Submit Order
                </button>
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
