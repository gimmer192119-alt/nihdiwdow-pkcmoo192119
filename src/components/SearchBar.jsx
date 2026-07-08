import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { games } from '../data/games';
import { loadProducts } from '../data/defaults';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const found = [];

    // Search games
    games.forEach((game) => {
      if (game.name.toLowerCase().includes(q) || game.description.toLowerCase().includes(q)) {
        found.push({
          type: 'game',
          id: game.id,
          name: game.name,
          desc: game.description,
          image: game.image,
          link: `/game/${game.id}`,
        });
      }
    });

    // Search products in each game
    games.forEach((game) => {
      const products = loadProducts(game.id);
      products.forEach((product) => {
        if (product.name.toLowerCase().includes(q)) {
          found.push({
            type: 'product',
            id: `${game.id}-${product.id}`,
            name: product.name,
            desc: `${game.name} — ${product.price} ₽`,
            image: product.image || game.image,
            link: `/game/${game.id}`,
          });
        }
      });
    });

    setResults(found.slice(0, 8));
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (link) => {
    setFocused(false);
    setQuery('');
    navigate(link);
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="search-glow" />
      <div className="search-border-outer" />
      <div className="search-white" />
      <div className="search-border" />
      <div className="search-main">
        <div className="search-icon-left">
          <Search size={18} color="#FF1493" />
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Найти игру или товар..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
        />
        {query && (
          <button className="search-clear" onClick={() => { setQuery(''); setResults([]); }}>
            <X size={16} />
          </button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((r) => (
            <div
              key={r.id}
              className="search-result"
              onClick={() => handleResultClick(r.link)}
            >
              <div className="search-result-img">
                {r.image ? <img src={r.image} alt="" /> : <span>?</span>}
              </div>
              <div className="search-result-info">
                <span className="search-result-name">{r.name}</span>
                <span className="search-result-desc">{r.desc}</span>
              </div>
              <span className="search-result-type">{r.type === 'game' ? 'Игра' : 'Товар'}</span>
            </div>
          ))}
        </div>
      )}

      {focused && query && query.length >= 2 && results.length === 0 && (
        <div className="search-dropdown">
          <div className="search-empty">Ничего не найдено</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
