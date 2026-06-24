window.addEventListener("DOMContentLoaded", async () => {
  // Statut initial
  const status = await window.api.checkDatabaseStatus();
  document.getElementById("db-status").innerText = status;

  // DOM Elements
  const barcodeInput = document.getElementById("prod-barcode");
  const nameInput = document.getElementById("prod-name");
  const brandInput = document.getElementById("prod-brand");
  const priceInput = document.getElementById("prod-price");
  const tvaSelect = document.getElementById("prod-tva");
  const imageInput = document.getElementById("prod-image");
  const apiFeedback = document.getElementById("api-feedback");

  const btnSearchOff = document.getElementById("btn-search-off");
  const btnSave = document.getElementById("btn-save-product");
  const productsList = document.getElementById("products-list");

  // Charger la liste des produits existants
  async function loadProducts() {
    productsList.innerHTML = "";
    const products = await window.api.getProducts();
    products.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${p.name}</strong> - ${p.brand} | <strong>${p.price.toFixed(2)}€</strong> (TVA ${p.tva}%) [ID: ${p.id}]`;
      productsList.appendChild(li);
    });
  }

  await loadProducts();

  // Recherche OpenFoodFacts (Logique A : connecté + produit existant)
  btnSearchOff.addEventListener("click", async () => {
    const barcode = barcodeInput.value.trim();
    if (!barcode) return;

    apiFeedback.innerText = "Recherche en cours...";
    apiFeedback.style.color = "blue";

    const res = await window.api.fetchOpenFoodFacts(barcode);

    if (res.success) {
      apiFeedback.innerText = "Produit trouvé !";
      apiFeedback.style.color = "green";
      nameInput.value = res.product.name;
      brandInput.value = res.product.brand;
      imageInput.value = res.product.imageUrl;
    } else {
      // Logique B : Inconnu ou hors-ligne -> Saisie manuelle facilitée
      apiFeedback.innerText = `${res.message}. Saisie manuelle nécessaire.`;
      apiFeedback.style.color = "orange";
    }
  });

  // Enregistrer le produit en BDD
  btnSave.addEventListener("click", async () => {
    const product = {
      barcode: barcodeInput.value.trim(),
      name: nameInput.value.trim(),
      brand: brandInput.value.trim(),
      price: priceInput.value,
      tva: tvaSelect.value,
      imageUrl: imageInput.value,
    };

    if (!product.name || !product.price) {
      alert("Le nom et le prix sont obligatoires !");
      return;
    }

    try {
      await window.api.addProduct(product);
      alert("Produit ajouté avec succès !");
      // Reset le formulaire
      barcodeInput.value = "";
      nameInput.value = "";
      brandInput.value = "";
      priceInput.value = "";
      imageInput.value = "";
      apiFeedback.innerText = "";
      await loadProducts(); // Recharger le catalogue
    } catch (err) {
      alert(err.message);
    }
  });
});
