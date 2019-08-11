'use strict';

const Controller = require('./baseController');

class UserController extends Controller {
  async loginSuccess(ctx) {
    if (ctx.user.msg) {
      this.serverSuccess('', ctx.user.msg);
      this.operationLogger(ctx.request, '登录', false);
      return;
    }
    this.operationLogger(ctx.request, '登录', true);
    this.serverSuccess(ctx.user);
  }
  async loginFailure(ctx) {
    this.operationLogger(ctx.request, '登录', false);
    this.serverError('账号或密码有误', 200);
  }
  async loginOut(ctx) {
    ctx.session = null;
    this.operationLogger(ctx.request, '登出', true);
    this.serverSuccess();
  }
}

module.exports = UserController;
