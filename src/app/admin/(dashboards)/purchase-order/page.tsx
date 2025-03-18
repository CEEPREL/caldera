"use client";
import { getallOrderStatus } from "@/app/actions/fetch";
import { PurchaseOrder } from "@/app/caldera/[storeId]/stock-management/page";
import PurchaseOrderTableAdmin from "@/components/admin/purchaseOrderTableAdmin";
import MenuComponent from "@/components/store/general_UI/SmallMenuComp";

import React, { useState, useRef, useEffect, useCallback } from "react";

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
    actionType: "link",
    href: "/admin/purchase-order/update-order",
  },
  {
    label: "View Store",
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

  const handleWindowBlur = () => {
    setOpenDropdownId(null);
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        openDropdownId !== null &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId]?.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".dropdown-toggle")
      ) {
        setOpenDropdownId(null);
      }
    },
    [openDropdownId]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [openDropdownId, handleClickOutside]);

  const handleMenuItemClick = (label: string) => {
    if (label === "Confirm Order") {
    }
    setOpenDropdownId(null);
  };

  useEffect(() => {
    const fetchPoData = async () => {
      setLoadingProducts(true);
      const result = await getallOrderStatus();
      if (!result.status) {
        console.error(result.error || "Unknown error");
      } else {
        setPoData(result.data);
        console.log("podata: ", result.data);
      }
      setLoadingProducts(false);
    };

    fetchPoData();
  }, []);

  const columns = [
    { key: "id", label: "#" },
    { key: "poId", label: "Order ID" },
    { key: "storeName", label: "Cadre" },
    { key: "requestDate", label: " Date" },
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
          {openDropdownId === row.poId && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
              ref={(el) => {
                dropdownRefs.current[row.poId] = el;
              }}
            >
              <div className="flex flex-col gap-2 p-2">
                <MenuComponent
                  menuItems={menuItems}
                  onMenuItemClick={handleMenuItemClick}
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
          <p>Loadiing</p>
        ) : (
          <div>
            <PurchaseOrderTableAdmin columns={columns} data={poData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
