import { Newspaper } from 'lucide-react';
import './News.css';

const newsData = [
  {
    id: 1,
    date: '05.07.2026',
    title: 'Обновление цен на UC',
    text: 'Снизили цены на пополнение UC для PUBG Mobile до 30%! Теперь покупай UC еще выгоднее. Акция действует до конца месяца.',
  },
  {
    id: 2,
    date: '01.07.2026',
    title: 'Новые товары для Brawl Stars',
    text: 'Добавлены новые пакеты гемов со скидкой для всех покупателей. Обновленный каталог уже доступен в магазине.',
  },
  {
    id: 3,
    date: '28.06.2026',
    title: 'Standoff 2 — акция выходного дня',
    text: 'Скидки до 40% на золото и кристаллы каждые выходные. Успей купить по лучшей цене!',
  },
  {
    id: 4,
    date: '25.06.2026',
    title: 'Roblox: новый сезон Robux',
    text: 'Запущены специальные предложения на Robux к началу нового сезона. Бонусы при покупке крупных пакетов.',
  },
  {
    id: 5,
    date: '20.06.2026',
    title: 'Техническое обслуживание',
    text: 'Плановое обновление системы оплаты. Все сервисы работают в штатном режиме. Спасибо за ожидание!',
  },
  {
    id: 6,
    date: '15.06.2026',
    title: 'Программа лояльности',
    text: 'Запускаем программу лояльности! Получай кэшбэк баллами за каждую покупку. Подробности на странице поддержки.',
  },
];

const News = () => {
  return (
    <div className="news-page">
      <h1 className="news-page-title">
        <Newspaper size={28} color="#FF1493" /> Новости
      </h1>
      <div className="news-page-list">
        {newsData.map((item) => (
          <div key={item.id} className="news-page-card">
            <div className="news-page-date">{item.date}</div>
            <h2 className="news-page-card-title">{item.title}</h2>
            <p className="news-page-card-text">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
