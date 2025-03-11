import Image from "next/image";
import { useState } from "react";
import SalesGraph from "../visualizationToola/SalesGraph";
import Dropdown from "../Dropdown";
import { PeriodType } from "@/app/admin/(dashboards)/report/page";

interface PurchasingReportProps {
  data: any;
  toggle: boolean;
  nameKeyY: string;
  nameKeyX: string;
  // renderProductContent: React.ReactNode;
  period: string[];
  products: any[];
  selectedProduct: string;
  setSelectedProduct: (p: string) => void;
  selectedPeriod: string;
  setselectedPeriod: (period: string) => void;
  // setselectedPeriod: (period: string) => void;
}
const PurchasingReport = ({
  data,
  toggle,
  nameKeyY,
  nameKeyX,
  // renderProductContent,
  period,
  products,
  setselectedPeriod,
}: // selectedProduct,
// setSelectedProduct,
// setselectedPeriod,
PurchasingReportProps) => {
  // const states = [
  //   { code: "OG", name: "Ogun State" },
  //   { code: "KW", name: "Kwara State" },
  //   { code: "LAG", name: "Lagos State" },
  //   { code: "ABJ", name: "Abuja" },
  // ];

  const productList = [
    "Screen",
    "Downboard",
    "Battery",
    "Back Glass",
    "Touch Pad",
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0].name);
  const renderProductContent = () => {
    switch (selectedProduct) {
      case "Screen":
        return (
          <div className="flex w-full flex-row">
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  w-full h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">6 sold </span>
                  </h1>
                </div>

                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph
                    stroke="#008342"
                    fill="#a2d7ad"
                    type="monotone"
                    fontSizeX={0}
                    fontSizeY={0}
                    nameKeyX="name"
                    nameKeyY={toggle ? "pv" : "amt"}
                    data={data}
                  />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_up_green.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-green-600">2.8% </span>from last
                      week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">LEAST PURCHASED</h1>
              <div className="flex  w-full h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">0 sold </span>
                  </h1>
                </div>
                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph
                    stroke="#fc1e05"
                    fill="#e69e9e"
                    type="monotone"
                    fontSizeX={0}
                    fontSizeY={0}
                    nameKeyY={nameKeyY}
                    nameKeyX={nameKeyX}
                    data={data}
                  />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_down_red.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-red-800">0% </span>from last week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Downboard":
        return (
          <div className="flex w-full flex-row">
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex w-full justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">6 sold </span>
                  </h1>
                </div>

                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="amt" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_up_green.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-green-600">2.8% </span>from last
                      week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">0 sold </span>
                  </h1>
                </div>
                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="uv" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_down_red.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-red-800">0% </span>from last week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Battery":
        return (
          <div className="flex w-full flex-row">
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">6 sold </span>
                  </h1>
                </div>

                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="amt" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_up_green.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-green-600">2.8% </span>from last
                      week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex w-full justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">0 sold </span>
                  </h1>
                </div>
                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="uv" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_down_red.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-red-800">0% </span>from last week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Back Glass":
        return (
          <div className="flex w-full flex-row">
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">6 sold </span>
                  </h1>
                </div>

                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="amt" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_up_green.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-green-600">2.8% </span>from last
                      week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">0 sold </span>
                  </h1>
                </div>
                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="uv" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_down_red.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-red-800">0% </span>from last week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "Touch Pad":
        return (
          <div className="flex w-full flex-row">
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">6 sold </span>
                  </h1>
                </div>

                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="amt" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_up_green.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-green-600">2.8% </span>from last
                      week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">0 sold </span>
                  </h1>
                </div>
                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="uv" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_down_red.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-red-800">0% </span>from last week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex w-full flex-row">
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">6 sold </span>
                  </h1>
                </div>

                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX=" " nameKeyY="amt" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_up_green.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-green-600">2.8% </span>from last
                      week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-1/2">
              <h1 className="text-gray-400">MOST PURCHASED</h1>
              <div className="flex  justify-between h-[100px] flex-row">
                <div className="flex items-center justify-center flex-row w-[30%] h-full">
                  <Image
                    className=" "
                    width={50}
                    height={50}
                    alt=""
                    src={"/icons/phone_icon.svg"}
                  />
                  <h1 className=" text-sm w-full">
                    Iphone XS Max
                    <br />
                    <span className="text-green-800">0 sold </span>
                  </h1>
                </div>
                <div className="w-[70%] relative h-[100px]">
                  <SalesGraph data={data} nameKeyX="" nameKeyY="uv" />
                  <div className="flex  flex-row pl-10 gap-3 justify-center items-center">
                    <Image
                      className=" "
                      width={10}
                      height={10}
                      alt=""
                      src={"/icons/arrow_down_red.svg"}
                    />
                    <h1 className=" text-sm w-full">
                      <span className="text-red-800">0% </span>from last week
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full text-black   h-[30%]  bg-white">
      {data.length > 0 ? (
        <div>
          <div className="flex flex-row items-center w-full justify-between">
            <h1 className="text-black font-semibold">Purchasing Report</h1>
            <div className="flex justify-end w-[70%] gap-4 flex-row">
              <Dropdown
                showSearch
                className="bg-white rounded-full w-[100px]"
                label="Select Product"
                options={period}
                placeholder={period[0]}
                onSelect={(vlaue) => setselectedPeriod(vlaue as PeriodType)}
                // getLabel={(period) => period}
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="flex text-black flex-col gap-4">
            <div className="flex flex-row gap-2 ]">
              {productList.map((p, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedProduct(p)}
                  className={` text-black ${
                    selectedProduct === p
                      ? "border-b-4 border-blue-400 font-semibold"
                      : ""
                  } p-2`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Product Content */}
            <div className="mt-4 p-4 rounded-lg">{renderProductContent()}</div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full">
          <div className="flex justify-center items-center w-48 h-48 rounded-full bg-gradient-to-t from-white to-gray-100">
            <Image
              className="top-3 left-1"
              width={100}
              height={100}
              alt="No Data"
              src={"/icons/revenue.svg"}
            />
          </div>
          <h2>No sales record yet</h2>
        </div>
      )}
    </div>
  );
};
export default PurchasingReport;
