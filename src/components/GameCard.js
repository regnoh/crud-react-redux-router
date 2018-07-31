import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
//game项
//爷组件GamesPage中 <GamesList games={ this.props.games } deleteGame={ this.props.deleteGame } />，games是从数据库中fetch({})查询所有
//父组件GamesList中 <GameCard deleteGame={deleteGame} game={game} key={game._id} />
const GameCard = ({ game, deleteGame }) => {
  return (
    <div className="ui card">
      <div className="image">
        <img src={ game.cover } alt="Game Cover" />
      </div>
      <div className="content">
        <div className="header">{ game.title }</div>
      </div>
      <div className="extra content">
        <div className="ui two buttons">
        {/*  编辑：重定向到GameForm.js,在index.js中定义路由*/}
        {/* 含${game._id}，要用1左边的符号，不是单引号 */} */}
          <Link to={ `/game/${game._id}` } className="ui basic button green">Edit</Link>
          {/* 删除：到actons/index.js 的deleteGame*/}
          <div className="ui basic button red" onClick={ () => deleteGame(game._id) }>Delete</div>
        </div>
      </div>
    </div>
  )
}

GameCard.propTypes = {
  game: PropTypes.object.isRequired,
  deleteGame: PropTypes.func.isRequired
}

export default GameCard
