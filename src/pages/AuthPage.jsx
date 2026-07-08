import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Key, RefreshCw, Copy, CheckCircle, Wallet, Shield } from 'lucide-react';
import './Auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [promo, setPromo] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { user, register, login, logout, updateBalance, getApiKey, regenerateApiKey } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="auth-page">
        <div className="auth-card profile-card">
          <div className="auth-avatar">
            <User size={40} color="#FF1493" />
          </div>
          <h2>{user.username}</h2>
          <p className="auth-member">Участник Dergame</p>
          {user.isAdmin && <div className="admin-badge"><Shield size={14} /> Администратор</div>}

          <div className="profile-section">
            <div className="profile-balance">
              <Wallet size={20} color="#FF1493" />
              <span className="balance-label">Баланс:</span>
              <span className="balance-value">{user.balance || 0} ₽</span>
            </div>
            <button className="profile-btn-sm" onClick={() => navigate('/balance')}>Пополнить</button>
          </div>

          <div className="profile-section">
            <div className="profile-api-row">
              <Key size={16} color="#FF1493" />
              <span className="api-label">API ключ:</span>
              <code className="api-key-display">{getApiKey()}</code>
              <button className="copy-btn-sm" onClick={() => { navigator.clipboard.writeText(getApiKey()); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <button className="profile-btn-sm profile-btn-regen" onClick={() => { if (confirm('Перегенерировать API ключ?')) regenerateApiKey(); }}>
              <RefreshCw size={14} /> Перегенерировать
            </button>
          </div>

          <button className="auth-btn auth-logout" onClick={() => { logout(); navigate('/'); }}>
            <LogOut size={18} /> Выйти
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) return setError('Заполните все поля');
    if (password.length < 4) return setError('Минимум 4 символа');
    const result = isLogin ? login(username, password) : register(username, password, promo);
    if (result.ok) {
      if (result.isAdmin) alert('Промокод активирован! Теперь у вас есть доступ к админ-панели.');
      navigate('/');
    } else setError(result.error);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Логин</label>
            <input type="text" placeholder="Ваш логин" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="auth-field">
            <label>Пароль</label>
            <input type="password" placeholder="Минимум 4 символа" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {!isLogin && (
            <div className="auth-field">
              <label>Промокод (необязательно)</label>
              <input type="text" placeholder="Введите промокод" value={promo} onChange={(e) => setPromo(e.target.value)} />
            </div>
          )}
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-btn">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
        </form>
        <p className="auth-switch">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </span>
        </p>
        {isLogin && (
          <p className="auth-forgot">
            <a href="https://t.me/dqeqeqё" target="_blank" rel="noopener noreferrer">Забыли пароль?</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
