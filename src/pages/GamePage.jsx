import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { games } from '../data/games';
import { loadProducts } from '../data/defaults';
import { useCurrency } from '../context/CurrencyContext';
import PurchaseModal from '../components/PurchaseModal';
import '../button.css';
import './GamePage.css';

const GamePage = () => {
  const { id } = useParams();
  const game = games.find((g) => g.id === id);
  const [products, setProducts] = useState([]);
  const [buyProduct, setBuyProduct] = useState(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    setProducts(loadProducts(id));
    const handleStorage = (e) => {
      if (e.key === `products_${id}_custom`) setProducts(loadProducts(id));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [id]);

  if (!game) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#fff' }}>
        <h2 style={{ color: '#FF1493', marginBottom: '1rem' }}>Игра не найдена</h2>
        <Link to="/shop" className="button" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          <p>Вернуться в магазин</p>
        </Link>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="game-page-header">
        <img src={game.image} alt={game.name} className="game-page-avatar" />
        <h2 className="game-page-title">{game.name}</h2>
      </div>
      <p className="game-page-id">Game ID: {game.id}</p>
      <p className="game-page-desc">{game.description}</p>

      <div className="products-grid">
        {products.map((product) => {
          const oldPrice = product.discount > 0 ? Math.round(product.price / (1 - product.discount / 100)) : 0;
          return (
            <div key={product.id} className="product-card">
              {product.discount > 0 && <div className="product-discount-badge">-{product.discount}%</div>}
              <div className="product-image-wrapper">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">Нет фото</div>
                )}
              </div>
              <div className="product-info">
                <span className="product-id-display">{product.id}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-row">
                  {product.discount > 0 && <span className="product-old-price">{formatPrice(oldPrice)}</span>}
                  <span className="product-price">{formatPrice(product.price)}</span>
                </div>
                <button className="button buy-btn" onClick={() => setBuyProduct(product)}>
                  <p>Купить</p>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {buyProduct && (
        <PurchaseModal product={buyProduct} gameName={game.name} gameId={game.id} onClose={() => setBuyProduct(null)} />
      )}
    </div>
  );
};

export default GamePage;
