"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TeamTable from "@/components/admin/TeamTable";
import SlideDrawer from "@/components/admin/AddTeamSlider";
import { addTeamAction } from "@/app/actions/addTeam";
import { fetchStaff } from "@/app/actions/fetch";
import { FormData } from "@/components/admin/AddTeamSlider";
import { useStore } from "@/ContextAPI/storeContex";

function Team() {
  const { stateObj } = useStore();

  const allStates = stateObj ? Object.values(stateObj) : [];

  const flatStores = allStates.flat();

  const [data, setData] = useState<FormData[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    userId: crypto.randomUUID(),
    fullName: "",
    email: "",
    state: "",
    location: "",
    manager: "",
    phoneNumber: "",
    cadre: "",
    userName: "",
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchStaff();
        setData(res);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const newTeam = () => {
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await addTeamAction({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        userName: formData.userName,
      });

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setErrorMessage(null);
        setFormData({
          userId: crypto.randomUUID(),
          fullName: "",
          email: "",
          state: "",
          location: "",
          manager: "",
          phoneNumber: "",
          cadre: "",
          userName: "",
          profilePic: "/images/profile.png",
          registered: new Date().toLocaleDateString(),
          status: "Active",
          url: "/images/profile.png",
          active: true,
        });
        // Refresh data after adding a new team member
        const updatedData = await fetchStaff();
        setData(updatedData);
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the team member.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[88%] bg-white overflow-y-scroll rounded-3xl">
      <div className="absolute top-0 right-0">
        <SlideDrawer
          formData={formData}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          errorMessage={errorMessage}
          role=""
          optionslocation={flatStores}
        />
      </div>
      <div className="w-full p-5 relative text-black bg-white">
        {loading ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <p>Loading...</p>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex flex-col min-h-[80vh] justify-center items-center w-full">
            <div className="flex justify-center items-center w-48 h-48 rounded-full bg-gradient-to-t from-white to-gray-100">
              <Image
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
              <button
                onClick={newTeam}
                className="bg-button text-white p-2 px-4 rounded-full"
              >
                Add New Team
              </button>
            </div>

            <div className="pt-4">
              <TeamTable data={data} setData={setData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Team;
