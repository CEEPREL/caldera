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

interface Product {
  categoryId: string;
  categoryName: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  orderId?: string;
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
  sendCartToDB: () => Promise<void>;
  addProductOrder: () => Promise<void>;
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
  };

  // Send cart to database
  const sendCartToDB = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Cart sent to database successfully", responseData);
    } catch (error) {
      console.error("Error sending cart:", error);
    }
  };

  // Send product order request
  const addProductOrder = async () => {
    const orderPayload: ProductOrder[] = cart.map((product) => ({
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      productId: product.productId,
      productName: product.productName,
      requestQuantity: product.quantity,
    }));

    try {
      await fetch("/api/purchase-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderPayload }),
      });

      // Optionally, clear the cart after order is placed
      setCart([]);
    } catch (error) {
      console.error("Error sending product to purchase order:", error);
    }
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
        sendCartToDB,
        addProductOrder,
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
