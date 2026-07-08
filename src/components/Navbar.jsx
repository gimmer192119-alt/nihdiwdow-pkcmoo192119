import { Link, useLocation } from 'react-router-dom';
import { Home, User, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import logo from '../assets/logo.jpg';
import SearchBar from './SearchBar';
import '../button.css';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { currency, setCurrency, lang, setLang, convertPrice } = useCurrency();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Dergame" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        <span><span style={{ color: '#FF1493' }}>Der</span>game</span>
      </Link>

      <SearchBar />

      <div className="nav-links">
        {location.pathname !== '/' && (
          <Link to="/" className="button home-btn-enter" style={{ marginRight: '0.3rem' }}>
            <p><Home size={16} style={{ marginRight: '0.3rem' }} /> {lang === 'ru' ? 'Главная' : 'Home'}</p>
          </Link>
        )}
        <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
          {lang === 'ru' ? 'Магазин' : 'Shop'}
        </Link>
        <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`}>
          {lang === 'ru' ? 'Новости' : 'News'}
        </Link>

        {/* Language & Currency */}
        <div className="nav-switchers">
          <button className="nav-switch" onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}>
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>
          <button className="nav-switch" onClick={() => setCurrency(currency === 'RUB' ? 'USD' : 'RUB')}>
            {currency}
          </button>
        </div>

        {/* Balance in header */}
        {user && (
          <Link to="/balance" className="nav-balance">
            <Wallet size={14} /> {convertPrice(user.balance || 0)} {currency}
          </Link>
        )}

        <Link to="/auth" className={`nav-link auth-nav ${location.pathname === '/auth' ? 'active' : ''}`}>
          <User size={16} /> {user ? user.username : (lang === 'ru' ? 'Войти' : 'Login')}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
