import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Zap, CreditCard, TrendingUp, Percent, Newspaper } from 'lucide-react';
import { games } from '../data/games';
import { DEFAULT_POPULAR, DEFAULT_DISCOUNTS, DEFAULT_NEWS, loadList } from '../data/defaults';
import PurchaseModal from '../components/PurchaseModal';
import '../button.css';
import './Home.css';

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [buyProduct, setBuyProduct] = useState(null);
  const [popularItems] = useState(() => loadList('popular_custom', DEFAULT_POPULAR));
  const [discountItems] = useState(() => loadList('discounts_custom', DEFAULT_DISCOUNTS));
  const [newsData] = useState(() => loadList('news_custom', DEFAULT_NEWS));

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % games.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentGame = games[activeSlide];

  return (
    <div className="home">
      {/* Top Banner */}
      <section className="top-banner">
        <div className="banner-items">
          <div className="banner-item"><Zap size={20} color="#FF1493" /><span>Лучшие цены</span></div>
          <div className="banner-divider" />
          <div className="banner-item"><ShieldCheck size={20} color="#FF1493" /><span>Надежные поставщики</span></div>
          <div className="banner-divider" />
          <div className="banner-item"><CreditCard size={20} color="#FF1493" /><span>Быстрая оплата</span></div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <div className="stat-card-single" key={currentGame.id}>
            <div className="stat-card-header">
              <img src={currentGame.image} alt={currentGame.name} className="stat-game-avatar" />
              <span className="stat-game-name">{currentGame.name}</span>
            </div>
            <div className="stat-values">
              {currentGame.stats.map((stat, i) => (
                <div key={i} className="stat-row">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
            <Link to={`/game/${currentGame.id}`} className="button stat-btn">
              <p>{currentGame.name} <ChevronRight size={16} /></p>
            </Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="slide-container">
            {games.map((game, index) => (
              <div key={game.id} className={`slide ${index === activeSlide ? 'slide-active' : ''}`}>
                <img src={game.image} alt={game.name} className="slide-image" />
                <div className="slide-overlay"><span className="slide-name">{game.name}</span></div>
              </div>
            ))}
            <div className="slide-dots">
              {games.map((_, index) => (
                <span key={index} className={`dot ${index === activeSlide ? 'dot-active' : ''}`} onClick={() => setActiveSlide(index)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Games */}
      <section className="categories-section">
        <h2 className="section-title"><ChevronRight size={24} /> Игры</h2>
        <div className="categories-grid">
          {games.map((game) => (
            <Link to={`/game/${game.id}`} key={game.id} className="category-card">
              <div className="category-image-wrapper"><img src={game.image} alt={game.name} className="category-image" /></div>
              <div className="category-info">
                <span className="category-name">{game.name}</span>
                <div className="category-arrow"><ChevronRight size={20} /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="popular-section">
        <h2 className="section-title"><TrendingUp size={24} /> Популярные товары</h2>
        <div className="items-grid">
          {popularItems.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-image-wrapper"><img src={item.image || games.find(g => g.name === item.game)?.image} alt={item.name} className="item-image" /></div>
              <div className="item-info">
                <span className="item-game">{item.game}</span>
                <span className="item-name">{item.name}</span>
                <div className="item-prices">
                  <span className="item-price">{item.price} ₽</span>
                  {item.oldPrice && <span className="item-old-price">{item.oldPrice} ₽</span>}
                </div>
                <button className="button item-buy-btn" onClick={() => setBuyProduct(item)}><p>Купить</p></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discounts */}
      <section className="discounts-section">
        <h2 className="section-title"><Percent size={24} /> Скидки</h2>
        <div className="items-grid">
          {discountItems.map((item) => (
            <div key={item.id} className="item-card discount-card">
              {item.discount && <div className="discount-badge">-{item.discount}%</div>}
              <div className="item-image-wrapper"><img src={item.image || games.find(g => g.name === item.game)?.image} alt={item.name} className="item-image" /></div>
              <div className="item-info">
                <span className="item-game">{item.game}</span>
                <span className="item-name">{item.name}</span>
                <div className="item-prices">
                  <span className="item-price">{item.price} ₽</span>
                  {item.oldPrice && <span className="item-old-price">{item.oldPrice} ₽</span>}
                </div>
                <button className="button item-buy-btn" onClick={() => setBuyProduct(item)}><p>Купить</p></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="news-section">
        <h2 className="section-title"><Newspaper size={24} /> Новости</h2>
        <div className="news-grid">
          {newsData.map((item) => (
            <div key={item.id} className="news-card">
              <div className="news-date">{item.date}</div>
              <h3 className="news-title">{item.title}</h3>
              <p className="news-text">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {buyProduct && (
        <PurchaseModal product={buyProduct} gameName={buyProduct.game} onClose={() => setBuyProduct(null)} />
      )}
    </div>
  );
};

export default Home;
