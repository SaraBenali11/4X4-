import React from "react";
import ProductCard from "../components/ProductCard";
import { newProducts } from '../../../database/data/mockData';

export default function meilleurs() {
  return (
    <div className="meilleurs_container">
      {newProducts.slice(0, 3).map((p) => (
        <ProductCard
          key={p.id}
          image={p.image}
          name={p.name}
          category={p.category}
          price={p.price}
          isNew={p.isNew}
          productId={p.id}
        />
      ))}
    </div>
  );
}
