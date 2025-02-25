import Image from "next/image";
import React from "react";

function PurchaseOrderTable() {
  return (
    <div>
      {" "}
      <div className="">
        <table className="w-full border-collapse shadow-md">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className=" p-2">#</th>
              <th className=" p-2">Product Name</th>
              <th className=" p-2">Cadre</th>
              <th className=" p-2">Quantity </th>
              <th className=" p-2">Note</th>
              <th className=" p-2">Status</th>
              <th className=" p-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr key="" className=" relative border-b">
              <td className=" justify-start items-center h-12 text-gray-400 text-xs flex w-14 p-2">
                <span className="text-black pr-1">
                  {" "}
                  <input className="" type="checkbox" />
                </span>
                1
              </td>
              <td className={`absolute top-[8px] h-[90%] w-[75%] left-0  `} />
              <td className="p-2">
                <div className="flex items-center">
                  {/* <Image
                    src={"product.url"}
                    alt={"product.fullName"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  /> */}
                  <span className="text-black ml-2">IphoneX screen</span>
                </div>
              </td>
              <td className=" p-2">
                <span className={`px-2 py-1 border bg-yellow-50 rounded-3xl`}>
                  Lagos 1
                </span>
              </td>
              <td className=" p-2">10</td>
              <td className=" p-2">this product...</td>

              <td className=" p-2">
                <span
                  className={`px-2 py-1 border border-green-800 rounded-3xl `}
                >
                  Pending
                </span>
              </td>
              <td className=" p-2 relative  cursor-pointer">
                <button className="bg-button rounded-sm px-2 py-1 hover:bg-blue-300 text-white font-semibold">
                  Approve
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseOrderTable;
