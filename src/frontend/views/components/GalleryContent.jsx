import { useState } from "react";
import SearchBar from "./SearchBar";
import OutfitGrid from "./OutfitGrid";
import outfitsData from "../data/outfits";
import "../styles/gallery.css";

const GalleryContent = () => {
  const [search, setSearch] = useState("");

  const filteredOutfits = outfitsData.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

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
