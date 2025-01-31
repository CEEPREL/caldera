"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface StoreContextType {
  storeId: string | null;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    const pathParts = pathname.split("/");
    const storeIndex = pathParts.indexOf("stores");
    if (storeIndex !== -1 && pathParts[storeIndex + 1]) {
      setStoreId(pathParts[storeIndex + 1]);
    } else {
      setStoreId(null);
    }
  }, [pathname]);

  return (
    <StoreContext.Provider value={{ storeId }}>
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
