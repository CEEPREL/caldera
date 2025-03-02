import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TeamProfileSlider from "./TeamProfileSlider";
import AddTeamSlider from "./AddTeamSlider";
import { states } from "./AddTeamSlider";
import { FormData } from "./AddTeamSlider";
import { deleteStaff } from "@/app/actions/delete";
import { Trash2 } from "lucide-react";
import Confirm from "@/components/store/general_UI/ConfirmBox";
import { UpdateStaffInfoProp, updateStaff } from "@/app/actions/update";

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [menuItem, setMenuItem] = useState(menuItems);
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    userId: "",
    fullName: "",
    email: "",
    state: "",
    location: "",
    manager: "",
    phoneNumber: "",
    cadre: "",
    userName: "",
    profilePic: "",
    registered: "",
    status: "",
    url: "",
    active: true,
  });
  const [activeStatus, setActiveStatus] = useState<string>("Active");

  const handleUpdateStaff = async (id: string) => {
    try {
      const originalStaff = data.find((staff) => staff.userId === id);
      if (!originalStaff) return;

      const updatedFields: UpdateStaffInfoProp = {
        fullName: formData.fullName ?? originalStaff.fullName,
        phoneNumber: formData.phoneNumber ?? originalStaff.phoneNumber,
        userName: formData.userName ?? originalStaff.userName,
      };

      await updateStaff(updatedFields, id);
      alert("Staff updated successfully!");
    } catch (error) {
      console.error("Failed to update staff:", error);
      alert("Error updating staff");
    }
  };

  const handleDelStaff = async (id: string) => {
    try {
      // setDeleting(id);
      const response = await deleteStaff(id);
      alert(response.message);
      console.log(id);
    } catch (error) {
      console.error("Failed to delete staff:", error);
      alert("Error deleting staff");
    } finally {
      // setDeleting(null);
      console.error(errorMessage);
    }
  };

  const handleMenuItemClick = async (label: string, staff: FormData) => {
    if (loading) return;
    if (label === "User Activity") {
      setSelectedProfileId(staff.userId);
      setOpenProfile(true);
      setOpenEdit(false);
    } else if (label === "Edit Profile" && staff) {
      setSelectedProfileId(staff.userId);
      setOpenEdit(true);

      setFormData((prev) => ({
        userId: staff.userId || prev.userId,
        fullName: staff.fullName || prev.fullName || "",
        email: staff.email || prev.email || "",
        state: staff.state || prev.state || "",
        location: staff.location || prev.location || "",
        manager: staff.manager || prev.manager || "",
        phoneNumber: staff.phoneNumber || prev.phoneNumber || "",
        cadre: staff.cadre || prev.cadre || "",
        userName: staff.userName || prev.userName || "",

        profilePic: staff.url || prev.profilePic || "/icons/user_icon.svg",
        registered:
          staff.registered ||
          prev.registered ||
          new Date().toLocaleDateString(),
        status: staff.status || prev.status || "Active",
        url: staff.url || prev.url || "/icons/user_icon.svg",
        active: staff.status === "Active",
      }));
    } else if (label === "Remove Staff") {
      setConfirmDelete(staff.userId);
    } else if (label === "Deactivate User" || label === "Activate User") {
      setLoading(true);
      setData((prevData) =>
        prevData.map((user) =>
          user.userId.toString() === staff.userId
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
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  useEffect(() => {
    if (openEdit && selectedProfileId) {
      const selectedStaff = data.find((s) => s.userId === selectedProfileId);
      if (!selectedStaff) return;

      setFormData({
        userId: selectedStaff.userId ?? "",
        fullName: selectedStaff.fullName ?? "",
        email: selectedStaff.email ?? "",
        state: selectedStaff.state ?? "",
        location: selectedStaff.location ?? "",
        manager: selectedStaff.manager ?? "",
        phoneNumber: selectedStaff.phoneNumber ?? "",
        cadre: selectedStaff.cadre ?? "",
        userName: selectedStaff.userName ?? "",
        profilePic: selectedStaff.url ?? "",
        registered: selectedStaff.registered ?? "",
        status: selectedStaff.status ?? "",
        url: selectedStaff.url ?? "",
        active: selectedStaff.status === "",
      });
    }
  }, [openEdit, selectedProfileId, data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (formData: FormData) => {
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
          {data.map((staff, index) =>
            staff.fullName ? (
              <tr key={staff.userId} className=" relative border-b">
                <td className=" justify-start items-center h-12 text-gray-400 text-xs flex w-14 p-2">
                  <span className="text-black pr-1">
                    {" "}
                    <input className="" type="checkbox" />
                  </span>

                  {index + 1}
                </td>
                <td
                  className={`absolute top-[8px] h-[90%] w-[75%] left-0 ${
                    staff.status === "active"
                      ? "opacity-0 "
                      : staff.status === "Deactivated"
                      ? "opacity-80  bg-white"
                      : "opacity-0"
                  } h-12 `}
                />

                <td className="p-2">
                  <div className="flex items-center">
                    <Image
                      src={staff.url || "/icons/user_icon.svg"}
                      alt={staff.fullName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="text-black ml-2">{staff.fullName}</span>
                  </div>
                  {selectedProfileId === staff.userId &&
                    menuItem[0]?.label === "User Activity" && (
                      <div className="flex flex-col gap-2">
                        <TeamProfileSlider
                          isOpen={openProfile}
                          onClose={() => {
                            setOpenProfile(false);
                          }}
                          id={staff.userId}
                          name={staff.fullName}
                          phone={staff.phoneNumber}
                          role={staff.cadre}
                          imageUrl={staff.url}
                          salesPick={0}
                          activeDays={0}
                          offlineDays={0}
                          width="w-1/4"
                          overlayColor="bg-black bg-opacity-50"
                          drawerStyle="bg-white"
                        />
                      </div>
                    )}
                  {selectedProfileId === staff.userId &&
                    menuItem[1]?.label === "Edit Profile" && (
                      <div className="">
                        {/* Edit Team */}
                        <AddTeamSlider
                          isOpen={openEdit}
                          onClose={() => {
                            setOpenEdit(false);
                          }}
                          id={staff.userId}
                          tittle="Edit Team Member"
                          formData={formData}
                          role={staff.cadre}
                          resetPass={true}
                          onChange={handleChange}
                          onSubmit={() => handleUpdateStaff(staff.userId)}
                          loading={loading}
                          errorMessage={errorMessage}
                          options={states}
                        />
                      </div>
                    )}
                </td>
                <td className=" p-2">
                  <span className={`px-2 py-1 border bg-yellow-50 rounded-3xl`}>
                    {staff.cadre}
                  </span>
                </td>
                <td className=" p-2">{staff.registered}</td>
                <td className=" p-2">{staff.phoneNumber}</td>

                <td className=" p-2">
                  <span
                    className={`px-2 py-1 border border-green-800 rounded-3xl ${
                      staff.status === "Active"
                        ? "bg-green-50 text-green-800"
                        : staff.status === activeStatus
                        ? "bg-gray-200 text-gray-500"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {staff.status === "Active"
                      ? "Active"
                      : staff.status === "Inactive"
                      ? "Inactive"
                      : staff.status === "Deactivated"
                      ? "Deactivated"
                      : "Active"}
                  </span>
                </td>
                <td className=" p-2 relative text-indigo-600 cursor-pointer">
                  <button
                    className=" pr-1"
                    onClick={() => {
                      toggleDropdown(staff.userId);
                    }}
                  >
                    •••
                  </button>
                  {openDropdownId === staff.userId && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50"
                      ref={dropdownRef}
                    >
                      <div className="flex flex-col gap-2 p-2">
                        {menuItems.map((item, index) => {
                          let isDeactivate = item.label === "Deactivate User";
                          let isActive = staff.status === "Activate User";
                          let newLabel =
                            staff.status === "Active" && isDeactivate
                              ? "Deactivate User"
                              : staff.status === "Deactivated" && isDeactivate
                              ? "Activate User"
                              : item.label;
                          let newIcon =
                            staff.status === "Active" && isDeactivate
                              ? "/icons/deactivate.svg"
                              : staff.status === "Deactivated" && isDeactivate
                              ? "/icons/activate.svg"
                              : item.icon;

                          return (
                            <>
                              {item.label === "Remove Staff" ? (
                                <Confirm
                                  message={`Are you sure you want to delete ${staff.fullName}?`}
                                  button={
                                    <button className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border-gray-500 transition cursor-pointer">
                                      <Trash2 className="text-red-600" />
                                      <h1 className="text-sm text-gray-700">
                                        Remove Staff
                                      </h1>
                                    </button>
                                  }
                                  onConfirm={() => handleDelStaff(staff.userId)}
                                />
                              ) : (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleMenuItemClick(newLabel, staff)
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
