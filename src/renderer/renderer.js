// On utilise l'objet sécurisé exposé par le preload script
window.addEventListener("DOMContentLoaded", async () => {
  const statusElement = document.getElementById("db-status");

  try {
    // Appel sécurisé via le pont IPC
    const status = await window.api.checkDatabaseStatus();
    statusElement.innerText = status;
    statusElement.style.color = "green";
  } catch (error) {
    statusElement.innerText = "Erreur de connexion IPC";
    statusElement.style.color = "red";
  }
});
