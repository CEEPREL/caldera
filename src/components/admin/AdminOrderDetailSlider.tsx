import React, { useState, useEffect } from "react";
import clsx from "clsx";
import {
  ProductRequest,
  PurchaseOrder,
} from "@/app/caldera/[storeId]/stock-management/page";
import { Trash2 } from "lucide-react";
import { deleteProductOrder } from "@/app/actions/delete";
import { useToastContext } from "@/ContextAPI/toastContext";

interface OrderDetailSliderProps {
  mainOrder: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    orderData: {
      prId: string;
      quantity: number;
      unitPrice: number;
      costPrice: number;
      outOfStock: number;
    }[],
    poId: string
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
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [unitPrices, setUnitPrices] = useState<{ [key: string]: number }>({});
  const [costPrices, setCostPrices] = useState<{ [key: string]: number }>({});
  const [outOfStocks, setOutOfStock] = useState<{ [key: string]: number }>({});
  const [productRequest, setProductRequest] = useState<ProductRequest[]>([]);
  const { showToast } = useToastContext();

  useEffect(() => {
    if (mainOrder) {
      const initialQuantities: { [key: string]: number } = {};
      const initialUnitPrices: { [key: string]: number } = {};
      const initialOutOfStock: { [key: string]: number } = {};
      const initialCostPrices: { [key: string]: number } = {};
      const initialProductRequest: ProductRequest[] = [];

      mainOrder.productRequest.forEach((product: ProductRequest) => {
        initialQuantities[product.productId] = product.requestQuantity;
        initialUnitPrices[product.productId] = Number(product.unitPrice) || 0; // Default to 0 if unitPrice is invalid
        initialCostPrices[product.productId] = Number(product.costPrice) || 0; // Default to 0 if costPrice is invalid
        initialOutOfStock[product.productId] = 0; // Default to 0 for outOfStock
        initialProductRequest.push(product); // Add the product to the initial array
      });

      setQuantities(initialQuantities);
      setUnitPrices(initialUnitPrices);
      setCostPrices(initialCostPrices);
      setOutOfStock(initialOutOfStock);
      setProductRequest(initialProductRequest); // Set the initial product list
    }
  }, [mainOrder]);

  // Handle quantity change (direct input)
  const handleOutOfStock = (productId: string, value: string) => {
    const stock = parseInt(value, 10);
    if (!isNaN(stock) && stock >= 0) {
      setOutOfStock((prev) => ({
        ...prev,
        [productId]: stock,
      }));
    } else if (value === "") {
      setOutOfStock((prev) => ({
        ...prev,
        [productId]: 0,
      }));
    }
  };

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    } else if (value === "") {
      setQuantities((prev) => ({
        ...prev,
        [productId]: 0,
      }));
    }
  };

  // Handle unit price change (direct input)
  const handleUnitPriceChange = (productId: string, value: string) => {
    const price = parseFloat(value);
    if (!isNaN(price) && price >= 0) {
      setUnitPrices((prev) => ({
        ...prev,
        [productId]: price,
      }));
    } else if (value === "") {
      setUnitPrices((prev) => ({
        ...prev,
        [productId]: 0,
      }));
    }
  };

  // Handle cost price change (direct input)
  const handleCostPriceChange = (productId: string, value: string) => {
    const price = parseFloat(value);
    if (!isNaN(price) && price >= 0) {
      setCostPrices((prev) => ({
        ...prev,
        [productId]: price,
      }));
    } else if (value === "") {
      setCostPrices((prev) => ({
        ...prev,
        [productId]: 0,
      }));
    }
  };

  // Handle product delete
  // Handle product delete
  const handleDelete = async (prId: string) => {
    try {
      const updatedProductRequest = await deleteProductOrder(prId);
      if (updatedProductRequest.status === true) {
        const newProductRequest = productRequest.filter(
          (product) => product.prId !== prId
        );
        showToast("Deleted successfully", "success");
        setProductRequest(newProductRequest);
        const updatedQuantities = { ...quantities };
        delete updatedQuantities[prId];
        setQuantities(updatedQuantities);

        const updatedUnitPrices = { ...unitPrices };
        delete updatedUnitPrices[prId];
        setUnitPrices(updatedUnitPrices);

        const updatedCostPrices = { ...costPrices };
        delete updatedCostPrices[prId];
        setCostPrices(updatedCostPrices);

        const updatedOutOfStock = { ...outOfStocks };
        delete updatedOutOfStock[prId];
        setOutOfStock(updatedOutOfStock);

        // Call the parent's onDelete function, passing the deleted prId
        onDelete(prId);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Submit the updated order data
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!mainOrder) return; // Ensure mainOrder is available

    const orderData = productRequest.map((product: ProductRequest) => {
      const quantity = quantities[product.productId] || product.requestQuantity;
      const unitPrice =
        unitPrices[product.productId] || Number(product.unitPrice);
      const outOfStock = outOfStocks[product.productId] || 0; // Use outOfStocks state for out-of-stock value
      const costPrice =
        costPrices[product.productId] || Number(product.unitPrice);

      return {
        prId: product.prId,
        quantity,
        unitPrice,
        costPrice,
        outOfStock,
      };
    });

    if (orderData.length > 0) {
      onSubmit(orderData, mainOrder.poId);
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
          "fixed top-0 overflow-y-scroll w-[70%] lg:w-[55%] text-black right-0 h-full gap-2 z-10 transition-transform duration-300 ease-in-out",
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
                Store Name:{" "}
                <span className="font-bold">
                  {capitalizeFirstLetter(mainOrder.storeName || "")}
                </span>
              </h1>
              <h1>
                Order By:{" "}
                <span className="font-bold">
                  {capitalizeFirstLetter(mainOrder.userName)}
                </span>
              </h1>

              {/* Label Header Row */}
              <div className="grid grid-cols-6 gap-1 font-semibold text-sm text-gray-700 mt-4">
                <div className=" text-center ">Product Name</div>
                <div className="text-center  ">Quantity</div>
                <div className=" text-center *:">Unit Price</div>
                <div className=" text-center ">Cost Price</div>
                <div className=" text-center">Set </div>
                <div className=""></div> {/* For delete button */}
              </div>

              {productRequest.length > 0 ? (
                productRequest.map((product: ProductRequest) => (
                  <div
                    key={product.productId}
                    className="w-full grid grid-cols-6 gap-2 mt-2"
                  >
                    {/* Product Name */}
                    <div className="text-gray-600">{product.productName}</div>
                    {/* Quantity Input */}
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={9}
                      value={quantities[product.productId] ?? ""}
                      onChange={(e) =>
                        handleQuantityChange(product.productId, e.target.value)
                      }
                      className="w-full h-8 text-center border focus:border-gray-400"
                    />
                    {/* Unit Price Input */}
                    <input
                      type="text"
                      value={unitPrices[product.productId] ?? ""}
                      onChange={(e) =>
                        handleUnitPriceChange(product.productId, e.target.value)
                      }
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={9}
                      className="w-full h-8 text-center border focus:border-gray-400"
                    />
                    {/* Cost Price Input */}
                    <input
                      type="text"
                      value={costPrices[product.productId] ?? ""}
                      onChange={(e) =>
                        handleCostPriceChange(product.productId, e.target.value)
                      }
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={9}
                      className="w-full h-8 text-center border focus:border-gray-400"
                    />
                    {/* Out of Stock Input */}
                    <input
                      type="text"
                      value={outOfStocks[product.productId] ?? ""}
                      onChange={(e) =>
                        handleOutOfStock(product.productId, e.target.value)
                      }
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={9}
                      className="w-full h-8 text-center border focus:border-gray-400"
                    />
                    {/* Delete Button */}
                    <div className="flex items-center h-8 justify-center">
                      {mainOrder?.status === "pending" && (
                        <button
                          className="flex justify-center items-center h-8 text-red-500"
                          onClick={() => handleDelete(product.prId)} // Handle delete
                        >
                          <Trash2 />
                        </button>
                      )}
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
            {mainOrder?.status === "pending" && (
              <button
                type="submit"
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg"
              >
                Confirm Order
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminOrderDetailSlider;

export const capitalizeFirstLetter = (name: string) => {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
};
