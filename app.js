'use strict';
// const crypto = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
module.exports = app => {
  const { messenger } = app;

  messenger.on('refresh', by => {
    app.logger.info('start update by %s', by);
    // create an anonymous context to access service
    const ctx = app.createAnonymousContext();
    // a convenient way to excute with generator function
    // can replaced by `co`
    ctx.runInBackground(async () => {
      await ctx.service.source.update();
      app.lastUpdateBy = by;
    });
  });
  app.beforeStart(async () => {
    await app.runSchedule('force_refresh');
    // 应用会等待这个函数执行完成才启动
    // await app.model.sync({ force: true }); // 开发环境使用
  });
  app.ready(async () => {
    await app.model.sync();
  });
  const localHandler = async (ctx, { username, password }) => {
    if (typeof (username) === 'undefined' || typeof (password) === 'undefined') {
      return null;
    }
    const getUser = await ctx.service.user.getUserByUsername(username);
    if (getUser === null) {
      return null;
    }
    const user = await ctx.service.user.getUserByUsernameAndPassword({ username, password });
    if (!user) {
      return null;
    }
    if (!user.allowLogin) {
      return { msg: '此用户禁止登录' };
    }
    return user;
  };
  app.passport.use(new LocalStrategy({
    passReqToCallback: true,
  }, (req, username, password, done) => {
    // format user
    const user = {
      provider: 'local',
      username,
      password,
    };
    app.passport.doVerify(req, user, done);
  }));
  // 校验用户
  app.passport.verify(async (ctx, user) => {
    const existUser = await localHandler(ctx, user);
    if (!existUser) {
      return null;
    }
    if (existUser.id) {
      return ctx.helper.createToken(existUser.id, app.config.jwtTokenSecret);
    } else if (existUser.msg) {
      return existUser;
    }
    return existUser;
  });
  app.passport.serializeUser(async (ctx, token) => {
    return token;
  });
  //   反序列化后取出用户信息
  app.passport.deserializeUser(async (ctx, token) => {
    if (token.msg) {
      return token;
    }
    if (token) {
      const user = ctx.helper.verifyToken(token, app.config.jwtTokenSecret);
      if (!user) {
        return null;
      }
      const userInfo = await ctx.service.user.getUserById(user.id);
      if (!userInfo) {
        return null;
      }
      const u = userInfo.toJSON();
      return {
        userName: u.username,
        userToken: token || '',
        userId: u.id,
        role: u.role,
      };
    }
    return token;
  });
};
