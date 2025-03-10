"use client";

import { ChevronRight, ShoppingBasket } from "lucide-react";
import React, { useEffect, useState } from "react";
import DailySalesRec from "@/components/store/daily_sales/DailySalesRec";
import CartSlider from "@/components/store/daily_sales/CartSlider";
import OrderDetailSlider from "@/components/store/daily_sales/OrderDetailSlider";
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

const productList = ["10-03-2025"];

function Page() {
  const [openCart, setOpenCart] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Screen");
  const [toggle, setToggle] = useState(false);
  const [cart, setCart] = useState<Cart>({ cartItems: [] });
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Product 1", quantity: 1, price: 10.99 },
    { id: "2", name: "Product 2", quantity: 1, price: 5.99 },
    { id: "3", name: "Product 3", quantity: 1, price: 7.99 },
  ]);
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
      render: (row: any) => (
        <div>
          <button className="w-full bg-blue-500 text-center text-white hover:bg-blue-300 rounded-sm px-2 py-1 font-semibold">
            Add
          </button>

          <OrderDetailSlider
            isOpen={openDetail}
            onClose={() => setOpenDetail(false)}
            data={productRecordData}
            width="w-1/4"
            overlayColor="bg-black bg-opacity-50"
            drawerStyle="bg-white"
          />
        </div>
      ),
    },
  ];
  const handleAction = (row: any) => {
    console.log("Perform action on:", row);
    alert(`Action performed on ${row.productName}`);
  };
  const handleOnDelete = () => {
    console.log("Hi");
  };
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const hadleCart = async (product: Product) => {
    const { addToCart } = await import("@/lib/cart");
    addToCart({ item: product, cart, setCart });
    product.quantity += 1;
  };
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
                data={apiData}
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
