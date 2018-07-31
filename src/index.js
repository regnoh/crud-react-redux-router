import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import GamesPage from './components/GamesPage';
import GameFormPage from './components/GameFormPage';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(logger, thunk)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className="ui container">
        {/* 文档：http://www.semantic-ui.cn/collections/menu.html */}
        <div className="ui three item menu">
          {/* 文档：https://reacttraining.com/react-router/web/api/NavLink/ */}
          {/* exact: bool When true, the active class/style will only be applied if the location is matched exactly. */}
          <NavLink exact activeClassName="active" className="item" to="/">Home</NavLink>
          <NavLink exact activeClassName="active" className="item" to="/games">Games</NavLink>
          <NavLink activeClassName="active" className="item" to="/games/new">Add New Game</NavLink>
        </div>
        {/* 首页 */}
        <Route exact path="/" component={App} />
        {/* 所有记录 */}
        <Route exact path="/games" component={GamesPage} />
        {/* 新建记录 */}
        <Route path="/games/new" component={GameFormPage} />
        {/* 更改记录 */}
        <Route path="/game/:_id" component={GameFormPage} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
