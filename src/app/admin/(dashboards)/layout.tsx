import { StoreProvider } from "@/ContextAPI/storeContex";
import DashboardContent from "./main";

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
