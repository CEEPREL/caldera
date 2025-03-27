"use server";
import { cookies } from "next/headers";

export interface UpdateStaffInfoProp {
  fullName: string;
  phoneNumber: string;
  userName: string;
  storeId?: string;
  storeName?: string;
  email?: string;
}

// Update staff
export async function updateStaff(staffInfo: UpdateStaffInfoProp, id: string) {
  const { fullName, phoneNumber, userName, storeId, storeName, email } =
    staffInfo;

  const token = (await cookies()).get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/staff/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    method: "PUT",
    body: JSON.stringify({
      fullName,
      phoneNumber,
      userName,
      storeId,
      storeName,
      email,
    }),
  });

  console.log(
    JSON.stringify({
      fullName,
      phoneNumber,
      userName,
      storeId,
      storeName,
      email,
    })
  );

  console.log(
    JSON.stringify({
      fullName,
      phoneNumber,
      userName,
      storeId,
      storeName,
      email,
    })
  );
  const data = await res.json();
  return { message: data.message };
}
