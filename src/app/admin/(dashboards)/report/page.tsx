"use client";
import Dropdown from "@/components/Dropdown";
import SalesGraph from "@/components/visualizationToola/SalesGraph";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import products from "@/data/data.json";
import PurchasingReport from "@/components/admin/PurchaseReport";
import SkeletonLoader from "../loading";
import {
  fetchAllAdminReport,
  fetchDatedCatAdminReport,
  fetchDatedStoreCatReport,
  fetchDatedStoreReport,
} from "@/app/actions/fetchReport";
import { useToastContext } from "@/ContextAPI/toastContext";
import { fetchStores, getCategories } from "@/app/actions/fetch";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Button } from "@mui/material";

type Store = {
  createdDate: string | null;
  createdTime: string | null;
  phoneNumber: string;
  state: string;
  storeId: string;
  storeLocation: string;
  storeName: string;
};

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
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCat, setselectedCat] = useState<string>("");
  const [repData, setReplData] = useState<RepData[]>();
  const [stores, setStores] = useState<Store[]>();
  const [category, setCategory] = useState<CategoryProps[]>();
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const date = new Date();
  const [fromValue, setFromValue] = React.useState(dayjs(date));
  const [toValue, setToValue] = React.useState(dayjs(date));

  const { showToast } = useToastContext();

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    if (state === "All") {
      setFilteredStores(stores || []);
    } else {
      setFilteredStores(stores?.filter((store) => store.state === state) || []);
    }
  };
  const handleStoreChange = (storeId: string) => {
    const selectedStore = stores?.find((store) => store.storeName === storeId);

    if (selectedStore) {
      const { storeId } = selectedStore;
      setSelectedStore(storeId);
      console.log("Selected Store:", selectedState);
    }
  };

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

    // Check if the user has selected both a store and a valid date range
    try {
      console.log("store", selectedStore, fromDate, toDate);

      // If both dates and a store are not selected, show a message to select them
      if (!fromDate || !toDate) {
        showToast("Select both from and to date range", "warning");
        return; // Stop execution if the dates are missing
      }

      if (!selectedStore && !selectedCat) {
        showToast(
          "Please select either a store or a category to filter",
          "warning"
        );
        return; // Stop execution if neither store nor category is selected
      }

      // Case when the store is selected and we have the date range
      if (selectedStore && fromDate && toDate && !selectedCat) {
        const res = await fetchDatedStoreReport(
          selectedStore,
          fromDate,
          toDate
        );
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
      }
      // Case when the category is selected and we have the date range
      else if (selectedCat && fromDate && toDate) {
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
        if (selectedStore && selectedCat && fromDate && toDate) {
          const res = await fetchDatedStoreCatReport(
            selectedStore,
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
        }
        setselectedCat("");
        setFromValue(dayjs(""));
        setToValue(dayjs(""));
      }
      // Case when both store and category are missing
      else {
        showToast(
          "Please select a store or category with a date range",
          "warning"
        );
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      showToast("Something went wrong while fetching filtered data", "error");
    } finally {
      setLoadingGraph(false);
    }
  };

  // Function to reset filters
  const handleReset = () => {
    setSelectedStore(""); // Reset store selection
    setSelectedState("All"); // Reset state to "All"
    setselectedCat(""); // Reset category selection
    setFromValue(dayjs(date)); // Reset 'from' date to today's date
    setToValue(dayjs(date)); // Reset 'to' date to today's date
    setFilteredStores(stores || []); // Reset filtered stores to the full list
    setReplData([]); // Clear the report data
    setTotalAmount(0); // Reset total sales
  };

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const [reportResponse, storesResponse, categoryResponse] =
          await Promise.all([
            fetchAllAdminReport(),
            fetchStores(),
            getCategories(),
          ]);
        console.log(reportResponse.data);

        if (reportResponse) {
          setReplData(reportResponse.data);
        } else {
          showToast("Something went wrong while fetching report data", "error");
        }

        if (storesResponse) {
          setStores(storesResponse.flat());
          setFilteredStores(storesResponse.flat());
          setTotalAmount(reportResponse.totalsales);
        } else {
          showToast("Something went wrong while fetching stores data", "error");
        }
        if (categoryResponse) {
          setCategory(categoryResponse.data);
        } else {
          showToast("Something went wrong while fetching categories", "error");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("Something went wrong while fetching data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

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
                  {/* State Dropdown */}
                  <Dropdown
                    showSearch
                    className="gap-0"
                    className2="bg-white border max-w-36 w-full overflow-hidden whitespace-nowrap text-ellipsis truncate min-w-32  h-[58px] flex justify-between items-center rounded-md"
                    label="State"
                    options={[{ state: "All" }, ...(stores || [])]}
                    placeholder="States"
                    onSelect={handleStateChange}
                    getLabel={(store) => store.state}
                    getSubLabel={() => ""}
                    id="state"
                  />

                  {/* Store Dropdown - Filters stores based on selected state */}
                  <Dropdown
                    showSearch
                    className="gap-0"
                    className2="bg-white border max-w-36 w-full overflow-hidden whitespace-nowrap text-ellipsis truncate min-w-32 h-[58px] flex justify-between items-center rounded-md"
                    label="Store"
                    options={filteredStores || []}
                    placeholder="Select Store"
                    onSelect={handleStoreChange}
                    getLabel={(store) => store.storeName}
                    getSubLabel={() => ""}
                    id="store"
                  />
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
                    <Button onClick={handleReset} variant="outlined">
                      Reset
                    </Button>
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
