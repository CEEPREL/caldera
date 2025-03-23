import { ReactNode, createContext, useContext } from "react";
import { ToastContainer, TypeOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastContextType = {
  showToast: (message: string, type?: TypeOptions) => void;
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = (message: string, type: TypeOptions = "success") => {
    toast(message, { type });
  };
  return (
    <toastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </toastContext.Provider>
  );
}

export const toastContext = createContext<ToastContextType | null>(null);
export function useToastContext() {
  return useContext(toastContext);
}
