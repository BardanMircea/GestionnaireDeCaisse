window.addEventListener("DOMContentLoaded", async () => {
  // --- Initialisations et États ---
  const status = await window.api.checkDatabaseStatus();
  document.getElementById("db-status").innerText = status;

  let allProducts = []; // Contiendra la liste fraîche du catalogue
  let currentCart = []; // Le panier en cours : [{ id, name, price, qty, tva }]

  // Éléments du DOM (Catalogue)
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

  // Éléments du DOM (Caisse)
  const cartProductSelect = document.getElementById("cart-product-select");
  const cartItemQty = document.getElementById("cart-item-qty");
  const btnAddToCart = document.getElementById("btn-add-to-cart");
  const cartTableBody = document.getElementById("cart-table-body");
  const cartTotal = document.getElementById("cart-total");
  const btnValidateSale = document.getElementById("btn-validate-sale");

  // --- Fonctions catalogue ---
  async function loadProducts() {
    productsList.innerHTML = "";
    cartProductSelect.innerHTML =
      '<option value="">-- Choisir un article --</option>';

    allProducts = await window.api.getProducts();

    allProducts.forEach((p) => {
      // Remplir la liste visuelle du catalogue
      const li = document.createElement("li");
      li.innerHTML = `<strong>${p.name}</strong> - ${p.brand} | <strong>${p.price.toFixed(2)}€</strong> (TVA ${p.tva}%)`;
      productsList.appendChild(li);

      // Remplir le select de la caisse
      const option = document.createElement("option");
      option.value = p.id;
      option.innerText = `${p.name} (${p.price.toFixed(2)}€)`;
      cartProductSelect.appendChild(option);
    });
  }

  await loadProducts();

  // Recherche OpenFoodFacts
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
      apiFeedback.innerText = `${res.message}. Saisie manuelle.`;
      apiFeedback.style.color = "orange";
    }
  });

  // Enregistrer produit
  btnSave.addEventListener("click", async () => {
    const product = {
      barcode: barcodeInput.value.trim(),
      name: nameInput.value.trim(),
      brand: brandInput.value.trim(),
      price: priceInput.value,
      tva: tvaSelect.value,
      imageUrl: imageInput.value,
    };
    if (!product.name || !product.price) return alert("Nom et prix requis !");
    try {
      await window.api.addProduct(product);
      barcodeInput.value = "";
      nameInput.value = "";
      brandInput.value = "";
      priceInput.value = "";
      imageInput.value = "";
      apiFeedback.innerText = "";
      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  });

  // --- LOGIQUE DE CAISSE (PANIER) ---

  // Calculer le total et re-rendre le tableau du panier
  function updateCartUI() {
    cartTableBody.innerHTML = "";
    let total = 0;

    currentCart.forEach((item, index) => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.price.toFixed(2)}€</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight:bold;">${lineTotal.toFixed(2)}€</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <button class="btn-remove-item" data-index="${index}" style="background:#e74c3c; color:white; border:none; border-radius:3px; padding:4px 8px; cursor:pointer;">X</button>
        </td>
      `;
      cartTableBody.appendChild(tr);
    });

    cartTotal.innerText = `${total.toFixed(2)}€`;

    // Attacher les événements de suppression
    document.querySelectorAll(".btn-remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const indexToRemove = e.target.getAttribute("data-index");
        currentCart.splice(indexToRemove, 1);
        updateCartUI();
      });
    });
  }

  // Ajouter un article au panier
  btnAddToCart.addEventListener("click", () => {
    const productId = cartProductSelect.value;
    const qty = parseInt(cartItemQty.value) || 1;

    if (!productId) return alert("Veuillez sélectionner un produit !");

    const productInfo = allProducts.find((p) => p.id === productId);
    if (!productInfo) return;

    // Vérifier si le produit est déjà dans le panier pour simplement gonfler la quantité
    const existingItem = currentCart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      currentCart.push({
        id: productInfo.id,
        name: productInfo.name,
        price: productInfo.price,
        tva: productInfo.tva,
        qty: qty,
      });
    }

    // Reset de la quantité choisie à 1 pour la suite
    cartItemQty.value = 1;
    updateCartUI();
  });

  // Valider et enregistrer la vente
  btnValidateSale.addEventListener("click", async () => {
    if (currentCart.length === 0) return alert("Le panier est vide !");

    const totalTTC = currentCart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    const saleData = {
      items: currentCart,
      totalTTC: totalTTC.toFixed(2),
    };

    try {
      await window.api.addSale(saleData);
      alert(
        `Vente validée avec succès ! Total encaissé : ${saleData.totalTTC}€`,
      );

      // Vider le panier
      currentCart = [];
      updateCartUI();
    } catch (error) {
      alert("Erreur lors de l'enregistrement de la vente : " + error.message);
    }
  });
});
