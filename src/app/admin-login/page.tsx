import React from "react";
import Image from "next/image";
import logo from "../../../public/images/Frame.svg";
import frame from "../../../public/images/Vector (4).svg";

function AdminLogin() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-[#7D95EE] to-[#F56476]">
      <div className=" flex justify-center  items-center">
        <Image src={logo} alt="" />
      </div>

      <Image className="overflow-hidden" src={frame} alt="" />
    </div>
  );
}

export default AdminLogin;
