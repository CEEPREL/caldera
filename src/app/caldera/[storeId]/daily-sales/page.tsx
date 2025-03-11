"use client";

import { ShoppingBasket } from "lucide-react";
import React, { useEffect, useState } from "react";
import DailySalesRec from "@/components/store/daily_sales/DailySalesRec";
import CartSlider from "@/components/store/daily_sales/CartSlider";
import OrderDetailSlider from "@/components/store/daily_sales/OrderDetailSlider";
import { getSalesReport } from "@/app/actions/fetch";
import { useStore } from "@/ContextAPI/storeContex";

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

const apiData = [
  {
    id: 1,
    productName: "iPhone X Screen",
    Purchased: 5000,
    price: 10,
    stock: 0,
    status: "out of stock",
  },
  {
    id: 2,
    productName: "Samsung Battery",
    Purchased: 3000,
    price: 5,
    stock: 2,
    status: "In Stock",
  },
  {
    id: 2,
    productName: "MacBook Charger",
    Purchased: 3000,
    price: 5,
    stock: 2,
    status: "In Stock",
  },
];

const dailySalesData = [
  {
    id: "1",
    date: "Today",
    revenue: 15000,
    quantity: 5,
    payment: "20 Products",
  },
  {
    id: "2",
    date: "Yesterday",
    revenue: 12000,
    quantity: 3,
    payment: "20 Products",
  },
  {
    id: " 3",
    date: "2024-01-03",
    revenue: 18000,
    quantity: 7,
    payment: "20 Products",
  },
];

const productList = [""];

function Page() {
  const { storeData } = useStore();
  const storeId = storeData?.data.storeId;
  const [openCart, setOpenCart] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Screen");
  const [salesReportData, setSalesReportData] = useState<Order[]>([]);
  const [toggle, setToggle] = useState(false);
  const [viewDailyRec, setViewDailyRec] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [salesToggle, setSalesToggle] = useState<"daily" | "product">("daily");
  const handleToggle = (p: string) => {
    setToggle(!toggle);
    setSelectedProduct(p);
  };

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
    { key: "customerName", label: "Customer Name" },
    { key: "customerNumber", label: "Customer Number" },
    { key: "paidAmount", label: "Paid" },
    { key: "costAmount", label: "Total Cost" },

    {
      key: "action",
      label: "",
      render: () => (
        <div>
          <button
            onClick={() => handleAction(row)}
            className="w-full bg-blue-500 text-center text-white hover:bg-blue-300 rounded-sm px-2 py-1 font-semibold"
          >
            Add
          </button>

          {loading ? (
            <p>loading</p>
          ) : (
            <OrderDetailSlider
              isOpen={openDetail}
              onClose={() => setOpenDetail(false)}
              data={salesReportData}
              width="w-1/4"
              overlayColor="bg-black bg-opacity-50"
              drawerStyle="bg-white"
            />
          )}
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

    console.log(orderId);

    // Wrap the order in an array before passing to setViewDailyRec
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

  const handleOnDelete = () => {
    console.log("Hi");
  };
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
    }
  }, []);

  useEffect(() => {
    if (!storeId) return;
    const fetchPoData = async () => {
      setLoading(true);
      const result = await getSalesReport("9033519996");

      if (!result) {
        console.error("Unknown error fetching data");
        console.log("ok no product");
      } else {
        setSalesReportData(result);
        console.log(result);
      }
      setLoading(false);
    };

    fetchPoData();
  }, [storeId]);

  // const hadleCart = async (product: Product) => {
  //   const { addToCart } = await import("@/lib/cart");
  //   addToCart({ item: product, cart, setCart });
  //   product.quantity += 1;
  // };
  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex gap-2 flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-medium">Daily Record</h1>

          <button onClick={() => setOpenCart(true)} className="relative">
            <h1 className="flex text-xs -top-2 right-0 absolute w-5 h-5 items-center justify-center bg-red-400 text-white rounded-full">
              3
            </h1>
            <div className="bg-gray-200 rounded-full p-1">
              <ShoppingBasket />
            </div>
          </button>
          <CartSlider
            onDelete={handleOnDelete}
            isOpen={openCart}
            onClose={() => setOpenCart(false)}
            data={dailySalesData}
            width="w-1/4"
            overlayColor="bg-black bg-opacity-50"
            drawerStyle="bg-white"
            form="show form"
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
          {salesToggle === "daily" ? (
            <div className="">
              <div className="flex gap-6">
                {productList.map((p, index) => (
                  <button
                    key={index}
                    onClick={() => handleToggle(p)}
                    className={`${
                      selectedProduct === p
                        ? "border-b-4 border-blue-400 font-semibold"
                        : ""
                    } p-2`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <DailySalesRec
                columns={dailyRecTable}
                data={salesReportData}
                onActionClick={handleAction}
              />
            </div>
          ) : (
            <div>
              {" "}
              <div className="flex gap-6">
                {productList.map((p, index) => (
                  <button
                    key={index}
                    onClick={() => handleToggle(p)}
                    className={`${
                      selectedProduct === p
                        ? "border-b-4 border-blue-400 font-semibold"
                        : ""
                    } p-2`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <DailySalesRec
                columns={productsTable}
                data={apiData}
                onActionClick={handleAction}
              />
            </div>
          )}
        </div>
        <OrderDetailSlider
          isOpen={openDetail}
          onClose={() => setOpenDetail(false)}
          mainOrder={viewDailyRec || []}
          width="w-1/4"
          overlayColor="bg-black bg-opacity-50"
          drawerStyle="bg-white"
        />
      </div>
    </div>
  );
}

export default Page;
