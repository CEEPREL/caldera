"use client";

import { ShoppingBasket } from "lucide-react";
import React, { useEffect, useState } from "react";
import DailySalesRec from "@/components/store/daily_sales/DailySalesRec";
import CartSlider, {
  FormData,
} from "@/components/store/daily_sales/CartSlider";
import OrderDetailSlider from "@/components/store/daily_sales/OrderDetailSlider";
import { getInventoies, getSalesReport } from "@/app/actions/fetch";
import { useStore } from "@/ContextAPI/storeContex";
import { InventoryItem } from "../inventory/page";
import { useCart } from "@/ContextAPI/cartContext";
import {
  createSalesOrder,
  createSalesPayment,
  createSalesRefund,
} from "@/app/actions/post";
import SkeletonLoader from "@/app/admin/(dashboards)/loading";

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
  const { storeData } = useStore();
  const storeId = storeData?.data.storeId;
  const [cartSalesOpen, setCartSalesOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [salesReportData, setSalesReportData] = useState<Order[]>([]);
  const [viewDailyRec, setViewDailyRec] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerNumber: "",
    paid: "pending",
    product: [],
  });
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const [salesToggle, setSalesToggle] = useState<"daily" | "product">("daily");

  const { cart, removeFromCart, addToCart, updateQuantity } = useCart();

  const handleFormDataChange = (newFormData: FormData) => {
    setFormData(newFormData);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    // Ensure the quantity is always greater than 0
    if (quantity < 1) return;

    // Update the cart with the new quantity
    updateQuantity(productId, quantity);

    // Update the quantities state
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));

    // Update the product quantity in formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      product: prevFormData.product.map((product) =>
        product.productId === productId
          ? { ...product, quantity: quantity }
          : product
      ),
    }));
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
    { key: "productName", label: "Product Name" },
    { key: "price", label: " Price" },
    { key: "quantity", label: "Quantity" },
    { key: "total", label: "Total" },

    {
      key: "action",
      label: "",
      render: (row: InventoryItem) => (
        <div>
          <button
            onClick={() => handleAddToCart(row)}
            className="w-full bg-blue-500 text-center text-white hover:bg-blue-300 rounded-sm px-2 py-1 font-semibold"
          >
            Add
          </button>
        </div>
      ),
    },
  ];

  const handleAction = (row: any) => {
    alert(`Action performed on ${row.productName}`);
  };

  const handleAddToCart = (product: InventoryItem) => {
    const {
      productId,
      productName,
      categoryId,
      categoryName,
      price,
      quantity: availableQuantity,
    } = product;

    // Get the quantity from the quantities state or default to 1
    const userQuantity = quantities[productId] || 1;

    // Ensure the user is not adding more than the available stock
    if (userQuantity > availableQuantity) {
      alert(
        `Cannot add more than ${availableQuantity} items. Available stock: ${availableQuantity}`
      );
      return;
    }

    // Add to cart with the correct quantity
    addToCart({
      productId,
      productName,
      categoryId,
      categoryName,
      quantity: userQuantity,
      price,
    });

    // Update formData.product with the added product and its quantity
    setFormData((prevFormData) => ({
      ...prevFormData,
      product: [
        ...prevFormData.product,
        {
          productId: productId,
          productName: productName,
          categoryId: categoryId,
          categoryName: categoryName,
          price: price,
          quantity: userQuantity, // Set the correct quantity based on user input
        },
      ],
    }));

    // Optionally, update the quantities state again here if needed
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: userQuantity,
    }));
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

  const handleOnSubmit = async (formData: FormData, amount: number) => {
    try {
      setLoading(true);

      const res = await createSalesOrder(formData);
      const res2 = await createSalesPayment({
        amount: amount,
        orderId: res.data.data.orderId,
      });
      console.log(
        "Just wanna know what  is sent",
        {
          amount: amount,
          orderId: res.data.data.orderId,
        },
        res2
      );
      alert("Order processed!");
      // window.location.reload();
    } catch (error) {
      console.error("Error during order creation or payment:", error);
      alert("There was an error processing the order or payment.");
    } finally {
      setLoading(false);
    }
  };

  const refundAndPayment = async (
    orderData: { transactionId: string; quantity: number }[],
    amount: number,
    orderId: string
  ) => {
    try {
      setLoading(true);

      const refundData = orderData.map((item) => ({
        transactionId: item.transactionId,
        quantity: item.quantity,
      }));

      const res = await createSalesRefund(refundData);
      console.log("refundData:", refundData, "res:", res);

      const paymentResponse = await createSalesPayment({
        amount: amount,
        orderId: orderId,
      });
      console.log(
        "rres:",
        paymentResponse,
        "paymentResponse:",
        amount,
        orderId
      );

      console.log("Payment response:", paymentResponse);
      alert("Order processed successfully!");
    } catch (error) {
      console.error("Error in processing refund or payment:", error);
      alert("There was an error processing the order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("storeId: ", storeData);

    if (!storeId) return;

    const fetchPoData = async () => {
      setLoading(true);
      const result = await getInventoies(storeId);

      if (!result) {
        console.error("Unknown error fetching data");
      } else {
        setInventoryData(result);
      }
      setLoading(false);
    };

    fetchPoData();
  }, [storeId, storeData]);

  useEffect(() => {
    if (!storeId) return;
    const fetchPoData = async () => {
      setLoading(true);
      const result = await getSalesReport(storeId);

      if (!result) {
        console.error("Unknown error fetching data");
      } else if (typeof result === "string") {
        setSalesReportData([]);
      } else {
        setSalesReportData(result);
      }
      setLoading(false);
    };

    fetchPoData();
  }, [storeId]);

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex gap-2 flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl font-medium">Daily Record</h1>

          <button onClick={() => setCartSalesOpen(true)} className="relative">
            <h1 className="flex text-xs -top-2 right-0 absolute w-5 h-5 items-center justify-center bg-red-400 text-white rounded-full">
              {cart.length}
            </h1>
            <div className="bg-gray-200 rounded-full p-1">
              <ShoppingBasket />
            </div>
          </button>

          <CartSlider
            data={cart}
            isOpen={cartSalesOpen}
            onClose={() => setCartSalesOpen(false)}
            onDelete={removeFromCart}
            onQuantityChange={handleQuantityChange}
            onSubmit={handleOnSubmit}
            formData={formData}
            onFormDataChange={handleFormDataChange}
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

          {loading ? (
            <div className="flex items-center justify-center h-screen w-full">
              <SkeletonLoader />
            </div>
          ) : salesToggle === "daily" ? (
            <DailySalesRec
              columns={dailyRecTable}
              data={salesReportData}
              onActionClick={handleAction}
            />
          ) : (
            <DailySalesRec
              columns={productsTable}
              data={inventoryData}
              onActionClick={handleAction}
            />
          )}
        </div>

        <OrderDetailSlider
          mainOrder={viewDailyRec}
          isOpen={openDetail}
          onClose={() => setOpenDetail(false)}
          onSubmit={refundAndPayment}
          onDelete={handleOnDelete}
        />
      </div>
    </div>
  );
}

export default Page;
