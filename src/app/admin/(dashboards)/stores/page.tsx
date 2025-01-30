"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const states = [
  // { code: "OG", name: "Ogun State" },
  // { code: "KW", name: "Kwara State" },
  // { code: "LAG", name: "Lagos State" },
  // { code: "ABJ", name: "Abuja" },
];

function storepage() {
  const router = useRouter();
  return (
    <div className="w-full h-[88%] bg-white  overflow-y-scroll rounded-3xl ">
      <div className="w-full p-5 relative text-black  bg-white">
        {states.length === 0 ? (
          <div
            className={`flex flex-col ${
              states.length === 0 ? "min-h-[80vh]" : "min-h-0"
            } justify-center items-center w-full`}
          >
            <div className="flex justify-center items-center w-48 h-48 rounded-full bg-gradient-to-t from-white to-gray-100">
              <Image
                className="top-3 left-1"
                width={100}
                height={100}
                alt="No Data"
                src={"/icons/stores.svg"}
              />
            </div>
            <h2>No store created yet</h2>
            <button
              onClick={() => router.push("/admin/stores/new")}
              className="bg-button font-bold p-3 px-6 mt-5 text-white rounded-full"
            >
              Add New Store
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {states.map((state) => (
              <div key={state.code}>{state.name}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default storepage;
