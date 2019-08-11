'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  const { home, users, login, operationalLog, notify, upload, ipc } = controller;
  //  包括检查登录和权限检查
  const checkLogin = app.middleware.checkTokenIsLogin({ key: app.config.jwtTokenSecret });
  // const createUserLimit = middleware.createNewUserLimit()

  router.get('/', home.index);
  router.get('/home', home.user);

  // 鉴权成功后的回调页面
  router.get('/loginSuccess', login.loginSuccess);
  router.get('/loginFailure', login.loginFailure);
  // 登录校验
  router.post('/login', app.passport.authenticate('local',
    {
      successRedirect: '/api/loginSuccess',
      failureRedirect: '/api/loginFailure',
    }));
  router.get('/loginOut', login.loginOut);
  router.post('/user/query', checkLogin, users.query);
  router.post('/register', checkLogin, users.create);
  router.delete('/user/delete/:id', checkLogin, users.delete);
  router.delete('/user/deleteBatch', checkLogin, users.deleteBatch);
  router.post('/user/modify', checkLogin, users.modify);
  //  操作日志
  router.post('/log/query', checkLogin, operationalLog.query);
  //  系统消息
  router.post('/notify/query', checkLogin, notify.query);
  router.delete('/notify/delete', checkLogin, notify.delete);
  //  上传文件
  router.post('/upload', checkLogin, upload.add);
  router.post('/uploadFile', checkLogin, upload.addHead);
  router.get('/img/query', checkLogin, upload.query);
  router.delete('/img/delete', checkLogin, upload.delete);
  router.get('/imgHead', checkLogin, upload.headImg);
  //  socket.io
  io.route('chat', io.controller.home.index);
  //  多进程、ipc
  router.get('/ipc', checkLogin, ipc.index);
};
