import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/report"); // Redirect on the server before rendering
}
