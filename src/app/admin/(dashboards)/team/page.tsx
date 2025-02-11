"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import products from "@/data/data.json";
import TeamTable, { tempProducts } from "@/components/admin/TeamTable";
import SlideDrawer from "@/components/admin/AddTeamSlider";
import { addTeamAction, TeamData } from "@/app/actions/addTeam";
import { FormData } from "@/components/admin/AddTeamSlider";

function Team() {
  const states = [
    { code: "OG", name: "Ogun State1" },
    { code: "KW", name: "Kwara State1" },
    { code: "LAG", name: "Lagos State1" },
    { code: "ABJ", name: "Abuja1" },
  ];

  const [data, setData] = useState<FormData[]>([
    tempProducts[0],
    tempProducts[1],
    tempProducts[2],
  ]);
  const period = ["year", "month", "week", "day"];

  const [selectedState, setSelectedState] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(products[0].name);
  const [selectedPeriod, setselectedPeriod] = useState<
    "year" | "month" | "week" | "day"
  >("year");
  const selectedProductData = products.find((p) => p.name === selectedProduct);
  const validPeriod = selectedPeriod || "year";
  const allProduct = products.map((p) => p.name);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    id: products.length + 1,
    fullName: "",
    email: "",
    state: "",
    location: "",
    manager: "",
    phoneNumber: "",
    cadre: "",
    userName: "",
    password: "",
    confirmPassword: "",
    profilePic: "/images/profile.png",
    registered: new Date().toLocaleDateString(),
    status: "Active",
    url: "/images/profile.png",
    active: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);

      const fetchData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/store`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const result = await response.json();
          setData(result);
          console.log("data", result);
          console.log("token", storedToken);
        } catch (error) {
          console.error("Error fetching data:", error);
          setErrorMessage("Failed to fetch data.");
        }
      };

      fetchData();
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await addTeamAction(
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          userName: formData.userName,
        },
        null
      );

      console.log(result);
      if (result.error) {
        setErrorMessage(result.error);
      } else if (result.success) {
        setErrorMessage(null);
        setLoading(false);
        setFormData({
          id: products.length + 1,
          fullName: "",
          email: "",
          state: "",
          location: "",
          manager: "",
          phoneNumber: "",
          cadre: "",
          userName: "",
          password: "",
          confirmPassword: "",
          profilePic: "/images/profile.png",
          registered: new Date().toLocaleDateString(),
          status: "Active",
          url: "/images/profile.png",
          active: true,
        });
      } else {
        setErrorMessage("An error occurred while adding the team member.");
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the team member.");
      setLoading(false);
      console.error(error);
      console.log(formData);
    }
  };

  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl ">
      <div className="absolute top-0 right-0">
        {/* add team component */}
        <SlideDrawer
          formData={formData}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onChange={(e) => handleChange(e)}
          onSubmit={handleSubmit}
          loading={loading}
          errorMessage={errorMessage}
          role={""}
          options={states}
        />
      </div>
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
          <div className=" ">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-medium">Team</h1>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="bg-button text-white p-2 px-4 rounded-full"
              >
                Add New Team
              </button>
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
            <div className=" pt-4">
              <TeamTable data={data} setData={setData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Team;
