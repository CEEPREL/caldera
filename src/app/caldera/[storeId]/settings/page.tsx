"use client";
import { useStore } from "@/ContextAPI/storeContex";
import Image from "next/image";

function Page() {
  const { storeData } = useStore();

  // Set default values if storeData is missing
  const storeName = storeData?.data?.storeName || "No Store Assigned";
  const profileImg =
    typeof storeData?.data?.profileImg === "string"
      ? storeData?.data?.profileImg
      : "/icons/user_icon.svg";
  const fullName = storeData?.data?.fullName || "Full Name";
  const role = storeData?.data?.role || "Role";
  const phoneNumber = storeData?.data?.phoneNumber || "No Phone Number";
  const email = storeData?.data?.email || "No Email";

  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl">
      <p className="text-3xl">
        Assigned store: <span>{storeName}</span>
      </p>

      <div className="flex flex-col items-center justify-center  p-5 gap-4">
        {/* Profile Image with smaller size */}
        <Image
          src={profileImg}
          alt="profile picture"
          width={80} // Smaller size
          height={80} // Smaller size
          className="rounded-full bg-green-500"
        />
        {/* Name centered under the image */}
        <h1 className="text-lg font-bold mt-3">{fullName}</h1>{" "}
        {/* <p className="text-sm text-gray-500 text-center">{role}</p> */}
        <p className="text-lg w-fit bg-yellow-500 rounded-full px-2  mx-auto">
          {role}
        </p>
      </div>

      <div className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div className="flex w-full flex-col gap-8">
              <p className="text-sm text-gray-500">Assigned store:</p>
              <div className="flex flex-row justify-between w-full">
                <p className="text-lg font-bold text-black">
                  <span>{storeName}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div className="flex w-full flex-col gap-8">
              <p className="text-sm text-gray-500">User Phone Number:</p>
              <div className="flex flex-row justify-between w-full">
                <p className="text-lg font-bold text-black">
                  <span>{phoneNumber}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div className="flex w-full flex-col gap-8">
              <p className="text-sm text-gray-500">User Email:</p>
              <div className="flex flex-row justify-between w-full">
                <p className="text-lg font-bold text-black">
                  <span>{email}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
