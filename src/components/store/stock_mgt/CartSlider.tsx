import React, { useState } from "react";
import clsx from "clsx";
import { Trash2 } from "lucide-react";

interface Product {
  categoryId: string;
  categoryName: string;
  productId: string;
  productName: string;
  requestQuantity: number;
}

interface CartSliderProps {
  data: Product[];
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
  onDelete: (id: string) => void;
  form?: string;
}

const CartSlider: React.FC<CartSliderProps> = ({
  data,
  isOpen,
  onClose,
  width = "w-1/4",
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
  onDelete,
}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    Object.fromEntries(
      data.map((item) => [item.productId, item.requestQuantity || 1])
    )
  );

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

  const handleDecrease = (id: string) => {
    setQuantities((prev) => {
      const currentQuantity = prev[id] || 1;
      return {
        ...prev,
        [id]: currentQuantity > 1 ? currentQuantity - 1 : 1,
      };
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
          <p className=" text-3xl font-bold">Product order</p>
          {data.length === 0 ? (
            <p>No order to display</p>
          ) : (
            data.map((item) => (
              <div
                key={item.productId}
                className="flex w-full mt-4 items-center justify-center flex-col gap-4"
              >
                <div className="flex flex-row py-5 w-full gap-4">
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex flex-row justify-between w-full">
                      <p className="text-gray-500">{item.categoryName}</p>
                      <p className="text-gray-500">{item.productName}</p>
                    </div>
                    <div className="flex flex-row justify-between w-full items-center">
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded"
                          onClick={() => handleDecrease(item.productId)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="border-gray-500 w-12 text-center border"
                          value={quantities[item.productId]}
                          onChange={(e) =>
                            handleChange(
                              item.productId,
                              parseInt(e.target.value) || 1 // Handle non-numeric inputs
                            )
                          }
                        />
                        <button
                          className="bg-gray-500 text-white w-6 h-6 flex items-center justify-center rounded"
                          onClick={() => handleIncrease(item.productId)}
                        >
                          +
                        </button>
                      </div>
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
        </div>
      </div>
    </>
  );
};

export default CartSlider;
