const fs = require("fs");
const path = require("path");
const { app } = require("electron");

// On stocke les données dans le dossier "AppData" de l'utilisateur pour que ce soit persistant
const dataPath = path.join(app.getPath("userData"), "db-caisses.json");

const defaultData = {
  products: [],
  sales: [],
  settings: { theme: "light", lang: "fr" },
};

function init() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), "utf-8");
    console.log("Base de données initialisée à l'emplacement :", dataPath);
  }
}

function getStatus() {
  return fs.existsSync(dataPath) ? "Connecté (Fichier Local OK)" : "Erreur BDD";
}

module.exports = { init, getStatus };
