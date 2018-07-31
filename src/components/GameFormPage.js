import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saveGame, fetchGame, updateGame } from '../actions';
import { Redirect } from 'react-router-dom';
import GameForm from './GameForm';
//本组件是GameForm的容器组件，外壳，被saveGame、updateGame共用
class GameFormPage extends Component {
  state = {
    //是否需要重定向,因为saveGame、updateGame成功后都需要重定向到./games，即GamesPage
    redirect: false
  }
  //【更新】组件挂载后：点击更新，跳到本页面时要在input框显示原值（根据_id到数据库找）
  componentDidMount() {
    // Router自带:this.props.match.params._id路由中存在id
    const { match } = this.props;
    if (match.params._id) {
      // 则显示这是一个更新表单，根据id填充：input中有原有值
      this.props.fetchGame(match.params._id);
    }
  }

  saveGame = ({ _id, title, cover }) => {
    if (_id) {
      return this.props.updateGame({ _id, title, cover }).then(
        () => { this.setState({ redirect: true }) }
      )
    } else {
      return this.props.saveGame({ title, cover }).then(
        () => { this.setState({ redirect: true }) }
      )
    }
  }

  render() {
    return (
      <div>
        {
          this.state.redirect ?
            <Redirect to="/games" /> :
            <GameForm
              saveGame={this.saveGame}
              game={this.props.game}
            />
        }
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { match } = props;
  //【更新】路由中有id，返回game，即调用props.game有值,否则null
  if (match.params._id) {
    return {
      game: state.games.find(item => item._id === match.params._id)
    };
  }

  return { game: null };
};

export default connect(mapStateToProps, { saveGame, fetchGame, updateGame })(GameFormPage);
