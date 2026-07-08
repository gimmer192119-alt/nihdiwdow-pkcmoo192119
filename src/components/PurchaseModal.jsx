import { useState } from 'react';
import { X, Loader, CheckCircle, AlertCircle, User } from 'lucide-react';
import sbpLogo from '../assets/logosbp.webp';
import cryptoLogo from '../assets/crypta.webp';
import { useCurrency } from '../context/CurrencyContext';
import { checkPlayerUid, createOrder } from '../api/nsgifts';
import './PurchaseModal.css';

const HELEKET_MERCHANT = '';
const HELEKET_API_KEY = '';

async function createHeleketPayment(amount, currency, orderId) {
  const body = JSON.stringify({
    amount: String(amount), currency, order_id: orderId,
    url_success: window.location.origin, url_return: window.location.origin, lifetime: 3600,
  });
  try {
    const res = await fetch('https://api.heleket.com/v1/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'merchant': HELEKET_MERCHANT, 'sign': btoa(body) },
      body,
    });
    const data = await res.json();
    return data.state === 0 && data.result?.url ? data.result.url : null;
  } catch { return null; }
}

const NEEDS_UID = ['pubg-mobile'];

const PurchaseModal = ({ product, gameName, gameId, onClose }) => {
  const [step, setStep] = useState('choose');
  const [method, setMethod] = useState(null);
  const [uid, setUid] = useState('');
  const [uidStatus, setUidStatus] = useState(null);
  const [uidNickname, setUidNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const { formatPrice } = useCurrency();

  if (!product) return null;

  const needsUid = NEEDS_UID.includes(gameId);

  const handleCheckUid = async () => {
    if (!uid || uid.length < 5) return;
    setUidStatus('checking');
    const result = await checkPlayerUid(uid);
    setUidStatus(result.valid ? 'valid' : 'invalid');
    setUidNickname(result.valid ? result.nickname : result.error);
  };

  const handlePay = async () => {
    if (needsUid && uidStatus !== 'valid') return;
    setStep('processing');
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    if (method === 'crypto' && HELEKET_MERCHANT) {
      const url = await createHeleketPayment(product.price, 'RUB', orderId);
      if (url) { window.open(url, '_blank'); setStep('redirect'); }
      else { alert('Ошибка'); setStep('choose'); }
    } else {
      const result = await createOrder(product.id, uid || null, method, orderId);
      if (result.success) setStep('success');
      else { alert(result.error || 'Ошибка'); setStep('choose'); }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className="modal-header">
          <h2>Покупка</h2>
          <div className="modal-product">
            <span className="modal-product-name">{product.name}</span>
            <span className="modal-product-game">{gameName}</span>
            {product.description && <span className="modal-product-desc">{product.description}</span>}
            <span className="modal-product-price">{formatPrice(product.price)}</span>
          </div>
        </div>

        {step === 'choose' && (
          <div className="payment-flow">
            {needsUid && (
              <div className="uid-section">
                <h3><User size={16} /> ID игрока (UID)</h3>
                <div className="uid-input-row">
                  <input
                    type="text"
                    placeholder="UID (5-15 цифр)"
                    value={uid}
                    onChange={(e) => { setUid(e.target.value.replace(/\D/g, '').slice(0, 15)); setUidStatus(null); }}
                    maxLength={15}
                  />
                  <button className="uid-check-btn" onClick={handleCheckUid} disabled={!uid || uid.length < 5 || uidStatus === 'checking'}>
                    {uidStatus === 'checking' ? <Loader size={14} className="spin" /> : 'Проверить'}
                  </button>
                </div>
                {uidStatus === 'valid' && (
                  <div className="uid-status uid-valid"><CheckCircle size={14} /> {uidNickname}</div>
                )}
                {uidStatus === 'invalid' && (
                  <div className="uid-status uid-invalid"><AlertCircle size={14} /> {uidNickname}</div>
                )}
              </div>
            )}

            <h3>Способ оплаты</h3>
            <button className="payment-option" onClick={() => setMethod('sbp')}>
              <img src={sbpLogo} alt="СБП" className="payment-logo" />
              <div className="payment-option-info">
                <span className="payment-option-title">СБП</span>
                <span className="payment-option-desc">Мгновенный перевод</span>
              </div>
            </button>
            <button className="payment-option" onClick={() => setMethod('crypto')}>
              <img src={cryptoLogo} alt="Крипта" className="payment-logo" />
              <div className="payment-option-info">
                <span className="payment-option-title">Криптовалюта</span>
                <span className="payment-option-desc">USDT, BTC, ETH, LTC</span>
              </div>
            </button>

            {method && (
              <button
                className="modal-pay-btn full-width"
                onClick={handlePay}
                disabled={needsUid && uidStatus !== 'valid'}
              >
                Оплатить {formatPrice(product.price)}
              </button>
            )}
          </div>
        )}

        {step === 'processing' && (
          <div className="payment-status">
            <Loader size={40} className="spin" color="#FF1493" />
            <p>Создаём платёж...</p>
          </div>
        )}

        {step === 'redirect' && (
          <div className="payment-status">
            <p>Откройте новую вкладку для оплаты</p>
            <button className="modal-back-btn" style={{ width: '100%' }} onClick={onClose}>Закрыть</button>
          </div>
        )}

        {step === 'success' && (
          <div className="payment-status">
            <CheckCircle size={48} color="#22c55e" />
            <p style={{ color: '#22c55e', fontWeight: 600 }}>Заказ создан!</p>
            <p style={{ fontSize: '0.85rem' }}>{needsUid ? `Товар зачислится на UID: ${uid}` : 'Ожидайте подтверждения'}</p>
            <button className="modal-back-btn" style={{ width: '100%' }} onClick={onClose}>Закрыть</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseModal;
