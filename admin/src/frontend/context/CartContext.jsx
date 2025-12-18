import React, { createContext, useState, useCallback } from "react";

export const CartContext = createContext();

export function CartProvider({ children, onAddToCart }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback(
    (product) => {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (item) =>
            item.productId === product.productId && item.size === product.size
        );

        if (existingItem) {
          if (onAddToCart) {
            onAddToCart(product.name);
          }
          return prevItems.map((item) =>
            item.productId === product.productId && item.size === product.size
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          );
        }

        if (onAddToCart) {
          onAddToCart(product.name);
        }
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      });
    },
    [onAddToCart]
  );

  const removeFromCart = useCallback((productId, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId, size, quantity) => {
      if (quantity <= 0) {
        removeFromCart(productId, size);
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity }
              : item
          )
        );
      }
    },
    [removeFromCart]
  );

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
