import {
  fetchPublicProducts,
  signup,
  login,
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./api.js";

/************************************************** 
// s'inscrire à la base de données
************************************************** */

const signUpEmail = document.getElementById("signUpEmail");
const signUpPassword = document.getElementById("signUpPassword");
const signUpSubmit = document.getElementById("signUpSubmit");

signUpSubmit.addEventListener("click", (event) => {
  event.preventDefault();

  let email = signUpEmail.value;
  let password = signUpPassword.value;

  signup(email, password);
});

/***************************************************
// Se connecter à la base de donnée
************************************************** */

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginSubmit = document.getElementById("loginSubmit");

loginSubmit.addEventListener("click", async (event) => {
  event.preventDefault();

  let email = loginEmail.value;
  let password = loginPassword.value;

  const response = await login(email, password);

  if (response.token) {
    const token = response.token;
    localStorage.setItem("token", token);
    fetchProducts(token);
    const products = await fetchProducts(token);

    localStorage.setItem("Things", JSON.stringify(products));
    console.log(token, products);
    showGallery(products);
    toggleView();
  } else {
    console.error("connexion error :", response.error);
  }
});

/*************************************************** 
// afficher les produits dans la galerie
************************************************** */

const galerie = document.getElementById("galerie-produit");
const products = JSON.parse(localStorage.getItem("Things")) || [];

function showGallery(products) {
  galerie.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("article");
    productCard.className =
      "card bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1";
    productCard.setAttribute("id", product._id);

    const productImage = document.createElement("img");
    productImage.src = product.imageUrl;
    productImage.alt = product.title;
    productImage.className = "w-full h-48 object-cover";

    const cardBody = document.createElement("div");
    cardBody.className = "p-4";

    const productTitle = document.createElement("h3");
    productTitle.textContent = product.title;
    productTitle.className =
      "text-lg font-semibold text-gray-800 mb-1 truncate";

    const productDescription = document.createElement("p");
    productDescription.textContent = product.description;
    productDescription.className = "text-gray-600 text-sm mb-2 line-clamp-2";

    const productPrice = document.createElement("p");
    productPrice.textContent = `${product.price}€`;
    productPrice.className = "text-lg font-bold text-blue-600";

    cardBody.appendChild(productTitle);
    cardBody.appendChild(productDescription);
    cardBody.appendChild(productPrice);

    productCard.appendChild(productImage);
    productCard.appendChild(cardBody);

    galerie.appendChild(productCard);
  });
}

galerie.className =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4";

/*********************************************************** */
// Chargement de la liste des produits pour affichage
/*********************************************************** */

const loadProducts = async () => {
  const token = localStorage.getItem("token");
  try {
    let products;
    if (token) {
      products = await fetchProducts(token);
    } else {
      products = await fetchPublicProducts();
    }
    showGallery(products);
    localStorage.setItem("Things", JSON.stringify(products));
  } catch (error) {
    console.error("erreur lors du chargement des produits", error);
  }
};
/*********************************************************** */
// Gestion affichage des formulaires signup et connexion
/*********************************************************** */

function toggleView() {
  const modaleSignup = document.getElementById("form-signup");
  const modaleLogin = document.getElementById("form-login");
  const btnLogin = document.getElementById("go-to-login");
  const btnSignUp = document.getElementById("go-to-signup");
  const btnLogout = document.getElementById("logout");
  const token = localStorage.getItem("token");

  // Ajout des événements pour afficher les modales
  btnSignUp.addEventListener("click", () => {
    modaleSignup.style.display = "block";
    modaleLogin.style.display = "none";
  });

  btnLogin.addEventListener("click", () => {
    modaleLogin.style.display = "block";
    modaleSignup.style.display = "none";
  });

  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Things");
    btnLogin.style.display = "block";
    btnLogout.style.display = "none";
    const openModalBtn = document.getElementById("open-add-product-modal");
    openModalBtn.style.display = "none";
    loadProducts();
    console.log("token suprimé");
  });

  // Gestion de l'affichage selon la présence du token
  if (token) {
    modaleLogin.style.display = "none";
    btnLogin.style.display = "none";
    btnLogout.style.display = "block";
    const openModalBtn = document.getElementById("open-add-product-modal");
    openModalBtn.style.display = "flex";
    loadProducts();
    console.log("Token identifié");
  } else {
    modaleLogin.style.display = "none";
    btnLogin.style.display = "block";
    btnLogout.style.display = "none";
    console.log("Token non identifié");
  }
}
toggleView();
loadProducts();

/*************************************************** 
// Modifier un article de la gallery
************************************************** */

let currentProductId = null;

// 1. Ouvrir la modale au clic sur un produit
galerie.addEventListener("click", (e) => {
  const card = e.target.closest(".card"); // On vérifie que le clic est sur une carte
  if (card) {
    currentProductId = card.id;

    // On récupère les données du produit depuis localStorage
    const product = JSON.parse(localStorage.getItem("Things")).find(
      (p) => p._id === currentProductId
    );

    // On remplit les champs du formulaire de la modale
    document.getElementById("edit-title").value = product.title;
    document.getElementById("edit-description").value = product.description;
    document.getElementById("edit-price").value = product.price;

    // On affiche la modale
    document.getElementById("modal").style.display = "flex";
  }
});

// 2. Fermer la modale au clic sur close-modal
document.querySelectorAll(".close").forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    const modal = closeButton.closest(".modal");
    console.log("click close");
    modal.style.display = "none";
    loadProducts(token);
  });
});

document.getElementById("edit-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  const fileInput = document.getElementById("edit-image");
  const image = fileInput && fileInput.files[0];

  const updatedProduct = {
    title: document.getElementById("edit-title").value,
    description: document.getElementById("edit-description").value,
    price: document.getElementById("edit-price").value,
  };

  // Appelle la fonction updateProduct
  await updateProduct(token, currentProductId, updatedProduct, image);

  // Rafraîchissement de la galerie
  document.getElementById("modal").style.display = "none";
  loadProducts();
});

/*************************************************** 
// Supprimer un produit
************************************************** */

document
  .getElementById("delete-product")
  .addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    await deleteProduct(token, currentProductId);

    document.getElementById("modal").style.display = "none";
    const updatedProducts = await fetchProducts(token);
    showGallery(updatedProducts);
    loadProducts();
  });

/*************************************************** 
// Ajouter un produit à la gallerie
************************************************** */

const openModalBtn = document.getElementById("open-add-product-modal");
const addProductModal = document.getElementById("add-product-modal");
const closeModalBtn = document.getElementById("close-modal");
const addProductForm = document.getElementById("add-product-form");

// Ouvrir la modale
openModalBtn.addEventListener("click", () => {
  addProductModal.style.display = "flex";
});

// Fermer la modale
closeModalBtn.addEventListener("click", () => {
  addProductModal.style.display = "none";
  loadProducts();
});

document
  .getElementById("add-product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté pour ajouter un produit !");
      return;
    }

    // Récupérer les valeurs des champs
    const titleInput = document.getElementById("product-title");
    const descriptionInput = document.getElementById("product-description");
    const priceInput = document.getElementById("product-price");
    const imageInput = document.getElementById("product-image");

    const title = titleInput.value;
    const description = descriptionInput.value;
    const price = priceInput.value;
    const image = imageInput.files[0];

    // Vérifier que les champs sont remplis
    if (!title || !description || !price || !image) {
      alert("Tous les champs sont requis !");
      return;
    }

    const newProduct = { title, description, price };

    try {
      // Appeler la fonction addProduct pour envoyer à l'API
      await addProduct(token, newProduct, image);
      alert("Produit ajouté avec succès !");
      document.getElementById("add-product-modal").style.display = "none";
      document.getElementById("add-product-form").reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      alert("Erreur lors de l'ajout du produit.");
    }

    loadProducts();
  });
