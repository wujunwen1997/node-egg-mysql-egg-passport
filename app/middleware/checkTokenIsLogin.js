'use strict'

module.exports = options => {

  return async function checkTokenIsLogin(ctx, next) {
    if (!ctx.request.header.cookie) {
      ctx.body = ctx.response.ServerResponse.needLogin();
      return;
    }
    const cookieToken = ctx.helper.cookieToJson(ctx.request.header.cookie);
    const token = cookieToken.token;
    if (!token || !ctx.user) {
      ctx.body = ctx.response.ServerResponse.needLogin();
      return;
    }
    //  检查是否允许登录
    const jwtToken = ctx.helper.verifyToken(token, options.key);
    if (!jwtToken) {
      ctx.body = ctx.response.ServerResponse.needLogin();
      return;
    }
    const { id } = ctx.helper.verifyToken(token, options.key);

    const user = await ctx.service.user.getUserById(id);
    if (!user.allowLogin) {
      ctx.body = ctx.response.ServerResponse.canNotLogin();
      return;
    }
    let isRole = '';
    Object.keys(ctx.helper.roleObj).forEach(u => {
      if (ctx.helper.pathMatchRegexp(u, ctx.request.url)) {
        isRole = ctx.helper.roleObj[u];
      }
    });
    if (!user.role.includes(isRole)) {
      ctx.body = ctx.response.ServerResponse.noAuth();
      return;
    }
    //  更新token时效
    ctx.cookies.set('userToken', ctx.helper.createToken(id, options.key));
    await next();
  };
};
