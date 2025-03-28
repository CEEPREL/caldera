"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import React, { useState } from "react";
import Menu from "../admin/Menu";

const getMenuItems = (basePath: string, storeId: string) => [
  {
    icon: "/icons/revenue.svg",
    label: "Report",
    href: `${basePath}/${storeId}/report`,
  },
  {
    icon: "/icons/daily_record.svg",
    label: "Daily Record",
    href: `${basePath}/${storeId}/daily-sales`,
  },
  {
    icon: "/icons/sales.svg",
    label: "Sales Record",
    href: `${basePath}/${storeId}/sales-record`,
  },
  {
    icon: "/icons/debt_mgt.svg",
    label: "Debt Management",
    href: `${basePath}/${storeId}/debt-management`,
  },
  // {
  //   icon: "/icons/Inventory.svg",
  //   label: "Inventory",
  //   href: `${basePath}/${storeId}/inventory`,
  // },
  {
    icon: "/icons/stock_mgt.svg",
    label: "Stock Management",
    href: `${basePath}/${storeId}/stock-management`,
  },
  {
    icon: "/icons/settings.svg",
    label: "Settings",
    href: `${basePath}/${storeId}/settings`,
  },
  {
    icon: "/icons/market.svg",
    label: "Market List",
    href: `${basePath}/${storeId}/market-list`,
  },
];

function StoreMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ storeId?: string }>();

  let storeId: string | undefined = params.storeId;

  if (!storeId) {
    const match =
      pathname.match(/stores\/([^/]+)/) || pathname.match(/caldera\/([^/]+)/);
    storeId = match?.[1];
  }

  const basePath = pathname.startsWith("/admin/stores")
    ? "/admin/stores"
    : "/caldera";

  const [selectedItem, setSelectedItem] = useState(pathname);

  const handleClick = (href: string) => {
    setSelectedItem(href);
    router.push(href);
  };

  if (!storeId) {
    return (
      <div className="text-gray-500 flex flex-col gap-6">
        <Menu />
      </div>
    );
  }

  const handleBackToStore = () => {
    router.push("/admin/stores");
  };

  const filteredMenuItems = pathname.includes("/admin")
    ? getMenuItems(basePath, storeId).filter(
        (item) => !["Settings", "Stock Management"].includes(item.label)
      )
    : getMenuItems(basePath, storeId);
  return (
    <div className="p-2 bg-white h-full flex flex-col gap-10">
      {/* Back Button for Admins */}
      {pathname.includes("/admin") ? (
        <button
          onClick={handleBackToStore}
          className="flex items-center gap-2 text-lg text-black font-semibold"
        >
          <Image
            src="/icons/curve_back.svg"
            alt="logo"
            width={20}
            height={20}
          />
          <span className="hidden lg:flex">Back to Store</span>
        </button>
      ) : (
        <Link
          href={`${basePath}/${storeId}/report`}
          className="flex items-center gap-2 text-lg text-black font-semibold"
        >
          <span className="text-2xl">Welcome</span>
        </Link>
      )}

      {/* Menu Items */}
      <div className="text-gray-500 flex flex-col gap-6">
        {filteredMenuItems.map((item) => (
          <Link
            key={item.label}
            className={`flex p-2 rounded-3xl gap-2 ${
              selectedItem === item.href ? "bg-selected" : ""
            }`}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleClick(item.href);
            }}
          >
            <Image src={item.icon} alt="" width={20} height={20} />
            <span className="hidden lg:block">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StoreMenu;
