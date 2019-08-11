'use strict';

const Controller = require('./baseController');

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.notify = ctx.service.notify;
  }
  async query({ request }) {
    const res = await this.notify.query(request.body);
    this.check(res, '查询失败', request, '用户系统消息查询');
  }
  async delete({ request }) {
    const res = await this.notify.delete(request.body);
    this.check(res, '删除发生错误', request, '批量删除系统消息');
  }
}

module.exports = UserController;
