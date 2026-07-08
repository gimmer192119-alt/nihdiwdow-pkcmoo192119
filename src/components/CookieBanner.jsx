import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import './CookieBanner.css';

const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('dergame_cookies_accepted');
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('dergame_cookies_accepted', 'true');
    // Set tracking cookies
    const d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = `dergame_visit=1;expires=${d.toUTCString()};path=/;SameSite=Lax`;
    document.cookie = `dergame_session=${Date.now()};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <Cookie size={20} color="#FF1493" />
        <p>Этот сайт использует файлы cookie для улучшения работы и аналитики.</p>
        <button className="cookie-btn" onClick={accept}>Хорошо</button>
      </div>
    </div>
  );
};

export default CookieBanner;
