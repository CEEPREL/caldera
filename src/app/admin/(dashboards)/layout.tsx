import Menu from "@/components/admin/Menu";
import Navbar from "@/components/admin/Navbar";
import StoreMenu from "@/components/admin/StoreMenu";
import { useStore } from "@/ContextAPI/storeContex";
import { StoreProvider } from "@/ContextAPI/storeContex";
import DashboardContent from "./main";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <DashboardContent>{children}</DashboardContent>
    </StoreProvider>
  );
}
