本例子是通过搭建koa服务端和vue3.0客户端实现的，下面简单的描述实现长链接websocket的关键点

## 服务端
   配置好服务端后，我们继续安装**socket.io**依赖包
   ```
      npm install socket.io --save
   ```
   依赖包下载完后，我做相关的配置
   ```app.js
      // 创建koa实例
      const app = new Koa()
      const server = require("http").createServer(app.callback());
      const io = require('socket.io')(server);
      const addSocket = require("./socket");
      ...
      addSocket(io);
      server.listen(config.socketPort);
   ```
   新建socket/index.js文件,由于本例子有配置mysql和其他的东西，具体详情可以去看源码，包括API等等。
   这里主要是通过用户给对方发送消息时监听**send**和**reply**，当**send**接收到值时，返回给客户端的时候给自己和对方发送同一条更新的信息，然后在客户端接收数据，更新dom。
   ```
      module.exports = io => {
          // middleware
          io.use(auth);
          //namespace (/)
          io.on('connection', socket => {
              socket.emit('open', {
                  code: 0,
                  handshake: socket.handshake,
                  namespace: '/',
                  message: 'welcome to main channel, please sign'
              });

              socket.on('sign', ({ user, rooms }, fn) => {
                  if (!user.id) {
                      return fn({ code: 2, message: 'id not exist' });
                  }
                  MAP[user.id] = socket.id;
                  user.socketId = socket.id;
                  LIST.push(user);
                  addRooms(rooms);

                  socket.join(rooms);//加入自己所在的组
                  socket.emit('userin', MAP, user);
                  socket.broadcast.emit('userin', MAP, user);

                  fn({
                      code: 0,
                      message: 'sign success',
                      data: MAP
                  });
              });

              //两人聊天
              socket.on('send', async (uid, msg) => {
                  const sid = MAP[uid];//接收用户socket.id
                  const cid = findUid(socket.id);//发送用户id
                  const txt = msg.txt;
                  const type = msg.type;
                  if (sid) { // 好友在线则发送
                      socket.to(sid).emit('reply', { id: cid, self: false }, { date: currTime(), msg });
                  }
                  // 给自己也发一份
                  socket.emit('reply', { id: uid, self: true }, { date: currTime(), msg });
                  // 保存数据库
                  try {
                      const ret = await insertMsg({ send_id: cid, receive_id: uid, content: txt, type: type });
                      insertToUser({ user_id: uid, send_id: cid, message_id: ret.insertId, is_read: sid ? 1 : 0 });
                  } catch (err) {
                      log.error(err);
                  }
              });

              //群组聊天
              socket.on('groupSend', async ({gid,user}, msg) => {
                  socket.to(gid).broadcast.emit('groupReply', { gid: gid , ...user }, { date: currTime(), msg });
                  // 给自己也发一份
                  socket.emit('groupReply', { gid: gid , ...user }, { date: currTime(), msg });

                  //保存数据库
                  try {
                      const ret = await insertMsg({ type:1, send_id: user.id, group_id: gid, content: msg });
                      insertToUser({ group_id: gid, send_id: user.id, message_id: ret.insertId, is_read: 1 });
                  } catch (err) {
                      log.error(err);
                  }
              });

              socket.on('acceptFriend', (uid) => {
                  const sid = MAP[uid];
                  if (sid) {
                      socket.to(sid).emit('refresh', MAP);
                  }
                  socket.emit('checkStatus', MAP);
              });

              socket.on('sendApply', (uid, data) => {
                  const sid = MAP[uid];
                  if(sid){
                      socket.to(MAP[uid]).emit('apply', { ...data, date: currTime() });
                  }
              });

              socket.on('disconnect', () => {
                  const user = deleteUser(socket.id);
                  socket.broadcast.emit('userout', MAP, user);
              });
          });
      };

   ```
## 客户端
   客户端也要安装**socket.io-client**依赖包
   ```
      npm install socket.io-client --save
   ```
   客户端首先要时刻跟服务端保持通信，这里的token是服务端设置安全校验等其他处理的参数，忽略不计。
   ```
      this.socket = io('http://localhost:3004?token=' + token)
   ```
   当客户端控制台可以打印出:socket io is open !，说明连接成功
   ```
      // 收到server的连接确认
      this.socket.on('open', () => {
          window.console.log('socket io is open !')
      })
   ```
   然后通过广播**send**来跟服务端保持连接
   ```
      this.socket.emit('send', this.friendId, param)
   ```
   服务端监听到**send**后，给客户端广播**reply**，然后客户端就可以监听到服务端广播的**reply**获取到相应的数据，接收到信息后做相应的处理即可。
   ```
      // 接收聊天信息
      this.socket.on('reply', (user, data) => {
          console.log(data)
          const newMsg = {
              msg: '',
              name: JSON.parse(this.myName).userName,
              my_send: true,
          }
          newMsg.msg = data.msg.txt
          if (!user.self) {
              newMsg.my_send = false
              newMsg.name = this.friendName
          }
          this.msgs.push(newMsg)
          this.scrollTo()
      })
   ```       
   
