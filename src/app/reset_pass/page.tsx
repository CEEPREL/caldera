"use client";
import Image from "next/image";
import logo from "../../../public/images/Frame.svg";
import frame from "../../../public/images/Vector (4).svg";
import { useState } from "react";
import { loginAction } from "../actions/auth";
import { useRouter } from "next/navigation";

function AdminLogin() {
  const router = useRouter();
  const [formState, setFormState] = useState<{
    error?: string;
    success?: boolean;
    redirectTo?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setFormState({ error: "Passwords do not match!" });
      setLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("password", password); // Override password in the FormData with the one from state
    formData.set("confirmPassword", confirmPassword); // Same for confirmPassword if needed

    // Assuming loginAction is for authentication or password reset (adjust as necessary)
    const result = await loginAction(null, formData);

    setFormState(result);
    setLoading(false);

    if (result?.success && result.redirectTo) {
      router.push(result.redirectTo);
    }
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-[#7D95EE] to-[#F56476]">
      <div className="flex w-full justify-center">
        <Image priority className="overflow-hidden" src={frame} alt="tag" />
        <div className="absolute top-16 flex flex-col items-center w-1/2 lg:w-1/4">
          <Image src={logo} alt="Logo" />
          <div className="w-full">
            <h1 className="rounded-t-2xl p-4 bg-[#F9F6F1] text-black font-bold text-3xl text-center">
              Reset Password
            </h1>
            <form
              className="bg-white flex flex-col gap-2 rounded-b-2xl text-gray-400 p-10"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border h-8 w-full p-1 rounded-xl border-gray-400"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border h-8 w-full p-1 rounded-xl border-gray-400"
                  required
                />
              </div>
              {formState?.error && (
                <p className="text-red-500">{formState.error}</p>
              )}
              <button
                type="submit"
                className="bg-[#7D95EE] text-white p-2 rounded-xl mt-4"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
