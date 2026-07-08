// NS.GIFTS API integration
const NSGIFTS_API_URL = 'https://api.ns.gifts';
const NSGIFTS_API_KEY = ''; // Вставь свой API ключ из ns.gifts

// Проверка UID — в демо режиме принимаем реальные UID PUBG
export async function checkPlayerUid(uid) {
  if (!NSGIFTS_API_KEY) {
    // Демо режим: валидный UID = 5-15 цифр
    if (/^\d{5,15}$/.test(uid)) {
      // Генерируем реалистичный никнейм на основе UID
      const demoNames = ['Shadow_Pro', 'SniperKing', 'ProGamer', 'BattleHero', 'SnipeGod', 'TacticX', 'VictoryOne'];
      const name = demoNames[parseInt(uid.slice(-2)) % demoNames.length];
      return { valid: true, nickname: name };
    }
    return { valid: false, error: 'UID должен содержать от 5 до 15 цифр' };
  }

  // Реальный запрос к NS.GIFTS API
  try {
    const response = await fetch(`${NSGIFTS_API_URL}/v1/player/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NSGIFTS_API_KEY}`,
      },
      body: JSON.stringify({ game: 'pubg_mobile', uid: uid }),
    });
    const data = await response.json();
    if (data.state === 0 && data.result) {
      return { valid: true, nickname: data.result.nickname || 'Игрок найден' };
    }
    return { valid: false, error: data.message || 'Игрок не найден' };
  } catch {
    return { valid: false, error: 'Сервис временно недоступен' };
  }
}

// Создание заказа с UID
export async function createOrder(productId, uid, paymentMethod, orderId) {
  if (!NSGIFTS_API_KEY) {
    return {
      success: true,
      order_id: orderId || `demo_${Date.now()}`,
      uid: uid,
      message: 'Демо: заказ создан',
    };
  }

  try {
    const response = await fetch(`${NSGIFTS_API_URL}/v1/order/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NSGIFTS_API_KEY}`,
      },
      body: JSON.stringify({
        product_id: productId,
        player_uid: uid,
        payment_method: paymentMethod,
        order_id: orderId,
      }),
    });
    const data = await response.json();
    if (data.state === 0 && data.result) {
      return { success: true, ...data.result };
    }
    return { success: false, error: data.message || 'Ошибка создания заказа' };
  } catch {
    return { success: false, error: 'Сервис временно недоступен' };
  }
}

export async function checkOrderStatus(orderId) {
  if (!NSGIFTS_API_KEY) return { status: 'demo' };
  try {
    const res = await fetch(`${NSGIFTS_API_URL}/v1/order/${orderId}`, {
      headers: { 'Authorization': `Bearer ${NSGIFTS_API_KEY}` },
    });
    const data = await res.json();
    return data.result || data;
  } catch { return { status: 'error' }; }
}
