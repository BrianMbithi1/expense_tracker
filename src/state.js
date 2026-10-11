const STORAGE_KEY = 'expense-tracker:expenses';

function loadExpenses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveExpenses(expenses) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch {
    // Storage may be unavailable (private mode); the app still works in memory.
  }
}

let state = {
  expenses: loadExpenses(),
  homeCurrency: 'USD',
  filter: 'All',
  rates: null,
  status: 'idle', 
  error: ''
};

export function getState() {
  return state;
}

function update(changes) {
  state = { ...state, ...changes }; // spread: new state object, never mutated
  return state;
}

export function addExpense({ description, amount, currency, category }) {
  const newExpense = { id: crypto.randomUUID(), description, amount, currency, category };
  const expenses = [...state.expenses, newExpense]; // spread: new array
  saveExpenses(expenses);
  return update({ expenses });
}

export function updateExpenseCategory(id, category) {
  const expenses = state.expenses.map((expense) =>
    expense.id === id ? { ...expense, category } : expense // spread: new object
  );
  saveExpenses(expenses);
  return update({ expenses });
}

export function removeExpense(id) {
  const expenses = state.expenses.filter((expense) => expense.id !== id);
  saveExpenses(expenses);
  return update({ expenses });
}

export const setFilter = (filter) => update({ filter });
export const setHomeCurrency = (homeCurrency) => update({ homeCurrency });
export const setLoading = () => update({ status: 'loading', error: '' });
export const setRates = (rates) => update({ rates, status: 'idle', error: '' });
export const setError = (error) => update({ status: 'error', error });