"use client";

import React, { useState } from "react";
import clsx from "clsx";
import { Trash2 } from "lucide-react";

interface Data {
  id: string;
  date: string;
  payment: string;
  revenue: number;
  quantity: number;
}

interface UserProfile {
  data: Data[];
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
  onDelete: (id: string) => void;
  form?: string;
}

const CartSlider: React.FC<UserProfile> = ({
  data,
  isOpen,
  onClose,
  width = "w-1/4",
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
  onDelete,
  form,
}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    Object.fromEntries(data.map((item) => [item.id, item.quantity || 1]))
  );
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [formDisplay, setFormDisplay] = useState(form || null);

  const totalPrice = data.reduce(
    (sum, item) => sum + item.revenue * quantities[item.id],
    0
  );
  const balance = totalPrice - amountPaid;

  const handleChange = (id: string, value: number) => {
    if (value < 1) return;
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleIncrease = (id: string) => {
    const newQuantity = (quantities[id] || 1) + 1;
    const newTotalPrice =
      totalPrice + data.find((item) => item.id === id)!.revenue;
    const newBalance = newTotalPrice - amountPaid;

    if (newBalance >= 0) {
      setQuantities((prev) => ({ ...prev, [id]: newQuantity }));
    }
  };

  const handleDecrease = (id: string) => {
    if (quantities[id] > 1) {
      setQuantities((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (value <= totalPrice) {
      setAmountPaid(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      customerName,
      phoneNumber,
      amountPaid,
      isPending,
      totalPrice,
      balance,
    });
  };

  return (
    <>
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
        <div className="mt-2 p-5 w-full">
          <button
            className="absolute top-5 right-5 text-black w-10 h-10 flex items-center justify-center bg-red-300 rounded-full shadow-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            ✕
          </button>

          {data.map((item) => (
            <div
              key={item.id}
              className="flex w-full items-center justify-center flex-col gap-4"
            >
              <div className="flex flex-row py-5 w-full gap-4">
                <div className="flex w-full flex-col gap-1">
                  <h1 className="text-lg text-blue-300">{item.date}</h1>
                  <div className="flex flex-row justify-between w-full">
                    <p className="text-gray-500">${item.revenue}</p>
                    <p className="text-gray-500">{item.payment}</p>
                  </div>
                  <div className="flex flex-row justify-between w-full items-center">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded"
                        onClick={() => handleDecrease(item.id)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="border-gray-500 w-12 text-center border"
                        value={quantities[item.id]}
                        onChange={(e) =>
                          handleChange(item.id, parseInt(e.target.value) || 1)
                        }
                      />
                      <button
                        className="bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded"
                        onClick={() => handleIncrease(item.id)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-red-500"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {formDisplay === "show form" && (
            <form
              onSubmit={handleSubmit}
              className="mt-5 p-4 bg-gray-100 rounded-lg"
            >
              <h2 className="text-lg font-semibold">Customer Details</h2>
              <input
                type="checkbox"
                checked={isPending}
                onChange={() => setIsPending(!isPending)}
                className="mr-2"
              />{" "}
              Order Pending
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border p-2 mt-2"
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border p-2 mt-2"
                inputMode="numeric"
                required
              />
              <input
                type="number"
                placeholder="Amount Paid"
                value={amountPaid}
                onChange={handleAmountChange}
                className="w-full border p-2 mt-2"
                min="0"
                max={totalPrice}
              />
              <p className="mt-2">Total: ${totalPrice}</p>
              <p className="mt-2">Balance: ${balance}</p>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
                disabled={balance < 0}
              >
                Submit Order
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSlider;
