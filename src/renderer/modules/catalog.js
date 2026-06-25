import { translations } from "./i18n.js";

export function initCatalog(elements) {
  const currentLang = () => localStorage.getItem("pos-lang") || "fr";

  async function loadProducts() {
    elements.productsList.innerHTML = "";
    const currentPlaceholder =
      translations[currentLang()].selectProdPlaceholder;
    elements.cartProductSelect.innerHTML = `<option value="">${currentPlaceholder}</option>`;

    elements.allProductsContainer.list = await window.api.getProducts();

    elements.allProductsContainer.list.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${p.name}</strong> - ${p.brand} | <strong>${p.price.toFixed(2)}€</strong> (TVA ${p.tva}%)`;
      elements.productsList.appendChild(li);

      const option = document.createElement("option");
      option.value = p.id;
      option.innerText = `${p.name} (${p.price.toFixed(2)}€)`;
      elements.cartProductSelect.appendChild(option);
    });

    return elements.allProductsContainer.list;
  }

  elements.btnSearchOff.addEventListener("click", async () => {
    const barcode = elements.barcodeInput.value.trim();
    if (!barcode) return;
    elements.apiFeedback.innerText = "Recherche en cours...";
    elements.apiFeedback.style.color = "blue";

    const res = await window.api.fetchOpenFoodFacts(barcode);
    if (res.success) {
      elements.apiFeedback.innerText = "Produit trouvé !";
      elements.apiFeedback.style.color = "green";
      elements.nameInput.value = res.product.name;
      elements.brandInput.value = res.product.brand;
      elements.imageInput.value = res.product.imageUrl;
    } else {
      elements.apiFeedback.innerText = `${res.message}. Saisie manuelle.`;
      elements.apiFeedback.style.color = "orange";
    }
  });

  elements.btnSave.addEventListener("click", async () => {
    const product = {
      barcode: elements.barcodeInput.value.trim(),
      name: elements.nameInput.value.trim(),
      brand: elements.brandInput.value.trim(),
      price: elements.priceInput.value,
      tva: elements.tvaSelect.value,
      imageUrl: elements.imageInput.value,
    };

    if (!product.name || !product.price) {
      alert("Nom et prix requis !");
      return;
    }

    try {
      await window.api.addProduct(product);
      elements.barcodeInput.value = "";
      elements.nameInput.value = "";
      elements.brandInput.value = "";
      elements.priceInput.value = "";
      elements.imageInput.value = "";
      elements.apiFeedback.innerText = "";
      await loadProducts();
    } catch (err) {
      alert(err.message);
    }
  });

  // Réagir au changement de langue pour traduire l'option par défaut du select
  window.addEventListener("pos-lang-changed", async () => {
    const selectedValue = elements.cartProductSelect.value;
    await loadProducts();
    elements.cartProductSelect.value = selectedValue;
  });

  return { loadProducts };
}
