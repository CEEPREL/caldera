import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Product {
  id: number;
  name: string;
  cadre: string;
  registered: string;
  phoneNo: string;
  status: string;
  url: string;
}
const menuItems = [
  { label: "User Activity", icon: "/icons/brief_case.svg" },
  { label: "Edit Profile", icon: "/icons/user_icon.svg" },
  { label: "Deactivate User", icon: "/icons/deactivate.svg" },
  { label: "Remove User", icon: "/icons/delete.svg" },
];
const products: Product[] = [
  {
    id: 1,
    name: "Adebowale Olaniyan",
    cadre: "Lagos",
    registered: "2024-01-01",
    phoneNo: "08123456789",
    status: "Active",
    url: "/images/profile.png",
  },
  {
    id: 2,
    name: "Ellena James",
    cadre: "Abuja",
    registered: "2024-01-01",
    phoneNo: "08123456789",
    status: "Inactive",
    url: "/images/profile.png",
  },
  {
    id: 3,
    name: "Ayodele Oluwaseyi",
    cadre: "Ogun",
    registered: "2024-01-01",
    phoneNo: "08123456789",
    status: "Active",
    url: "/images/profile.png",
  },
];

export default function TeamTable() {
  const [data, setData] = useState(products);
  const [extraRows, setExtraRows] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddRow = () => {
    setExtraRows(extraRows + 1);
  };

  const toggleDropdown = (rowId: number | null) => {
    setOpenDropdownId((prev) => (prev === rowId ? null : rowId));
    setTimeout(() => {
      setOpenDropdownId((prev) => (prev === rowId ? null : rowId));
    }, 0);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !(event.target as HTMLElement).closest(".dropdown-toggle")
    ) {
      setOpenDropdownId(null);
    }
  };
  const handleWindowBlur = () => {
    setOpenDropdownId(null);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("blur", handleWindowBlur);
    return () => {
      // document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  const handleDeleteRow = (id: number) => {
    setData(data.filter((product) => product.id !== id));
  };

  return (
    <div className="">
      <table className="w-full border-collapse shadow-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className=" p-2">#</th>
            <th className=" p-2">Name</th>
            <th className=" p-2">Cadre</th>
            <th className=" p-2">Registered </th>
            <th className=" p-2">Phone No.</th>
            <th className=" p-2">Status</th>
            <th className=" p-2"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((product, index) =>
            product.name ? (
              <tr key={product.id} className=" border-b">
                <td className="justify-start items-center h-12 text-gray-400 text-xs flex w-14 p-2">
                  <span className="text-black pr-1">
                    {" "}
                    <input className="" type="checkbox" />
                  </span>

                  {index + 1}
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <Image
                      src={product.url}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="text-black ml-2">{product.name}</span>
                  </div>
                </td>
                <td className=" p-2">
                  <span className={`px-2 py-1 border bg-yellow-50 rounded-3xl`}>
                    {product.cadre}
                  </span>
                </td>
                <td className=" p-2">{product.registered}</td>
                <td className=" p-2">{product.phoneNo}</td>
                <td className=" p-2">
                  <span
                    className={`px-2 py-1 border border-green-800 rounded-3xl ${
                      product.status === "Active"
                        ? "bg-green-50 text-green-800"
                        : product.status === "Inactive"
                        ? "bg-gray-200 text-gray-500"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {product.status === "Active"
                      ? "Active"
                      : product.status === "Inactive"
                      ? "Inactive"
                      : "Pending"}
                  </span>
                </td>
                <td className=" p-2 relative text-indigo-600 cursor-pointer">
                  <button
                    className=" pr-1"
                    onClick={(e) => {
                      toggleDropdown(product.id);
                    }}
                  >
                    •••
                  </button>
                  {openDropdownId === product.id && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
                      ref={dropdownRef}
                    >
                      <div className="flex flex-col gap-2 p-2">
                        {menuItems.map((item, index) => (
                          <div
                            key={index}
                            // onClick={() => handleMenuItemClick(item.label)}
                            className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border hover:border-gray-500 transition cursor-pointer"
                          >
                            <Image
                              src={item.icon}
                              alt={item.label}
                              width={14}
                              height={14}
                            />
                            <h1 className="text-sm text-gray-700">
                              {item.label}
                            </h1>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ) : null
          )}

          {/* Extra Rows for Adding More */}
          {[...Array(extraRows)].map((_, i) => (
            <tr key={data.length + i + 1} className="border bg-gray-50">
              <td className="border p-2">{data.length + i + 1}</td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
              <td className="border p-2"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
