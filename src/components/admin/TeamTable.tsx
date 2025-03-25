import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import TeamProfileSlider from "./TeamProfileSlider";
import AddTeamSlider from "@/components/admin/AddTeamSlider";
import { FormData } from "./AddTeamSlider";
import { useStore } from "@/ContextAPI/storeContex";
import { deleteStaff } from "@/app/actions/delete";
import { Trash2 } from "lucide-react";
import Confirm from "@/components/store/general_UI/ConfirmBox";
import { UpdateStaffInfoProp, updateStaff } from "@/app/actions/update";
import { resetPass } from "@/app/actions/post";
import { capitalizeFirstLetter } from "./AdminOrderDetailSlider";
import { useToastContext } from "@/ContextAPI/toastContext";

const menuItems = [
  { label: "User Activity", icon: "/icons/brief_case.svg" },
  { label: "Edit Profile", icon: "/icons/user_icon.svg" },
  { label: "Deactivate User", icon: "/icons/deactivate.svg" },
  { label: "Remove Staff", icon: "/icons/delete.svg" },
];

export default function TeamTable({
  data = [],
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
  const menuItem = menuItems;
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const { showToast } = useToastContext();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
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
    storeId: "",
    storeName: "",
    profilePic: "",
    registered: "",
    status: "",
    url: "",
    active: true,
  });
  const activeStatus = "Active";

  const { stateObj } = useStore();

  const allStates = stateObj ? Object.values(stateObj) : [];

  const flatStores = allStates.flat();

  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

  const handleUpdateStaff = async (id: string) => {
    try {
      setLoading(true);

      const originalStaff = data.find((staff) => staff.userId === id);
      if (!originalStaff) {
        setErrorMessage("Staff not found.");
        setLoading(false);
        return;
      }
      // Find store based on selected location
      // const selectedStore = flatStores.find(
      //   (store) => store.storeLocation === formData.location
      // );

      // if (!selectedStore) {
      //   setErrorMessage("Invalid store selection.");
      //   setLoading(false);
      //   return;
      // }
      const storeId = originalStaff.storeId;
      const storeName = originalStaff.storeName;
      const updatedFields: UpdateStaffInfoProp = {
        fullName: formData.fullName ?? originalStaff.fullName,
        phoneNumber: formData.phoneNumber ?? originalStaff.phoneNumber,
        userName: formData.userName ?? originalStaff.userName,
        storeId: storeId ?? originalStaff.storeId,
        storeName: storeName ?? originalStaff.storeName,
        email: formData.email ?? originalStaff.email,
      };
      await updateStaff(updatedFields, id);
      showToast("Staff updated successfully!", "success");
      console.log({
        userId: formData.userId,
        resetUrl: `${baseUrl}/reset_pass`,
      });
      if (formData.password === "Reset") {
        await resetPass({
          userId: formData.userId,
          resetUrl: `${baseUrl}/reset_pass`,
        });
      }

      // Await the store assignment request
      // await assignStore(storeId, id)
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating staff.");
    } finally {
      setLoading(false);
      setOpenEdit(false);
      // window.location.reload();
    }
  };

  const handleDelStaff = async (id: string) => {
    console.log(id);
    try {
      const response = await deleteStaff(id);
      alert(response.message);
    } catch (error) {
      console.error("error: ", error);
    } finally {
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
        storeName: staff.storeName || prev.storeName || "any",
        location: staff.location || prev.location || "",
        manager: staff.manager || prev.manager || "",
        phoneNumber: staff.phoneNumber || prev.phoneNumber || "",
        cadre: staff.cadre || prev.cadre || "",
        userName: staff.userName || prev.userName || "",
        profilePic: staff.url || prev.profilePic || "/icons/user_icon.svg",
        registered: staff.registered || prev.registered || "",
        status: staff.status || prev.status || "Active",
        url: staff.url || prev.url || "/icons/user_icon.svg",
        active: staff.status === "Active",
      }));
    } else if (label === "Remove Staff") {
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
      const selectedStaff = data.find(
        (staff) => staff.userId === selectedProfileId
      );
      if (selectedStaff) {
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
          status: selectedStaff.status ?? "Active",
          url: selectedStaff.url ?? "",
          active: selectedStaff.status === "Active",
        });
      }
    }
  }, [openEdit, selectedProfileId, data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
                          role={staff.storeName || "Store not assigned"}
                          imageUrl={staff.url || "/icons/user_icon.svg"}
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
                          btnTitle="Save"
                          tittle="Edit Team Member"
                          formData={formData}
                          role={staff.cadre}
                          resetPass={true}
                          onChange={handleChange}
                          onSubmit={() => handleUpdateStaff(staff.userId)}
                          loading={loading}
                          errorMessage={errorMessage}
                          // options={flatStores}
                          optionslocation={flatStores}
                        />
                      </div>
                    )}
                </td>
                <td className=" p-2">
                  <span className={`px-2 py-1 border bg-yellow-50 rounded-3xl`}>
                    {staff.storeName}
                  </span>
                </td>
                <td className=" p-2">{staff.registered}</td>
                <td className=" p-2">{staff.phoneNumber}</td>

                <td className=" p-2">
                  <span
                    className={`px-2 py-1 border border-green-800 rounded-3xl ${
                      staff.status === "active"
                        ? "bg-green-50 text-green-800"
                        : staff.status === activeStatus
                        ? "bg-gray-200 text-gray-500"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {capitalizeFirstLetter(staff.status)}
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
                      <div key={index} className="flex flex-col gap-2 p-2">
                        {menuItems.map((item, index) => {
                          const isDeactivate = item.label === "Deactivate User";
                          const newLabel =
                            staff.status === "Active" && isDeactivate
                              ? "Deactivate User"
                              : staff.status === "Deactivated" && isDeactivate
                              ? "Activate User"
                              : item.label;
                          const newIcon =
                            staff.status === "Active" && isDeactivate
                              ? "/icons/deactivate.svg"
                              : staff.status === "Deactivated" && isDeactivate
                              ? "/icons/activate.svg"
                              : item.icon;

                          return (
                            <React.Fragment key={`staff-${index}`}>
                              {item.label === "Remove Staff" ? (
                                <Confirm
                                  message={`Are you sure you want to delete ${staff.fullName}?`}
                                  button={
                                    <button
                                      className="flex items-center bg-gray-100 gap-2 p-2 border rounded-md hover:border-gray-500 transition cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelStaff(staff.userId);
                                      }}
                                    >
                                      <Trash2 className="text-red-600" />
                                      <h1 className="text-sm text-gray-700">
                                        Remove Staff
                                      </h1>
                                    </button>
                                  }
                                  onConfirm={() => console.log(staff.userId)}
                                />
                              ) : (
                                <button
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
                            </React.Fragment>
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
