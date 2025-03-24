"use client";
import { ReactNode, createContext, useContext } from "react";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastContextType = {
  showToast: (message: string, type?: TypeOptions) => void;
};

export const toastContext = createContext<ToastContextType | undefined>(
  undefined
);

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

export function useToastContext() {
  const context = useContext(toastContext);

  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }

  return context;
}
