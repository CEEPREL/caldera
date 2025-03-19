"use client";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type SetState<T> = Dispatch<SetStateAction<T>>;

export interface Product {
  categoryId: string;
  categoryName: string;
  productId: string;
  productName: string;
  price: number;
  costPrice?: number;
  quantity: number;
  orderId?: string;
  userName?: string;
  storeName?: string;
}

export interface ProductOrder {
  categoryId: string;
  categoryName: string;
  productId: string;
  productName: string;
  requestQuantity: number;
}

interface CartContextType {
  cart: Product[];
  setCart: SetState<Product[]>;
  totalAmount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (p) => p.productId === product.productId
      );
      if (existingProduct) {
        return prevCart.map((p) =>
          p.productId === product.productId
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) =>
      prevCart.filter((product) => product.productId !== id)
    );
  };

  // Update product quantity in cart
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((p) => (p.productId === id ? { ...p, quantity } : p))
    );
    console.log(quantity);
  };

  // Recalculate total amount whenever the cart changes
  useEffect(() => {
    const calculateTotalAmount = () => {
      const total = cart.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [cart]);
  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
