import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FavoritesContext } from "../../context/FavoritesContext";
import "../styles/ProductCard.css";

const OutfitCard = ({ outfit }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const favorited = isFavorite(`outfit-${outfit.id}`);

  const handleCardClick = () => {
    navigate(`/outfit/${outfit.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(`outfit-${outfit.id}`, {
      ...outfit,
      type: "outfit",
    });
  };

  return (
    <article
      className="pcard"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && handleCardClick()
      }
    >
      <div className="pcard-image">
        <img src={outfit.image} alt={outfit.title} loading="lazy" />
        <button
          className="pcard-fav"
          aria-label="Add to wishlist"
          onClick={handleFavoriteClick}
        >
          {favorited ? "♥" : "♡"}
        </button>
      </div>

      <div className="pcard-body">
        <h3 className="pcard-title">{outfit.title}</h3>
        <p className="pcard-cat">Tenue • {outfit.products.length} produits</p>

        <div className="pcard-price">
          <span className="current">&nbsp;</span>
        </div>

        <button className="pcard-add-to-cart" aria-label="View outfit">
          Voir la tenue
        </button>
      </div>
    </article>
  );
};

export default OutfitCard;
