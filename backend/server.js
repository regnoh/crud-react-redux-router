import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';
// Express 简介:http://www.runoob.com/nodejs/nodejs-express-framework.html
// Express 是一个简洁而灵活的 node.js Web应用框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。
// Express 框架核心特性：
// 可以设置中间件来响应 HTTP 请求。
// 定义了路由表用于执行不同的 HTTP 请求动作。
// 可以通过向模板传递参数来动态渲染 HTML 页面。
// body-parser:需要与 express 框架一起安装的： node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。

//express()用来创建一个Express的程序
const app = express();
app.use(bodyParser.json());
const dbUrl = "mongodb://localhost";
//后端非空验证
const validate = (data) => {
  let errors = {};
  if (data.title === '') errors.title = "Can't be empty";
  if (data.cover === '') errors.cover = "Can't be empty";

  const isValid = Object.keys(errors).length === 0

  return { errors, isValid };
}
//从actions/index 的 fetch()跳转到此
//要在 MongoDB 中创建一个数据库，首先我们需要创建一个 MongoClient 对象，然后配置好指定的 URL 和 端口号。
mongodb.MongoClient.connect(dbUrl, (err, client) => {
  if (err) throw err;
  //db()如果数据库crud不存在，MongoDB 将创建数据库并建立连接。
  const db = client.db('crud');
//7.3、【地址匹配】,处理客户端get请求，返回games,用于显示gameslist
  app.get('/api/games', (req, res) => {
    db.collection('games').find({}).toArray((err, games) => {
      res.json({ games });
    });
  });

  app.get('/api/games/:_id', (req, res) => {
    db.collection('games').findOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, game) => {//game是查找到的数据内容
      res.json({ game });
    });
  })

  app.delete('/api/games/:_id', (req, res) => {
    db.collection('games').deleteOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, game) => {
      if (err) { res.status(500).json({ errors: { global: err } }); return; }
      //返回空
      res.json({});
    });
  })

  app.put('/api/games/:_id', (req, res) => {
    const { errors, isValid } = validate(req.body);
    if (isValid) {
      const { title, cover } = req.body;
      db.collection('games').findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.params._id) },
        { $set: { title, cover } },
        { returnOriginal: false },
        (err, result) => {
          if (err) { res.status(500).json({ errors: { global: err } }); return; }
          res.json({ game: result.value });
        }
      )
    } else {
      res.status(400).json({ errors });
    }
  })
//7.1、【地址匹配】,处理客户端post请求，返回添加的一个game到ctions/index
    //从actions/index 的 saveGame= (data){fetch('/api/games',)}跳转到此，data:前端games对象
    //路由决定了由谁(指定脚本)去响应客户端请求。这里是/api/games页面去响应
  app.post('/api/games', (req, res) => {
    const { errors, isValid } = validate(req.body);

    if (isValid) {
      const { title, cover } = req.body;
      db.collection('games').insert({ title, cover }, (err, result) => {
        if (err) {
          res.status(500).json({ errors: { global: "Something went wrong" } });
        } else {
          res.json({ game: result.ops[0] });
        }
      });
    } else {
      res.status(400).json({ errors });
    }
  });

  app.use((req, res) => {
    res.status(404).json({
      errors: {
        global: "Still working on it. Please try again later than when we implement it"
      }
    })
  })

  app.listen(8080, () => console.log('Server is running on localhost:8080'));
});
