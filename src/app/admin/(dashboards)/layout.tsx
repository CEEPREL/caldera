import Menu from "@/components/Menu";
import Navbar from "@/components/admin/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" h-screen flex flex-row">
      <div className=" md:w-1/12 lg:w-1/6 xl:w-1/6 w-1/6">
        <Menu />
      </div>
      <div className="w-5/6 px-5 bg-primary overflow-scroll  md:w-11/12 lg:w-5/6 xl:w-5/6">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
