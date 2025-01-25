import Image from "next/image";
import React from "react";

function Navbar() {
  return (
    <div className="p-5 flex flex-row w-full">
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
      <button className="bg-white rounded-full">
        <Image
          //   className=" top-1 left-1"
          width={15}
          height={15}
          alt=""
          src={"/icons/reload.svg"}
        />
      </button>
      {/* notification */}
      <button>
        <Image
          //   className=" top-1 left-1"
          width={15}
          height={15}
          alt=""
          src={"/icons/notification.svg"}
        />
      </button>
    </div>
  );
}

export default Navbar;
