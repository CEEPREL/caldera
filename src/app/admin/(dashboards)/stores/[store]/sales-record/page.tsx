"use client";

import { ChevronRight, ChevronLeft } from "lucide-react"; // Add ChevronLeft
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
import { useStore } from "@/ContextAPI/storeContex";
import SkeletonLoader from "@/app/admin/(dashboards)/loading";

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
  const { setSalesRecData } = useStore();
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
    return date.toISOString().split("T")[0];
  }
  // const fetchSalesData = async (startDate: string, endDate: string) => {
  //   setLoading(true);
  //   try {
  //     const res = await getFilteredSalesReport(storeId, startDate, endDate);
  //     if (res) {
  //       setOldSalesRecData(res);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching sales data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const startDate = today.clone().subtract(30, "days").format("YYYY-MM-DD");
    const endDate = today.clone().add(30, "days").format("YYYY-MM-DD");
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
        setSelectedCategoryId(res.data[0].categoryId);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) return;

    setLoading(true);
    const fetchSalesData = async () => {
      try {
        const res = await getSalesByCategory(storeId, selectedCategoryId);
        setDateByCat(res.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
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
        if (res) {
          setOldSalesRecData(res);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [storeId, startDateStr, endDateStr]);

  const handleRecStore = (date: string) => {
    router.push(`/caldera/${storeId}/sales-record/${date}`);
    setSalesRecData(groupedOrders[date]);
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
    alert(`Action performed on ${row.customerNumber}`);
  };

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      {loading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <SkeletonLoader />
        </div>
      ) : (
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
            <>
              <div className="flex justify-between items-center">
                <button
                  className="text-sm p-2 rounded-full border"
                  onClick={() => {
                    const newStartDate = moment(startDateStr)
                      .subtract(1, "days")
                      .format("YYYY-MM-DD");
                    const newEndDate = moment(endDateStr)
                      .subtract(1, "days")
                      .format("YYYY-MM-DD");
                    setStartDateStr(newStartDate);
                    setEndDateStr(newEndDate);
                  }}
                >
                  <ChevronLeft />
                </button>
                <p>
                  Showing records from {startDateStr} to {endDateStr}
                </p>
                <button
                  className="text-sm p-2 rounded-full border"
                  onClick={() => {
                    const newStartDate = moment(startDateStr)
                      .add(1, "days")
                      .format("YYYY-MM-DD");
                    const newEndDate = moment(endDateStr)
                      .add(1, "days")
                      .format("YYYY-MM-DD");
                    setStartDateStr(newStartDate);
                    setEndDateStr(newEndDate);
                  }}
                >
                  <ChevronRight />
                </button>
              </div>
              <div className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(groupedOrders).reverse().length === 0 ? (
                  <p>No records available for the selected date range</p>
                ) : (
                  Object.entries(groupedOrders)
                    .reverse()
                    .map(([date, orders]) => (
                      <div onClick={() => handleRecStore(date)} key={date}>
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
                    ))
                )}
              </div>
            </>
          ) : (
            <div className="gap-2 flex flex-col">
              <div className="flex overflow-x-auto gap-6">
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
                <div className="flex items-center justify-center h-screen w-full">
                  <SkeletonLoader />
                </div>
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
      )}
    </div>
  );
}

export default Page;
