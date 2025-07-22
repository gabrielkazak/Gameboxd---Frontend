import React, { useState } from 'react'
import './GamesGrid.css'
import GameCard from '../GameCard/GameCard';
import AddList from '../AddList/AddList';

const GamesGrid = ({
  games,
  loading,
  error,
  token,
  userId,
  myGames,
  wishGames,
  listGames
}) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAddList, setShowAddList] = useState(false);

  return (
  <div className="games-grid-container d-flex flex-wrap gap-3 justify-content-center">
    {loading && <p>Carregando...</p>}
    {error && <p>Erro ao carregar jogos.</p>}

    {!loading && !error && games.map((game) => {
      const matchedGame = myGames?.find((g) => g.gameId === game.id);

      return (
        <GameCard
          key={game.id}
          id={game.id}
          imageUrl={game.background_image}
          gameName={game.name}
          platforms={game.platforms}
          screenshoots={game.short_screenshots}
          genre={game.genres?.[0]?.name || ''}
          date = {game.released}
          comment={matchedGame?.comment || ''}
          rating={matchedGame?.rating || ''}
          wishGames={wishGames}
          listGames={listGames}
          onHoverStart={() => setIsOverlayVisible(true)}
          onHoverEnd={() => setIsOverlayVisible(false)}
          onAddListClick={() => {
            setSelectedGame(game);
            setShowAddList(true);
          }}
        />
      );
    })}

    {showAddList && selectedGame && (
      <AddList
        gameId={selectedGame.id}
        name={selectedGame.name}
        userId={userId}
        token={token}
        onClose={() => setShowAddList(false)}
      />
    )}

    <div className={`screen-overlay ${(isOverlayVisible || showAddList) ? 'visible' : ''}`}></div>
  </div>
);

};

export default GamesGrid;
