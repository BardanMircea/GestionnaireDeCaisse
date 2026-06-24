const { contextBridge, ipcRenderer } = require("electron");

// On expose une API restreinte et sécurisée au Renderer
contextBridge.exposeInMainWorld("api", {
  checkDatabaseStatus: () => ipcRenderer.invoke("db:check-status"),
});
