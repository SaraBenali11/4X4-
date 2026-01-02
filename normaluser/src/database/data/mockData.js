// Lightweight mock data used by tests / dev

import slide1 from "../../frontend/assets/images/image.png";
import slide2 from "../../frontend/assets/images/img2.png";
import slide3 from "../../frontend/assets/images/img3.png";

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
    { href: "/outfits", label: "Tenues" },
    { href: "/inspiration", label: "Inspiration" },
    { href: "/contact-us", label: "Contact" },
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
