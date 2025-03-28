"use client";
import { useCart } from "@/ContextAPI/cartContext";
import { useStore } from "@/ContextAPI/storeContex";
import { getOutOfStockList } from "@/app/actions/fetch";
import { createPurchaseOrder } from "@/app/actions/post";
import PurchaseOrderTable from "@/components/store/inventory/purchaseOrderTable";
import CartSlider from "@/components/store/stock_mgt/CartSlider";
import React, { useEffect, useState } from "react";
import SkeletonLoader from "../../../loading";
// import { Product } from "../stock-management/page";

export interface InventoryItem {
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  categoryId: string;
  categoryName: string;
  total: number;
  outOfStock: "0" | "1";
  createdDate: string;
  createdTime: string;
}

function Page() {
  const { storeData } = useStore();
  const storeId = storeData?.data.storeId;
  const [loading, setLoading] = useState(true);
  const [openCart, setOpenCart] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const { cart, setCart, removeFromCart, addToCart } = useCart();

  const inventoryTable = [
    { key: "", label: "#" },
    { key: "productName", label: "Product Name" },
    { key: "price", label: " Price" },
    { key: "quantity", label: "Quantity" },
    { key: "total", label: "Total" },
  ];

  const productOrders = cart.map(
    ({ categoryId, categoryName, productId, productName, quantity }) => ({
      categoryId,
      categoryName,
      productId,
      productName,
      requestQuantity: quantity,
      outOfStock: 1,
    })
  );

  const handleOnSubmit = async (quantities: { [key: string]: number }) => {
    try {
      console.log("Submitted Quantities:", quantities);

      const productOrders = cart.map((item) => ({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        productId: item.productId,
        productName: item.productName,
        requestQuantity: quantities[item.productId] || 1,
        unitPrice: item.price,
        outOfStock: 1,
      }));

      const response = await createPurchaseOrder(productOrders);

      if (response?.status) {
        alert("Order created successfully!");
        setCart([]);
      } else {
        console.error(
          "Error creating order:",
          response?.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const handleAddAllToCart = () => {
    // Loop through the inventory data and map items to cart
    inventoryData.forEach((item) => {
      const {
        productId,
        productName,
        categoryId,
        categoryName,
        price,
        quantity,
      } = item;
      addToCart({
        productId,
        productName,
        categoryId,
        categoryName,
        price,
        quantity,
      });
    });
    setOpenCart(true);
  };
  const handleOnDelete = (id: string) => {
    removeFromCart(id);
  };
  useEffect(() => {
    if (!storeId) return;

    const fetchPoData = async () => {
      setLoading(true);
      const result = await getOutOfStockList(`${storeId}`);

      if (!result) {
        console.error("Unknown error fetching data");
      } else {
        setInventoryData(result.data);
      }
      setLoading(false);
    };

    fetchPoData();
  }, [storeId]);

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex flex-col">
        <div className="flex justify-between flex-row">
          <h1 className="text-2xl font-medium">Market Lists</h1>
          <button
            onClick={handleAddAllToCart}
            className="bg-button text-white rounded-2xl p-1 px-2 boder border-black"
          >
            Add All to Cart
          </button>
        </div>
        <CartSlider
          onDelete={handleOnDelete}
          isOpen={openCart}
          onClose={() => setOpenCart(false)}
          data={productOrders}
          width="w-1/4"
          overlayColor="bg-black bg-opacity-50"
          drawerStyle="bg-white"
          onSubmit={handleOnSubmit}
        />
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-screen w-full">
              <SkeletonLoader />
            </div>
          ) : (
            <PurchaseOrderTable columns={inventoryTable} data={inventoryData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
