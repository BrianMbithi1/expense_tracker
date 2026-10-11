
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'KES', 'JPY', 'CAD', 'AUD', 'INR'];
export const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Lodging', 'Other'];


export function convertAmount(amount, from, to, rates) {
  if (!rates) return null;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return null;
  return (amount / fromRate) * toRate;
}


export function calculateTotal(expenses, home, rates) {
  return expenses.reduce(
    (acc, expense) => {
      const converted = convertAmount(expense.amount, expense.currency, home, rates);
      return converted === null
        ? { ...acc, skipped: acc.skipped + 1 }
        : { ...acc, total: acc.total + converted };
    },
    { total: 0, skipped: 0 }
  );
}


export function filterByCategory(expenses, category) {
  if (!category || category === 'All') return expenses;
  return expenses.filter((expense) => expense.category === category);
}

// Format a number as currency, e.g., 10.5 USD -> $10.50
export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}