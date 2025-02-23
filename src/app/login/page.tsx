"use client";

import Image from "next/image";
import logo from "../../../public/images/Frame.svg";
import frame from "../../../public/images/Vector (4).svg";
import { useActionState } from "react";
import { loginAction } from "../actions/auth";
import { useRouter } from "next/navigation";

function AdminLogin() {
  const router = useRouter();
  const [state, formAction] = useActionState(loginAction, null);

  if (state?.success) {
    router.push("/admin/report");
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-[#7D95EE] to-[#F56476]">
      <div className="flex w-full justify-center">
        <Image priority className="overflow-hidden" src={frame} alt="tag" />
        <div className="absolute top-16 flex flex-col items-center w-1/2 lg:w-1/4">
          <Image src={logo} alt="Logo" />
          <div className="w-full">
            <h1 className="rounded-t-2xl p-4 bg-[#F9F6F1] text-black font-bold text-3xl text-center">
              Login
            </h1>
            <form
              className="bg-white flex flex-col gap-2 rounded-b-2xl text-gray-400 p-10"
              action={formAction}
            >
              <div className="flex flex-col">
                <label>Username</label>
                <input
                  type="text"
                  name="userName"
                  className="border h-8 w-full p-1 rounded-xl border-gray-400"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="border h-8 w-full p-1 rounded-xl border-gray-400"
                  required
                />
              </div>
              {state?.error && <p className="text-red-500">{state.error}</p>}
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
