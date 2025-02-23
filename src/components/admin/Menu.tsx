"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const menuItems = [
  { icon: "/icons/revenue.svg", label: "Report", href: "/admin/report" },
  { icon: "/icons/stores.svg", label: "Stores", href: "/admin/stores" },
  { icon: "/icons/team.svg", label: "Team", href: "/admin/team" },
  { icon: "/icons/settings.svg", label: "Settings", href: "/admin/settings" },
];

function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState(pathname);
  const handleClick = (item: string, href: string) => {
    setSelectedItem(item);
    router.push(href);
  };
  return (
    <div className="p-2 h-full bg-white flex flex-col gap-10">
      <Link href="/admin/revenue" className=" text-lg text-black font-semibold">
        Admin
      </Link>
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

export default Menu;
