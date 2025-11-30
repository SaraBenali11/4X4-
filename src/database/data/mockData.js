/**
 * Mock data for development and testing
 * Separated from components for better maintainability
 */

import image1 from '../../frontend/assets/images/image.png';
import image2 from '../../frontend/assets/images/img2.png';
import image3 from '../../frontend/assets/images/img3.png';

export const carouselSlides = [
  {
    id: 1,
    src: image1,
    alt: 'Modern Fashion',
    subtitle: 'Pour chaque occasion',
    title: 'Style Moderne',
  },
  {
    id: 2,
    src: image2,
    alt: 'Evening Gown',
    subtitle: 'Sophistication Intemporelle',
    title: 'Tenue de Soirée',
  },
  {
    id: 3,
    src: image3,
    alt: 'Elegant Collection',
    subtitle: 'Nouvelle Arrivée 2025',
    title: 'Collection Élégance',
  },
];

export const newProducts = [
  {
    id: 1,
    image: image1,
    name: 'Abaya Élégante Beige',
    category: 'Abaya',
    price: 12500,
    oldPrice: null,
    isNew: true,
  },
  {
    id: 2,
    image: image2,
    name: 'Robe Longue Crème',
    category: 'Robes',
    price: 9800,
    oldPrice: null,
    isNew: true,
  },
  {
    id: 3,
    image: image3,
    name: 'Tunique Brodée Beige',
    category: 'Hauts',
    price: 7200,
    oldPrice: null,
    isNew: true,
  },
];

export const customerReviews = [
  {
    id: 1,
    name: 'Amira K.',
    city: 'Alger',
    text: 'La qualité est exceptionnelle! Les tissus sont luxueux et la coupe est parfaite. Je recommande vivement Boubaaya.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah M.',
    city: 'Oran',
    text: 'Des designs élégants et modernes. Le service client est excellent et la livraison rapide. Ma boutique préférée!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    rating: 5,
  },
  {
    id: 3,
    name: 'Leila B.',
    city: 'Constantine',
    text: 'J\'adore la collection Boubaaya! Chaque pièce est unique et représente parfaitement l\'élégance algérienne moderne.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    rating: 5,
  },
];

export const navigationLinks = [
  { id: 'accueil', label: 'Accueil', href: '#accueil' },
  { id: 'produits', label: 'Produits', href: '#produits' },
  { id: 'inspiration', label: 'Inspiration', href: '#inspiration' },
  { id: 'creer-tenue', label: 'Créer Tenue', href: '#creer-tenue' },
];

export const footerLinks = {
  navigation: [
    { label: 'Accueil', href: '/' },
    { label: 'Catégories', href: '/categories' },
    { label: 'Produits', href: '/produits' },
    { label: 'Inspiration', href: '/inspiration' },
  ],
};