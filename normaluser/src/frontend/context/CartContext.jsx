import React, { createContext, useState, useCallback, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children, onAddToCart }) {
  const [cartItems, setCartItems] = useState(() => {
  try {
    const stored = localStorage.getItem("sutraty_cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
});

  const addToCart = useCallback(
    (product) => {
      setCartItems((prevItems) => {
        // Check if item exists with same productId, size, and color
        // This allows adding different items: different products, sizes, or colors
        const existingItem = prevItems.find(
          (item) =>
            item.productId === product.productId &&
            item.size === product.size &&
            item.color === product.color
        );

        if (existingItem) {
          // If same product with same size and color exists, increase quantity
          if (onAddToCart) {
            onAddToCart(product.name);
          }
          return prevItems.map((item) =>
            item.productId === product.productId &&
            item.size === product.size &&
            item.color === product.color
              ? { ...item, quantity: item.quantity + (product.quantity || 1) }
              : item
          );
        }

        // Different item (different product, size, or color) - add as new item
        if (onAddToCart) {
          onAddToCart(product.name);
        }
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      });
    },
    [onAddToCart]
  );

  const removeFromCart = useCallback((productId, size, color) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId, size, quantity, color) => {
      if (quantity <= 0) {
        removeFromCart(productId, size, color);
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId &&
            item.size === size &&
            item.color === color
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

  // Persist cart in localStorage
  useEffect(() => {
    localStorage.setItem("sutraty_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("sutraty_cart");
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
