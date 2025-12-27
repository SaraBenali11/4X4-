// Lightweight mock data used by tests / dev

// Use public asset URLs so CRA can serve images from /public
const slide1 = "/assets/images/image.png";
const slide2 = "/assets/images/img2.png";
const slide3 = "/assets/images/img3.png";

export const navigationLinks = [
  { id: "home", href: "/", label: "Accueil" },
  { id: "produits", href: "/produits", label: "Produits" },
  { id: "contact", href: "/contact-us", label: "Contact" },
  { id: "outfits", href: "/outfits", label: "Tenues" },
];

export const footerLinks = {
  navigation: [
    { href: "/", label: "Accueil" },
    { href: "/produits", label: "Produits" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact-us", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
};

export const carouselSlides = [
  {
    id: "s1",
    src: slide1,
    alt: "Collection principale",
    subtitle: "Nouvelle Collection",
    title: "Tradition & Modernité",
  },
  {
    id: "s2",
    src: slide2,
    alt: "Tendance",
    subtitle: "Meilleures ventes",
    title: "Styles populaires",
  },
  {
    id: "s3",
    src: slide3,
    alt: "Look",
    subtitle: "Nouveautés",
    title: "Inspiration",
  },
];

export const customerReviews = [
  {
    id: "c1",
    text: "Très belle qualité et livraison rapide.",
    name: "Amina",
    city: "Alger",
    avatar: slide1,
    rating: 5,
  },
  {
    id: "c2",
    text: "Service client à l'écoute.",
    name: "Nadia",
    city: "Oran",
    avatar: slide2,
    rating: 4,
  },
];

export const newProducts = [
  {
    id: "p1",
    image: slide1,
    name: "Abaya Élégante Beige",
    category: "Abaya",
    price: 8500,
    oldPrice: 0,
    isNew: true,
  },
  {
    id: "p2",
    image: slide2,
    name: "Pantalon Chic",
    category: "Pantalon",
    price: 4200,
    oldPrice: 0,
    isNew: true,
  },
  {
    id: "p3",
    image: slide3,
    name: "T-shirt Bleu",
    category: "Haut",
    price: 1200,
    oldPrice: 0,
    isNew: false,
  },
];

const mockData = {
  navigationLinks,
  footerLinks,
  carouselSlides,
  customerReviews,
  newProducts,
};

export default mockData;
