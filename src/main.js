import { fetchRates } from './api.js';
import * as store from './state.js';
import { initSelects, render } from './ui.js';

const handlers = {
  onDelete: (id) => { store.removeExpense(id); refresh(); },
  onCategory: (id, category) => { store.updateExpenseCategory(id, category); refresh(); },
  onRetry: () => loadRates()
};

function refresh() {
  render(store.getState(), handlers);
}

async function loadRates() {
  store.setLoading();
  refresh();
  try {
    const rates = await fetchRates(store.getState().homeCurrency);
    store.setRates(rates);
  } catch (error) {
    store.setError(error.message);
  }
  refresh();
}

function setupEvents() {
  document.getElementById('expense-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const description = document.getElementById('description').value.trim();
    const amount = Number(document.getElementById('amount').value);
    if (!description || !(amount > 0)) return;

    store.addExpense({
      description,
      amount,
      currency: document.getElementById('currency').value,
      category: document.getElementById('category').value
    });
    event.target.reset();
    refresh();
  });

  document.getElementById('home-currency').addEventListener('change', (event) => {
    store.setHomeCurrency(event.target.value);
    loadRates(); // fetch fresh rates for the new home currency
  });

  document.getElementById('filter').addEventListener('change', (event) => {
    store.setFilter(event.target.value);
    refresh();
  });
}

initSelects(store.getState());
setupEvents();
loadRates();