const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./database");

const { dialog } = require("electron");
const fs = require("fs");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true, // Protège le Main Process
      nodeIntegration: false, // Empêche le Renderer d'accéder à Node.js
      sandbox: true, // Isole le Renderer
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  // ouvrir les DevTools en dev pour bosser confortablement
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Initialisation de la BDD locale au démarrage
  db.init();

  // Mise en place de l'écouteur IPC (e.g.: récupérer le statut de la DB)
  ipcMain.handle("db:check-status", async () => {
    return db.getStatus();
  });

  // Récupérer tous les produits
  ipcMain.handle("products:get-all", async () => {
    return db.getProducts();
  });

  // Ajouter un produit
  ipcMain.handle("products:add", async (event, product) => {
    return db.addProduct(product);
  });

  // Requête OpenFoodFacts (Main Process centralise pour éviter les soucis de CORS dans le Renderer)
  ipcMain.handle("api:fetch-off", async (event, barcode) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
      );
      if (!response.ok)
        return { success: false, message: "Erreur réseau OpenFoodFacts" };

      const data = await response.json();
      if (data.status === 1) {
        return {
          success: true,
          product: {
            barcode: barcode,
            name: data.product.product_name || "",
            brand: data.product.brands || "",
            imageUrl: data.product.image_front_thumb_url || "",
          },
        };
      } else {
        return { success: false, message: "Produit inconnu sur OpenFoodFacts" };
      }
    } catch (error) {
      return { success: false, message: "Mode hors-ligne ou API inaccessible" };
    }
  });

  // Enregistrer une vente
  ipcMain.handle("sales:add", async (event, saleData) => {
    return db.addSale(saleData);
  });

  // Récupérer l'historique des ventes
  ipcMain.handle("sales:get-all", async () => {
    return db.getSales();
  });

  // Exporter les ventes en CSV
  ipcMain.handle("sales:export-csv", async () => {
    const sales = db.getSales();

    // Construction du contenu CSV (Date, ID Vente, Total TTC)
    let csvContent = "\uFEFFDate;ID Vente;Total TTC (€)\n"; // BOM UTF-8 pour Excel
    sales.forEach((sale) => {
      csvContent += `${new Date(sale.date).toLocaleString()};${sale.id};${sale.totalTTC}\n`;
    });

    // Ouverture de la boîte de dialogue native de l'OS
    const { filePath } = await dialog.showSaveDialog({
      title: "Exporter les chiffres comptables",
      defaultPath: `export-compta-${Date.now()}.csv`,
      filters: [{ name: "Fichiers CSV", extensions: ["csv"] }],
    });

    if (filePath) {
      fs.writeFileSync(filePath, csvContent, "utf-8");
      return { success: true, path: filePath };
    }
    return { success: false };
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
