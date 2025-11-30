/**
 * Admin panel mock data
 * Statistics, orders, and product data for admin dashboard
 */

import { FiBox, FiClipboard, FiTruck } from 'react-icons/fi';
import image1 from '../../frontend/assets/images/image.png';
import image2 from '../../frontend/assets/images/img2.png';
import image3 from '../../frontend/assets/images/img3.png';

export const adminStats = [
  { title: 'Produits', value: 6, icon: FiBox },
  { title: 'Commandes en attente', value: 1, icon: FiClipboard },
  { title: 'Commandes envoyées', value: 3, icon: FiTruck },
];

export const pendingOrders = [
  {
    id: 1,
    name: 'Fatima Zahra',
    status: 'En attente',
    product: 'Abaya Élégante Beige',
    phone: '0555123456',
    address: 'Hydra, Alger',
    size: 'M',
    wilaya: 'Alger',
    date: '2025-11-15',
    notes: '',
  },
  {
    id: 2,
    name: 'Khadija Benali',
    status: 'Confirmée',
    product: 'Robe de Soirée Rose',
    phone: '0661234567',
    address: 'Sidi Bel Abbès',
    size: 'L',
    wilaya: 'Oran',
    date: '2025-11-16',
    notes: 'Livraison urgente svp',
  },
];

export const receivedOrders = [
  {
    id: 1,
    name: 'Manar Boukenouche',
    status: 'Reçue',
    product: 'Abaya Élégante Beige',
    phone: '0555592038',
    address: 'Taher, Jijel',
    size: 'M',
    wilaya: 'Jijel',
    date: '2025-11-20',
  },
  {
    id: 2,
    name: 'Laib Nadjet',
    status: 'Retournée',
    product: 'Abaya Noir',
    phone: '0555123456',
    address: 'Sidi Mabouk, Constantine',
    size: 'XL',
    wilaya: 'Constantine',
    date: '2025-11-15',
  },
];

export const productsData = [
  {
    id: 1,
    produit: 'Abaya Élégante Beige',
    categorie: 'Abaya',
    prix: 8500,
    statuts: ['Nouveau', 'Best Seller'],
  },
  {
    id: 2,
    produit: 'Robe Longue Crème',
    categorie: 'Robes',
    prix: 6500,
    statuts: ['Nouveau'],
  },
  {
    id: 3,
    produit: 'Ensemble Chic Nude',
    categorie: 'Ensembles',
    prix: 7200,
    statuts: ['Best Seller'],
  },
  {
    id: 4,
    produit: 'Robe de Soirée Rose',
    categorie: 'Robes',
    prix: 9500,
    statuts: ['Best Seller'],
  },
  {
    id: 5,
    produit: 'Abaya Traditionnelle',
    categorie: 'Abaya',
    prix: 7800,
    statuts: [],
  },
  {
    id: 6,
    produit: 'Tunique Brodée Beige',
    categorie: 'Hauts',
    prix: 5200,
    statuts: ['Nouveau'],
  },
];

export const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const availableColors = [
  'Noir',
  'Rose',
  'Rose Clair',
  'Beige',
  'Blanc',
  'Vert',
  'Bleu',
  'Marron',
  'Rouge',
];

export const carouselSlidesAdmin = [
  {
    id: 1,
    title: 'Collection Élégance',
    subtitle: 'NOUVELLE ARRIVÉE 2025',
    image: image1,
    alt: 'Collection Élégance - Fashion 2025',
  },
  {
    id: 2,
    title: 'Style Raffiné',
    subtitle: 'COLLECTION PRINTEMPS',
    image: image2,
    alt: 'Style Raffiné - Spring Collection',
  },
  {
    id: 3,
    title: 'Haute Couture',
    subtitle: 'ÉDITION LIMITÉE',
    image: image3,
    alt: 'Haute Couture - Limited Edition',
  },
];