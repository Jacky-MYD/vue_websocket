const path = require('path')
const Koa = require('koa2')
const bodyparser = require('koa-bodyparser')
var cors = require('koa2-cors');
const static = require('koa-static')
const views = require('koa-views')
const config = require('../config')
const router = require('./routers/index')

const jwt = require("./middleware/jwt");
const verify = require("./middleware/verify");
const errorHandler = require("./middleware/error");

// 创建koa实例
const app = new Koa()
const server = require("http").createServer(app.callback());
const io = require('socket.io')(server);
const addSocket = require("./socket");

// 配置跨域
// app.use(cors())
app.use(
    cors({
        origin: "http://localhost:" + config.clientPort, // * 仍然不能访问header,要写明具体域名才行
        credentials: true, //将凭证暴露出来, 前端才能获取cookie
        allowMethods: ["GET", "POST", "DELETE"],
        exposeHeaders: ["Authorization"], // 将header字段expose出去，前端才能获取该header字段
        allowHeaders: ["Content-Type", "Authorization", "Accept"] // 允许添加到header的字段
    })
);

//json-web-token
app.use(
  jwt({
    secret: config.secret,
    exp: config.exp
  })
);

// exclude login verify url
app.use(
  verify({
    exclude: ["/api/login", "/api/register", "/api/search"]
  })
);

app.use(errorHandler()); // handle the error

// 配置数据解析中间件
app.use(bodyparser())

// 配置静态资源加载中间件
app.use(static(path.join(__dirname, '../public')))

// 配置路由中间件
app.use(router.routes()).use(router.allowedMethods())

addSocket(io);
server.listen(config.socketPort);

app.listen(config.port, () => {
    console.log("\033[32m Listening at http://localhost:8082 \033[0m")
})

