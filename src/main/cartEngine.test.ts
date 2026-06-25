const { calculateTotal } = require("./cartEngine");

describe("Logique Métier : Calcul du Panier", () => {
  test("Doit retourner 0.00 si le panier est vide", () => {
    expect(calculateTotal([])).toBe("0.00");
  });

  test("Doit calculer correctement le total de plusieurs articles", () => {
    const items = [
      { name: "Chocolat", price: 2.5, qty: 2 }, // 5.00
      { name: "Lait", price: 1.2, qty: 1 }, // 1.20
    ];
    expect(calculateTotal(items)).toBe("6.20");
  });

  test("Doit gérer correctement les arrondis de décimales", () => {
    const items = [
      { name: "Pomme", price: 1.33, qty: 3 }, // 3.99
    ];
    expect(calculateTotal(items)).toBe("3.99");
  });
});
