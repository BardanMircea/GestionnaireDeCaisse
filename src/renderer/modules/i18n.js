export const translations = {
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

export function initLanguage(
  langSelect,
  btnToggleTheme,
  uiElements,
  rawStatus,
  dbStatus,
) {
  function applyLanguage(lang) {
    localStorage.setItem("pos-lang", lang);
    langSelect.value = lang;

    // Traduction de tous les éléments passés en paramètre
    Object.keys(uiElements).forEach((key) => {
      if (uiElements[key]) {
        uiElements[key].el[uiElements[key].prop] = translations[lang][key];
      }
    });

    // Cas particulier du statut de connexion dynamique
    if (rawStatus.includes("OK")) {
      dbStatus.innerText = translations[lang].dbStatusConnected;
    } else {
      dbStatus.innerText = rawStatus;
    }

    // Ajustement du libellé du bouton de thème selon la langue active
    const currentTheme = localStorage.getItem("pos-theme") || "light";
    btnToggleTheme.innerText =
      currentTheme === "dark"
        ? translations[lang].btnThemeLight
        : translations[lang].btnThemeDark;
  }

  langSelect.addEventListener("change", (e) => {
    applyLanguage(e.target.value);
    // Déclencher un événement global pour notifier les autres modules que la langue a changé
    window.dispatchEvent(new Event("pos-lang-changed"));
  });

  const savedLang = localStorage.getItem("pos-lang") || "fr";
  applyLanguage(savedLang);
}
