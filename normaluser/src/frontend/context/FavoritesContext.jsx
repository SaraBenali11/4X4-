import React, { createContext, useState, useCallback } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = useCallback((product) => {
    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find(
        (fav) => fav.productId === product.productId
      );
      if (exists) return prevFavorites;
      return [...prevFavorites, product];
    });
  }, []);

  const removeFavorite = useCallback((productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.productId !== productId)
    );
  }, []);

  const isFavorite = useCallback(
    (productId) => {
      return favorites.some((fav) => fav.productId === productId);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (product) => {
      if (isFavorite(product.productId)) {
        removeFavorite(product.productId);
      } else {
        addFavorite(product);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
