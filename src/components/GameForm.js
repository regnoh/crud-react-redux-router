import React, { Component } from 'react';
import classnames from 'classnames';

class GameForm extends Component {
  state = {
    //看gameFormPage的mapStateToProps,
    /* 和<GameForm
        saveGame={this.saveGame}
        game={this.props.game}
      /> */
    _id: this.props.game ? this.props.game._id : null,
    title: this.props.game ? this.props.game.title : '',
    cover: this.props.game ? this.props.game.cover : '',
    errors: {},
    loading: false
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      _id: nextProps.game._id,
      title: nextProps.game.title,
      cover: nextProps.game.cover
    })
  }
  // 4、当name=title的input框内容改变时(同理cover)
  handleChange = (e) => {
    //（因之前点击提交时该input为空，添加了errors[title]），所以当改变时，获取errors[title]值,转为布尔值true
    if (!!this.state.errors[e.target.name]) {
      //复制this.state.errors对象的内容到errors，以免修改原对象
      let errors = Object.assign({}, this.state.errors);
      //任务1、重新点击input框后,删除errors[title]，错误提示消失
      delete errors[e.target.name];
      //任务2、setState({title:input框中内容，errors:null})，
      this.setState({
        [e.target.name]: e.target.value,
        errors
      });
    }
    //之前提交时该input不为空，用于handleSubmit()时 通过this.state.title获取input填入
    else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  }
  //5、点击save按钮提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    //任务1、前端非空验证，若为空，setState({errors}),添加错误提示,然后在<span>{this.state.errors.title}显示
    //新建errors初始为空，是state.errors的副本
    let errors = {};
    //handleChange()时input空，这里提交时为errors创建属性title / cover,否则errors仍={}
    if (this.state.title === '') errors.title = "Can't be empty";
    if (this.state.cover === '') errors.cover = "Can't be empty";
    this.setState({ errors });
    //keys(errors)返回errors的所有属性，===0说明errors为{}，没有errors.title/cover属性,isValid为true
    const isValid = Object.keys(errors).length === 0
    //任务2、input框都非空时
    if (isValid) {
      //相当于const title = this.state.title; const cover = this.state.cover;
      const { _id, title, cover } = this.state;
      //用于<form className="{loading:this.state.loading}">中判断可显示加载的圈圈
      this.setState({ loading: true });
      //才能调用actions中的saveGame提交数据库，saveGame需要import,connect(null,{saveGame})
      this.props.saveGame({ _id, title, cover })
        .catch((err) => err.response.json().then(({ errors }) => { this.setState({ errors, loading: false }) }))
    }
  }

  render() {
    const form = (
      // classnames需要import
      // {loding:this.state.loading}表示:号后为true时，loading可用，className="ui loading"
      // loading是显示加载圈圈的样式，初始false
      <form className={classnames('ui', 'form', { loading: this.state.loading })} onSubmit={this.handleSubmit}>
        <h1>Add new game</h1>
        {/* 显示后端验证结果server.js，比较可靠，看server.js */}
        {!!this.state.errors.global && <div className="ui negative message">{this.state.errors.global}</div>}
        {/* !!将值转为布尔值 ,error样式使得input变红*/}
        <div className={classnames('field', { error: !!this.state.errors.title })}>
          {/* htmlFor="input name" */}
          <label htmlFor="title">Title</label>
          <input
            type="text"
            //用于 htmlFor="title"和event.target.name
            name="title"
            // 给value设置初始值{{this.state.title}，初始为空
            //用于event.target.value
            value={this.state.title}
            onChange={this.handleChange}
          />
          {/* 显示不能为空的提示 */}
          <span>{this.state.errors.title}</span>
        </div>

        <div className={classnames('field', { error: !!this.state.errors.cover })}>
          <label htmlFor="title">Cover Url</label>
          <input
            type="text"
            name="cover"
            value={this.state.cover}
            onChange={this.handleChange}
          />
          <span>{this.state.errors.cover}</span>
        </div>

        <div className="field">
        {/* 根据input输入的图片url，显示图片 */}
          {this.state.cover !== '' && <img src={this.state.cover} alt="cover" className="ui small bordered image" />}
        </div>

        <div className="field">
          <button className="ui primary button">Save</button>
        </div>
      </form>
    )
    return (
      <div>
        {form}
      </div>
    );
  }
}

export default GameForm;
