import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import ProductDetail from "../components/ProductDetail";
import { newProducts } from "../../../database/data/mockData";

// Enhanced products data with additional details for product page
const productsData = [
  {
    id: "p1",
    image: newProducts[0].image,
    name: "Abaya Élégante Beige",
    category: "Abaya",
    price: 8500,
    oldPrice: 0,
    isNew: true,
    description:
      "Une abaya élégante en tissu de qualité supérieure, parfaite pour toutes occasions.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Beige", "Noir", "Blanc"],
    features: [
      "Tissu de qualité",
      "Coupe moderne",
      "Confortable",
      "Lavable en machine",
    ],
    availability: ["Alger Centre", "Oran", "Constantine"],
  },
  {
    id: "p2",
    image: newProducts[1].image,
    name: "Pantalon Chic",
    category: "Pantalon",
    price: 4200,
    oldPrice: 0,
    isNew: true,
    description: "Pantalon chic avec une coupe moderne et confortable.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Noir", "Beige", "Gris"],
    features: ["Coupe moderne", "Confortable", "Tissu premium", "Polyvalent"],
    availability: ["Alger Centre", "Oran", "Constantine"],
  },
  {
    id: "p3",
    image: newProducts[2].image,
    name: "T-shirt Bleu",
    category: "Haut",
    price: 1200,
    oldPrice: 0,
    isNew: false,
    description:
      "T-shirt bleu de qualité supérieure, confortable pour le quotidien.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Bleu", "Blanc", "Noir"],
    features: [
      "Tissu respirant",
      "Coupe ajustée",
      "Lavable en machine",
      "Confortable",
    ],
    availability: ["Alger Centre", "Oran", "Constantine"],
  },
];

/**
 * Product detail page component
 * Displays detailed information about a specific product
 */
function Productdetpage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the product by ID (id is a string like "p1", "p2", etc.)
  const product = productsData.find((p) => p.id === id);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="homepage">
      <Header />
      <main>
        <ProductDetail product={product} onBack={handleBack} />
      </main>
      <Footer />
    </div>
  );
}

export default Productdetpage;
