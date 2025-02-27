interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Cart {
  cartItems: Product[];
}

interface AddToCartProps {
  item: Product;
  cart: Cart;
  setCart: (cart: Cart) => void;
}

export const addToCart: ({ item, cart, setCart }: AddToCartProps) => void = ({
  item,
  cart,
  setCart,
}) => {
  const setCartToState = () => {
    const storedCart = localStorage.getItem("cart");
    const initialCart: Cart = storedCart
      ? JSON.parse(storedCart)
      : { cartItems: [] };
    setCart(initialCart);
  };

  const isItemExist = cart.cartItems.find((i) => i.id === item.id);
  let newCartItems: Product[];

  if (isItemExist) {
    newCartItems = cart.cartItems.map((i) => (i.id === item.id ? item : i));
  } else {
    newCartItems = [...cart.cartItems, item];
  }

  localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
  setCartToState();
};
