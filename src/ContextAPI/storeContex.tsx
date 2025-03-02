"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { fetchStores } from "@/app/actions/fetch";

interface StoreContextType {
  storeId: string | null;
  stateObj: Record<string, any[]>; // State-wise grouped stores
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [stateObj, setStateObj] = useState<Record<string, any[]>>({});

  // Function to group stores by state
  const groupStores = (stores: any[]) => {
    return stores.reduce((acc, store) => {
      const { state } = store;
      if (!acc[state]) {
        acc[state] = [];
      }
      acc[state].push(store);
      return acc;
    }, {} as Record<string, any[]>);
  };

  // Extract storeId from pathname
  useEffect(() => {
    const pathParts = pathname.split("/");
    const storeIndex = pathParts.indexOf("stores");
    const addStore = pathParts.includes("new");

    if (storeIndex !== -1 && pathParts[storeIndex + 1] && !addStore) {
      setStoreId(pathParts[storeIndex + 1]);
    } else {
      setStoreId(null);
    }
  }, [pathname]);

  // Fetch and group stores
  useEffect(() => {
    const getStores = async () => {
      try {
        const data = await fetchStores();

        if (Array.isArray(data)) {
          const groupedStores = groupStores(data);
          setStateObj(groupedStores);
        } else {
          console.error("Invalid stores data received:", data);
          setStateObj({}); // Reset to empty object if data is invalid
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
        setStateObj({}); // Ensure state doesn't break on error
      }
    };

    getStores();
  }, []);

  return (
    <StoreContext.Provider value={{ storeId, stateObj }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook to use store context
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
