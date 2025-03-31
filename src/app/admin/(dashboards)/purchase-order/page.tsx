"use client";
import { getallOrderStatus } from "@/app/actions/fetch";
import { acceptAllOrder } from "@/app/actions/post";
import { PurchaseOrder } from "@/app/caldera/[storeId]/stock-management/page";
import AdminOrderDetailSlider from "@/components/admin/AdminOrderDetailSlider";
import PurchaseOrderTableAdmin from "@/components/admin/purchaseOrderTableAdmin";
import MenuComponent from "@/components/store/general_UI/SmallMenuComp";
import React, { useState, useEffect, useRef } from "react";
import SkeletonLoader from "../loading";
import ConfirmModal from "@/components/admin/MyComfirmation";
import { deletePo } from "@/app/actions/delete";
import { useToastContext } from "@/ContextAPI/toastContext";

interface MenuItem {
  label: string;
  icon: string;
  actionType?: "link" | "button" | "div";
  href?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "View Order",
    icon: "/icons/stores.svg",
    actionType: "button",
    href: "/admin/purchase-order/update-order",
  },
  {
    label: "Delete Order",
    icon: "/icons/delete.svg",
    actionType: "button",
  },
];

function Page() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  // const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [poData, setPoData] = useState<PurchaseOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder>();
  const [openDetail, setOpenDetail] = useState(false);
  const [openComfirm, setOpenComfirm] = useState<boolean>(false);
  const [poId, setPoId] = useState<string>("");
  const { showToast } = useToastContext();

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
      const payload = prepareOrderPayload(orderToConfirm, updatedProducts);

      const result = await acceptAllOrder(payload);
      if (result.status) {
        showToast("Order confirmed successfully");
      } else {
        showToast("Failed to confirm order", "error");
      }
    } else {
      console.error("Order not found for poId:", poId);
    }
  };

  const toggleDropdown = (rowId: string | null) => {
    setOpenDropdownId((prev) => (prev === rowId ? null : rowId));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest(".dropdown-toggle")
    ) {
      setOpenDropdownId(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDelete = async (poId: string) => {
    try {
      const response = await deletePo(poId);
      if (response) {
        showToast(response.message);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMenuItemClick = async (label: string, poId: string) => {
    if (label === "View Order") {
      const selectedOrder = poData.find((order) => order.poId === poId);
      setOpenDetail(true);
      setOpenDropdownId(null);
      setSelectedOrder(selectedOrder);
    }
    if (label === "Delete Order") {
      const selectedOrder = poData.find((order) => order.poId === poId);
      setOpenComfirm(true);
      setOpenDropdownId(null);
      setPoId(selectedOrder?.poId || "");
    }
  };

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
    const productRequests = updatedProducts.map((product) => ({
      prId: product.prId,
      quantity: product.quantity,
      unitPrice: product.unitPrice || 0,
      costPrice: product.costPrice || 0,
      outOfStock: product.outOfStock || 0,
    }));

    return {
      poId: order.poId,
      product: productRequests,
    };
  };

  const columns = [
    { key: "id", label: "#" },
    { key: "poId", label: "Order ID" },
    { key: "storeName", label: "Store Name" },
    { key: "requestDate", label: "Date" },
    { key: "productRequestCount", label: "No of Product" },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <div className="relative">
          <ConfirmModal
            message={`Are you sure you want to delete ${row.poId} from ${row.storeName}?`}
            isOpen={openComfirm}
            onConfirm={() => {
              handleDelete(poId);
              setOpenComfirm(false);
            }}
            onClose={() => setOpenComfirm(false)}
          />
          <button
            className="dropdown-toggle"
            onClick={() => toggleDropdown(row.poId)}
          >
            •••
          </button>
          {openDropdownId === row.poId && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
              ref={dropdownRef}
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
          )}
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
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Page;
