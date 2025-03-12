"use client";

import { ShoppingBasket } from "lucide-react";
import React, { useEffect, useState } from "react";
import DailySalesRec from "@/components/store/daily_sales/DailySalesRec";
import CartSlider from "@/components/store/daily_sales/CartSlider";
import OrderDetailSlider from "@/components/store/daily_sales/OrderDetailSlider";
import { getInventoies, getSalesReport } from "@/app/actions/fetch";
import { useStore } from "@/ContextAPI/storeContex";
import { InventoryItem } from "../inventory/page";
import { useCart } from "@/ContextAPI/cartContext";
import { createSalesOrder } from "@/app/actions/post";

export interface Order {
  orderId: string;
  orderDate: string;
  orderTime: string;
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  customerName: string;
  customerNumber: string;
  costAmount: number;
  paidAmount: number;
  creditAmount: number | null;
  status: "paid" | "pending";
  product: Transaction[];
  paymentHistory: any[];
}

export interface Transaction {
  transactionId: string;
  transactionDate: string;
  transactionTime: string;
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  customerName: string;
  customerNumber: string;
  status: string | null;
}

function Page() {
  const { storeData } = useStore();
  const storeId = storeData?.data.storeId;
  const [cartSalesOpen, setCartSalesOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [salesReportData, setSalesReportData] = useState<Order[]>([]);
  const [viewDailyRec, setViewDailyRec] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);

  const [salesToggle, setSalesToggle] = useState<"daily" | "product">("daily");

  const { cart, setCart, removeFromCart, addToCart, updateQuantity } =
    useCart();

  const salesOrders = cart.map(
    ({
      categoryId,
      price,
      productId,
      categoryName,
      productName,
      quantity,
      orderId,
    }) => ({
      categoryId,
      price,
      productId,
      productName,
      categoryName,
      quantity,
      orderId,
    })
  );

  const dailyRecTable = [
    { key: "", label: "#" },
    { key: "customerName", label: "Customer Name" },
    { key: "customerNumber", label: "Customer Number" },
    { key: "productCount", label: "Product Number" },
    { key: "paidAmount", label: "Paid" },
    { key: "costAmount", label: "Total Cost" },

    {
      key: "action",
      label: "",
      render: (row: Order) => (
        <div>
          <button
            onClick={() => handleViewMore(row)}
            className="w-full bg-blue-500 text-center text-white hover:bg-blue-300 rounded-sm px-2 py-1 font-semibold"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const productsTable = [
    { key: "", label: "#" },
    { key: "productName", label: "Product Name" },
    { key: "price", label: " Price" },
    { key: "quantity", label: "Quantity" },
    { key: "total", label: "Total" },

    {
      key: "action",
      label: "",
      render: (row: InventoryItem) => (
        <div>
          <button
            onClick={() => handleAddToCart(row)}
            className="w-full bg-blue-500 text-center text-white hover:bg-blue-300 rounded-sm px-2 py-1 font-semibold"
          >
            Add
          </button>
        </div>
      ),
    },
  ];

  const handleAction = (row: any) => {
    console.log("Perform action on:", row);
    alert(`Action performed on ${row.productName}`);
  };

  const handleAddToCart = (product: InventoryItem) => {
    const { productId, productName, categoryId, categoryName } = product;
    addToCart({
      productId,
      productName,
      categoryId,
      categoryName,
      quantity: 1,
      price: product.price,
    });
  };

  const handleViewMore = (row: Order) => {
    const orderId = row.orderId;
    const product = row.product || [];

    setViewDailyRec([
      {
        orderId,
        product,
        userId: row.userId || "",
        userName: row.userName || "",
        storeId: row.storeId || "",
        storeName: row.storeName || "",
        orderTime: row.orderTime || "",
        creditAmount: row.creditAmount !== undefined ? row.creditAmount : null,
        status: row.status || "pending",
        orderDate: row.orderDate || "",
        customerName: row.customerName || "",
        customerNumber: row.customerNumber || "",
        costAmount: row.costAmount || 0,
        paidAmount: row.paidAmount || 0,
        paymentHistory: row.paymentHistory || [],
      },
    ]);
    setOpenDetail(true);
  };

  const handleOnDelete = (id: string) => {
    removeFromCart(id);
  };

  const handleOnSubmit = async (
    formData: {
      customerName: string;
      phoneNumber: string;
      paid: "paid" | "pending";
      products: {
        categoryId: string;
        categoryName: string;
        productId: string;
        productName: string;
        price: number;
        quantity: number;
      }[];
    },
    formData2?: { amount: number; orderId: string }
  ) => {
    console.log("res.data.message");
    try {
      if (formData2) {
        const res = await createSalesOrder(formData);
        console.log(formData);
      } else {
        await createSalesOrder(formData);
      }
      setCart([]);
      // window.location.reload();
    } catch (error) {
      console.error("Error creating sales order:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (!storeId) return;

    const fetchPoData = async () => {
      setLoading(true);
      const result = await getInventoies(`${storeId}`);

      if (!result) {
        console.error("Unknown error fetching data");
      } else {
        setInventoryData(result);
      }
      setLoading(false);
    };

    fetchPoData();
  }, [storeId]);

  useEffect(() => {
    if (!storeId) return;
    const fetchPoData = async () => {
      setLoading(true);
      const result = await getSalesReport(`${storeId}`);

      if (!result) {
        console.error("Unknown error fetching data");
      } else {
        setSalesReportData(result);
      }
      setLoading(false);
    };

    fetchPoData();
  }, [storeId]);

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex gap-2 flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-medium">Daily Record</h1>

          <button onClick={() => setCartSalesOpen(true)} className="relative">
            <h1 className="flex text-xs -top-2 right-0 absolute w-5 h-5 items-center justify-center bg-red-400 text-white rounded-full">
              {cart.length}
            </h1>
            <div className="bg-gray-200 rounded-full p-1">
              <ShoppingBasket />
            </div>
          </button>

          <CartSlider
            isOpen={cartSalesOpen}
            onClose={() => setCartSalesOpen(false)}
            data={salesOrders}
            onDelete={removeFromCart}
            onQuantityChange={updateQuantity}
            onSubmit={handleOnSubmit}
          />
        </div>

        <div className="gap-2 flex flex-col">
          <div className="flex gap-2 flex-row">
            <button
              className={`${
                salesToggle === "daily"
                  ? "bg-button text-white"
                  : "border bg-white"
              } p-2 px-4 rounded-full `}
              onClick={() => setSalesToggle("daily")}
            >
              Daily Record
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

          {loading ? (
            <p>Loading...</p>
          ) : salesToggle === "daily" ? (
            <DailySalesRec
              columns={dailyRecTable}
              data={salesReportData}
              onActionClick={handleAction}
            />
          ) : (
            <DailySalesRec
              columns={productsTable}
              data={inventoryData}
              onActionClick={handleAction}
            />
          )}
        </div>

        <OrderDetailSlider
          isOpen={openDetail}
          onClose={() => setOpenDetail(false)}
          mainOrder={viewDailyRec || []}
          width="w-1/4"
          overlayColor="bg-black bg-opacity-50"
          drawerStyle="bg-white"
          onDelete={handleOnDelete}
          onSubmit={() => handleOnSubmit}
        />
      </div>
    </div>
  );
}

export default Page;
