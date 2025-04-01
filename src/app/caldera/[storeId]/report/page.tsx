"use client";
import SalesGraph from "@/components/visualizationToola/SalesGraph";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import products from "@/data/data.json";
import PurchasingReport from "@/components/admin/PurchaseReport";
import {
  fetchAllStoreReport,
  fetchDatedCatAdminReport,
  fetchDatedStoreCatReport,
  fetchDatedStoreReport,
} from "@/app/actions/fetchReport";
import { useToastContext } from "@/ContextAPI/toastContext";
import { getInventoies } from "@/app/actions/fetch";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "@mui/material";
import SkeletonLoader from "@/app/admin/(dashboards)/loading";
import { useStore } from "@/ContextAPI/storeContex";

interface CategoryProps {
  categoryId: string;
  categoryName: string;
}
interface RepData {
  transaction_date: string;
  total_amount: string;
}

export type PeriodType = "year" | "month" | "week" | "day";

function Report() {
  const [selectedCat, setselectedCat] = useState<string>("");
  const [repData, setReplData] = useState<RepData[]>();
  const [category, setCategory] = useState<CategoryProps[]>();
  const [loading, setLoading] = useState(false);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  // const [storeId, setStoreId] = useState("");
  const date = new Date();
  const [fromValue, setFromValue] = React.useState(dayjs(date));
  const [toValue, setToValue] = React.useState(dayjs(date));

  const { showToast } = useToastContext();
  const { storeId } = useStore();

  const handleFromDateChange = (newValue: Dayjs | null) => {
    setFromValue(newValue ? dayjs(newValue) : dayjs(""));
  };
  const handleToDateChange = (newValue: Dayjs | null) => {
    setToValue(newValue ? dayjs(newValue) : dayjs(""));
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const handleFilter = async () => {
    setLoadingGraph(true);

    // Format the date values properly
    const fromDate = fromValue ? fromValue.format("YYYY-MM-DD") : "";
    const toDate = toValue ? toValue.format("YYYY-MM-DD") : "";
    try {
      console.log("store", storeId, fromDate, toDate);
      if (!fromDate || !toDate) {
        showToast("Select both from and to date range", "warning");
        return; // Stop execution if the dates are missing
      }

      if (!storeId && !selectedCat) {
        showToast(
          "Please select either a store or a category to filter",
          "warning"
        );
        return;
      }

      if (storeId && fromDate && toDate) {
        const res = await fetchDatedStoreReport(storeId, fromDate, toDate);
        if (res?.data) {
          setReplData(res.data);
          setTotalAmount(res.totalsales);
        } else {
          showToast(
            "No data found for the selected store and date range",
            "warning"
          );
          setReplData([]);
          setTotalAmount(0);
        }
        setselectedCat("");
        setFromValue(dayjs(""));
        setToValue(dayjs(""));
      } else if (selectedCat && fromDate && toDate) {
        const filteredData = await fetchDatedCatAdminReport(
          fromDate,
          toDate,
          selectedCat
        );
        if (filteredData?.data) {
          setReplData(filteredData.data);
          setTotalAmount(filteredData.totalsales);
        } else {
          showToast(
            "No data found for the selected category and date range",
            "warning"
          );
          setReplData([]);
          setTotalAmount(0);
        }
      }

      if (storeId && selectedCat && fromDate && toDate) {
        const res = await fetchDatedStoreCatReport(
          storeId,
          selectedCat,
          fromDate,
          toDate
        );
        if (res?.data) {
          setReplData(res.data);
          setTotalAmount(res.totalsales);
        } else {
          showToast(
            "No data found for the selected category and date range",
            "warning"
          );
          setReplData([]);
          setTotalAmount(0);
        }
      } else {
        showToast(
          "Please select a store or category with a date range",
          "warning"
        );

        setselectedCat("");
        setFromValue(dayjs(""));
        setToValue(dayjs(""));
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      showToast("Something went wrong while fetching filtered data", "error");
    } finally {
      setLoadingGraph(false);

      // Check if there is no data after the filter
      if (repData?.length === 0 && totalAmount === 0) {
        showToast("No data for this filter", "error");
      }
    }
  };

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [reportResponse, catResponse] = await Promise.all([
          fetchAllStoreReport(storeId),
          getInventoies(storeId),
        ]);

        console.log("category", catResponse);

        if (reportResponse) {
          setReplData(reportResponse.data);
          setTotalAmount(reportResponse.totalsales);
        } else {
          showToast("Something went wrong while fetching report data", "error");
        }

        if (catResponse) {
          // Remove duplicate categories based on categoryName
          const uniqueCategories = catResponse.filter(
            (value: any, index: any, self: any) =>
              index ===
              self.findIndex((t: any) => t.categoryName === value.categoryName)
          );
          setCategory(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Something went wrong while fetching data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId, showToast]);

  const renderProductContent = () => {
    return (
      <div className="w-full h-[200px]">
        <SalesGraph data={repData || []} nameKeyX="total_amount" nameKeyY="" />
      </div>
    );
  };

  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl">
      <div className="w-full p-5 relative text-black bg-white">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <SkeletonLoader />
          </div>
        ) : (
          <div>
            {products.length === 0 ? (
              <div
                className={`flex flex-col ${
                  products.length === 0 ? "min-h-[80vh]" : "min-h-0"
                } justify-center items-center w-full`}
              >
                <div className="flex justify-center  items-center w-48 h-48 rounded-full bg-gradient-to-t from-white to-gray-100">
                  <Image
                    className="top-3 left-1"
                    width={100}
                    height={100}
                    alt="No Data"
                    src={"/icons/revenue.svg"}
                  />
                </div>
                <h2>No sales record yet</h2>
              </div>
            ) : (
              <div>
                <h1 className="text-black font-semibold">Report</h1>
                <div className="flex pt-4 w-[100%] gap-4 flex-row">
                  <div className="flex  gap-4  max-h-10">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="w-36 h-9  "
                        value={fromValue}
                        onChange={(newValue: Dayjs | null) =>
                          handleFromDateChange(newValue)
                        }
                      ></DatePicker>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className="w-36 h-9 "
                        value={toValue}
                        onChange={(newValue: Dayjs | null) =>
                          handleToDateChange(newValue)
                        }
                      ></DatePicker>
                    </LocalizationProvider>
                    <Button onClick={handleFilter}>Filter</Button>
                  </div>
                </div>

                {/* Product Selection */}
                <div className="flex pt-5 flex-col gap-4">
                  <div className="flex scroll-m-0  overflow-x-scroll gap-6">
                    {category?.map((cat, index) => (
                      <button
                        onClick={() => setselectedCat(cat.categoryId)}
                        key={index}
                        className={`
                        ${
                          selectedCat === cat.categoryId
                            ? "border-b-4 border-blue-400 font-semibold"
                            : ""
                        }
                        w-[120px] p-2 whitespace-nowrap
                      `}
                      >
                        {cat.categoryName}
                      </button>
                    ))}
                  </div>

                  {/* Product Content */}
                  <div className="border-t-8 border-gray-100">
                    {loadingGraph ? (
                      <div className="flex justify-center items-center min-h-[50vh]">
                        <SkeletonLoader />
                      </div>
                    ) : (
                      <div className="mt-4 p-4 rounded-lg">
                        <div className="flex justify-between flex-row">
                          <div>
                            <label className="text-gray-400">Total sales</label>
                            <h1 className="text-2xl font-medium pb-8">
                              ₦{formatNumber(totalAmount)}
                            </h1>
                          </div>
                        </div>
                        <div className="flex flex-row items-center justify-start w-full">
                          <div className="w-[70%] lg:w-[70%]">
                            {renderProductContent()}
                          </div>
                          <div className="w-[70%] lg:w-[30%]">
                            {/* <Piechart data={repData || []} /> */}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {products.length === 0 ? null : (
        <div className="border-t-8 border-gray-100">
          {loadingGraph ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <SkeletonLoader />
            </div>
          ) : (
            <div className="bg-white p-5">
              <PurchasingReport
                data={repData || []}
                nameKeyY="amt"
                nameKeyX=""
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Report;
