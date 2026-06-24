const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const dataPath = path.join(app.getPath("userData"), "db-caisses.json");

function readData() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

function init() {
  if (!fs.existsSync(dataPath)) {
    const defaultData = {
      products: [],
      sales: [],
      settings: { theme: "light", lang: "fr" },
    };
    fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

function getStatus() {
  return fs.existsSync(dataPath) ? "Connecté (Fichier Local OK)" : "Erreur BDD";
}

// --- Fonctions CRUD Produits ---
function getProducts() {
  return readData().products;
}

function addProduct(product) {
  const data = readData();

  // On génère un ID unique si non fourni (ex: pas de code-barres)
  const newProduct = {
    id: product.barcode || `manual-${Date.now()}`,
    barcode: product.barcode || "",
    name: product.name,
    brand: product.brand || "",
    price: parseFloat(product.price) || 0,
    tva: parseFloat(product.tva) || 20, // TVA par défaut à 20%
    imageUrl: product.imageUrl || "",
  };

  // Éviter les doublons de code-barres
  const exists = data.products.some((p) => p.id === newProduct.id);
  if (exists) throw new Error("Ce produit existe déjà dans le catalogue.");

  data.products.push(newProduct);
  writeData(data);
  return newProduct;
}

// --- Fonctions de Vente ---
function addSale(saleData) {
  const data = readData();

  const newSale = {
    id: `sale-${Date.now()}`,
    date: new Date().toISOString(),
    items: saleData.items, // Contient [{ id, name, price, qty, tva }]
    totalTTC: parseFloat(saleData.totalTTC),
  };

  data.sales.push(newSale);
  writeData(data);
  return newSale;
}

function getSales() {
  return readData().sales;
}

module.exports = {
  init,
  getStatus,
  getProducts,
  addProduct,
  addSale,
  getSales,
};
