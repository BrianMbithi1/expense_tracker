import { CATEGORIES, CURRENCIES, calculateTotal, convertAmount, filterByCategory, formatMoney } from './utils.js';

const $ = (id) => document.getElementById(id);

function fillSelect(select, options, selected) {
  select.replaceChildren(
    ...options.map((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      option.selected = value === selected;
      return option;
    })
  );
}

export function initSelects(state) {
  fillSelect($('home-currency'), CURRENCIES, state.homeCurrency);
  fillSelect($('currency'), CURRENCIES, state.homeCurrency);
  fillSelect($('category'), CATEGORIES, CATEGORIES[0]);
  fillSelect($('filter'), ['All', ...CATEGORIES], state.filter);
}

function renderStatus(state, onRetry) {
  const box = $('status');
  box.className = 'status';
  box.replaceChildren();

  if (state.status === 'loading') {
    box.hidden = false;
    box.textContent = 'Loading live exchange rates…';
  } else if (state.status === 'error') {
    box.hidden = false;
    box.classList.add('error');
    const message = document.createElement('span');
    message.textContent = `${state.error} Totals may be incomplete.`;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Retry';
    retry.addEventListener('click', onRetry);
    box.append(message, retry);
  } else {
    box.hidden = true;
  }
}

function renderTotal(state) {
  const { total, skipped } = calculateTotal(state.expenses, state.homeCurrency, state.rates);
  $('total-currency').textContent = state.homeCurrency;
  $('total-amount').textContent = formatMoney(total, state.homeCurrency);
  $('total-note').textContent =
    skipped > 0 ? `${skipped} expense(s) not included: no exchange rate available.` : '';
}

function renderExpense(state, expense, handlers) {
  const converted = convertAmount(expense.amount, expense.currency, state.homeCurrency, state.rates);

  const item = document.createElement('li');
  item.className = 'expense';

  const info = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'expense-title';
  title.textContent = expense.description;
  const original = document.createElement('div');
  original.className = 'expense-original';
  original.textContent = `${formatMoney(expense.amount, expense.currency)} · ${expense.category}`;
  info.append(title, original);

  const convertedEl = document.createElement('div');
  convertedEl.className = 'expense-converted';
  convertedEl.textContent = converted === null ? 'Rate unavailable' : formatMoney(converted, state.homeCurrency);

  const actions = document.createElement('div');
  actions.className = 'expense-actions';
  const categorySelect = document.createElement('select');
  categorySelect.setAttribute('aria-label', `Category for ${expense.description}`);
  fillSelect(categorySelect, CATEGORIES, expense.category);
  categorySelect.addEventListener('change', () => handlers.onCategory(expense.id, categorySelect.value));
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'secondary';
  remove.textContent = 'Delete';
  remove.setAttribute('aria-label', `Delete ${expense.description}`);
  remove.addEventListener('click', () => handlers.onDelete(expense.id));
  actions.append(categorySelect, remove);

  item.append(info, convertedEl, actions);
  return item;
}

function renderList(state, handlers) {
  const visible = filterByCategory(state.expenses, state.filter);
  const list = $('expense-list');

  if (visible.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent =
      state.expenses.length === 0 ? 'No expenses yet. Add your first one above.' : 'No expenses in this category.';
    list.replaceChildren(empty);
    return;
  }
  list.replaceChildren(...visible.map((expense) => renderExpense(state, expense, handlers)));
}

export function render(state, handlers) {
  renderStatus(state, handlers.onRetry);
  renderTotal(state);
  renderList(state, handlers);
}