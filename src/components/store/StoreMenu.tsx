"use client";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const menuItems = [
  { icon: "/icons/revenue.svg", label: "Report", href: "/report" },
  {
    icon: "/icons/daily_record.svg",
    label: "Daily Sales",
    href: "/daily-sales",
  },
  { icon: "/icons/sales.svg", label: "Sales Record", href: "/sales-record" },
  {
    icon: "/icons/debt_mgt.svg",
    label: "Debt Management",
    href: "/debt-management",
  },
  { icon: "/icons/inventory.svg", label: "Inventory", href: "/inventory" },
  {
    icon: "/icons/stock_mgt.svg",
    label: "Stock Management",
    href: "/stock-management",
  },
  { icon: "/icons/settings.svg", label: "Settings", href: "/settings" },
  { icon: "/icons/market.svg", label: "Market List", href: "/market-list" },
];

function StoreMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState(pathname);
  const handleClick = (item: string, href: string) => {
    setSelectedItem(item);
    router.push(href);
  };
  const welcomeRedirect = () => {
    redirect("/user/report");
  };
  return (
    <div className="p-2 bg-white h-full flex flex-col gap-10">
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
          <span className="hidden lg:flex ">Back to Store</span>
        </button>
      ) : (
        <Link
          href="/report"
          className="flex items-center gap-2 text-lg text-black font-semibold"
        >
          <span className="text-2xl">Welcome</span>
        </Link>
      )}
      <div className="text-gray-500 flex flex-col gap-6">
        {menuItems.map((item) => (
          <div className="flex flex-col gap-6" key={item.label}>
            <Link
              className={`flex p-2 rounded-3xl gap-2 ${
                selectedItem === item.href ? "bg-selected" : ""
              }`}
              href={item.href}
              onClick={() => handleClick(item.href, item.href)}
            >
              <Image
                className=""
                src={item.icon}
                alt=""
                width={20}
                height={20}
              />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoreMenu;
