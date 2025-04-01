"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
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
  const [loading, setLoading] = useState(false);
  const [startDateStr, setStartDateStr] = useState<string>("");
  const [endDateStr, setEndDateStr] = useState<string>("");
  const [storeId, setStoreId] = useState<string>("");
  const [oldSalesRecData, setOldSalesRecData] = useState<Order[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [dateByCat, setDateByCat] = useState<DataByCategory[]>([]);

  const { setSalesRecData } = useStore();
  const today = moment();
  const params = useParams<{ storeId?: string }>();
  const router = useRouter();

  // Function to group orders by date
  const groupedOrders: GroupedOrders = oldSalesRecData.reduce((acc, order) => {
    const orderDate = new Date(order.orderDate);
    const formattedDate = getFormattedDate(orderDate);

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(order);
    return acc;
  }, {} as GroupedOrders);

  // Date formatting utility
  function getFormattedDate(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];

  // Memoize the fetchSalesData function using useCallback
  const fetchSalesData = useCallback(
    async (startDate: string, endDate: string) => {
      setLoading(true); // Show loading spinner while fetching data
      try {
        const res = await getFilteredSalesReport(storeId, startDate, endDate);
        if (res) {
          setOldSalesRecData(res);
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false); // Hide loading spinner after data is fetched
      }
    },
    [storeId] // storeId is the dependency, so fetchSalesData will only be recreated when storeId changes
  );

  // Fetch categories for the product records
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategoryData(res.data);
        setSelectedCategoryId(res.data[0].categoryId); // Default to the first category
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Set the initial date range (30 days before and after today)
  useEffect(() => {
    const startDate = today.clone().subtract(30, "days").format("YYYY-MM-DD");
    const endDate = today.clone().format("YYYY-MM-DD");
    setStartDateStr(startDate);
    setEndDateStr(endDate);

    const storeId = params.storeId || "";
    setStoreId(storeId);
  }, [params.storeId, today]);

  // Fetch sales data based on the current date range
  useEffect(() => {
    if (!startDateStr || !endDateStr || !storeId) return;

    fetchSalesData(startDateStr, endDateStr);
  }, [storeId, startDateStr, endDateStr, fetchSalesData]);

  // Fetch sales data for a specific category
  useEffect(() => {
    if (!selectedCategoryId) return;

    setLoading(true);
    const fetchCategoryData = async () => {
      try {
        const res = await getSalesByCategory(storeId, selectedCategoryId);
        setDateByCat(res.data);
      } catch (error) {
        console.error("Error fetching sales data by category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [selectedCategoryId, storeId]);

  // Handle category selection
  const handleToggle = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  // Navigate to the sales record page for a specific date
  const handleRecStore = (date: string) => {
    router.push(`/caldera/${storeId}/sales-record/${date}`);
    setSalesRecData(groupedOrders[date]);
  };

  // Handle date range changes by adding or subtracting 30 days
  const handleDateChange = async (direction: "next" | "prev") => {
    setLoading(true); // Show loading state while fetching new data

    const newStartDate = moment(startDateStr);
    const newEndDate = moment(endDateStr);

    // Update the date range by 30 days based on direction
    if (direction === "next") {
      newStartDate.add(30, "days");
      newEndDate.add(30, "days");
    } else if (direction === "prev") {
      newStartDate.subtract(30, "days");
      newEndDate.subtract(30, "days");
    }

    // Only update date range and fetch data, no need for additional state updates
    const updatedStartDate = newStartDate.format("YYYY-MM-DD");
    const updatedEndDate = newEndDate.format("YYYY-MM-DD");

    try {
      await fetchSalesData(updatedStartDate, updatedEndDate); // Fetch the sales data
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false); // Reset loading state after data is fetched
    }
  };

  // Columns for the product sales table
  const columns = [
    { key: "id", label: "#" },
    { key: "productName", label: "Product" },
    { key: "price", label: "Price" },
    { key: "quantity", label: "Number of sales" },
    { key: "total", label: "Total Revenue" },
    { key: "userName", label: "Sold by" },
  ];

  // Handle action click (for each row)
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
                  onClick={() => handleDateChange("prev")}
                >
                  <ChevronLeft />
                </button>
                <p>
                  Showing records from {startDateStr} to {endDateStr}
                </p>
                <button
                  className="text-sm p-2 rounded-full border"
                  onClick={() => handleDateChange("next")}
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
