const DEFAULT_PRODUCTS = {
  'pubg-mobile': [
    { id: 'pubg-60', name: '60 UC', price: 99, image: '', description: '', discount: 0 },
    { id: 'pubg-325', name: '325 UC', price: 399, image: '', description: '', discount: 10 },
    { id: 'pubg-660', name: '660 UC', price: 599, image: '', description: '', discount: 15 },
    { id: 'pubg-1800', name: '1800 UC', price: 1499, image: '', description: '', discount: 0 },
    { id: 'pubg-3850', name: '3850 UC', price: 2999, image: '', description: '', discount: 0 },
    { id: 'pubg-8100', name: '8100 UC', price: 5499, image: '', description: '', discount: 5 },
  ],
  'brawl-stars': [
    { id: 'brawl-30', name: '30 Гемов', price: 49, image: '', description: '', discount: 0 },
    { id: 'brawl-80', name: '80 Гемов', price: 99, image: '', description: '', discount: 0 },
    { id: 'brawl-170', name: '170 Гемов', price: 199, image: '', description: '', discount: 10 },
    { id: 'brawl-350', name: '350 Гемов', price: 349, image: '', description: '', discount: 0 },
    { id: 'brawl-700', name: '700 Гемов', price: 649, image: '', description: '', discount: 15 },
  ],
  'roblox': [
    { id: 'robux-80', name: '80 Robux', price: 79, image: '', description: '', discount: 0 },
    { id: 'robux-400', name: '400 Robux', price: 349, image: '', description: '', discount: 0 },
    { id: 'robux-800', name: '800 Robux', price: 649, image: '', description: '', discount: 10 },
    { id: 'robux-1700', name: '1700 Robux', price: 1299, image: '', description: '', discount: 0 },
    { id: 'robux-4500', name: '4500 Robux', price: 3199, image: '', description: '', discount: 5 },
  ],
  'standoff-2': [
    { id: 'so2-50', name: '50 Золота', price: 49, image: '', description: '', discount: 0 },
    { id: 'so2-150', name: '150 Золота', price: 129, image: '', description: '', discount: 0 },
    { id: 'so2-500', name: '500 Золота', price: 349, image: '', description: '', discount: 10 },
    { id: 'so2-1500', name: '1500 Золота', price: 899, image: '', description: '', discount: 0 },
  ],
};

const DEFAULT_POPULAR = [
  { id: 'pop-1', name: '60 UC', game: 'PUBG Mobile', price: 99, oldPrice: 149, image: '', description: '', discount: 0 },
  { id: 'pop-2', name: '80 Гемов', game: 'Brawl Stars', price: 79, oldPrice: 119, image: '', description: '', discount: 0 },
  { id: 'pop-3', name: '400 Robux', game: 'Roblox', price: 349, oldPrice: 499, image: '', description: '', discount: 0 },
  { id: 'pop-4', name: '150 Золота', game: 'Standoff 2', price: 149, oldPrice: 219, image: '', description: '', discount: 0 },
];

const DEFAULT_DISCOUNTS = [
  { id: 'disc-1', name: '660 UC', game: 'PUBG Mobile', price: 599, oldPrice: 999, discount: 40, image: '', description: '' },
  { id: 'disc-2', name: '350 Гемов', game: 'Brawl Stars', price: 329, oldPrice: 549, discount: 40, image: '', description: '' },
  { id: 'disc-3', name: '1000 Robux', game: 'Roblox', price: 699, oldPrice: 1199, discount: 42, image: '', description: '' },
  { id: 'disc-4', name: '500 Золота', game: 'Standoff 2', price: 399, oldPrice: 699, discount: 43, image: '', description: '' },
];

const DEFAULT_NEWS = [
  { id: 'news-1', date: '05.07.2026', title: 'Обновление цен на UC', text: 'Снизили цены на пополнение UC для PUBG Mobile до 30%!' },
  { id: 'news-2', date: '01.07.2026', title: 'Новые товары для Brawl Stars', text: 'Добавлены новые пакеты гемов со скидкой.' },
  { id: 'news-3', date: '28.06.2026', title: 'Standoff 2 — акция выходного дня', text: 'Скидки до 40% на золото и кристаллы каждые выходные.' },
];

function loadProducts(gameId) {
  try {
    const custom = localStorage.getItem(`products_${gameId}_custom`);
    const customList = custom ? JSON.parse(custom) : [];
    const defaults = DEFAULT_PRODUCTS[gameId] || [];
    return [...defaults, ...customList];
  } catch {
    return DEFAULT_PRODUCTS[gameId] || [];
  }
}

function loadList(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    const customList = saved ? JSON.parse(saved) : [];
    return [...fallback, ...customList];
  } catch {
    return fallback;
  }
}

export { DEFAULT_PRODUCTS, DEFAULT_POPULAR, DEFAULT_DISCOUNTS, DEFAULT_NEWS, loadProducts, loadList };
