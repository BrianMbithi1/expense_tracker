const BASE_URL = 'https://open.er-api.com/v6/latest';


export async function fetchRates(base) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/${base}`);
  } catch {
    throw new Error('Could not reach the exchange rate service. Check your connection.');
  }

  if (!response.ok) {
    throw new Error(`Exchange rate service returned an error (${response.status}).`);
  }

  const data = await response.json();
  if (data.result !== 'success' || !data.rates) {
    throw new Error('Exchange rate service returned unexpected data.');
  }
  return data.rates;
}