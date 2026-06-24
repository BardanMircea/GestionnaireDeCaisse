const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./database");

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
  // Initialisation de notre fausse/petite BDD locale au démarrage
  db.init();

  // Mise en place de l'écouteur IPC (Exemple: Récupérer le statut de la DB)
  ipcMain.handle("db:check-status", async () => {
    return db.getStatus();
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
