'use strict';

const Controller = require('./baseController');

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.UserService = ctx.service.user;
  }
  async query({ request }) {
    const res = await this.UserService.query(request.body);
    this.check(res, '查询失败', request, '用户列表查询');
  }
  async create({ request }) {
    const { username, password, role, allowLogin } = request.body;
    if (!username || !password) {
      this.serverError('数据不完整', request, '用户新增');
      return;
    }
    const res = await this.UserService.register(username, password, role, allowLogin);
    this.check(res, '创建失败', request, '用户新增');
  }
  async delete({ request }) {
    const id = this.ctx.params.id;
    const res = await this.UserService.destroy(id);
    this.check(res, '删除失败', request, '删除用户');
  }
  async modify({ request }) {
    const { id, username, password } = request.body;
    if (!id) {
      this.serverError('缺失ID', request, '修改用户信息');
      return;
    }
    if (!username && !password) {
      this.serverError('至少修改用户名或者密码中的一项');
      return;
    }
    const res = await this.UserService.modify(request.body);
    this.check(res, '修改失败', request, '修改用户信息');
  }
  async deleteBatch({ request }) {
    const res = await this.UserService.deleteBatch(request.body);
    this.check(res, '删除发生错误', request, '批量删除用户');
  }
}

module.exports = UserController;
