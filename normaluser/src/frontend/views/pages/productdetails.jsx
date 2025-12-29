import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductDetail from "../components/ProductDetail";
import { productService } from "../../services/productService";

function Productdetpage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProduct(id);

        if (data) {
          // Transform data to match ProductDetail component expectations
          const firstImage = data.product_images && data.product_images.length > 0
            ? data.product_images[0].image_url
            : 'https://via.placeholder.com/300';

          const transformed = {
            id: data.id,
            name: data.name,
            category: data.categories?.name || data.category || "Catégorie",
            price: data.promo_price || data.price,
            oldPrice: data.promo_price ? data.price : null,
            description: data.description || "Aucune description disponible.",
            image: firstImage,
            images: data.product_images?.map(img => img.image_url) || [firstImage],
            sizes: data.product_sizes?.map(s => s.size) || [],
            colors: data.product_colors?.map(c => c.color) || [],
            isNew: data.status === 'new' || data.is_new,
            status: data.status,
            features: [
              "Tissu de haute qualité",
              "Coupe élégante et confortable",
              "Facile d'entretien",
              "Design moderne"
            ]
          };
          setProduct(transformed);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/produits");
  };

  return (
    <div className="homepage">
      <Header />
      <main>
        {loading ? (
          <div style={{ padding: "50px", textAlign: "center" }}>Chargement...</div>
        ) : product ? (
          <ProductDetail product={product} onBack={handleBack} />
        ) : (
          <div style={{ padding: "50px", textAlign: "center" }}>Produit introuvable.</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Productdetpage;
