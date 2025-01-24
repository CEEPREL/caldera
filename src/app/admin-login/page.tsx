"use client";
import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../public/images/Frame.svg";
import frame from "../../../public/images/Vector (4).svg";

function AdminLogin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        // Redirect or handle successful login
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-[#7D95EE] to-[#F56476]">
      <div className="flex justify-center">
        <Image priority className="overflow-hidden" src={frame} alt="tag" />

        <div className="absolute top-16 flex flex-col items-center w-1/4">
          <Image src={logo} alt="Logo" />
          <div className="w-full">
            <h1 className="rounded-t-2xl p-4 bg-[#F9F6F1] text-black font-bold text-3xl text-center">
              Login
            </h1>
            <form
              className="bg-white flex flex-col gap-2 rounded-b-2xl text-gray-400 p-10"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border h-8 w-full p-1 rounded-xl border-gray-400"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border h-8 w-full p-1 rounded-xl border-gray-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-[#7D95EE] text-white p-2 rounded-xl mt-4"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
