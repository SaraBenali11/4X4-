import OutfitCard from "./OutfitCard";

const OutfitGrid = ({ outfits }) => {
  return (
    <section className="outfit-grid">
      {outfits.map((outfit) => (
        <OutfitCard key={outfit.id} outfit={outfit} />
      ))}
    </section>
  );
};

export default OutfitGrid;
