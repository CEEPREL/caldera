"use client";

import { ArrowLeft, ShoppingBasket } from "lucide-react";
import React, { useEffect, useState } from "react";
// import DailySalesRec from "@/components/store/daily_sales/DailySalesRec";
// import CartSlider from "@/components/store/daily_sales/CartSlider";
// import OrderDetailSlider from "@/components/store/daily_sales/OrderDetailSlider";
// import {  getSalesReport } from "@/app/actions/fetch";
import { useStore } from "@/ContextAPI/storeContex";
// import { InventoryItem } from "../inventory/page";
import { useCart } from "@/ContextAPI/cartContext";
import { createSalesOrder } from "@/app/actions/post";
import DailySalesRec from "@/components/store/sales_rec/DailySalesRec";
import OrderDetailSlider from "@/components/store/sales_rec/OrderDetailSlider";

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
  const [openDetail, setOpenDetail] = useState(false);
  const [viewDailyRec, setViewDailyRec] = useState<Order[]>([]);
  const { salesRecData } = useStore();

  const [salesToggle, setSalesToggle] = useState<"daily" | "product">("daily");

  const { setCart, removeFromCart } = useCart();

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

  const handleAction = (row: any) => {
    console.log("Perform action on:", row);
    alert(`Action performed on ${row.productName}`);
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
    // set this upp for refund
  ) => {
    try {
      const res = await createSalesOrder(formData);
      console.log(res, formData, `---${storeId}`);

      setCart([]);
      // window.location.reload();
    } catch (error) {
      console.error("Error creating sales order:", error);
    } finally {
    }
  };

  // useEffect(() => {
  //   if (!storeId) return;

  //   const fetchPoData = async () => {
  //     setLoading(true);
  //     const result = await getInventoies(`${storeId}`);

  //     if (!result) {
  //       console.error("Unknown error fetching data");
  //     } else {
  //       setInventoryData(result);
  //     }
  //     setLoading(false);
  //   };

  //   fetchPoData();
  // }, [storeId]);

  // useEffect(() => {
  //   if (!storeId) return;
  //   const fetchPoData = async () => {
  //     setLoading(true);
  //     const result = await getSalesReport(`${storeId}`);

  //     if (!result) {
  //       console.error("Unknown error fetching data");
  //     } else {
  //       setSalesReportData(result);
  //     }
  //     setLoading(false);
  //   };

  //   fetchPoData();
  // }, [storeId]);

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex gap-2 flex-col">
        {/* <div className="flex flex-row justify-between">
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
        </div> */}

        <div className="gap-2 flex flex-col">
          <div className="flex gap-2 flex-row">
            <button
              className={`flex p-2 px-4 rounded-full `}
              onClick={() => window.history.back()}
            >
              <ArrowLeft /> Back
            </button>
          </div>

          <DailySalesRec
            columns={dailyRecTable}
            data={salesRecData}
            onActionClick={handleAction}
          />
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
