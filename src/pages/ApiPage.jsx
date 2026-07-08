import { games } from '../data/games';
import { loadProducts } from '../data/defaults';
import { Code, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import './ApiPage.css';

const ApiPage = () => {
  const [copied, setCopied] = useState('');

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const exampleGetGames = `GET https://your-site.com/api/games

{
  "games": [
    { "id": "pubg-mobile", "name": "PUBG Mobile", "image": "..." },
    { "id": "brawl-stars", "name": "Brawl Stars", "image": "..." },
    { "id": "roblox", "name": "Roblox", "image": "..." },
    { "id": "standoff-2", "name": "Standoff 2", "image": "..." }
  ]
}`;

  const exampleGetProducts = `GET https://your-site.com/api/products?game=pubg-mobile

{
  "products": [
    { "id": 1, "name": "60 UC", "price": 99 },
    { "id": 2, "name": "325 UC", "price": 399 },
    { "id": 3, "name": "660 UC", "price": 599 }
  ]
}`;

  const exampleCreateOrder = `POST https://your-site.com/api/order
Content-Type: application/json

{
  "product_id": 1,
  "game_id": "pubg-mobile",
  "payment_method": "sbp",
  "email": "user@example.com"
}

Response:
{
  "order_id": "ord_abc123",
  "payment_url": "https://pally.info/pay/...",
  "status": "pending"
}`;

  const exampleCheckOrder = `GET https://your-site.com/api/order/ord_abc123

{
  "order_id": "ord_abc123",
  "status": "paid",
  "product": { "name": "60 UC", "price": 99 },
  "game": "PUBG Mobile",
  "created_at": "2026-07-07T15:30:00Z"
}`;

  return (
    <div className="api-page">
      <h1 className="api-title"><Code size={28} color="#FF1493" /> API Documentation</h1>
      <p className="api-desc">Публичный API для интеграции с Dergame. Покупайте товары программно.</p>

      <div className="api-section">
        <h2>Базовый URL</h2>
        <div className="api-code-block">
          <code>https://your-domain.com/api</code>
        </div>
      </div>

      <div className="api-section">
        <h2>1. Получить список игр</h2>
        <div className="api-method">GET</div>
        <div className="api-code-block">
          <pre>{exampleGetGames}</pre>
        </div>
      </div>

      <div className="api-section">
        <h2>2. Получить товары игры</h2>
        <div className="api-method">GET</div>
        <div className="api-code-block">
          <pre>{exampleGetProducts}</pre>
        </div>
      </div>

      <div className="api-section">
        <h2>3. Создать заказ</h2>
        <div className="api-method api-post">POST</div>
        <div className="api-code-block">
          <pre>{exampleCreateOrder}</pre>
        </div>
      </div>

      <div className="api-section">
        <h2>4. Проверить статус заказа</h2>
        <div className="api-method">GET</div>
        <div className="api-code-block">
          <pre>{exampleCheckOrder}</pre>
        </div>
      </div>

      <div className="api-section">
        <h2>Доступные товары</h2>
        <div className="api-products-grid">
          {games.map((game) => {
            const products = loadProducts(game.id);
            return (
              <div key={game.id} className="api-game-block">
                <h3>{game.name}</h3>
                <table className="api-table">
                  <thead>
                    <tr><th>ID</th><th>Товар</th><th>Цена</th></tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.price} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      <div className="api-section">
        <h2>Методы оплаты</h2>
        <div className="api-methods-list">
          <div className="api-method-item">
            <span className="api-method-name">sbp</span>
            <span className="api-method-desc">Система Быстрых Платежей (через Pally)</span>
          </div>
          <div className="api-method-item">
            <span className="api-method-name">crypto</span>
            <span className="api-method-desc">Криптовалюта USDT/BTC/ETH (через Heleket)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiPage;
