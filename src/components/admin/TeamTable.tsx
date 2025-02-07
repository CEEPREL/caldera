import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TeamProfileSlider from "./TeamPeofileSlider";
import AddTeamSlider from "./AddTeamSlider";
// import { addTeamAction, TeamData } from "@/app/actions/addTeam";
import { states } from "./AddTeamSlider";
import { FormData } from "./AddTeamSlider";

interface Product {
  id: number;
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
  { label: "Remove User", icon: "/icons/delete.svg" },
];
export const tempProducts: Product[] = [
  {
    id: 1,
    fullName: "Adebowale Olaniyan",
    cadre: "Lagos",
    registered: "2024-01-01",
    phoneNumber: "08123456789",
    status: "Active",
    url: "/images/profile.png",
    email: "adebowale@gmail.com",
    active: true,
    userName: "adebowale",
    password: "password",
    confirmPassword: "password",
    state: "Lagos",
    location: "Lagos",
    manager: "Adebowale Olaniyan",
    profilePic: "/images/profile.png",
  },
  {
    id: 2,
    fullName: "Ellena James",
    cadre: "Abuja",
    registered: "2024-01-01",
    phoneNumber: "08123456789",
    status: "Inactive",
    url: "/images/profile.png",
    email: "ellena@gmail.com",
    active: false,
    confirmPassword: "password",
    state: "Lagos",
    location: "Lagos",
    manager: "Adebowale Olaniyan",
    profilePic: "/images/profile.png",
    userName: "ellena",
    password: "password",
  },
  {
    id: 3,
    fullName: "Ayodele Oluwaseyi",
    cadre: "Ogun",
    registered: "2024-01-01",
    phoneNumber: "08123456789",
    status: "Active",
    url: "/images/profile.png",
    email: "ayodele@gmail.com",
    active: true,
    userName: "ayodele",
    password: "password",
    confirmPassword: "password",
    state: "Ogun",
    location: "Ogun",
    manager: "Adebowale Olaniyan",
    profilePic: "/images/profile.png",
  },
];

export default function TeamTable({
  data,
  setData,
}: {
  data: FormData[];
  setData: React.Dispatch<React.SetStateAction<FormData[]>>;
}) {
  const [extraRows, setExtraRows] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuItem, setMenuItem] = useState(menuItems);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id: data.length + 1,
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
    profilePic: "/images/profile.png",
    registered: new Date().toLocaleDateString(),
    status: "Active",
    url: "/images/profile.png",
    active: true,
  });
  const [activeStatus, setActiveStatus] = useState<string>("Active");
  const handleAddRow = () => {
    setExtraRows(extraRows + 1);
  };
  const handleMenuItemClick = (label: string, product: Product) => {
    if (label === "User Activity") {
      setSelectedProfileId(product.id);
      setOpenProfile(true);
      setOpenEdit(false);
    } else if (label === "Edit Profile") {
      setSelectedProfileId(product.id);
      setOpenEdit(true);
      setOpenProfile(false);
    } else if (label === "Deactivate User" || label === "Activate User") {
      setData((prevData) =>
        prevData.map((user) =>
          user.id === product.id
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

    setOpenDropdownId(null); // Close the dropdown
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (formData: Product) => {
    setLoading(true);
    setErrorMessage(null);

    // try {
    //   // Passing formData to addTeamAction, structuring the data to match API expectations
    //   const result = await addTeamAction(
    //     {
    //       fullName: formData.fullName,
    //       email: formData.email,
    //       password: formData.password,
    //       phoneNumber: formData.phoneNumber,
    //       userName: formData.userName,
    //     },
    //     null
    //   );

    //   console.log(result);
    // } catch (error) {
    //   console.error("Error adding team member:", error);
    // }
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
              <tr key={product.id} className=" relative border-b">
                <td className=" justify-start items-center h-12 text-gray-400 text-xs flex w-14 p-2">
                  <span className="text-black pr-1">
                    {" "}
                    <input className="" type="checkbox" />
                  </span>

                  {index + 1}
                </td>
                <td
                  className={`absolute top-[8px] w-[75%] left-0 ${
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
                      src={product.url}
                      alt={product.fullName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="text-black ml-2">{product.fullName}</span>
                  </div>
                  {selectedProfileId === product.id &&
                    menuItem[0]?.label === "User Activity" && (
                      <div className="flex flex-col gap-2">
                        <TeamProfileSlider
                          isOpen={openProfile}
                          onClose={() => {
                            setOpenProfile(false);
                          }}
                          id={product.id}
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
                  {selectedProfileId === product.id &&
                    menuItem[1]?.label === "Edit Profile" && (
                      <div className="">
                        <AddTeamSlider
                          isOpen={openEdit}
                          onClose={() => {
                            setOpenEdit(false);
                          }}
                          id={product.id}
                          tittle="Edit Team Member"
                          formData={formData}
                          role={product.cadre}
                          onChange={handleChange}
                          onSubmit={handleSubmit}
                          loading={loading}
                          errorMessage={errorMessage}
                          options={states}
                          // width="w-1/4"
                          // overlayColor="bg-black bg-opacity-50"
                          // drawerStyle="bg-white"
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
                        {menuItems.map((item, index) => {
                          let isDeactivate = item.label === "Deactivate User";
                          let isActive = product.status === "Activate User";
                          let newLabel =
                            product.status === "Active" && isDeactivate
                              ? "Deactivate User"
                              : product.status === "Inactive" && isDeactivate
                              ? "Deactivate User"
                              : item.label;
                          let newIcon =
                            product.status === "Active" && isDeactivate
                              ? "/icons/deactivate.svg"
                              : product.status === "Deactivated" && isDeactivate
                              ? "/icons/activate.svg"
                              : item.icon;

                          return (
                            <div
                              key={index}
                              onClick={() =>
                                handleMenuItemClick(newLabel, product)
                              }
                              className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border hover:border-gray-500 transition cursor-pointer"
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
                            </div>
                          );
                        })}
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
