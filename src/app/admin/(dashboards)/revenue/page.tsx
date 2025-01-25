import Image from "next/image";
import React from "react";

function Revenue() {
  return (
    <div className="w-[100%] rounded-3xl p-5 h-[88%] bg-white ">
      <h1 className=" font-semibold">Revenue</h1>

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
    </div>
  );
}

export default Revenue;
