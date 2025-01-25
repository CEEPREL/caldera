import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-row">
      <div className="bg-[#F5F2EA] md:w-1/12 lg:w-1/6 xl:w-1/6 w-1/6">
        <Menu />
      </div>
      <div className="w-5/6 overflow-scroll bg-white md:w-11/12 lg:w-5/6 xl:w-5/6">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
