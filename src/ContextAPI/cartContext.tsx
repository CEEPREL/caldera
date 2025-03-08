import { createContext, useContext, useEffect, useState } from "react";

// Define the product type
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  categoryId: string;
  productId: string;
}

interface CartContextType {
  cart: Product[];
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

  // Function to update the total amount whenever cart is updated
  const calculateTotalAmount = () => {
    const total = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setTotalAmount(total);
  };

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevCart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove product from cart
  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((product) => product.id !== id));
  };

  // Update product quantity in cart
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const sendCartToDB = async () => {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      console.log("Cart sent to database successfully");
    } catch (error) {
      console.error("Error sending cart:", error);
    }
  };

  const addProductOrder = async () => {
    const orderPayload = cart.map((product) => ({
      categoryId: product.categoryId,
      categoryName: product.category,
      productId: product.productId,
      productName: product.name,
      requestQuantity: product.quantity,
    }));

    try {
      await fetch("/api/purchase-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderPayload }),
      });
      console.log("Products added to purchase order successfully");
    } catch (error) {
      console.error("Error sending product to purchase order:", error);
    }
  };

  // Recalculate total amount whenever the cart changes
  useEffect(() => {
    calculateTotalAmount();
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
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
