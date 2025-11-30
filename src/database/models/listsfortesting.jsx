import React from 'react';
import { FiBox, FiClipboard, FiTruck } from 'react-icons/fi';

// Stats data
export const stats = [
  {
    icon: <FiClipboard size={24} />,
    title: 'Commandes en attente',
    value: '12',
  },
  {
    icon: <FiBox size={24} />,
    title: 'Total Produits',
    value: '45',
  },
  {
    icon: <FiTruck size={24} />,
    title: 'Commandes livrées',
    value: '128',
  },
];

// Initial orders data
export const initialOrders = [
  {
    id: 1,
    name: 'Amina Benali',
    status: 'en_attente',
    product: 'Robe Longue Crème',
    size: 'M',
    phone: '0555123456',
    address: '12 Rue des Roses',
    wilaya: 'Alger',
    date: '2024-01-15',
    notes: 'Livraison après 17h',
  },
  {
    id: 2,
    name: 'Sarah Mansouri',
    status: 'en_attente',
    product: 'Ensemble Chic Nude',
    size: 'L',
    phone: '0666234567',
    address: '45 Avenue de la Liberté',
    wilaya: 'Oran',
    date: '2024-01-16',
    notes: '',
  },
  {
    id: 3,
    name: 'Leila Kaddour',
    status: 'en_attente',
    product: 'Abaya Élégante Beige',
    size: 'S',
    phone: '0777345678',
    address: '8 Rue du Marché',
    wilaya: 'Constantine',
    date: '2024-01-17',
    notes: 'Appeler avant livraison',
  },
];

// Received/Returned orders data
export const recuesOrders = [
  {
    id: 101,
    name: 'Fatima Zerrouki',
    status: 'livree',
    product: 'Robe de Soirée Rose',
    size: 'M',
    phone: '0555987654',
    address: '23 Boulevard Mohammed V',
    wilaya: 'Blida',
    date: '2024-01-10',
    notes: '',
  },
  {
    id: 102,
    name: 'Naima Boudiaf',
    status: 'retournee',
    product: 'Tunique Brodée Beige',
    size: 'L',
    phone: '0666876543',
    address: '67 Rue Larbi Ben Mhidi',
    wilaya: 'Sétif',
    date: '2024-01-12',
    notes: 'Taille incorrecte',
  },
];

// Products data
export const produitsData = [
  {
    id: 1,
    name: 'Robe Longue Crème',
    price: 6500,
    category: 'Robes',
    sizes: ['S', 'M', 'L'],
    colors: ['Crème', 'Beige'],
    image: '/images/robe-creme.jpg',
    stock: 15,
  },
  {
    id: 2,
    name: 'Ensemble Chic Nude',
    price: 7200,
    category: 'Ensembles',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Nude', 'Rose Clair'],
    image: '/images/ensemble-nude.jpg',
    stock: 8,
  },
  {
    id: 3,
    name: 'Abaya Élégante Beige',
    price: 8500,
    category: 'Abaya',
    sizes: ['S', 'M', 'L'],
    colors: ['Beige', 'Noir'],
    image: '/images/abaya-beige.jpg',
    stock: 12,
  },
  {
    id: 4,
    name: 'Robe de Soirée Rose',
    price: 9500,
    category: 'Robes',
    sizes: ['S', 'M', 'L'],
    colors: ['Rose', 'Bordeaux', 'Bleu Nuit'],
    image: '/images/robe-rose.jpg',
    stock: 5,
  },
  {
    id: 5,
    name: 'Tunique Brodée Beige',
    price: 5200,
    category: 'Hauts',
    sizes: ['M', 'L', 'XL'],
    colors: ['Beige', 'Blanc'],
    image: '/images/tunique-beige.jpg',
    stock: 20,
  },
];
