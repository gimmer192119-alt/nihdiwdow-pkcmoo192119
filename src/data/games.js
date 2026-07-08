import pubgImg from '../../icongame/pubg.webp';
import brawlImg from '../../icongame/brawl.webp';
import robloxImg from '../../icongame/roblox.webp';
import standoffImg from '../../icongame/standoff 2.webp';

export const games = [
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    description: 'Пополнение UC для PUBG Mobile',
    image: pubgImg,
    stats: [
      { label: 'UC куплено', value: '2.4M' },
      { label: 'На сумму', value: '14.2M ₽' },
      { label: 'Покупателей', value: '18.4K' },
    ],
  },
  {
    id: 'brawl-stars',
    name: 'Brawl Stars',
    description: 'Гемы и билеты для Brawl Stars',
    image: brawlImg,
    stats: [
      { label: 'Гемов куплено', value: '1.8M' },
      { label: 'На сумму', value: '9.6M ₽' },
      { label: 'Покупателей', value: '22.1K' },
    ],
  },
  {
    id: 'roblox',
    name: 'Roblox',
    description: 'Robux для Roblox',
    image: robloxImg,
    stats: [
      { label: 'Robux куплено', value: '3.1M' },
      { label: 'На сумму', value: '11.5M ₽' },
      { label: 'Покупателей', value: '31.7K' },
    ],
  },
  {
    id: 'standoff-2',
    name: 'Standoff 2',
    description: 'Золото и кристаллы для Standoff 2',
    image: standoffImg,
    stats: [
      { label: 'Золота куплено', value: '5.2M' },
      { label: 'На сумму', value: '7.8M ₽' },
      { label: 'Покупателей', value: '15.3K' },
    ],
  },
];
