import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GamesList from './GamesList';
import { fetchGames, deleteGame } from '../actions';

class GamesPage extends Component {
  //挂载后显示所有games
  componentDidMount() {
    //到actions/index.js中的fetchGames
    this.props.fetchGames();
  }

  render() {
    return (
      <div>
        <GamesList games={ this.props.games } deleteGame={ this.props.deleteGame } />
      </div>
    );
  }
}

GamesPage.propTypes = {
  games: PropTypes.array.isRequired,
  fetchGames: PropTypes.func.isRequired,
  deleteGame: PropTypes.func.isRequired
}
//需要取到reducers/games.js中fetchGames()返回的state(games)，本页用this.props.games引用
const mapStateToProps = (state) => {
  return {
    games: state.games
  };
};

export default connect(mapStateToProps, { fetchGames, deleteGame })(GamesPage);
