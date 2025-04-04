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
import { getStoreData } from "@/app/actions/auth";
import { Order } from "@/app/caldera/[storeId]/daily-sales/page";
import { SetState } from "./cartContext";

// Store type definition
interface Store {
  storeId: string;
  storeLocation: string;
  storeName: string;
  state: string;
  phoneNumber: string;
}

interface StoreData {
  status: boolean;
  data: {
    userId: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    userName: string;
    email: string;
    storeId: string;
    storeName: string;
    profileImg: object;
    ipAddress: null | string;
    createdDate: null | string;
    createdTime: null | string;
    loginDate: string;
    loginTime: string;
    login: boolean;
    status: string;
  };
  token: string;
}

interface Product {
  createdDate: string;
  createdTime: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  storeData: StoreData;
}

interface ProductsProps {
  categoryName: string;
  categoryId: string;
  product: Product[];
}

// Context type definition
interface StoreContextType {
  storeId: string | null;
  stateObj: Record<string, Store[]>;
  products: ProductsProps[];
  stores: Store[];
  salesRecData: Order[];
  setSalesRecData: SetState<Order[]>;
  setStoreIdState: (storeId: string) => void;
  loading: boolean;
  storeData: StoreData | null;
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
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [salesRecData, setSalesRecData] = useState<Order[]>([]);

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
    const storedStoreId = localStorage.getItem("storeId");
    if (storedStoreId) {
      setStoreId(storedStoreId);
    }

    const pathParts = pathname.split("/");
    const storeId = pathParts[2];
    if (storeId) {
      setStoreId(storeId);
    } else {
      setStoreId(null);
    }
    console.log("this is storeId from context; ", storeId);
  }, [pathname]);
  const setStoreIdState = (storeId: string) => {
    localStorage.getItem("storeId");
    setStoreId(storeId);
  };

  // Fetch stores and products
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

        // Ensure stores are grouped correctly
        const groupedStores = Array.isArray(fetchedStores)
          ? groupStores(fetchedStores)
          : {};

        // Set grouped data
        setStateObj(groupedStores);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStateObj({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId, pathname]);

  // Fetch store data
  useEffect(() => {
    const fetchStoreData = async () => {
      const storedData = await getStoreData();
      setStoreData(storedData);
    };
    fetchStoreData();
  }, []);
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) {
        console.warn("No storeId found, skipping fetch.");
        return;
      }

      try {
        const storedData = await getStoreData();
        console.log("Fetched Store Data:", storedData);

        if (!storedData || storedData.status === false || !storedData.data) {
          console.error("Invalid store data received:", storedData);
          return;
        }

        setStoreData(storedData);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStoreData();
  }, [storeId]);
  return (
    <StoreContext.Provider
      value={{
        storeId,
        stateObj,
        products,
        stores,
        loading,
        storeData,
        salesRecData,
        setSalesRecData,
        setStoreIdState,
      }}
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
