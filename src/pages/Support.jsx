const Support = () => {
  return (
    <div className="support-content">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--white)', textShadow: '0 0 10px rgba(227, 11, 93, 0.5)' }}>
        Техническая поддержка
      </h2>
      
      <div className="faq-item">
        <h3>Как сделать заказ?</h3>
        <p>Выберите игру в магазине, выберите нужный товар и следуйте инструкциям на экране.</p>
      </div>

      <div className="faq-item">
        <h3>Как долго длится зачисление?</h3>
        <p>Зачисление происходит автоматически в течение 5-15 минут после оплаты.</p>
      </div>

      <div className="faq-item">
        <h3>Как связаться с поддержкой?</h3>
        <p>Напишите нам на почту: support@dergame.ru или в Telegram: @dergame_support</p>
      </div>
    </div>
  );
};

export default Support;
