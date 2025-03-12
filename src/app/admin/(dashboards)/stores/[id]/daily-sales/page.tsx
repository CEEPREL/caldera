"use client";

import { ChevronRight, ShoppingBasket } from "lucide-react";
import React, { useEffect, useState } from "react";
import DailySalesRec from "@/components/store/daily_sales/DailySalesRec";
// import CartSlider from "@/components/store/daily_sales/CartSlider";
// import OrderDetailSlider from "@/components/store/daily_sales/OrderDetailSlider";
// import CartSlider from "@/components/store/daily_rec/CartSlider";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Cart {
  cartItems: Product[];
}

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

const productRecordData = [
  {
    id: "1",
    productName: "iPhone X Screen",
    revenue: 5000,
    date: "2024-01-01",
    sales: 0,
    payment: "Out of Stock",
  },
  {
    id: "2",
    productName: "Samsung Battery",
    revenue: 3000,
    date: "2024-01-02",
    sales: 2,
    payment: "In Stock",
  },
  {
    id: "3",
    productName: "MacBook Charger",
    revenue: 8000,
    date: "2024-01-03",
    sales: 5,
    payment: "In Stock",
  },
];

const productList = [
  "Screen",
  "Downboard",
  "Battery",
  "Back Glass",
  "Touch Pad",
];

function Page() {
  // const [openCart, setOpenCart] = useState(false);
  // const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Screen");
  const [toggle, setToggle] = useState(false);
  const [cart, setCart] = useState<Cart>({ cartItems: [] });
  const [salesToggle, setSalesToggle] = useState<"daily" | "product">("daily");
  const handleToggle = (p: string) => {
    setToggle(!toggle);
    setSelectedProduct(p);
  };

  const columns = [
    { key: "id", label: "#" },
    { key: "productName", label: "Product" },
    { key: "sales", label: "Number of sales" },
    { key: "revenue", label: "Total Revenue" },

    {
      key: "action",
      label: "",
      render: () => (
        <div>
          <button onClick={() => console.log("true")} className={``}>
            <ChevronRight />
          </button>

          {/* <OrderDetailSlider
            isOpen={openDetail}
            onClose={() => setOpenDetail(false)}
            data={dailySalesData}
            width="w-1/4"
            overlayColor="bg-black bg-opacity-50"
            drawerStyle="bg-white"
          /> */}
        </div>
      ),
    },
  ];
  const handleAction = (row: any) => {
    console.log("Perform action on:", row);
    alert(`Action performed on ${row.productName}`);
  };
  // const handleOnDelete = () => {
  //   console.log("Hi");
  // };
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex gap-2 flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-medium">Daily Record</h1>

          <button onClick={() => console.log("true")} className="relative">
            <h1 className="flex text-xs -top-2 right-0 absolute w-5 h-5 items-center justify-center bg-red-400 text-white rounded-full">
              {}
            </h1>
            <div className="bg-gray-200 rounded-full p-1">
              <ShoppingBasket />
            </div>
          </button>
          {/* <CartSlider
            onDelete={handleOnDelete}
            isOpen={openCart}
            onClose={() => setOpenCart(false)}
            data={[]}
            width="w-1/4"
            overlayColor="bg-black bg-opacity-50"
            drawerStyle="bg-white"
          /> */}
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
                columns={columns}
                data={productRecordData}
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
                columns={columns}
                data={dailySalesData}
                onActionClick={handleAction}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
