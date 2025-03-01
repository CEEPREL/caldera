import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TeamProfileSlider from "./TeamProfileSlider";
import AddTeamSlider from "./AddTeamSlider";
import { states } from "./AddTeamSlider";
import { FormData } from "./AddTeamSlider";
import { deleteStaff } from "@/app/actions/delete";
import { Trash2 } from "lucide-react";
import Confirm from "@/components/store/general_UI/ConfirmBox";
// import { randomUUID } from "crypto";

interface Product {
  userId: string;
  // name: string;
  cadre: string;
  registered: string;
  // phoneNo: string;
  status: string;
  url: string;
  email: string;
  active: boolean;
  fullName: string;
  phoneNumber: string;
  userName: string;
  password: string;
  confirmPassword: string;
  state: string;
  location: string;
  manager: string;
  profilePic: string;
}
const menuItems = [
  { label: "User Activity", icon: "/icons/brief_case.svg" },
  { label: "Edit Profile", icon: "/icons/user_icon.svg" },
  { label: "Deactivate User", icon: "/icons/deactivate.svg" },
  { label: "Remove Staff", icon: "/icons/delete.svg" },
];

export default function TeamTable({
  data,
  setData,
}: {
  data: FormData[];
  setData: React.Dispatch<React.SetStateAction<FormData[]>>;
}) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );
  // const [deleting, setDeleting] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuItem, setMenuItem] = useState(menuItems);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    userId: crypto.randomUUID(),
    fullName: "",
    email: "",
    state: "",
    location: "",
    manager: "",
    phoneNumber: "",
    cadre: "",
    userName: "",
    password: "",
    confirmPassword: "",
    profilePic: "/icons/user_icon.svg",
    registered: new Date().toLocaleDateString(),
    status: "Active",
    url: "/icons/user_icon.svg",
    active: true,
  });
  const [activeStatus, setActiveStatus] = useState<string>("Active");

  const handleDelStaff = async (id: string) => {
    try {
      // setDeleting(id);
      const response = await deleteStaff(id);
      alert(response.message);
    } catch (error) {
      console.error("Failed to delete staff:", error);
      alert("Error deleting staff");
    } finally {
      // setDeleting(null);
      console.error(errorMessage);
    }
  };

  const handleMenuItemClick = async (label: string, product: Product) => {
    if (loading) return;
    if (label === "User Activity") {
      setSelectedProfileId(product.userId);
      setOpenProfile(true);
      setOpenEdit(false);
    } else if (label === "Edit Profile") {
      setSelectedProfileId(product.userId);
      setOpenEdit(true);
      setOpenProfile(false);
    } else if (label === "Remove Staff") {
      await handleDelStaff(product.userId); // Call handleDelStaff asynchronously with the product.userId
    } else if (label === "Deactivate User" || label === "Activate User") {
      setLoading(true);
      setData((prevData) =>
        prevData.map((user) =>
          user.userId.toString() === product.userId
            ? {
                ...user,
                status:
                  user.status === "Active"
                    ? "Deactivated"
                    : user.status === "Inactive"
                    ? "Deactivated"
                    : "Active",
              }
            : user
        )
      );
      setOpenEdit(false);
      setOpenProfile(false);
    } else {
      setSelectedProfileId(null);
      setOpenProfile(false);
      setOpenEdit(false);
    }

    setOpenDropdownId(null);
  };

  const toggleDropdown = (rowId: string | null) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (formData: Product) => {
    setLoading(true);
    setErrorMessage(null);
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
            product.fullName ? (
              <tr key={product.userId} className=" relative border-b">
                <td className=" justify-start items-center h-12 text-gray-400 text-xs flex w-14 p-2">
                  <span className="text-black pr-1">
                    {" "}
                    <input className="" type="checkbox" />
                  </span>

                  {index + 1}
                </td>
                <td
                  className={`absolute top-[8px] h-[90%] w-[75%] left-0 ${
                    product.status === "Active"
                      ? "opacity-0 "
                      : product.status === "Deactivated"
                      ? "opacity-80  bg-white"
                      : "opacity-0"
                  } h-12 `}
                />

                <td className="p-2">
                  <div className="flex items-center">
                    <Image
                      src={product.url || "/icons/user_icon.svg"}
                      alt={product.fullName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="text-black ml-2">{product.fullName}</span>
                  </div>
                  {selectedProfileId === product.userId &&
                    menuItem[0]?.label === "User Activity" && (
                      <div className="flex flex-col gap-2">
                        <TeamProfileSlider
                          isOpen={openProfile}
                          onClose={() => {
                            setOpenProfile(false);
                          }}
                          id={product.userId}
                          name={product.fullName}
                          phone={product.phoneNumber}
                          role={product.cadre}
                          imageUrl={product.url}
                          salesPick={0}
                          activeDays={0}
                          offlineDays={0}
                          width="w-1/4"
                          overlayColor="bg-black bg-opacity-50"
                          drawerStyle="bg-white"
                        />
                      </div>
                    )}
                  {selectedProfileId === product.userId &&
                    menuItem[1]?.label === "Edit Profile" && (
                      <div className="">
                        <AddTeamSlider
                          isOpen={openEdit}
                          onClose={() => {
                            setOpenEdit(false);
                          }}
                          id={product.userId}
                          tittle="Edit Team Member"
                          formData={formData}
                          role={product.cadre}
                          onChange={handleChange}
                          onSubmit={handleSubmit}
                          loading={loading}
                          errorMessage={errorMessage}
                          options={states}
                        />
                      </div>
                    )}
                </td>
                <td className=" p-2">
                  <span className={`px-2 py-1 border bg-yellow-50 rounded-3xl`}>
                    {product.cadre}
                  </span>
                </td>
                <td className=" p-2">{product.registered}</td>
                <td className=" p-2">{product.phoneNumber}</td>

                <td className=" p-2">
                  <span
                    className={`px-2 py-1 border border-green-800 rounded-3xl ${
                      product.status === "Active"
                        ? "bg-green-50 text-green-800"
                        : product.status === activeStatus
                        ? "bg-gray-200 text-gray-500"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {product.status === "Active"
                      ? "Active"
                      : product.status === "Inactive"
                      ? "Inactive"
                      : product.status === "Deactivated"
                      ? "Deactivated"
                      : "Active"}
                  </span>
                </td>
                <td className=" p-2 relative text-indigo-600 cursor-pointer">
                  <button
                    className=" pr-1"
                    onClick={() => {
                      toggleDropdown(product.userId);
                    }}
                  >
                    •••
                  </button>
                  {openDropdownId === product.userId && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
                      ref={dropdownRef}
                    >
                      <div className="flex flex-col gap-2 p-2">
                        {menuItems.map((item, index) => {
                          let isDeactivate = item.label === "Deactivate User";
                          let isActive = product.status === "Activate User";
                          let newLabel =
                            product.status === "Active" && isDeactivate
                              ? "Deactivate User"
                              : product.status === "Deactivated" && isDeactivate
                              ? "Activate User"
                              : item.label;
                          let newIcon =
                            product.status === "Active" && isDeactivate
                              ? "/icons/deactivate.svg"
                              : product.status === "Deactivated" && isDeactivate
                              ? "/icons/activate.svg"
                              : item.icon;

                          return (
                            <>
                              {item.label === "Remove Staff" ? (
                                <Confirm
                                  message={`Are you sure you want to delete ${product.fullName}?`}
                                  button={
                                    <button className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border-gray-500 transition cursor-pointer">
                                      <Trash2 className="text-red-600" />
                                      <h1 className="text-sm text-gray-700">
                                        Remove Staff
                                      </h1>
                                    </button>
                                  }
                                  onConfirm={() =>
                                    handleDelStaff(product.userId)
                                  }
                                />
                              ) : (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleMenuItemClick(newLabel, product)
                                  }
                                  className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border-gray-500 transition cursor-pointer"
                                >
                                  <Image
                                    src={newIcon}
                                    alt={newLabel}
                                    width={14}
                                    height={14}
                                  />
                                  <h1 className="text-sm text-gray-700">
                                    {newLabel}
                                  </h1>
                                </button>
                              )}
                            </>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  );
}
