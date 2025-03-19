import React, { useState } from "react";
import clsx from "clsx";
import {
  ProductRequest,
  PurchaseOrder,
} from "@/app/caldera/[storeId]/stock-management/page";
import { Trash2 } from "lucide-react";

interface OrderDetailSliderProps {
  mainOrder: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    orderData: { transactionId: string; quantity: number; amount: number }[],
    orderId: string
  ) => void;
  onDelete: (id: string) => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
}

const AdminOrderDetailSlider: React.FC<OrderDetailSliderProps> = ({
  mainOrder,
  isOpen,
  onDelete,
  onSubmit,
  onClose,
  width = "w-1/4",
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({}); // Product quantities

  // Handle quantity change (direct input)
  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value, 10);
    if (quantity > 0) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    }
  };

  // Calculate total amount for a product
  const calculateAmount = (quantity: number, price: number) => {
    return quantity * price;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!mainOrder) return; // Ensure mainOrder is available

    const orderData = mainOrder.productRequest.map(
      (product: ProductRequest) => {
        const quantity =
          quantities[product.productId] || product.requestQuantity;
        const price = Number(product.unitPrice) || 0;
        const totalAmount = calculateAmount(quantity, price);

        return {
          transactionId: product.productId,
          quantity,
          amount: totalAmount,
        };
      }
    );

    if (orderData.length > 0) {
      onSubmit(orderData, mainOrder.poId); // Pass orderData and correct orderId
    }
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

          {mainOrder ? (
            <div key={mainOrder.poId} className="mt-8">
              <h1 className="text-lg text-blue-300">
                Customer Name:{" "}
                <span className="font-bold">{mainOrder.storeName || ""}</span>
              </h1>
              <h1>{mainOrder.userName}</h1>

              {mainOrder.productRequest.length > 0 ? (
                mainOrder.productRequest.map((product: ProductRequest) => (
                  <div key={product.productId} className="mt-4">
                    <div className="flex items-center mt-2 gap-2">
                      <p className="flex-1">{product.productName}</p>
                      <input
                        type="number"
                        value={
                          quantities[product.productId] ||
                          product.requestQuantity
                        }
                        onChange={(e) =>
                          handleQuantityChange(
                            product.productId,
                            e.target.value
                          )
                        }
                        className="w-16 text-center focus:border border-gray-400"
                      />
                      <input
                        type="number"
                        value={Number(product.unitPrice) || 0}
                        readOnly
                        className="w-20 text-center focus:border border-gray-400"
                      />
                      <button
                        className="text-red-500"
                        onClick={() => onDelete(product.productId)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found for this order.</p>
              )}
            </div>
          ) : (
            <p>No order details available.</p>
          )}

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Submit Order
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminOrderDetailSlider;
