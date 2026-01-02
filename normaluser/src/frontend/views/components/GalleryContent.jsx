import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import OutfitGrid from "./OutfitGrid";
import { supabase } from "../../config/supabase";
import "../styles/gallery.css";

const GalleryContent = () => {
  const [search, setSearch] = useState("");
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("outfits")
        .select(
          `
          *,
          outfit_products (
            product:products (*)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("Fetched outfits data:", data);

      const formattedData = data.map((outfit) => ({
        id: outfit.id,
        image: outfit.image,
        title: outfit.title,
        author: outfit.author || "Anonymous",
        products: outfit.outfit_products?.map((op) => op.product) || [],
      }));

      console.log("Formatted outfits:", formattedData);
      setOutfits(formattedData);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching outfits:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOutfits = outfits.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main className="gallery-content">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Chargement des tenues...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="gallery-content">
        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          Erreur: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="gallery-content">
      <SearchBar
        value={search}
        onChange={setSearch}
        count={filteredOutfits.length}
      />
      {outfits.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Aucune tenue disponible pour le moment.</p>
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Les tenues créées dans le panneau d'administration apparaîtront ici.
          </p>
        </div>
      ) : (
        <OutfitGrid outfits={filteredOutfits} />
      )}
    </main>
  );
};

export default GalleryContent;
