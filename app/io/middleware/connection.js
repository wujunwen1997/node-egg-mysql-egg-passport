'use strict';

//  前端在页面中请求连接，后台来判断是否登录
module.exports = () => {
  return async (ctx, next) => {
    const jwtToken = ctx.helper.verifyToken(ctx.socket.handshake.query.token, ctx.app.config.jwtTokenSecret);
    if (!jwtToken) {
      return;
    }
    const { username } = await ctx.service.user.getUserById(jwtToken.id)
    await next();
    console.log('断开!', username);
    ctx.service.userInline.DeleteInlineKey(username);
  };
};
