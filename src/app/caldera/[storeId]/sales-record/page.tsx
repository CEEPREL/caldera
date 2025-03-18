"use client";

import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import {
  getCategories,
  getFilteredSalesReport,
  getSalesByCategory,
} from "@/app/actions/fetch";
import PurchaseOrderTable from "@/components/store/stock_mgt/purchaseOrderTable";
import { Order } from "../daily-sales/page";

interface DataByCategory {
  transactionId: string;
  orderId: string;
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
}

export interface GroupedOrders {
  [date: string]: Order[];
}

interface Category {
  categoryId: string;
  categoryName: string;
  createdDate: string;
  createdTime: string;
}

function Page() {
  const [salesToggle, setSalesToggle] = useState<"daily" | "product">("daily");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDateStr, setStartDateStr] = useState<string>("");
  const [dateByCat, setDateByCat] = useState<DataByCategory[]>([]);
  const [endDateStr, setEndDateStr] = useState<string>("");
  const [storeId, setStoreId] = useState<string>("");
  const [oldSalesRecData, setOldSalesRecData] = useState<Order[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [categoryData, setCategoryData] = useState<Category[]>();
  // const { salesRecData, setSalesRecData } = useStore();
  const today = moment();
  const params = useParams<{ storeId?: string }>();
  const router = useRouter();

  const groupedOrders: GroupedOrders = oldSalesRecData.reduce((acc, order) => {
    const orderDate = new Date(order.orderDate);
    const formattedDate = getFormattedDate(orderDate);

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(order);
    return acc;
  }, {} as GroupedOrders);

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];
  function getFormattedDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));

    if (isSameDate(date, today)) {
      return date.toISOString().split("T")[0];
    } else if (isSameDate(date, yesterday)) {
      return date.toISOString().split("T")[0];
    } else {
      return date.toISOString().split("T")[0];
    }
  }

  function isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  useEffect(() => {
    const startDate = today.clone().subtract(5, "days").format("YYYY-MM-DD");
    const endDate = today.format("YYYY-MM-DD");
    setStartDateStr(startDate);
    setEndDateStr(endDate);

    const storeId = params.storeId || "";
    setStoreId(storeId);
  }, [params.storeId, today]);
  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategoryData(res.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchCategories();

    if (selectedCategoryId) {
      setLoading(true);
      const fetchCategories = async () => {
        try {
          const res = await getSalesByCategory(storeId, selectedCategoryId);
          setDateByCat(res.data);
        } catch (error) {
          console.error("Error fetching sales data:", error);
        }
      };
      fetchCategories();
    }
  }, [selectedCategoryId, storeId]);

  useEffect(() => {
    if (!startDateStr || !endDateStr || !storeId) return;

    setLoading(true);
    const fetchSalesData = async () => {
      try {
        const res = await getFilteredSalesReport(
          storeId,
          startDateStr,
          endDateStr
        );
        if (res && res !== "error") {
          setOldSalesRecData(res);
          console.log(res);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
    console.log(startDateStr, "/", endDateStr);
  }, [storeId, startDateStr, endDateStr]);

  const handleRecStore = (date: string) => {
    console.log(date);
    router.push(`/caldera/${storeId}/sales-record/${date}`);
    console.log(groupedOrders[date]);
  };
  const handleToggle = (p: string) => {
    setToggle(!toggle);
    setSelectedCategoryId(p);
  };

  const columns = [
    { key: "id", label: "#" },
    { key: "productName", label: "Product" },
    { key: "price", label: "Price" },
    { key: "quantity", label: "Number of sales" },
    { key: "total", label: "Total Revenue" },
    { key: "userName", label: "Sold by" },
  ];

  const handleAction = (row: Order) => {
    console.log("Perform action on:", row);
    alert(`Action performed on ${row.customerNumber}`);
  };

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex gap-2 flex-col">
        <h1 className="text-2xl font-medium">Sales Record</h1>
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
            Product Record
          </button>
        </div>

        {salesToggle === "daily" ? (
          <div className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(groupedOrders)
              .reverse()
              .map(([date, orders]) => (
                <div
                  onClick={() => handleRecStore(date)}
                  key={date}
                  // href={`/caldera/${storeId}/sales-record/${date}`}
                >
                  <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
                    <div className="flex justify-between items-center">
                      <div className="flex w-full flex-col gap-8">
                        <p className="text-sm text-gray-500">
                          {date === todayStr
                            ? "Today"
                            : date === yesterdayStr
                            ? "Yesterday"
                            : date}
                        </p>
                        <div className="flex flex-row justify-between w-full">
                          <p className="text-sm text-black">
                            {orders.length}{" "}
                            {orders.length > 1 ? "Orders" : "Order"}
                          </p>
                          <ChevronRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="gap-2 flex flex-col">
            <div className="flex gap-6">
              {categoryData?.map((p, index) => (
                <button
                  key={index}
                  onClick={() => handleToggle(p.categoryId)}
                  className={`${
                    selectedCategoryId === p.categoryId
                      ? "border-b-4 border-blue-400 font-semibold"
                      : ""
                  } p-2`}
                >
                  {p.categoryName}
                </button>
              ))}
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <PurchaseOrderTable
                columns={columns}
                data={dateByCat}
                onActionClick={handleAction}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
