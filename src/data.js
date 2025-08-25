// src/data.js

import bcrypt from "bcryptjs";

// Utilisateurs par défaut (hash du mot de passe "1234")
export const utilisateurs = [
  { username: "admin", password: bcrypt.hashSync("1234", 10) },
  { username: "user1", password: bcrypt.hashSync("pass123", 10) }
];

// Produits par défaut
export const produits = [
  { id: 1, nom: "Produit A", quantite: 10, prix: 500 },
  { id: 2, nom: "Produit B", quantite: 5, prix: 1200 },
  { id: 3, nom: "Produit C", quantite: 2, prix: 750 },
];
