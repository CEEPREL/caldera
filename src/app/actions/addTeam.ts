export async function addTeamAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const fullName = formData.get("fullName") as string;
  const password = formData.get("password") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const userName = formData.get("userName") as string;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/addstaff`,
      {
        method: "POST",
        body: JSON.stringify({ fullName, password, phoneNumber, userName }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      console.log(data);
      return { success: true };
    } else {
      return { error: data.message || "failed to add team member" };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
