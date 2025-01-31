"use client";
import Dropdown from "@/components/Dropdown";
import SalesGraph from "@/components/visualizationToola/SalesGraph";
import Image from "next/image";
import React, { useState } from "react";
import products from "@/data/data.json";
import Link from "next/link";
import TeamTable from "@/components/admin/TeamTable";

function Team() {
  const states = [
    { code: "OG", name: "Ogun State" },
    { code: "KW", name: "Kwara State" },
    { code: "LAG", name: "Lagos State" },
    { code: "ABJ", name: "Abuja" },
  ];

  const period = ["year", "month", "week", "day"];

  const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(products[0].name);
  const [selectedPeriod, setselectedPeriod] = useState<
    "year" | "month" | "week" | "day"
  >("year");
  const selectedProductData = products.find((p) => p.name === selectedProduct);
  const validPeriod = selectedPeriod || "year";
  const allProduct = products.map((p) => p.name);

  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl ">
      <div className="w-full p-5 relative text-black  bg-white">
        {products.length === 0 ? (
          <div
            className={`flex flex-col ${
              products.length === 0 ? "min-h-[80vh]" : "min-h-0"
            } justify-center items-center w-full`}
          >
            <div className="flex justify-center  items-center w-48 h-48 rounded-full bg-gradient-to-t from-white to-gray-100">
              <Image
                className="top-3 left-1"
                width={100}
                height={100}
                alt="No Data"
                src={"/icons/team.svg"}
              />
            </div>
            <h2>No team record yet</h2>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-medium">Team</h1>
              <Link
                href="/admin/stores/new"
                className="bg-button text-white p-2 px-4 rounded-full"
              >
                Add New Team
              </Link>
            </div>
            <div className="flex pt-4 w-[100%] gap-4 flex-row">
              <Dropdown
                showSearch
                className="bg-white rounded-full w-1/6"
                label={states[0].name}
                options={states}
                placeholder="Select a State"
                onSelect={(state) => setSelectedState(state)}
                getLabel={(state) => state.name}
                getSubLabel={(products) => ""}
              />
              <Dropdown
                showSearch
                className="bg-white rounded-full w-1/6"
                label="Select Product"
                options={allProduct}
                placeholder="Select a Product"
                onSelect={setSelectedProduct}
                getLabel={(product) => product}
              />
            </div>
            <div className="pt-4">
              <TeamTable />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Team;
