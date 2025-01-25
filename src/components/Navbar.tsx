import Image from "next/image";
import React from "react";

function Navbar() {
  return (
    <div className="py-5 gap-4 bg-primary  flex items-center  flex-row w-full">
      {/* the search section  */}
      <div className="relative w-2/3">
        <input
          className="border shadow-lg px-5 h-10 rounded-full w-full"
          placeholder="search..."
        />
        <button>
          <Image
            className="absolute top-3 left-1"
            width={15}
            height={15}
            alt=""
            src={"/icons/search.svg"}
          />
        </button>
      </div>
      {/* reload */}
      <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full">
        <Image
          //   className=" top-1 left-1"
          width={15}
          height={15}
          alt=""
          src={"/icons/reload.svg"}
        />
      </button>
      {/* notification */}
      <button className="bg-white w-10 h-10 flex items-center justify-center rounded-full">
        <Image
          //   className=" top-1 left-1"
          width={15}
          height={15}
          alt=""
          src={"/icons/notification.svg"}
        />
      </button>
      <div className="w-[18%]  cursor-pointer justify-between px-2 items-center flex flex-row h-10 rounded-full bg-white">
        <div className="flex gap-4 flex-row ">
          <Image
            className=" rounded-full"
            width={15}
            height={15}
            alt=""
            src={"/icons/notification.svg"}
          />{" "}
          <span className="hidden lg:block">Ayodele O</span>
          <span className="hidden sm:block lg:hidden">A</span>
        </div>
        <div className=" cursor-pointer">
          <Image
            //   className=" top-1 left-1"
            width={15}
            height={15}
            alt=""
            src={"/icons/filled_dropdown.svg"}
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
