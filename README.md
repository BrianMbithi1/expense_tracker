# Expense Tracker

Anyone who travels, freelances internationally, or shops from foreign stores ends up paying in many currencies and quickly loses track of what they have spent. Expense Tracker lets you log each purchase in the currency you paid in and instantly see everything converted into one home currency, using live exchange rates.

**Live demo:** https://YOUR-USERNAME.github.io/expense-tracker/

## Features
- Add expenses with description, amount, currency and category
- Each expense shows its original amount and its converted value
- Running total in your home currency, updated on every add, delete or change
- Delete expenses and change an expense's category
- Filter the list by category
- Choose the home currency; rates are re-fetched when it changes
- Loading and error states with a Retry button
- Expenses are saved in the browser (localStorage)

## Tech used
- REST API: [open.er-api.com](https://www.exchangerate-api.com/docs/free) (`/v6/latest/{base}`, no key needed), via `fetch` and `async/await`
- Vanilla JavaScript with ES modules (`api`, `state`, `utils`, `ui`, `main`)
- Jest for unit tests
- ESLint (`eslint:recommended`)
- GitHub Pages for deployment

## Run locally
```bash
git clone https://github.com/YOUR-USERNAME/expense-tracker.git
cd expense-tracker
npm install
npm start        # serves the app (ES modules need a server, not file://)
npm test         # run unit tests
npm run lint     # run ESLint
```

