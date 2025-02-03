import React from "react";
import { redirect } from "next/navigation";

function page() {
  return redirect("/login");
}

export default page;
