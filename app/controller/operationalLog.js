'use strict';

const Controller = require('./baseController');

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.operationalLog = ctx.service.operationalLog;
  }
  async query({ request }) {
    const res = await this.operationalLog.query(request.body);
    this.check(res, '查询失败', request, '用户操作日志查询');
  }
}

module.exports = UserController;
