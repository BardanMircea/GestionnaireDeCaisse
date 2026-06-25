function calculateTotal(items) {
  if (!items || items.length === 0) return "0.00";
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return total.toFixed(2);
}

module.exports = { calculateTotal };
