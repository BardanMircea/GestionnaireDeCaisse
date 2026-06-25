import { initLanguage } from "./modules/i18n.js";
import { initTheme } from "./modules/theme.js";
import { initCatalog } from "./modules/catalog.js";
import { initCart } from "./modules/cart.js";

window.addEventListener("DOMContentLoaded", async () => {
  // --- Éléments Système Initiaux ---
  const rawStatus = await window.api.checkDatabaseStatus();
  const dbStatus = document.getElementById("db-status");
  const langSelect = document.getElementById("setting-lang");
  const btnToggleTheme = document.getElementById("btn-toggle-theme");

  // --- Cartographie Complète du DOM pour i18n ---
  const uiElements = {
    appTitle: {
      el: document.getElementById("txt-app-title"),
      prop: "innerText",
    },
    dbStatusLabel: {
      el: document.getElementById("txt-db-status-label"),
      prop: "innerText",
    },
    cartTitle: {
      el: document.getElementById("txt-cart-title"),
      prop: "innerText",
    },
    selectProdLabel: {
      el: document.getElementById("txt-select-prod-label"),
      prop: "innerText",
    },
    selectProdPlaceholder: {
      el: document.getElementById("txt-select-prod-placeholder"),
      prop: "innerText",
    },
    qtyLabel: {
      el: document.getElementById("txt-qty-label"),
      prop: "innerText",
    },
    btnAddToCart: {
      el: document.getElementById("btn-add-to-cart"),
      prop: "innerText",
    },
    thProduct: { el: document.getElementById("th-product"), prop: "innerText" },
    thPrice: { el: document.getElementById("th-price"), prop: "innerText" },
    thQty: { el: document.getElementById("th-qty"), prop: "innerText" },
    txtTotalLabel: {
      el: document.getElementById("txt-total-label"),
      prop: "innerText",
    },
    btnValidateSale: {
      el: document.getElementById("btn-validate-sale"),
      prop: "innerText",
    },
    catalogSummary: {
      el: document.getElementById("txt-catalog-summary"),
      prop: "innerText",
    },
    addProdTitle: {
      el: document.getElementById("txt-add-prod-title"),
      prop: "innerText",
    },
    barcodeLabel: {
      el: document.getElementById("txt-barcode-label"),
      prop: "innerText",
    },
    btnSearchOff: {
      el: document.getElementById("btn-search-off"),
      prop: "innerText",
    },
    prodNameLabel: {
      el: document.getElementById("txt-prod-name-label"),
      prop: "innerText",
    },
    prodBrandLabel: {
      el: document.getElementById("txt-prod-brand-label"),
      prop: "innerText",
    },
    prodPriceLabel: {
      el: document.getElementById("txt-prod-price-label"),
      prop: "innerText",
    },
    prodTvaLabel: {
      el: document.getElementById("txt-prod-tva-label"),
      prop: "innerText",
    },
    btnSaveProduct: {
      el: document.getElementById("btn-save-product"),
      prop: "innerText",
    },
    catalogListTitle: {
      el: document.getElementById("txt-catalog-list-title"),
      prop: "innerText",
    },
    comptaTitle: {
      el: document.getElementById("txt-compta-title"),
      prop: "innerText",
    },
    latestSales: {
      el: document.getElementById("txt-latest-sales"),
      prop: "innerText",
    },
    btnExport: {
      el: document.getElementById("btn-export-csv"),
      prop: "innerText",
    },
  };

  // --- Conteneur Partagé de Référence pour les Produits ---
  const allProductsContainer = { list: [] };

  // --- Initialisations des Modules Métiers ---
  initLanguage(langSelect, btnToggleTheme, uiElements, rawStatus, dbStatus);
  initTheme(btnToggleTheme);

  const catalogController = initCatalog({
    productsList: document.getElementById("products-list"),
    cartProductSelect: document.getElementById("cart-product-select"),
    btnSearchOff: document.getElementById("btn-search-off"),
    btnSave: document.getElementById("btn-save-product"),
    barcodeInput: document.getElementById("prod-barcode"),
    nameInput: document.getElementById("prod-name"),
    brandInput: document.getElementById("prod-brand"),
    priceInput: document.getElementById("prod-price"),
    tvaSelect: document.getElementById("prod-tva"),
    imageInput: document.getElementById("prod-image"),
    apiFeedback: document.getElementById("api-feedback"),
    allProductsContainer: allProductsContainer,
  });

  // Chargement de la liste initiale des produits
  allProductsContainer.list = await catalogController.loadProducts();

  initCart({
    cartProductSelect: document.getElementById("cart-product-select"),
    cartItemQty: document.getElementById("cart-item-qty"),
    btnAddToCart: document.getElementById("btn-add-to-cart"),
    cartTableBody: document.getElementById("cart-table-body"),
    cartTotal: document.getElementById("cart-total"),
    btnValidateSale: document.getElementById("btn-validate-sale"),
    salesHistoryList: document.getElementById("sales-history-list"),
    btnExportCSV: document.getElementById("btn-export-csv"),
    allProductsContainer: allProductsContainer,
  });
});
