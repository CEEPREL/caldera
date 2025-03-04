"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { fetchProduct, fetchStores } from "@/app/actions/fetch";

// Store type definition
interface Store {
  storeId: string;
  storeLocation: string;
  storeName: string;
  state: string;
  phoneNumber: string;
}

interface product {
  createdDate: string;

  createdTime: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
}

interface ProductsProps {
  categoryName: string;
  categoryId: string;
  product: product[];
}

// Context type definition
interface StoreContextType {
  storeId: string | null;
  stateObj: Record<string, Store[]>; // Grouped products and stores
  products: ProductsProps[]; // Raw product data
  stores: Store[]; // Raw store data
  loading: boolean;
}

// Create context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Provider component
export function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [stateObj, setStateObj] = useState<Record<string, Store[]>>({});
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to group stores by state
  const groupStores = (stores: Store[]): Record<string, Store[]> => {
    return stores.reduce((acc, store) => {
      if (!acc[store.state]) acc[store.state] = [];
      acc[store.state].push(store);
      return acc;
    }, {} as Record<string, Store[]>);
  };

  // Extract storeId from pathname
  useEffect(() => {
    const pathParts = pathname.split("/");
    const storeIndex = pathParts.indexOf("stores");
    const isNewStore = pathParts.includes("new");

    if (storeIndex !== -1 && pathParts[storeIndex + 1] && !isNewStore) {
      setStoreId(pathParts[storeIndex + 1]);
    } else {
      setStoreId(null);
    }
  }, [pathname]);

  // Fetch grouped products and stores
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both products and stores
        const [fetchedProducts, fetchedStores] = await Promise.all([
          fetchProduct(),
          fetchStores(),
        ]);

        // Save raw data for child components
        setProducts(fetchedProducts || []);
        setStores(fetchedStores || []);

        // Ensure both responses are arrays before processing
        const groupedProducts = Array.isArray(fetchedProducts)
          ? groupStores(fetchedProducts)
          : {};
        const groupedStores = Array.isArray(fetchedStores)
          ? groupStores(fetchedStores)
          : {};

        // Merge results
        setStateObj({ ...groupedProducts, ...groupedStores });
      } catch (error) {
        console.error("Error fetching data:", error);
        setStateObj({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <StoreContext.Provider
      value={{ storeId, stateObj, products, stores, loading }}
    >
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
