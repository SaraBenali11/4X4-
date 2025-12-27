import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/outfitspage.css";
import GalleryContent from "../components/GalleryContent";

export default function OutfitsPage() {
  return (
    <div className="outfits-page">
      <Header />
      <GalleryContent />
      <Footer />
    </div>
  );
}
