"use client";

import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useStore } from "@/ContextAPI/storeContex";
import { useCart } from "@/ContextAPI/cartContext";
import { createSalesOrder } from "@/app/actions/post";
import DailySalesRec from "@/components/store/sales_rec/DailySalesRec";
import OrderDetailSlider from "@/components/store/sales_rec/OrderDetailSlider";
import { usePathname, useRouter } from "next/navigation";

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
  const pathname = usePathname();
  const router = useRouter();
  const { storeData } = useStore();
  const storeId = storeData?.data.storeId;
  const [openDetail, setOpenDetail] = useState(false);
  const [viewDailyRec, setViewDailyRec] = useState<Order[]>([]);
  const { salesRecData } = useStore();

  const { setCart, removeFromCart } = useCart();

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    // Ensure `salesRecData` is empty and `pathname` includes 'sales-record/'
    if (!salesRecData && pathname.includes("sales-record/") && storeId) {
      // Generate the desired redirect URL with the storeId
      const date = pathname.split("/").pop(); // Extract date from the pathname
      const redirectUrl = `${baseUrl}/caldera/${storeId}/sales-record/${date}`;

      // Redirect immediately if the condition is met
      router.push(redirectUrl);
    }
  }, [pathname, salesRecData, storeId, baseUrl, router]);
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
      console.log(res, formData, `${storeId}`);

      setCart([]);
      // window.location.reload();
    } catch (error) {
      console.error("Error creating sales order:", error);
    } finally {
    }
  };

  return (
    <div
      onClick={() => {
        console.log(salesRecData);
      }}
      className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl"
    >
      <div className="flex gap-2 flex-col">
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
