const API_URL = "http://localhost:3000/api"; // URL de base de l'API

// Fonction pour s'inscrire
export const signup = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Fonction pour se connecter
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

// Fonction pour récupérer les produits avec authentification
export const fetchProducts = async (token) => {
  const response = await fetch(`${API_URL}/stuff`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

// Fonction pour récupérer les produits sans authentification

export const fetchPublicProducts = async () => {
  try {
    console.log("Début fetchPublicProducts");
    const response = await fetch(`${API_URL}/stuff`);
    console.log("Réponse fetchPublicProducts :", response);
    if (!response.ok) {
      const errorResponse = await response.text();
      console.error("Réponse erreur :", errorResponse);
      throw new Error("Erreur lors de la récupération des produits.");
    }
    return response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    throw error;
  }
};

// Fonction pour modifier un produit
export const updateProduct = async (
  token,
  productId,
  updatedProduct,
  image
) => {
  const formData = new FormData();

  formData.append("thing", JSON.stringify(updatedProduct));
  if (image) formData.append("image", image);

  console.log("FormData envoyé pour update :");
  formData.forEach((value, key) => console.log(key, value));

  const response = await fetch(`${API_URL}/stuff/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorResponse = await response.text();
    console.error("Réponse erreur :", errorResponse);
    throw new Error("Erreur lors de la modification du produit.");
  }

  return response.json();
};

// fonction pour créer un produit
export const addProduct = async (token, product, image) => {
  const formData = new FormData();

  // Transformer l'objet product en JSON et l'ajouter dans un champ "thing"
  formData.append("thing", JSON.stringify(product));

  formData.append("image", image); // Fichier image

  console.log("FormData envoyé :");
  formData.forEach((value, key) => console.log(key, value)); // Vérification

  const response = await fetch(`${API_URL}/stuff`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // Envoi de FormData
  });

  if (!response.ok) {
    const errorResponse = await response.text();
    console.error("Réponse erreur :", errorResponse);
    throw new Error("Erreur lors de l'ajout du produit.");
  }

  return response.json();
};

// Fonction pour supprimer un produit
export const deleteProduct = async (token, productId) => {
  const response = await fetch(`${API_URL}/stuff/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};
