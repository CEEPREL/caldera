"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

// Function to generate menu items dynamically
const getMenuItems = (basePath: string, storeId: string) => [
  {
    icon: "/icons/revenue.svg",
    label: "Report",
    href: `${basePath}/${storeId}/report`,
  },
  {
    icon: "/icons/daily_record.svg",
    label: "Daily Sales",
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
  {
    icon: "/icons/inventory.svg",
    label: "Inventory",
    href: `${basePath}/${storeId}/inventory`,
  },
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

function StoreMenu({ params }: { params: { storeId: string } }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState(pathname);

  // Determine if the user is in `/caldera` (user) or `/admin`
  const basePath = pathname.includes("/admin") ? "/admin" : "/caldera";

  // Handle menu click
  const handleClick = (href: string) => {
    setSelectedItem(href);
    router.push(href);
  };

  return (
    <div className="p-2 bg-white h-full flex flex-col gap-10">
      {/* Back Button for Admins */}
      {pathname.includes("/admin") ? (
        <button
          onClick={() => router.back()}
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
          href={`${basePath}/${params.storeId}/report`}
          className="flex items-center gap-2 text-lg text-black font-semibold"
        >
          <span className="text-2xl">Welcome</span>
        </Link>
      )}

      {/* Menu Items */}
      <div className="text-gray-500 flex flex-col gap-6">
        {getMenuItems(basePath, params.storeId).map((item) => (
          <div className="flex flex-col gap-6" key={item.label}>
            <Link
              className={`flex p-2 rounded-3xl gap-2 ${
                selectedItem === item.href ? "bg-selected" : ""
              }`}
              href={item.href}
              onClick={() => handleClick(item.href)}
            >
              <Image src={item.icon} alt="" width={20} height={20} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoreMenu;
