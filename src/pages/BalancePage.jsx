import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, Loader, CheckCircle } from 'lucide-react';
import sbpLogo from '../assets/logosbp.webp';
import cryptoLogo from '../assets/crypta.webp';
import './Balance.css';

const BalancePage = () => {
  const { user, updateBalance } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState('input');
  const [loading, setLoading] = useState(false);

  if (!user) { navigate('/auth'); return null; }

  const handlePay = () => {
    const sum = parseInt(amount);
    if (!sum || sum < 10) return;
    setStep('processing');
    setLoading(true);

    // Демо — зачисляем баланс сразу
    setTimeout(() => {
      updateBalance(sum);
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  return (
    <div className="balance-page">
      <div className="balance-card">
        <div className="balance-header">
          <Wallet size={32} color="#FF1493" />
          <h2>Баланс</h2>
        </div>
        <div className="balance-current">
          <span className="balance-current-label">Текущий баланс</span>
          <span className="balance-current-value">{user.balance || 0} ₽</span>
        </div>

        {step === 'input' && (
          <div className="balance-form">
            <div className="balance-field">
              <label>Сумма пополнения</label>
              <input type="number" min="10" placeholder="Минимум 10 ₽" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <h3>Способ оплаты</h3>
            <div className="balance-methods">
              <button className={`balance-method ${method === 'sbp' ? 'balance-method-active' : ''}`} onClick={() => setMethod('sbp')}>
                <img src={sbpLogo} alt="СБП" />
                <span>СБП</span>
              </button>
              <button className={`balance-method ${method === 'crypto' ? 'balance-method-active' : ''}`} onClick={() => setMethod('crypto')}>
                <img src={cryptoLogo} alt="Крипта" />
                <span>Криптовалюта</span>
              </button>
            </div>

            {method && amount >= 10 && (
              <button className="balance-pay-btn" onClick={handlePay}>
                Пополнить на {amount} ₽
              </button>
            )}
          </div>
        )}

        {step === 'processing' && (
          <div className="balance-status">
            <Loader size={40} className="spin" color="#FF1493" />
            <p>Обработка оплаты...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="balance-status">
            <CheckCircle size={48} color="#22c55e" />
            <p style={{ color: '#22c55e', fontWeight: 600 }}>Баланс пополнен!</p>
            <p>Новый баланс: {user.balance} ₽</p>
            <button className="balance-back-btn" onClick={() => navigate('/auth')}>В профиль</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalancePage;
