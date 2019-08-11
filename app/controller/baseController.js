'use strict';

const { Controller } = require('egg');
class BaseController extends Controller {
  check(res, text, req, msg) {
    if (res && res.status === 0) {
      this.serverSuccess(res.data);
      this.operationLogger(req, msg, true);
    } else {
      this.serverError(res.msg || text, req, msg);
    }
  }
  serverSuccess(data) {
    const { ctx } = this;
    ctx.body = { data };
    ctx.status = 200;
  }
  serverError(msg, req, text) {
    const { ctx } = this;
    ctx.body = { msg };
    ctx.status = 200;
    this.operationLogger(req, text, false);
  }
  /*
操作日志
  1.用户名 2.IP 3.操作 4. 时间 5. 成功
 */
  operationLogger(req, operation, isSuccess) {
    const { ctx } = this;
    const ip = ctx.helper.getClientIp(req);
    if (ctx.user && operation) {
      const username = ctx.user.userName;
      ctx.service.operationalLog.addOperationLog({ ip, username, isSuccess, operation });
    }
  }
}
module.exports = BaseController;
