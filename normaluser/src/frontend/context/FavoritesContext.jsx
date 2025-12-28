import React, { createContext, useState, useCallback, useEffect } from "react";

export const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = "sutraty_favorites";

export function FavoritesProvider({ children }) {
  // Initialize from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      return [];
    }
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

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
