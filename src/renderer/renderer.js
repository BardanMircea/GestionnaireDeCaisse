// --- Dictionnaire de traduction (i18n) complet ---
const translations = {
  fr: {
    appTitle: "Système de Caisse 🛒",
    dbStatusLabel: "Statut BDD :",
    dbStatusConnected: "Connecté (Fichier Local OK)",
    cartTitle: "🛒 Encaisser un client",
    selectProdLabel: "Sélectionner un produit :",
    selectProdPlaceholder: "-- Choisir un article --",
    qtyLabel: "Quantité :",
    btnAddToCart: "Ajouter au ticket",
    thProduct: "Produit",
    thPrice: "Prix Unitaire",
    thQty: "Quantité",
    txtTotalLabel: "Total à Payer :",
    btnValidateSale: "Valider l'encaissement",
    catalogSummary: "📦 Gérer le Catalogue (Ajout / Visualisation)",
    addProdTitle: "Ajouter un produit",
    barcodeLabel: "Code-barres (OpenFoodFacts) :",
    btnSearchOff: "Rechercher API",
    prodNameLabel: "Nom du produit * :",
    prodBrandLabel: "Marque :",
    prodPriceLabel: "Prix de vente (€) * :",
    prodTvaLabel: "TVA (%) :",
    btnSaveProduct: "Enregistrer",
    catalogListTitle: "Produits en Catalogue",
    comptaTitle: "📊 Historique & Chiffres Comptables",
    latestSales: "Dernières ventes enregistrées :",
    btnExport: "📥 Exporter les données (CSV)",
    btnThemeLight: "☀️ Mode Clair",
    btnThemeDark: "🌓 Mode Sombre",
    alertExportSuccess: "Fichier comptable exporté avec succès vers : ",
    alertSaleSuccess: "Vente validée avec succès !",
  },
  en: {
    appTitle: "POS System 🛒",
    dbStatusLabel: "DB Status:",
    dbStatusConnected: "Connected (Local File OK)",
    cartTitle: "🛒 Checkout Customer",
    selectProdLabel: "Select a product:",
    selectProdPlaceholder: "-- Choose an item --",
    qtyLabel: "Quantity:",
    btnAddToCart: "Add to ticket",
    thProduct: "Product",
    thPrice: "Unit Price",
    thQty: "Quantity",
    txtTotalLabel: "Total to Pay:",
    btnValidateSale: "Validate checkout",
    catalogSummary: "📦 Manage Catalog (Add / View)",
    addProdTitle: "Add a new product",
    barcodeLabel: "Barcode (OpenFoodFacts):",
    btnSearchOff: "Search API",
    prodNameLabel: "Product Name * :",
    prodBrandLabel: "Brand:",
    prodPriceLabel: "Selling Price (€) * :",
    prodTvaLabel: "VAT (%):",
    btnSaveProduct: "Save Product",
    catalogListTitle: "Products in Catalog",
    comptaTitle: "📊 History & Accounting Figures",
    latestSales: "Latest registered sales:",
    btnExport: "📥 Export Data (CSV)",
    btnThemeLight: "☀️ Light Mode",
    btnThemeDark: "🌓 Dark Mode",
    alertExportSuccess: "Accounting file successfully exported to: ",
    alertSaleSuccess: "Sale successfully validated!",
  },
};

window.addEventListener("DOMContentLoaded", async () => {
  // --- Éléments du DOM (UX / Langue / Thème) ---
  const langSelect = document.getElementById("setting-lang");
  const btnToggleTheme = document.getElementById("btn-toggle-theme");
  const btnExportCSV = document.getElementById("btn-export-csv");
  const salesHistoryList = document.getElementById("sales-history-list");

  // Liaison Dictionnaire -> Éléments HTML
  const txtAppTitle = document.getElementById("txt-app-title");
  const txtDbStatusLabel = document.getElementById("txt-db-status-label");
  const dbStatus = document.getElementById("db-status");
  const txtCartTitle = document.getElementById("txt-cart-title");
  const txtSelectProdLabel = document.getElementById("txt-select-prod-label");
  const txtSelectProdPlaceholder = document.getElementById(
    "txt-select-prod-placeholder",
  );
  const txtQtyLabel = document.getElementById("txt-qty-label");
  const btnAddToCart = document.getElementById("btn-add-to-cart");
  const thProduct = document.getElementById("th-product");
  const thPrice = document.getElementById("th-price");
  const thQty = document.getElementById("th-qty");
  const txtTotalLabel = document.getElementById("txt-total-label");
  const btnValidateSale = document.getElementById("btn-validate-sale");
  const txtCatalogSummary = document.getElementById("txt-catalog-summary");
  const txtAddProdTitle = document.getElementById("txt-add-prod-title");
  const txtBarcodeLabel = document.getElementById("txt-barcode-label");
  const btnSearchOff = document.getElementById("btn-search-off");
  const txtProdNameLabel = document.getElementById("txt-prod-name-label");
  const txtProdBrandLabel = document.getElementById("txt-prod-brand-label");
  const txtProdPriceLabel = document.getElementById("txt-prod-price-label");
  const txtProdTvaLabel = document.getElementById("txt-prod-tva-label");
  const btnSave = document.getElementById("btn-save-product");
  const txtCatalogListTitle = document.getElementById("txt-catalog-list-title");
  const txtComptaTitle = document.getElementById("txt-compta-title");
  const txtLatestSales = document.getElementById("txt-latest-sales");

  // Éléments Logique (Catalogue & Panier)
  const barcodeInput = document.getElementById("prod-barcode");
  const nameInput = document.getElementById("prod-name");
  const brandInput = document.getElementById("prod-brand");
  const priceInput = document.getElementById("prod-price");
  const tvaSelect = document.getElementById("prod-tva");
  const imageInput = document.getElementById("prod-image");
  const apiFeedback = document.getElementById("api-feedback");
  const productsList = document.getElementById("products-list");
  const cartProductSelect = document.getElementById("cart-product-select");
  const cartItemQty = document.getElementById("cart-item-qty");
  const cartTableBody = document.getElementById("cart-table-body");
  const cartTotal = document.getElementById("cart-total");

  let allProducts = [];
  let currentCart = [];

  // --- Initialisation du Statut BDD ---
  const rawStatus = await window.api.checkDatabaseStatus();
  // On gère la traduction du statut de connexion de manière dynamique
  const currentLang = () => localStorage.getItem("pos-lang") || "fr";
  dbStatus.innerText = rawStatus.includes("OK")
    ? translations[currentLang()].dbStatusConnected
    : rawStatus;

  // --- Gestion de la Langue ---
  function applyLanguage(lang) {
    localStorage.setItem("pos-lang", lang);
    langSelect.value = lang;

    // Traduction complète de l'interface
    txtAppTitle.innerText = translations[lang].appTitle;
    txtDbStatusLabel.innerText = translations[lang].dbStatusLabel;
    if (rawStatus.includes("OK"))
      dbStatus.innerText = translations[lang].dbStatusConnected;
    txtCartTitle.innerText = translations[lang].cartTitle;
    txtSelectProdLabel.innerText = translations[lang].selectProdLabel;
    txtSelectProdPlaceholder.innerText =
      translations[lang].selectProdPlaceholder;
    txtQtyLabel.innerText = translations[lang].qtyLabel;
    btnAddToCart.innerText = translations[lang].btnAddToCart;
    thProduct.innerText = translations[lang].thProduct;
    thPrice.innerText = translations[lang].thPrice;
    thQty.innerText = translations[lang].thQty;
    txtTotalLabel.innerText = translations[lang].txtTotalLabel;
    btnValidateSale.innerText = translations[lang].btnValidateSale;
    txtCatalogSummary.innerText = translations[lang].catalogSummary;
    txtAddProdTitle.innerText = translations[lang].addProdTitle;
    txtBarcodeLabel.innerText = translations[lang].barcodeLabel;
    btnSearchOff.innerText = translations[lang].btnSearchOff;
    txtProdNameLabel.innerText = translations[lang].prodNameLabel;
    txtProdBrandLabel.innerText = translations[lang].prodBrandLabel;
    txtProdPriceLabel.innerText = translations[lang].prodPriceLabel;
    txtProdTvaLabel.innerText = translations[lang].prodTvaLabel;
    btnSave.innerText = translations[lang].btnSaveProduct;
    txtCatalogListTitle.innerText = translations[lang].catalogListTitle;
    txtComptaTitle.innerText = translations[lang].comptaTitle;
    txtLatestSales.innerText = translations[lang].latestSales;
    btnExportCSV.innerText = translations[lang].btnExport;

    // Mettre à jour le texte du bouton de thème selon la langue
    const currentTheme = localStorage.getItem("pos-theme") || "light";
    btnToggleTheme.innerText =
      currentTheme === "dark"
        ? translations[lang].btnThemeLight
        : translations[lang].btnThemeDark;
  }

  langSelect.addEventListener("change", (e) => {
    applyLanguage(e.target.value);
  });

  const savedLang = localStorage.getItem("pos-lang") || "fr";
  applyLanguage(savedLang);

  // --- Gestion du Mode Sombre ---
  function applyTheme(theme) {
    localStorage.setItem("pos-theme", theme);
    const lang = currentLang();
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      btnToggleTheme.innerText = translations[lang].btnThemeLight;
    } else {
      document.body.classList.remove("dark-theme");
      btnToggleTheme.innerText = translations[lang].btnThemeDark;
    }
  }

  btnToggleTheme.addEventListener("click", () => {
    const currentTheme =
      localStorage.getItem("pos-theme") === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
  });

  const savedTheme = localStorage.getItem("pos-theme") || "light";
  applyTheme(savedTheme);

  // --- Gestion de l'historique ---
  async function loadSalesHistory() {
    salesHistoryList.innerHTML = "";
    const sales = await window.api.getSales();
    sales.reverse().forEach((sale) => {
      const li = document.createElement("li");
      li.style.color = "#333";
      li.innerHTML = `📅 ${new Date(sale.date).toLocaleString()} - 🆔 ${sale.id} -> <strong>${sale.totalTTC}€</strong>`;
      salesHistoryList.appendChild(li);
    });
  }
  await loadSalesHistory();

  btnExportCSV.addEventListener("click", async () => {
    const lang = currentLang();
    const result = await window.api.exportCSV();
    if (result.success) {
      alert(`${translations[lang].alertExportSuccess}\n${result.path}`);
    }
  });

  // --- Logique Catalogue ---
  async function loadProducts() {
    productsList.innerHTML = "";
    const currentPlaceholder =
      translations[currentLang()].selectProdPlaceholder;
    cartProductSelect.innerHTML = `<option value="">${currentPlaceholder}</option>`;

    allProducts = await window.api.getProducts();
    allProducts.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${p.name}</strong> - ${p.brand} | <strong>${p.price.toFixed(2)}€</strong> (TVA ${p.tva}%)`;
      productsList.appendChild(li);

      const option = document.createElement("option");
      option.value = p.id;
      option.innerText = `${p.name} (${p.price.toFixed(2)}€)`;
      cartProductSelect.appendChild(option);
    });
  }
  await loadProducts();

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

  // --- Logique Panier ---
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

    document.querySelectorAll(".btn-remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const indexToRemove = e.target.getAttribute("data-index");
        currentCart.splice(indexToRemove, 1);
        updateCartUI();
      });
    });
  }

  btnAddToCart.addEventListener("click", () => {
    const productId = cartProductSelect.value;
    const qty = parseInt(cartItemQty.value) || 1;
    if (!productId) return alert("Veuillez sélectionner un produit !");
    const productInfo = allProducts.find((p) => p.id === productId);
    if (!productInfo) return;

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
    cartItemQty.value = 1;
    updateCartUI();
  });

  btnValidateSale.addEventListener("click", async () => {
    if (currentCart.length === 0) return alert("Le panier est vide !");
    const totalTTC = currentCart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const saleData = { items: currentCart, totalTTC: totalTTC.toFixed(2) };

    try {
      await window.api.addSale(saleData);
      const lang = currentLang();
      alert(
        `${translations[lang].alertSaleSuccess} Total : ${saleData.totalTTC}€`,
      );
      currentCart = [];
      updateCartUI();
    } catch (error) {
      alert("Erreur lors de l'enregistrement : " + error.message);
    }
    await loadSalesHistory();
  });
});
