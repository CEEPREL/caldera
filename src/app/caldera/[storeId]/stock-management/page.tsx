"use client";

import { useCart } from "@/ContextAPI/cartContext";
import { useStore } from "@/ContextAPI/storeContex";
import { fetchProduct, getallpurchaseOrder } from "@/app/actions/fetch";
import { createPurchaseOrder } from "@/app/actions/post";
import CartSlider from "@/components/store/stock_mgt/CartSlider";
import OrderDetailSlider from "@/components/store/stock_mgt/OrderDetailSlider";
import PurchaseOrderTable from "@/components/store/stock_mgt/purchaseOrderTable";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export interface ProductRequest {
  prId: string;
  poId: string;
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  categoryId: string;
  categoryName: string;
  productId: string;
  productName: string;
  costPrice: string | null;
  unitPrice: string | null;
  requestQuantity: number;
}

export interface PurchaseOrder {
  poId: string;
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  requestDate: string;
  requestTime: string;
  status: string;
  productRequestCount?: number;
  productRequest: ProductRequest[];
}

type Product = {
  productId: string;
  userId: string;
  userName: string;
  productName: string;
  createdDate: string;
  createdTime: string;
  categoryId: string;
  categoryName: string;
};

function Page() {
  const { storeData } = useStore();
  const storeId = storeData?.data.storeId;
  const [openCart, setOpenCart] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [poData, setPoData] = useState<PurchaseOrder[]>([]);
  const [loadingPo, setLoadingPo] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentPoData, setCurrentPoData] = useState<PurchaseOrder | null>(
    null
  );
  // const [error, setError] = useState<string | null>(null);
  const [salesToggle, setSalesToggle] = useState<"purchase order" | "product">(
    "purchase order"
  );

  const { cart, setCart, removeFromCart, addToCart } = useCart();

  const productOrders = cart.map(
    ({ categoryId, categoryName, productId, productName, quantity }) => ({
      categoryId,
      categoryName,
      productId,
      productName,
      requestQuantity: quantity,
    })
  );
  const cartLength = cart.length;
  const handleAddToCart = (product: Product) => {
    const { productId, productName, categoryId, categoryName } = product;
    addToCart({
      productId,
      productName,
      categoryId,
      categoryName,
      quantity: 1,
      price: 0,
    });
  };
  const handleAction = (row: PurchaseOrder) => {
    const poId = row.poId;
    const productRequest = row.productRequest || [];

    console.log(poData);

    setCurrentPoData({
      poId,
      productRequest,
      userId: row.userId || "",
      userName: row.userName || "",
      storeId: row.storeId || "",
      storeName: row.storeName || "",
      requestDate: row.requestDate || "",
      requestTime: row.requestTime || "",
      status: row.status || "",
    });
    setOpenDetail(true);
  };

  const productsTable = [
    { key: "id", label: "#" },
    { key: "productName", label: "Product Name" },
    { key: "categoryName", label: "Category" },
    { key: "userName", label: "Append By" },
    {
      key: "action",
      label: "",
      render: (row: Product) => (
        <button
          onClick={() => handleAddToCart(row)}
          className="w-full bg-blue-500 text-center text-white hover:bg-blue-300 rounded-sm px-2 py-1 font-semibold"
        >
          Add
        </button>
      ),
    },
  ];

  const orderTable = [
    { key: "id", label: "#" },
    { key: "poId", label: "Order ID" },
    { key: "requestDate", label: " Date" },
    { key: "productRequestCount", label: "No of Product" },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      render: (row: PurchaseOrder) => (
        <div>
          <button
            onClick={() => handleAction(row)}
            className={`${
              row.status === "Pending"
                ? "bg-gray-400 w-full hover:bg-gray-300"
                : "bg-blue-500 w-full hover:bg-blue-300"
            } rounded-sm px-2 py-1 text-white font-semibold`}
          >
            {row.status === "Pending" ? "Pending" : "View"}
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getProducts = async () => {
      setLoadingProducts(true);
      const data = await fetchProduct();
      if (data && Array.isArray(data)) {
        const allProducts = data
          .filter((category) => category.product.length > 0)
          .flatMap((category) =>
            category.product.map((product: Product) => ({
              ...product,
              categoryId: category.categoryId,
              categoryName: category.categoryName,
            }))
          );
        setProducts(allProducts);
        console.log("producrs: ", allProducts);
      }
      setLoadingProducts(false);
    };

    getProducts();
  }, []);

  useEffect(() => {
    if (!storeId) return;

    const fetchPoData = async () => {
      setLoadingPo(true);
      const result = await getallpurchaseOrder("9033519996");
      if (!result.status) {
        console.error(result.error || "Unknown error");
      } else {
        setPoData(result.data);
        console.log("podata: ", result.data);
      }
      setLoadingPo(false);
    };

    fetchPoData();
  }, [storeId]);

  const handleOnDelete = (id: string) => {
    removeFromCart(id);
  };
  const handleOnSubmit = async (quantities: { [key: string]: number }) => {
    try {
      console.log("Submitted Quantities:", quantities);

      const productOrders = cart.map((item) => ({
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        productId: item.productId,
        productName: item.productName,
        requestQuantity: quantities[item.productId] || 1, // Use provided quantity or default to 1
      }));

      console.log("Submitting Order:", productOrders);

      const response = await createPurchaseOrder(productOrders);

      // =======Handle the response=======
      if (response?.status) {
        console.log("Order created successfully!", response.data);
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

  // Loading spinner component
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center w-full h-full">
      <div className=" text-2xl font-bold">Loding...</div>
    </div>
  );

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-medium">Stock Management</h1>

          <button onClick={() => setOpenCart(true)} className="relative">
            <h1
              className={`flex text-xs -top-2 right-0 absolute w-5 h-5 items-center justify-center ${
                cartLength > 0 ? "bg-red-400" : ""
              }  text-white rounded-full`}
            >
              {cartLength > 0 && cartLength}
            </h1>
            <div className="bg-gray-200 rounded-full p-1">
              <ShoppingBasket />
            </div>
          </button>
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
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2 py-2 flex-row">
            <button
              className={`${
                salesToggle === "purchase order"
                  ? "bg-button text-white"
                  : "border bg-white"
              } p-2 px-4 rounded-full `}
              onClick={() => setSalesToggle("purchase order")}
            >
              Purchase Order
            </button>
            <button
              className={`${
                salesToggle === "product"
                  ? "bg-button text-white"
                  : "border bg-white"
              } p-2 px-4 rounded-full `}
              onClick={() => setSalesToggle("product")}
            >
              Products
            </button>
          </div>
          {salesToggle === "purchase order" ? (
            <div className="flex gap-2 py-2 flex-row">
              <Link
                href={`/caldera/${storeId}/stock-management/purchase-order`}
                className="bg-button text-white p-2 px-4 rounded-full"
              >
                Purchase Order
              </Link>
            </div>
          ) : (
            <div className="flex gap-2 py-2 flex-row">
              <Link
                href={`/caldera/${storeId}/stock-management/new-product`}
                className="bg-button text-white p-2 px-4 rounded-full"
              >
                Create new Product
              </Link>
            </div>
          )}
        </div>

        {/* Show loading indicator while products or PO data are being loaded */}
        {loadingProducts || loadingPo ? (
          <LoadingIndicator />
        ) : (
          <div>
            {salesToggle === "purchase order" ? (
              <PurchaseOrderTable
                columns={orderTable}
                data={poData}
                onActionClick={(row: PurchaseOrder) => handleAction(row)}
              />
            ) : (
              <PurchaseOrderTable
                columns={productsTable}
                data={products}
                onActionClick={handleAction}
              />
            )}
          </div>
        )}
      </div>

      {/* OrderDetailSlider for viewing products in product order*/}
      <OrderDetailSlider
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        data={currentPoData?.productRequest || []}
        width="w-1/4"
        overlayColor="bg-black bg-opacity-50"
        drawerStyle="bg-white"
      />
    </div>
  );
}

export default Page;
