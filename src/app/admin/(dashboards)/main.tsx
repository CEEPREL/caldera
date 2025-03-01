"use client";
import Menu from "@/components/admin/Menu";
import Navbar from "@/components/admin/Navbar";
import StoreMenu from "@/components/store/StoreMenu";

import { useStore } from "@/ContextAPI/storeContex";

export default function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { storeId } = useStore();
  const isStorePage = !!storeId;

  return (
    <div className="h-screen flex flex-row">
      <div className="md:w-1/12 lg:w-1/6 xl:w-1/6 w-1/6">
        {isStorePage ? <StoreMenu /> : <Menu />}
      </div>
      <div className="w-5/6 px-5 bg-primary !bg-[#f1ede5] overflow-scroll md:w-11/12 lg:w-5/6 xl:w-5/6">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
