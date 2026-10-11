import { describe, expect, test } from '@jest/globals';
import { calculateTotal, convertAmount, filterByCategory } from '../src/utils.js';

const rates = { USD: 1, EUR: 0.5, KES: 100 };

const expenses = [
  { id: '1', description: 'Lunch', amount: 10, currency: 'USD', category: 'Food' },
  { id: '2', description: 'Taxi', amount: 1000, currency: 'KES', category: 'Transport' },
  { id: '3', description: 'Shirt', amount: 5, currency: 'EUR', category: 'Shopping' }
];

describe('convertAmount', () => {
  test('converts between currencies using the rates table', () => {
    expect(convertAmount(1000, 'KES', 'USD', rates)).toBe(10);
    expect(convertAmount(10, 'USD', 'EUR', rates)).toBe(5);
  });

  test('returns 0 for a zero amount', () => {
    expect(convertAmount(0, 'EUR', 'USD', rates)).toBe(0);
  });

  test('returns null when a rate is missing or rates are not loaded', () => {
    expect(convertAmount(10, 'XYZ', 'USD', rates)).toBeNull();
    expect(convertAmount(10, 'USD', 'EUR', null)).toBeNull();
  });
});

describe('calculateTotal', () => {
  test('sums all expenses in the home currency', () => {
    
    expect(calculateTotal(expenses, 'USD', rates)).toEqual({ total: 30, skipped: 0 });
  });

  test('skips expenses with missing rates and counts them', () => {
    const withUnknown = [...expenses, { id: '4', description: 'Odd', amount: 9, currency: 'XYZ', category: 'Other' }];
    expect(calculateTotal(withUnknown, 'USD', rates)).toEqual({ total: 30, skipped: 1 });
  });

  test('returns zero for an empty list', () => {
    expect(calculateTotal([], 'USD', rates)).toEqual({ total: 0, skipped: 0 });
  });
});

describe('filterByCategory', () => {
  test('returns only matching expenses', () => {
    expect(filterByCategory(expenses, 'Food')).toHaveLength(1);
    expect(filterByCategory(expenses, 'Transport')[0].description).toBe('Taxi');
  });

  test('"All" returns every expense', () => {
    expect(filterByCategory(expenses, 'All')).toHaveLength(3);
  });
});