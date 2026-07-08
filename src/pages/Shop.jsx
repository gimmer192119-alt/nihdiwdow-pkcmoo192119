import { Link } from 'react-router-dom';
import { games } from '../data/games';
import '../button.css';

const reorderedGames = [
  games.find(g => g.id === 'pubg-mobile'),
  games.find(g => g.id === 'brawl-stars'),
  games.find(g => g.id === 'standoff-2'),
  games.find(g => g.id === 'roblox')
].filter(Boolean);

const Shop = ({ searchValue = '' }) => {
  const filtered = reorderedGames.filter((game) =>
    game.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#fff', textShadow: '0 0 10px rgba(227,11,93,0.4)' }}>
        Выберите игру
      </h2>
      <div className="shop-grid">
        {filtered.map((game) => (
          <div key={game.id} className="game-card">
            <Link to={`/game/${game.id}`}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img
                  src={game.image}
                  alt={game.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </Link>
            <div className="game-info">
              <h3 className="game-title">{game.name}</h3>
              <p className="game-desc">{game.description}</p>
              <Link to={`/game/${game.id}`} className="button game-card-btn">
                <p>Перейти</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '3rem' }}>
          Игры не найдены
        </p>
      )}
    </div>
  );
};

export default Shop;
