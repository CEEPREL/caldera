"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import React, { useState } from "react";

function Revenue() {
  const states = [
    { code: "CA", name: "California" },
    { code: "TX", name: "Texas" },
    { code: "NY", name: "New York" },
    { code: "FL", name: "Florida" },
  ];
  const [selectedState, setSelectedState] = useState("");
  return (
    <div className="w-[100%] rounded-3xl p-5 h-[88%] bg-white ">
      {states.length >= 1 && (
        <div className="">
          <h1 className=" font-semibold">Revenue</h1>
          <div className="flex flex-row">
            <Dropdown
              showSearch
              className="bg-white rounded-full w-1/4"
              label="Select State"
              options={states}
              placeholder={states[0].name}
              onSelect={setSelectedState}
              getLabel={(state) => state.name}
              getSubLabel={(state) => state.code}
            />
            <Dropdown
              showSearch
              className="bg-white rounded-full w-1/4"
              label="Select State"
              options={states}
              placeholder={states[0].name}
              onSelect={setSelectedState}
              getLabel={(state) => state.name}
              getSubLabel={(state) => state.code}
            />
          </div>
        </div>
      )}
      {states.length <= 0 && (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex justify-center items-center w-48 h-48  rounded-full bg-gradient-to-t from-white to-gray-100">
            <Image
              className=" top-3 left-1"
              width={100}
              height={100}
              alt=""
              src={"/icons/revenue.svg"}
            />
          </div>
          <h2>No sales recored yet</h2>
        </div>
      )}
    </div>
  );
}

export default Revenue;
