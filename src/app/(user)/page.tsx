import { redirect } from "next/navigation";

function Adminpage() {
  return redirect("/user/inventory");
}

export default Adminpage;
