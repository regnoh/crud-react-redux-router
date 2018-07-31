import React from 'react';
import PropTypes from 'prop-types';
import GameCard from './GameCard';
// games列表
//父组件GamesPage中 <GamesList games={ this.props.games } deleteGame={ this.props.deleteGame } />，games是从数据库中fetch({})查询所有
const GamesList = ({ games, deleteGame }) => {
  const emptyMessage = (
    <p>There are no games yet in your collection.</p>
  );
//  games存在，遍历返回每个gamecard列表项
  const gamesList = (
    <div className="ui four cards">
      {/* game列表项，传递deleteGame，game变量 */}
      {games.map(game => <GameCard deleteGame={deleteGame} game={game} key={game._id} />)}
    </div>
  );

  return (
    <div>
      {games.length === 0 ? emptyMessage : gamesList}
    </div>
  )
}

GamesList.propTypes = {
  games: PropTypes.array.isRequired,
  deleteGame: PropTypes.func.isRequired
}

export default GamesList;
