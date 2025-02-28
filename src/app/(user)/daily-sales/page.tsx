"use client";

import { ChevronRight, ShoppingBasket } from "lucide-react";
import React, { useEffect, useState } from "react";
import DailySalesRec from "@/components/ui-utils/DailySalesRec";
import CartSlider from "@/components/user/CartSlider";

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
    totalSales: 15000,
    totalOrders: 5,
    status: "20 Products",
  },
  {
    id: "2",
    date: "Yesterday",
    totalSales: 12000,
    totalOrders: 3,
    status: "20 Products",
  },
  {
    id: " 3",
    date: "2024-01-03",
    totalSales: 18000,
    totalOrders: 7,
    status: "20 Products",
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
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Screen");
  const [toggle, setToggle] = useState(false);
  const [cart, setCart] = useState<Cart>({ cartItems: [] });
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Product 1", quantity: 1, price: 10.99 },
    { id: "2", name: "Product 2", quantity: 1, price: 5.99 },
    { id: "3", name: "Product 3", quantity: 1, price: 7.99 },
  ]);
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
          <button onClick={() => setOpen(true)} className={``}>
            <ChevronRight />
          </button>

          <CartSlider
            isOpen={open}
            onClose={() => setOpen(false)}
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

          <button onClick={() => setOpen(true)} className="relative">
            <h1 className="flex text-xs -top-2 right-0 absolute w-5 h-5 items-center justify-center bg-red-400 text-white rounded-full">
              {}
            </h1>
            <div className="bg-gray-200 rounded-full p-1">
              <ShoppingBasket />
            </div>
          </button>
        </div>

        <div className="gap-2 flex flex-col">
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
      </div>
    </div>
  );
}

export default Page;
