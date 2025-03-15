import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Order } from "@/app/caldera/[storeId]/daily-sales/page";

interface OrderDetailSliderProps {
  mainOrder: Order[] | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    orderData: { transactionId: string; quantity: number }[],
    amount: number,
    orderId: string
  ) => void;
  onDelete: (id: string) => void;
  width?: string;
  overlayColor?: string;
  drawerStyle?: string;
}

// Define the type for the product structure
interface GroupedProduct {
  quantity: number;
  product: any; // You can further define the product type if you have it
}

const OrderDetailSlider: React.FC<OrderDetailSliderProps> = ({
  mainOrder,
  isOpen,
  onSubmit,
  onClose,
  width = "w-1/4",
  overlayColor = "bg-black bg-opacity-50",
  drawerStyle = "bg-white p-5 rounded-r-2xl shadow-lg",
}) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [amount, setAmount] = useState<number>(0); // Amount to be paid
  const [orderId, setOrderId] = useState<string>(""); // The current orderId
  const [groupedProducts, setGroupedProducts] = useState<{
    [key: string]: GroupedProduct;
  }>({});

  useEffect(() => {
    if (mainOrder && mainOrder.length > 0) {
      // Group products by productId and calculate total quantity
      const grouped: { [key: string]: GroupedProduct } = {};

      mainOrder.forEach((order) => {
        order.product.forEach((item) => {
          if (grouped[item.productId]) {
            grouped[item.productId].quantity += 1; // Increase quantity for existing product
          } else {
            grouped[item.productId] = { quantity: 1, product: item };
          }
        });
      });

      // Store quantities for each productId
      setGroupedProducts(grouped);

      // Set initial quantities for the input fields
      const initialQuantities = Object.fromEntries(
        Object.entries(grouped).map(([productId, { quantity }]) => [
          productId,
          quantity,
        ])
      );
      setQuantities(initialQuantities);

      // Set orderId
      const currentOrderId = mainOrder[0]?.orderId || "";
      setOrderId(currentOrderId);

      // Calculate total amount
      const totalAmount =
        mainOrder[0]?.product.reduce((acc, item) => acc + item.total, 0) || 0;
      setAmount(totalAmount);
    }
  }, [mainOrder]);

  const handleChange = (productId: string, value: number) => {
    if (value < 1) return; // Ensure quantity is at least 1
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const handleIncrease = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrease = (productId: string) => {
    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 0;
      return {
        ...prev,
        [productId]: currentQuantity > 1 ? currentQuantity - 1 : 1,
      };
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Collect the transactionId and quantities for each product based on productId
    const orderData = Object.values(groupedProducts).map(({ product }) => ({
      transactionId: product.transactionId, // Grab the transactionId
      quantity: quantities[product.productId] || 1, // Use the aggregated quantity from the state
    }));

    if (orderData) {
      onSubmit(orderData, amount, orderId); // Pass orderData, amount, and orderId to parent
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

          {mainOrder && mainOrder.length > 0 ? (
            mainOrder.map((order) => (
              <div key={order.orderId} className="mt-8">
                <h1 className="text-lg text-blue-300">
                  Customer Name:{" "}
                  <span className=" font-bold">{order.customerName || ""}</span>
                </h1>
                <h1>{order.customerNumber}</h1>

                {order.product.length > 0 ? (
                  Object.values(groupedProducts).map(
                    ({ product, quantity }) => (
                      <div key={product.productId} className="mt-4">
                        <div className="flex justify-between">
                          <p>
                            {product.productName} -{" "}
                            {quantities[product.productId]} x ₦{product.price}
                          </p>
                          <p>
                            ₦{quantities[product.productId] * product.price}
                          </p>
                        </div>

                        <div className="flex mt-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleDecrease(product.productId)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={quantities[product.productId]}
                            onChange={(e) =>
                              handleChange(
                                product.productId,
                                Number(e.target.value)
                              )
                            }
                            className="w-16 text-center"
                          />
                          <button
                            type="button"
                            onClick={() => handleIncrease(product.productId)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p>No products found for this order.</p>
                )}
              </div>
            ))
          ) : (
            <p>No order details available.</p>
          )}

          {/* Amount input field */}
          <div className="mt-4">
            <label htmlFor="amount" className="block text-gray-700">
              Amount to Pay:
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

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

export default OrderDetailSlider;
