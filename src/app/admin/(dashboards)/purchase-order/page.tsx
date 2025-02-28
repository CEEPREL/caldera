"use client";
import { PurchaseOrderButton } from "@/components/admin/PurchaseOrderButton";
import PurchaseOrderTableAdmin from "@/components/admin/purchaseOrderTableAdmin";
import MenuComponent from "@/components/store/general_UI/SmallMenuComp";

import React, { useState, useRef, useEffect, RefObject } from "react";

interface MenuItem {
  label: string;
  icon: string;
  actionType?: "link" | "button" | "div";
  href?: string;
}

const apiData = [
  {
    id: 1,
    productName: "iPhone X Screen",
    cadre: "Lagos 1",
    quantity: 10,
    note: "This product...",
    status: "Pending",
  },
  {
    id: 2,
    productName: "Samsung Battery",
    cadre: "Abuja 2",
    quantity: 5,
    note: "Urgent replacement needed.",
    status: "Pending",
  },
];

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

  const handleWindowBlur = () => {
    setOpenDropdownId(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      openDropdownId !== null &&
      dropdownRefs.current[openDropdownId] &&
      !dropdownRefs.current[openDropdownId]?.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest(".dropdown-toggle")
    ) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  const handleMenuItemClick = (label: string, row: any) => {
    if (label === "Confirm Order") {
    }
    setOpenDropdownId(null);
  };

  const columns = [
    { key: "id", label: "#" },
    { key: "productName", label: "Product Name" },
    { key: "cadre", label: "Cadre" },
    { key: "quantity", label: "Quantity" },
    { key: "note", label: "Note" },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      render: (row: any) => (
        <div className="relative">
          <button
            className="dropdown-toggle"
            onClick={() =>
              setOpenDropdownId(openDropdownId === row.id ? null : row.id)
            }
          >
            •••
          </button>
          {openDropdownId === row.id && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
              ref={(el) => {
                dropdownRefs.current[row.id] = el;
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
        <div>
          <PurchaseOrderTableAdmin columns={columns} data={apiData} />
        </div>
      </div>
    </div>
  );
}

export default Page;
