import { SET_GAMES, ADD_GAME, GAME_FETCHED, GAME_UPDATED, GAME_DELETED } from '../constants';

export const setGames = (games) => {
  return {
    type: SET_GAMES,
    games
  }
};

/*  被components/GamesPage.js以下语句调用
    componentDidMount(){
        this.props.fetchGames();
} */
//所有记录
export const fetchGames = () => {
  return dispatch => {
    //到server.js,默认get
    fetch('/api/games')
      //取出server.js中的res.json({ games})，即表中所有记录
      .then(res => res.json())
      /* reducers/games.js
          case SET_GAMES:
              return action.games;
      */
      .then(data => dispatch(setGames(data.games)))
  }
};
export const gameFetched = (game) => {
  return {
    type: GAME_FETCHED,
    game
  }
};
//根据id查找【单条记录】
export const fetchGame = (id) => {
  return dispatch => {
    fetch(`/api/games/${id}`)
      .then(res => res.json())
      .then(data => dispatch(gameFetched(data.game)))
  }
};

const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    let error = new Error(response.statusText);
    error.response = response
    throw error;
  }
}

export const addGame = (game) => {
  return {
    type: ADD_GAME,
    game
  }
};

export const saveGame = (data) => {
  return dispatch => {
    return fetch('/api/games', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
      .then(data => dispatch(addGame(data.game)));
  }
};

export const gameUpdated = (game) => {
  return {
    type: GAME_UPDATED,
    game
  }
};
//用put
export const updateGame = (data) => {
  return dispatch => {
    return fetch(`/api/games/${data._id}`, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
      .then(data => dispatch(gameUpdated(data.game)));
  }
};

export const gameDeleted = (gameId) => {
  return {
    type: GAME_DELETED,
    gameId
  }
};

export const deleteGame = (id) => {
  return dispatch => {
    return fetch(`/api/games/${id}`, {
      //到server.js中的delete方法
      method: 'delete',
      headers: {
        "Content-Type": "application/json"
      }
    }).then(handleResponse)
      .then(data => dispatch(gameDeleted(id)));
  }
};
