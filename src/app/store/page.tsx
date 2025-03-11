"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoreId } from "@/app/actions/auth";

function AdminPage() {
  const router = useRouter();
  // const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStoreId() {
      const storedStoreId = await getStoreId();

      if (!storedStoreId) {
        router.push("/login?error=You are not assigned to any store.");
      } else {
        // setStoreId(storedStoreId);
        router.push(`/caldera/${storedStoreId}/report`);
      }
    }

    fetchStoreId();
  }, [router]);

  return <div>Loading...</div>;
}

export default AdminPage;
