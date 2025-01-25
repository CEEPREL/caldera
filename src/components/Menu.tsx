import Image from "next/image";
import Link from "next/link";
import React from "react";

const menuItems = [
  { icon: "/icons/revenue.svg", label: "Revenue", href: "/admin/revenue" },
  { icon: "/icons/stores.svg", label: "Stores", href: "/admin/stores" },
  { icon: "/icons/team.svg", label: "Team", href: "/admin/team" },
  { icon: "/icons/settings.svg", label: "Settings", href: "/admin/settings" },
];

function Menu() {
  return (
    <div className="p-2 flex flex-col gap-10">
      <h1 className=" text-lg font-semibold">Admin</h1>
      <div className="text-gray-500 flex flex-col gap-6">
        {menuItems.map((item) => (
          <div className=" flex flex-col gap-6" key={item.label}>
            <Link className="flex gap-2" href={item.href}>
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
