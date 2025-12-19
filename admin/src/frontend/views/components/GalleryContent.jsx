import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import OutfitGrid from "./OutfitGrid";
import "../styles/gallery.css";
import { supabase } from "../../config/supabase";

const GalleryContent = () => {
  const [search, setSearch] = useState("");
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const { data, error } = await supabase
          .from("outfits")
          .select(`
            *,
            outfit_products (
               product:products (*)
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching outfits:", error);
          return;
        }




        const formatted = data.map(o => {
          const products = o.outfit_products?.map(op => op.product) || [];
          return {
            id: o.id,
            title: o.title,
            description: o.description,
            // Prefer outfit image, then first product image, then placeholder
            image: o.image ? o.image : (products.length > 0 ? products[0].image_url : "https://via.placeholder.com/300?text=No+Image"),
            author: "Sutraty",
            products: products
          };
        });

        setOutfits(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, []);

  const filteredOutfits = outfits.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <main className="gallery-content">
      <SearchBar
        value={search}
        onChange={setSearch}
        count={filteredOutfits.length}
      />
      <OutfitGrid outfits={filteredOutfits} />
    </main>
  );
};

export default GalleryContent;
