import { useState, useEffect } from 'react';
import { games } from '../data/games';
import { Plus, Trash2, Upload, Newspaper, TrendingUp, Percent, Package, Eye, EyeOff, LogOut } from 'lucide-react';
import { loadProducts } from '../data/defaults';
import './Admin.css';

const ADMIN_PASSWORD = 'DanilBlaze192119';

const load = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : []; }
  catch { return []; }
};

const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const Admin = ({ onAuth }) => {
  const [auth, setAuth] = useState(() => localStorage.getItem('adminAuth') === 'true');
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  const [selectedGame, setSelectedGame] = useState(games[0].id);
  const [products, setProducts] = useState([]);
  const [popular, setPopular] = useState(() => load('popular_custom', []));
  const [discounts, setDiscounts] = useState(() => load('discounts_custom', []));
  const [news, setNews] = useState(() => load('news_custom', []));

  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', description: '', discount: 0 });
  const [newPopular, setNewPopular] = useState({ name: '', game: games[0].name, price: '', oldPrice: '', image: '' });
  const [newDiscount, setNewDiscount] = useState({ name: '', game: games[0].name, price: '', oldPrice: '', discount: '', image: '' });
  const [newNews, setNewNews] = useState({ title: '', text: '' });

  useEffect(() => {
    if (auth) {
      const all = loadProducts(selectedGame);
      const custom = localStorage.getItem(`products_${selectedGame}_custom`);
      setProducts(custom ? JSON.parse(custom) : []);
    }
  }, [selectedGame, auth]);

  useEffect(() => { if (auth) save('popular_custom', popular); }, [popular, auth]);
  useEffect(() => { if (auth) save('discounts_custom', discounts); }, [discounts, auth]);
  useEffect(() => { if (auth) save('news_custom', news); }, [news, auth]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuth(true);
      setVisible(true);
      localStorage.setItem('adminAuth', 'true');
      onAuth(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setAuth(false);
    setVisible(false);
    localStorage.removeItem('adminAuth');
    onAuth(false);
  };

  const handleImageUpload = (e, setter, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter({ ...state, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // Products
  const saveProducts = (updated) => { setProducts(updated); save(`products_${selectedGame}_custom`, updated); };
  const addProduct = () => { if (!newProduct.name || !newProduct.price) return; saveProducts([...products, { ...newProduct, id: Date.now() }]); setNewProduct({ name: '', price: '', image: '', description: '', discount: 0 }); };
  const removeProduct = (id) => saveProducts(products.filter((p) => p.id !== id));
  const updateProductPrice = (id, newPrice) => saveProducts(products.map((p) => p.id === id ? { ...p, price: newPrice } : p));

  // Popular
  const addPopular = () => { if (!newPopular.name || !newPopular.price) return; setPopular([...popular, { ...newPopular, id: Date.now() }]); setNewPopular({ name: '', game: games[0].name, price: '', oldPrice: '', image: '' }); };
  const removePopular = (id) => setPopular(popular.filter((p) => p.id !== id));

  // Discounts
  const addDiscount = () => { if (!newDiscount.name || !newDiscount.price) return; setDiscounts([...discounts, { ...newDiscount, id: Date.now() }]); setNewDiscount({ name: '', game: games[0].name, price: '', oldPrice: '', discount: '', image: '' }); };
  const removeDiscount = (id) => setDiscounts(discounts.filter((d) => d.id !== id));

  // News
  const addNews = () => { if (!newNews.title || !newNews.text) return; const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }); setNews([{ id: Date.now(), date: today, ...newNews }, ...news]); setNewNews({ title: '', text: '' }); };
  const removeNews = (id) => setNews(news.filter((n) => n.id !== id));

  if (!auth) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>Вход в админ-панель</h2>
          <input type="password" placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button className="login-btn" onClick={handleLogin}>Войти</button>
        </div>
      </div>
    );
  }

  if (!visible) {
    return (
      <div className="admin-hidden">
        <button className="admin-toggle-btn" onClick={() => setVisible(true)}><Eye size={18} /> Показать панель</button>
        <button className="admin-logout-btn" onClick={handleLogout}><LogOut size={16} /> Выйти</button>
      </div>
    );
  }

  const tabs = [
    { id: 'products', label: 'Товары', icon: <Package size={16} /> },
    { id: 'popular', label: 'Популярные', icon: <TrendingUp size={16} /> },
    { id: 'discounts', label: 'Скидки', icon: <Percent size={16} /> },
    { id: 'news', label: 'Новости', icon: <Newspaper size={16} /> },
  ];

  return (
    <div className="admin">
      <div className="admin-header">
        <h1 className="admin-title">Админ-панель</h1>
        <div className="admin-header-actions">
          <button className="admin-toggle-btn" onClick={() => setVisible(false)}><EyeOff size={16} /> Скрыть</button>
          <button className="admin-logout-btn" onClick={handleLogout}><LogOut size={16} /> Выйти</button>
        </div>
      </div>

      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'admin-tab-active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Products */}
      {activeTab === 'products' && (
        <div className="admin-section">
          <div className="admin-select">
            <label>Игра:</label>
            <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
              {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="admin-form">
            <h2>Добавить товар</h2>
            <div className="form-row">
              <div className="form-group"><label>Название</label><input type="text" placeholder="60 UC" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} /></div>
              <div className="form-group"><label>Цена (₽)</label><input type="number" placeholder="99" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
              <div className="form-group"><label>Скидка %</label><input type="number" placeholder="0" value={newProduct.discount} onChange={(e) => setNewProduct({ ...newProduct, discount: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 3 }}><label>Описание</label><input type="text" placeholder="Описание товара" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
              <div className="form-group"><label>Фото</label><label className="upload-btn"><Upload size={16} /> {newProduct.image ? 'Готово' : 'Загрузить'}<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setNewProduct, newProduct)} hidden /></label></div>
              <button className="add-btn" onClick={addProduct}><Plus size={18} /> Добавить</button>
            </div>
          </div>
          <div className="admin-list">
            <h2>Доп. товары ({products.length})</h2>
            {products.map((p) => (
              <div key={p.id} className="admin-list-item">
                <div className="admin-list-img">{p.image ? <img src={p.image} alt="" /> : <span>Нет</span>}</div>
                <span className="admin-list-name">{p.name}</span>
                <input type="number" className="price-input" value={p.price} onChange={(e) => updateProductPrice(p.id, e.target.value)} />
                <span className="price-rub">₽</span>
                <button className="delete-btn-sm" onClick={() => removeProduct(p.id)}><Trash2 size={14} /></button>
              </div>
            ))}
            {products.length === 0 && <p className="empty-msg">Доп. товаров нет — показываются стандартные</p>}
          </div>
        </div>
      )}

      {/* Popular */}
      {activeTab === 'popular' && (
        <div className="admin-section">
          <div className="admin-form">
            <h2>Добавить в популярные</h2>
            <div className="form-row">
              <div className="form-group"><label>Название</label><input type="text" placeholder="60 UC" value={newPopular.name} onChange={(e) => setNewPopular({ ...newPopular, name: e.target.value })} /></div>
              <div className="form-group"><label>Игра</label><select value={newPopular.game} onChange={(e) => setNewPopular({ ...newPopular, game: e.target.value })}>{games.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}</select></div>
              <div className="form-group"><label>Цена</label><input type="number" placeholder="99" value={newPopular.price} onChange={(e) => setNewPopular({ ...newPopular, price: e.target.value })} /></div>
              <div className="form-group"><label>Старая цена</label><input type="number" placeholder="149" value={newPopular.oldPrice} onChange={(e) => setNewPopular({ ...newPopular, oldPrice: e.target.value })} /></div>
              <div className="form-group"><label>Фото</label><label className="upload-btn"><Upload size={16} /> {newPopular.image ? 'Готово' : 'Загрузить'}<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setNewPopular, newPopular)} hidden /></label></div>
              <button className="add-btn" onClick={addPopular}><Plus size={18} /> Добавить</button>
            </div>
          </div>
          <div className="admin-list">
            <h2>Доп. популярные ({popular.length})</h2>
            {popular.map((p) => (
              <div key={p.id} className="admin-list-item">
                <div className="admin-list-img">{p.image ? <img src={p.image} alt="" /> : <span>Нет</span>}</div>
                <span className="admin-list-name">{p.name}</span>
                <span className="admin-list-game">{p.game}</span>
                <span className="admin-list-price">{p.price} ₽</span>
                <button className="delete-btn-sm" onClick={() => removePopular(p.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discounts */}
      {activeTab === 'discounts' && (
        <div className="admin-section">
          <div className="admin-form">
            <h2>Добавить в скидки</h2>
            <div className="form-row">
              <div className="form-group"><label>Название</label><input type="text" placeholder="660 UC" value={newDiscount.name} onChange={(e) => setNewDiscount({ ...newDiscount, name: e.target.value })} /></div>
              <div className="form-group"><label>Игра</label><select value={newDiscount.game} onChange={(e) => setNewDiscount({ ...newDiscount, game: e.target.value })}>{games.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}</select></div>
              <div className="form-group"><label>Цена</label><input type="number" placeholder="599" value={newDiscount.price} onChange={(e) => setNewDiscount({ ...newDiscount, price: e.target.value })} /></div>
              <div className="form-group"><label>Старая цена</label><input type="number" placeholder="999" value={newDiscount.oldPrice} onChange={(e) => setNewDiscount({ ...newDiscount, oldPrice: e.target.value })} /></div>
              <div className="form-group"><label>Скидка %</label><input type="number" placeholder="40" value={newDiscount.discount} onChange={(e) => setNewDiscount({ ...newDiscount, discount: e.target.value })} /></div>
              <div className="form-group"><label>Фото</label><label className="upload-btn"><Upload size={16} /> {newDiscount.image ? 'Готово' : 'Загрузить'}<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setNewDiscount, newDiscount)} hidden /></label></div>
              <button className="add-btn" onClick={addDiscount}><Plus size={18} /> Добавить</button>
            </div>
          </div>
          <div className="admin-list">
            <h2>Доп. скидки ({discounts.length})</h2>
            {discounts.map((d) => (
              <div key={d.id} className="admin-list-item">
                <div className="admin-list-img">{d.image ? <img src={d.image} alt="" /> : <span>Нет</span>}</div>
                <span className="admin-list-name">{d.name}</span>
                <span className="admin-list-game">{d.game}</span>
                <span className="admin-list-price">{d.price} ₽</span>
                {d.discount && <span className="admin-list-discount">-{d.discount}%</span>}
                <button className="delete-btn-sm" onClick={() => removeDiscount(d.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News */}
      {activeTab === 'news' && (
        <div className="admin-section">
          <div className="admin-form">
            <h2>Добавить новость</h2>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}><label>Заголовок</label><input type="text" placeholder="Заголовок" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} /></div>
              <div className="form-group" style={{ flex: 3 }}><label>Текст</label><input type="text" placeholder="Текст новости" value={newNews.text} onChange={(e) => setNewNews({ ...newNews, text: e.target.value })} /></div>
              <button className="add-btn" onClick={addNews}><Plus size={18} /> Добавить</button>
            </div>
          </div>
          <div className="admin-list">
            <h2>Доп. новости ({news.length})</h2>
            {news.map((n) => (
              <div key={n.id} className="admin-list-item admin-news-item">
                <span className="admin-list-date">{n.date}</span>
                <span className="admin-list-name">{n.title}</span>
                <span className="admin-list-text">{n.text}</span>
                <button className="delete-btn-sm" onClick={() => removeNews(n.id)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
