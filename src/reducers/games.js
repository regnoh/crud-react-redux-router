import { SET_GAMES, ADD_GAME, GAME_FETCHED, GAME_UPDATED, GAME_DELETED } from '../constants';

const games = (state = [], action = {}) => {
  switch(action.type) {
    case SET_GAMES:
      return action.games;
    case GAME_DELETED:
    //遍历state：item
      return state.filter(item => item._id !== action.gameId)
    case ADD_GAME:
      return [
        ...state,
        action.game
      ]
    case GAME_UPDATED:
      return state.map(item => {
        if (item._id === action.game._id) return action.game;
        return item;
      })
      // 查找某条记录
      // action.game._id是从actions.index传过来的，源自于服务器数据，新的
      // state:本地state,数据可能是老的
    case GAME_FETCHED:
      const index = state.findIndex(item => item._id === action.game._id)
      //【更新记录】在本地state中找到了服务器的相同id数据
      if (index > -1) {
        return state.map(item => {
          //返回服务器的那条数据，因为服务器的数据和本地可能冲突，信任服务器的
          if (item._id === action.game._id) return action.game;
          //其他数据不变
          return item;
        })
        //【创建记录】在本地state中没有找到与服务器的相同id数据
      } else {
        return [
          ...state,
          action.game
        ]
      }
    default: return state;
  }
}

export default games;
