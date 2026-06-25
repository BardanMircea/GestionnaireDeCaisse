import { translations } from "./i18n.js";

export function initCart(elements) {
  let currentCart = [];
  const currentLang = () => localStorage.getItem("pos-lang") || "fr";

  function updateCartUI() {
    elements.cartTableBody.innerHTML = "";
    let total = 0;

    currentCart.forEach((item, index) => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.price.toFixed(2)}€</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight:bold;">${lineTotal.toFixed(2)}€</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <button class="btn-remove-item" data-index="${index}" style="background:#e74c3c; color:white; border:none; border-radius:3px; padding:4px 8px; cursor:pointer;">X</button>
        </td>
      `;
      elements.cartTableBody.appendChild(tr);
    });

    elements.cartTotal.innerText = `${total.toFixed(2)}€`;

    document.querySelectorAll(".btn-remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const indexToRemove = e.target.getAttribute("data-index");
        currentCart.splice(indexToRemove, 1);
        updateCartUI();
      });
    });
  }

  async function loadSalesHistory() {
    elements.salesHistoryList.innerHTML = "";
    const sales = await window.api.getSales();

    sales.reverse().forEach((sale) => {
      const li = document.createElement("li");
      li.style.color = "#333";
      li.innerHTML = `📅 ${new Date(sale.date).toLocaleString()} - 🆔 ${sale.id} -> <strong>${sale.totalTTC}€</strong>`;
      elements.salesHistoryList.appendChild(li);
    });
  }

  elements.btnAddToCart.addEventListener("click", () => {
    const productId = elements.cartProductSelect.value;
    const qty = parseInt(elements.cartItemQty.value) || 1;

    if (!productId) {
      alert(translations[currentLang()].selectProdPlaceholder);
      return;
    }

    const productInfo = elements.allProductsContainer.list.find(
      (p) => p.id === productId,
    );
    if (!productInfo) return;

    const existingItem = currentCart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.qty += qty;
    } else {
      currentCart.push({
        id: productInfo.id,
        name: productInfo.name,
        price: productInfo.price,
        tva: productInfo.tva,
        qty: qty,
      });
    }
    elements.cartItemQty.value = 1;
    updateCartUI();
  });

  elements.btnValidateSale.addEventListener("click", async () => {
    if (currentCart.length === 0) {
      alert("Le panier est vide !");
      return;
    }

    const totalTTC = currentCart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const saleData = { items: currentCart, totalTTC: totalTTC.toFixed(2) };

    try {
      await window.api.addSale(saleData);
      const lang = currentLang();
      alert(
        `${translations[lang].alertSaleSuccess} Total : ${saleData.totalTTC}€`,
      );
      currentCart = [];
      updateCartUI();
      await loadSalesHistory();
    } catch (error) {
      alert("Erreur lors de l'enregistrement : " + error.message);
    }
  });

  elements.btnExportCSV.addEventListener("click", async () => {
    const lang = currentLang();
    const result = await window.api.exportCSV();
    if (result.success) {
      alert(`${translations[lang].alertExportSuccess}\n${result.path}`);
    }
  });

  // Initialisation au démarrage
  loadSalesHistory();
}
