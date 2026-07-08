import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

const USD_RATE = 92; // Примерный курс RUB/USD

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem('dergame_currency') || 'RUB');
  const [lang, setLang] = useState(() => localStorage.getItem('dergame_lang') || 'ru');

  useEffect(() => { localStorage.setItem('dergame_currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('dergame_lang', lang); }, [lang]);

  const convertPrice = (priceRUB) => {
    if (currency === 'USD') return (priceRUB / USD_RATE).toFixed(2);
    return priceRUB;
  };

  const formatPrice = (priceRUB) => {
    const converted = convertPrice(priceRUB);
    return `${converted} ${currency === 'USD' ? '$' : '₽'}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, lang, setLang, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
