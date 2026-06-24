const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  checkDatabaseStatus: () => ipcRenderer.invoke("db:check-status"),
  getProducts: () => ipcRenderer.invoke("products:get-all"),
  addProduct: (product) => ipcRenderer.invoke("products:add", product),
  fetchOpenFoodFacts: (barcode) => ipcRenderer.invoke("api:fetch-off", barcode),
  addSale: (saleData) => ipcRenderer.invoke("sales:add", saleData),
  getSales: () => ipcRenderer.invoke("sales:get-all"),
  exportCSV: () => ipcRenderer.invoke("sales:export-csv"),
});
