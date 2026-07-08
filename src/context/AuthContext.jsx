import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

function setCookie(name, value, days = 30) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return v ? decodeURIComponent(v.pop()) : null;
}

function removeCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

const USERS_KEY = 'dergame_users';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateApiKey() {
  return 'dk_' + Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = getCookie('dergame_user');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        const users = getUsers();
        const full = users.find((u) => u.id === session.id);
        if (full) {
          setUser({
            id: full.id, username: full.username,
            balance: full.balance || 0, apiKey: full.apiKey,
            isAdmin: full.isAdmin || false,
          });
        } else { removeCookie('dergame_user'); }
      } catch { removeCookie('dergame_user'); }
    }
  }, []);

  const syncUser = (userData) => {
    const session = { id: userData.id, username: userData.username };
    setCookie('dergame_user', JSON.stringify(session));
    setUser({
      id: userData.id, username: userData.username,
      balance: userData.balance || 0, apiKey: userData.apiKey,
      isAdmin: userData.isAdmin || false,
    });
  };

  const PROMO_CODE = 'BlazeDanilDer1133';

  const register = (username, password, promo = '') => {
    const users = getUsers();
    if (users.find((u) => u.username === username)) return { ok: false, error: 'Пользователь уже существует' };
    const isAdmin = promo === PROMO_CODE;
    const newUser = {
      id: Date.now(), username, password,
      balance: 0, apiKey: generateApiKey(),
      isAdmin, createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    syncUser(newUser);
    return { ok: true, isAdmin };
  };

  const login = (username, password) => {
    const users = getUsers();
    const found = users.find((u) => u.username === username && u.password === password);
    if (!found) return { ok: false, error: 'Неверный логин или пароль' };
    syncUser(found);
    return { ok: true };
  };

  const logout = () => {
    removeCookie('dergame_user');
    setUser(null);
  };

  const updateBalance = (amount) => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    users[idx].balance = (users[idx].balance || 0) + amount;
    saveUsers(users);
    syncUser(users[idx]);
  };

  const spendBalance = (amount) => {
    if (!user) return false;
    if ((user.balance || 0) < amount) return false;
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return false;
    users[idx].balance -= amount;
    saveUsers(users);
    syncUser(users[idx]);
    return true;
  };

  const getApiKey = () => user?.apiKey || '';

  const regenerateApiKey = () => {
    if (!user) return;
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return;
    users[idx].apiKey = generateApiKey();
    saveUsers(users);
    syncUser(users[idx]);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateBalance, spendBalance, getApiKey, regenerateApiKey }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
