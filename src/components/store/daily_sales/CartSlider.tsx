import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Trash2 } from "lucide-react";

interface Product {
  productId: string;
  categoryName: string;
  productName: string;
  price: number;
  categoryId: string;
  quantity: number;
}

export interface FormData {
  customerName: string;
  customerNumber: string;
  paid: "paid" | "pending";
  product: {
    categoryId: string;
    categoryName: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
}

interface CartSliderProps {
  data: Product[];
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onSubmit: (
    formData: {
      customerName: string;
      customerNumber: string;
      paid: "paid" | "pending";
      product: {
        categoryId: string;
        categoryName: string;
        productId: string;
        productName: string;
        price: number;
        quantity: number;
      }[];
    },
    amount: number
  ) => void;
  formData: FormData;
  onFormDataChange: (newFormData: FormData) => void;
}

const CartSlider: React.FC<CartSliderProps> = ({
  data,
  isOpen,
  onClose,
  width = "w-1/4",
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
  onDelete,
  onQuantityChange,
  onSubmit,
  formData,
  onFormDataChange,
}) => {
  const [amount, setAmount] = useState(0);
  const [paid, setPaid] = useState<"paid" | "pending">(formData.paid); // Sync with parent

  // Calculate total price and balance dynamically
  const totalPrice = data.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const balance = totalPrice - amount;

  useEffect(() => {
    setPaid(formData.paid); // Sync the paid status from parent
  }, [formData.paid]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
  };

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormDataChange({ ...formData, customerName: e.target.value });
  };

  const handleCustomerNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFormDataChange({ ...formData, customerNumber: e.target.value });
  };

  const handlePaymentStatusChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newStatus = e.target.checked ? "pending" : "paid";
    onFormDataChange({ ...formData, paid: newStatus });
    setPaid(newStatus);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, amount);
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

          {data.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <h2>No products available in cart</h2>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.productId}
                className="flex w-full items-center justify-center flex-col gap-4"
              >
                <div className="flex flex-row py-5 w-full gap-4">
                  <div className="flex w-full flex-col gap-1">
                    <h1 className="text-lg text-blue-300">
                      {item.productName}
                    </h1>
                    <div className="flex flex-row justify-between w-full">
                      <p className="text-gray-500">₦{item.price}</p>
                      <p className="text-gray-500">{item.categoryName}</p>
                    </div>
                    <div className="flex flex-row justify-between w-full items-center">
                      <button
                        className="bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded"
                        onClick={() =>
                          onQuantityChange(item.productId, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="border-gray-500 w-12 text-center border"
                        value={item.quantity}
                        onChange={(e) =>
                          onQuantityChange(
                            item.productId,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                      <button
                        className="bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded"
                        onClick={() =>
                          onQuantityChange(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => onDelete(item.productId)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-5 p-4 bg-gray-100 rounded-lg"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                id="payment-status"
                checked={paid === "pending"}
                onChange={handlePaymentStatusChange}
                className="mr-2"
              />
              <label htmlFor="payment-status" className="text-gray-700">
                Payment Status: {paid}
              </label>
            </div>

            <h2 className="text-lg font-semibold">Customer Details</h2>
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={handleCustomerNameChange}
              className="w-full border p-2 mt-2"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.customerNumber}
              onChange={handleCustomerNumberChange}
              className="w-full border p-2 mt-2"
              inputMode="numeric"
              required
            />
            <input
              type="text"
              pattern="[0-9]*"
              placeholder="Amount Paid"
              value={amount}
              onChange={handleAmountChange}
              className="w-full border p-2 mt-2"
              min="0"
              max={totalPrice}
            />
            <p className="mt-2">Total: ₦{totalPrice}</p>
            <p className="mt-2">Balance: ₦{balance}</p>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
            >
              Submit Order
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CartSlider;
