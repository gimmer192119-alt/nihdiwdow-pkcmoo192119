import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Support from './pages/Support';
import Faq from './pages/Faq';
import News from './pages/News';
import GamePage from './pages/GamePage';
import Admin from './pages/Admin';
import AuthPage from './pages/AuthPage';
import ApiPage from './pages/ApiPage';
import BalancePage from './pages/BalancePage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <div className="container">
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
          </div>

          <div className="app">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/game/:id" element={<GamePage />} />
                <Route path="/news" element={<News />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/support" element={<Support />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/balance" element={<BalancePage />} />
                <Route path="/api-docs" element={<ApiPage />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <CookieBanner />
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
