"use client";
import { getallOrderStatus } from "@/app/actions/fetch";
import { acceptAllOrder } from "@/app/actions/post";
import { PurchaseOrder } from "@/app/caldera/[storeId]/stock-management/page";
import AdminOrderDetailSlider from "@/components/admin/AdminOrderDetailSlider";
import PurchaseOrderTableAdmin from "@/components/admin/purchaseOrderTableAdmin";
import MenuComponent from "@/components/store/general_UI/SmallMenuComp";
import React, { useState, useEffect, useRef } from "react";
import SkeletonLoader from "../loading";

interface MenuItem {
  label: string;
  icon: string;
  actionType?: "link" | "button" | "div";
  href?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "Confirm Order",
    icon: "/icons/brief_case.svg",
    actionType: "button",
    href: "/admin/purchase-order/update-order",
  },
  {
    label: "View Order",
    icon: "/icons/stores.svg",
    actionType: "link",
    href: "/settings",
  },
  {
    label: "Remove Order",
    icon: "/icons/delete.svg",
    actionType: "button",
  },
];

function Page() {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [poData, setPoData] = useState<PurchaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder>();
  const [openDetail, setOpenDetail] = useState(false);
  // const { cart, setCart, removeFromCart, addToCart } = useCart();

  // const productOrders = cart.map(
  //   ({
  //     categoryId,
  //     orderId,
  //     userName,
  //     storeName,
  //     categoryName,
  //     productId,
  //     productName,
  //     quantity,
  //     price,
  //   }) => ({
  //     categoryId,
  //     categoryName,
  //     orderId,
  //     price,
  //     userName,
  //     storeName,
  //     productId,
  //     productName,
  //     requestQuantity: quantity,
  //   })
  // );

  // Fetch purchase order data
  useEffect(() => {
    const fetchPoData = async () => {
      setLoadingProducts(true);
      const result = await getallOrderStatus();
      if (!result.status) {
        console.error(result.error || "Unknown error");
      } else {
        setPoData(result.data);
      }
      setLoadingProducts(false);
    };

    fetchPoData();
  }, []);

  // Handle submit for confirming the order
  const handleSubmit = async (
    updatedProducts: {
      prId: string;
      quantity: number;
      unitPrice: number;
      costPrice: number;
      outOfStock: number;
    }[],
    poId: string
  ) => {
    const orderToConfirm = poData.find((order) => order.poId === poId);
    if (orderToConfirm) {
      // Transform the updatedProducts to match the expected shape
      const payload = prepareOrderPayload(orderToConfirm, updatedProducts);
      console.log("hi", payload);

      const result = await acceptAllOrder(payload);
      if (result.status) {
        alert("Order confirmed successfully");
      } else {
        alert("Failed to confirm order");
      }
    } else {
      console.error("Order not found for poId:", poId);
    }
  };

  const handleDelete = () => {};

  const handleMenuItemClick = async (label: string, poId: string) => {
    if (label === "Confirm Order") {
      const selectedOrder = poData.find((order) => order.poId === poId);
      setOpenDetail(true);
      setOpenDropdownId(null);
      setSelectedOrder(selectedOrder);
    }
  };

  // Prepare order payload with simplified product data
  const prepareOrderPayload = (
    order: PurchaseOrder,
    updatedProducts: {
      prId: string;
      quantity: number;
      unitPrice: number;
      costPrice: number;
      outOfStock: number;
    }[]
  ) => {
    // Convert updatedProducts (with explicit typing) into the expected structure
    const productRequests = updatedProducts.map((product) => ({
      prId: product.prId, // Extract prId
      quantity: product.quantity, // Extract quantity
      unitPrice: product.unitPrice || 0, // Set unitPrice (default to 0 if undefined)
      costPrice: product.costPrice || 0, // Set costPrice (default to 0 if undefined)
      outOfStock: product.outOfStock || 0,
    }));

    return {
      poId: order.poId,
      product: productRequests, // This is now the correct shape expected by onSubmit
    };
  };

  // Columns definition for the Purchase Order Table
  const columns = [
    { key: "id", label: "#" },
    { key: "poId", label: "Order ID" },
    { key: "storeName", label: "Cadre" },
    { key: "requestDate", label: "Date" },
    { key: "productRequestCount", label: "No of Product" },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <div className="relative">
          <button
            className="dropdown-toggle"
            onClick={() =>
              setOpenDropdownId(openDropdownId === row.poId ? null : row.poId)
            }
          >
            •••
          </button>
          {openDropdownId === row.poId ? (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
              ref={(el) => {
                dropdownRefs.current[row.poId] = el;
              }}
            >
              <div className="flex flex-col gap-2 p-2">
                <MenuComponent
                  menuItems={menuItems}
                  onMenuItemClick={(label: string) =>
                    handleMenuItemClick(label, row.poId)
                  }
                  product={row}
                />
              </div>
            </div>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-[88%] bg-white text-black overflow-y-scroll p-5 rounded-3xl">
      <div className="flex flex-col">
        <h1 className="text-2xl font-medium">Purchase Order</h1>
        {loadingProducts ? (
          <div className="flex items-center justify-center h-screen w-full">
            <SkeletonLoader />
          </div>
        ) : (
          <PurchaseOrderTableAdmin columns={columns} data={poData} />
        )}
      </div>
      <AdminOrderDetailSlider
        mainOrder={selectedOrder || null}
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        onSubmit={handleSubmit} // Passing handleSubmit to child component
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Page;
