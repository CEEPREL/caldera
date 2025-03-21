"use client";
import { useStore } from "@/ContextAPI/storeContex";
import Image from "next/image";

function page() {
  const { storeData } = useStore();
  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl ">
      <p className=" text-3xl">
        Assigned store: <span>{storeData?.data.storeName}</span>
      </p>

      <div className="flex flex-row item-center justify-center bg-gray-100 p-5  gap-4">
        <Image
          src={
            typeof storeData?.data.profileImg === "string"
              ? storeData?.data.profileImg
              : "/icons/user_icon.svg"
          }
          alt="picture"
          width={10}
          height={10}
          className="rounded-full bg-green-500 w-[35%]"
        />
      </div>
      <div className="flex w-[65%] flex-col gap-1">
        <h1 className="text-lg font-bold">
          {storeData?.data.fullName || "Full Name"}
        </h1>{" "}
        <p className="text-sm text-gray-500">
          {storeData?.data.role || "Role"}
        </p>
        <p className="text-lg w-fit bg-yellow-500 rounded-full px-2 py-1">
          {storeData?.data.role || "Role"}
        </p>
      </div>
      <div className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div className="flex w-full flex-col gap-8">
              <p className="text-sm text-gray-500"> Assigned store:</p>
              <div className="flex flex-row justify-between w-full">
                <p className="text-lg font-bold text-black">
                  {" "}
                  <span>{storeData?.data.storeName}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-t from-gray-100 to-gray-300 shadow-2xl rounded-lg p-5">
          <div className="flex justify-between items-center">
            <div className="flex w-full flex-col gap-8">
              <p className="text-sm text-gray-500"> User Phone Number: </p>
              <div className="flex flex-row justify-between w-full">
                <p className="text-lg font-bold text-black">
                  {" "}
                  <span>{storeData?.data.phoneNumber}</span>
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
                  {" "}
                  <span>
                    {" "}
                    <span>{storeData?.data.email}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
